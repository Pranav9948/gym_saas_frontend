// ===========================================
// API Client - Axios instance with interceptors
// ===========================================

import axios, {
  AxiosRequestConfig,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api.config';
import { parseApiError, ErrorCode } from './errors';

// Extend Axios config to include retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Token storage (in-memory for security)
let accessToken: string | null = null;

export type AuthType = 'user' | 'superAdmin';

let authType: AuthType = 'user';

export function getAuthType(): AuthType {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('gym-auth-storage');
      if (raw) {
        const parsed = JSON.parse(raw) as {
          state?: { authType?: AuthType; user?: { role?: string } };
        };
        const state = parsed.state;
        if (
          state?.authType === 'superAdmin' ||
          state?.user?.role === 'SUPER_ADMIN'
        ) {
          return 'superAdmin';
        }
      }
    } catch {
      // Fall back to in-memory value
    }
  }

  return authType;
}

export function setAuthType(type: AuthType): void {
  authType = type;
}

// Token getter/setter
export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}

let refreshPromise: Promise<string | null> | null = null;

/** Shared refresh — deduplicates AuthProvider init and 401 interceptor retries. */
export function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshPath =
      getAuthType() === 'superAdmin'
        ? API_ENDPOINTS.SUPER_ADMIN.REFRESH
        : API_ENDPOINTS.AUTH.REFRESH;

    const response = await axios.get(`${API_BASE_URL}${refreshPath}`, {
      withCredentials: true,
      params: { _: Date.now() },
    });

    const newToken = response.data?.data?.accessToken as string | undefined;
    if (newToken) {
      setAccessToken(newToken);
      return newToken;
    }

    return null;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: Error | null,
  token: string | null = null,
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for refresh token cookie
});

// Request interceptor - attach access token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(parseApiError(error));
  },
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | ExtendedAxiosRequestConfig
      | undefined;

    // If no config or already retried, reject
    if (!originalRequest) {
      return Promise.reject(parseApiError(error));
    }

    // Check if it's a 401 error and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry for login, register, or refresh endpoints
      const skipRefreshPaths = [
        '/auth/login',
        '/auth/register-gym',
        '/auth/generate-new-tokens',
        '/super-admin/login',
        '/super-admin/rotate-refresh-token',
      ];
      if (
        skipRefreshPaths.some((path) => originalRequest.url?.includes(path))
      ) {
        return Promise.reject(parseApiError(error));
      }

      if (isRefreshing) {
        // Queue request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return apiClient(originalRequest);
        }

        throw new Error('No token in refresh response');
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        clearAccessToken();

        // Redirect to login (handled by auth store/provider)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        return Promise.reject(
          parseApiError({
            response: {
              status: 401,
              data: {
                message: 'Session expired. Please log in again.',
                errorCode: ErrorCode.TOKEN_EXPIRED,
              },
            },
          }),
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(parseApiError(error));
  },
);

export default apiClient;

// Typed request helpers

export async function get<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const response = await apiClient.get<T>(url, { params });
  return response.data;
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

export async function patch<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.patch<T>(url, data);
  return response.data;
}

export async function del<T>(url: string): Promise<T> {
  const response = await apiClient.delete<T>(url);
  return response.data;
}

// Multipart form upload helper
export async function uploadFile<T>(
  url: string,
  file: File,
  fieldName = 'file',
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await apiClient.post<T>(url, formData, {
    headers: {
      // Let browser set Content-Type with boundary
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
