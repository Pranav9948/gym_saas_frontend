// ===========================================
// Toast & Error Messages
// ===========================================

// Success messages
export const SUCCESS_MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'You are signed in',
  LOGOUT_SUCCESS: 'You have been signed out',
  REGISTER_SUCCESS: 'Your gym account is ready',
  PASSWORD_RESET_EMAIL: 'Ask the person who manages your account for the 6-digit code',
  PASSWORD_RESET_SUCCESS: 'Password updated. You can sign in now.',

  // Members
  MEMBER_CREATED: 'Member added successfully.',
  MEMBER_UPDATED: 'Member updated successfully.',
  MEMBER_DELETED: 'Member deactivated successfully.',

  // Trainers
  TRAINER_CREATED: 'Trainer added successfully.',
  TRAINER_UPDATED: 'Trainer updated successfully.',
  TRAINER_DELETED: 'Trainer removed successfully.',

  // Attendance
  ATTENDANCE_MARKED: 'Attendance marked successfully.',

  // Goals
  GOAL_CREATED: 'Goal created successfully.',

  // Tenant
  TENANT_UPDATED: 'Gym settings updated successfully.',
  LOGO_UPLOADED: 'Logo uploaded successfully.',
  USER_INVITED: 'Invitation sent successfully.',
  USER_CREATED: 'User created successfully.',

  // Billing
  PLAN_UPGRADED: 'Plan upgraded successfully.',
  CHECKOUT_REDIRECTING: 'Redirecting to checkout...',

  // General
  SAVED: 'Changes saved successfully.',
  COPIED: 'Copied to clipboard.',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  // Auth
  LOGIN_FAILED: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  UNAUTHORIZED: 'You must be logged in to access this page.',

  // Validation
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD:
    'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
  PASSWORDS_MISMATCH: 'Passwords do not match.',
  REQUIRED_FIELD: 'This field is required.',

  // Network
  NETWORK_ERROR:
    'Unable to connect to the server. Please check your connection.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  TIMEOUT: 'Request timed out. Please try again.',

  // Permissions
  FORBIDDEN: 'You do not have permission to perform this action.',
  ACCESS_DENIED: 'Access denied.',

  // Not found
  NOT_FOUND: 'The requested resource was not found.',
  MEMBER_NOT_FOUND: 'Member not found.',
  TRAINER_NOT_FOUND: 'Trainer not found.',

  // Duplicates
  EMAIL_EXISTS: 'This email is already registered.',
  RESOURCE_EXISTS: 'This resource already exists.',

  // Rate limiting
  RATE_LIMITED: 'Too many attempts. Please try again later.',

  // File upload
  FILE_TOO_LARGE: 'File is too large. Maximum size is 2MB.',
  INVALID_FILE_TYPE:
    'Invalid file type. Please upload a PNG, JPEG, or WEBP image.',

  // General
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
} as const;

// Confirmation messages
export const CONFIRM_MESSAGES = {
  LOGOUT: 'Are you sure you want to log out?',
  DELETE_MEMBER:
    'Are you sure you want to deactivate this member? This action cannot be undone.',
  DELETE_TRAINER:
    'Are you sure you want to remove this trainer? This action cannot be undone.',
  DISCARD_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
  CANCEL_SUBSCRIPTION: 'Are you sure you want to cancel your subscription?',
} as const;

// Loading messages
export const LOADING_MESSAGES = {
  LOGGING_IN: 'Logging in...',
  REGISTERING: 'Creating your account...',
  SAVING: 'Saving...',
  LOADING: 'Loading...',
  UPLOADING: 'Uploading...',
  PROCESSING: 'Processing...',
} as const;
