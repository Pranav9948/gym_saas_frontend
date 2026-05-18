// ===========================================
// JWT Helpers - Token decode & validation
// ===========================================

import type { AccessTokenPayload } from '@/types';

// Base64 URL decode
function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }

  // Decode
  if (typeof window !== 'undefined') {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  }

  // Server-side
  return Buffer.from(base64, 'base64').toString('utf-8');
}

// Decode JWT payload without verification
export function decodeJwtPayload<T = AccessTokenPayload>(
  token: string,
): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload) as T;
  } catch {
    return null;
  }
}

// Get expiration time from JWT
export function getJwtExpiration(token: string): number | null {
  const payload = decodeJwtPayload<{ exp?: number }>(token);
  return payload?.exp ?? null;
}

// Check if JWT is expired
export function isJwtExpired(token: string, bufferSeconds = 30): boolean {
  const exp = getJwtExpiration(token);
  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return exp - bufferSeconds < now;
}

// Get time until expiration (in seconds)
export function getTimeUntilExpiration(token: string): number {
  const exp = getJwtExpiration(token);
  if (!exp) return 0;

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, exp - now);
}

// Check if token should be refreshed (< 5 minutes remaining)
export function shouldRefreshToken(
  token: string,
  thresholdSeconds = 300,
): boolean {
  const timeRemaining = getTimeUntilExpiration(token);
  return timeRemaining < thresholdSeconds && timeRemaining > 0;
}

// Extract user info from token
export function getUserFromToken(token: string): AccessTokenPayload | null {
  return decodeJwtPayload<AccessTokenPayload>(token);
}
