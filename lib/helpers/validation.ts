// ===========================================
// Validation Helpers - Custom validators
// ===========================================

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (E.164 format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
}

// Password validation rules
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else {
    score += 1;
    if (password.length >= 12) score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  } else {
    score += 1;
  }

  // Special character check
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain a special character');
  } else {
    score += 1;
  }

  // No spaces
  if (/\s/.test(password)) {
    errors.push('Password cannot contain spaces');
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 3) {
    strength = 'weak';
  } else if (score <= 5) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

// UUID validation
export function isValidUuid(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Date validation (YYYY-MM-DD format)
export function isValidDateString(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;

  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Name validation (2-50 characters, letters and spaces only)
export function isValidName(
  name: string,
  minLength = 2,
  maxLength = 50,
): boolean {
  const trimmed = name.trim();
  if (trimmed.length < minLength || trimmed.length > maxLength) {
    return false;
  }
  // Allow letters, spaces, hyphens, and apostrophes
  return /^[a-zA-Z\s\-']+$/.test(trimmed);
}

// File validation
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {},
): FileValidationResult {
  const {
    maxSizeMB = 2,
    allowedTypes = ['image/png', 'image/jpeg', 'image/webp'],
  } = options;

  // Check size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File is too large. Maximum size is ${maxSizeMB}MB.`,
    };
  }

  // Check type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.map((t) => t.split('/')[1]).join(', ')}.`,
    };
  }

  return { isValid: true };
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Slug validation
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
