// ===========================================
// API Client - Axios instance with interceptors
// ===========================================

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL } from '@/config/api.config';
import { parseApiError, ErrorCode } from './errors';

// Extend Axios config to include retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Token storage (in-memory for security)
let accessToken: string | null = null;

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
        // Attempt to refresh token
        const response = await axios.get(
          `${API_BASE_URL}/auth/generate-new-tokens`,
          {
            withCredentials: true,
          },
        );

        const newToken = response.data?.data?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return apiClient(originalRequest);
        } else {
          throw new Error('No token in refresh response');
        }
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

export async function post<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<T>(url, data);
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
