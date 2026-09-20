// ===========================================
// Error Handling - Centralized error management
// ===========================================

// Backend error codes
export enum ErrorCode {
  // Auth errors (1xxx)
  UNAUTHORIZED = 1001,
  TOKEN_EXPIRED = 1002,
  INVALID_TOKEN = 1003,
  INVALID_CREDENTIALS = 1004,

  // Validation errors (2xxx)
  VALIDATION_FAILED = 2001,
  EMAIL_ALREADY_EXISTS = 2002,
  INVALID_INPUT = 2003,

  // Not found errors (3xxx)
  NOT_FOUND = 3001,
  USER_NOT_FOUND = 3002,
  RESOURCE_ALREADY_EXISTS = 3003,

  // Permission errors (4xxx)
  FORBIDDEN = 4001,
  ACCESS_DENIED = 4002,
  FEATURE_LIMIT_REACHED = 4003,

  // Server errors (5xxx)
  INTERNAL_EXCEPTION = 5001,
  DATABASE_ERROR = 5002,
  SERVICE_UNAVAILABLE = 5003,
}

// Error code to user-friendly message mapping
export const ERROR_MESSAGES: Record<number, string> = {
  [ErrorCode.UNAUTHORIZED]: 'Authentication token missing or expired.',
  [ErrorCode.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ErrorCode.INVALID_TOKEN]: 'Authentication token missing or expired.',
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCode.VALIDATION_FAILED]: 'Please check your input and try again.',
  [ErrorCode.EMAIL_ALREADY_EXISTS]: 'This email is already registered.',
  [ErrorCode.INVALID_INPUT]: 'Invalid input provided.',
  [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCode.USER_NOT_FOUND]: 'User not found.',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: 'This resource already exists.',
  [ErrorCode.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ErrorCode.ACCESS_DENIED]: 'Access denied.',
  [ErrorCode.FEATURE_LIMIT_REACHED]:
    'You have reached the limit for your current plan. Upgrade to continue.',
  [ErrorCode.INTERNAL_EXCEPTION]:
    'An unexpected error occurred. Please try again.',
  [ErrorCode.DATABASE_ERROR]: 'A database error occurred. Please try again.',
  [ErrorCode.SERVICE_UNAVAILABLE]:
    'Service is temporarily unavailable. Please try again later.',
};

// Custom API Error class
export class ApiException extends Error {
  public readonly errorCode: number;
  public readonly errors:
    | Record<string, string[]>
    | Array<{ field: string; message: string }>
    | null;
  public readonly statusCode: number;
  public readonly featureLimit?: {
    code: 'FEATURE_LIMIT_REACHED';
    feature: string;
    currentPlan: string;
    limit: number;
    used: number;
  };

  constructor(
    message: string,
    errorCode: number,
    errors:
      | Record<string, string[]>
      | Array<{ field: string; message: string }>
      | null = null,
    statusCode: number = 500,
    featureLimit?: ApiException['featureLimit'],
  ) {
    super(message);
    this.name = 'ApiException';
    this.errorCode = errorCode;
    this.errors = errors;
    this.statusCode = statusCode;
    this.featureLimit = featureLimit;
  }

  // Get user-friendly message
  getUserMessage(): string {
    if (this.message && this.message.trim()) {
      return this.message;
    }
    return ERROR_MESSAGES[this.errorCode] || 'An unexpected error occurred';
  }

  // Check if error is due to authentication
  isAuthError(): boolean {
    return [
      ErrorCode.UNAUTHORIZED,
      ErrorCode.TOKEN_EXPIRED,
      ErrorCode.INVALID_TOKEN,
      ErrorCode.INVALID_CREDENTIALS,
    ].includes(this.errorCode);
  }

  // Check if error is due to validation
  isValidationError(): boolean {
    return [ErrorCode.VALIDATION_FAILED, ErrorCode.INVALID_INPUT].includes(
      this.errorCode,
    );
  }

  // Check if error is permission related
  isPermissionError(): boolean {
    return [
      ErrorCode.FORBIDDEN,
      ErrorCode.ACCESS_DENIED,
      ErrorCode.FEATURE_LIMIT_REACHED,
    ].includes(this.errorCode);
  }

  isFeatureLimitError(): boolean {
    return (
      this.errorCode === ErrorCode.FEATURE_LIMIT_REACHED ||
      this.featureLimit?.code === 'FEATURE_LIMIT_REACHED'
    );
  }

  // Get field-specific validation errors
  getFieldErrors(): Record<string, string> {
    if (!this.errors) return {};

    if (Array.isArray(this.errors)) {
      return this.errors.reduce(
        (acc, item) => {
          if (item?.field && item?.message) {
            acc[item.field] = item.message;
          }
          return acc;
        },
        {} as Record<string, string>,
      );
    }

    return Object.entries(this.errors).reduce(
      (acc, [field, messages]) => {
        acc[field] = messages[0] || 'Invalid value';
        return acc;
      },
      {} as Record<string, string>,
    );
  }
}

// Parse backend error response into ApiException
export function parseApiError(error: unknown): ApiException {
  // Handle Axios errors
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
          errorCode?: number;
          errors?:
            | Record<string, string[]>
            | Array<{ field: string; message: string }>;
        };
        status?: number;
      };
      message?: string;
    };

    const data = axiosError.response?.data as
      | {
          message?: string;
          errorCode?: number;
          errors?:
            | Record<string, string[]>
            | Array<{ field: string; message: string }>;
          code?: string;
          feature?: string;
          currentPlan?: string;
          limit?: number;
          used?: number;
        }
      | undefined;
    const status = axiosError.response?.status || 500;

    if (data) {
      if (data.code === 'FEATURE_LIMIT_REACHED') {
        return new ApiException(
          data.message || 'Plan limit reached. Upgrade to continue.',
          ErrorCode.FEATURE_LIMIT_REACHED,
          null,
          status,
          {
            code: 'FEATURE_LIMIT_REACHED',
            feature: data.feature || 'MEMBERS',
            currentPlan: data.currentPlan || 'FREE',
            limit: data.limit ?? 0,
            used: data.used ?? 0,
          },
        );
      }

      return new ApiException(
        data.message || 'An error occurred',
        data.errorCode || ErrorCode.INTERNAL_EXCEPTION,
        data.errors || null,
        status,
      );
    }

    // Network error
    if (axiosError.message === 'Network Error') {
      return new ApiException(
        'Unable to connect to the server',
        ErrorCode.SERVICE_UNAVAILABLE,
        null,
        503,
      );
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return new ApiException(error.message, ErrorCode.INTERNAL_EXCEPTION);
  }

  // Unknown error type
  return new ApiException(
    'An unexpected error occurred',
    ErrorCode.INTERNAL_EXCEPTION,
  );
}
