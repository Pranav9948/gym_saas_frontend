// Generic success response
export interface ApiResponse<T> {
  success: true;
  data?: T;
  message?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Error response from backend
export interface ApiError {
  success: false;
  message: string;
  errorCode: number;
  errors: Record<string, string[]> | null;
}

// Union type for all API responses
export type ApiResult<T> = ApiResponse<T> | ApiError;

// Type guard for error checking
export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    (response as ApiError).success === false
  );
}

// Type guard for success checking
export function isApiSuccess<T>(
  response: ApiResult<T>,
): response is ApiResponse<T> {
  return response.success === true;
}
