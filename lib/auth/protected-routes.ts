export const LOGIN_PATH = '/login';
export const RESUME_PATH = '/auth/resume';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/accept-invite',
  '/unauthorized',
  '/forbidden',
  '/pricing',
  '/features',
  '/setup',
  '/auth/resume',
] as const;

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/owner',
  '/staff',
  '/member',
  '/trainer',
  '/members',
  '/trainers',
  '/attendance',
  '/analytics',
  '/settings',
  '/billing',
  '/packages',
  '/reset-codes',
  '/super-admin',
] as const;

function matchesPath(pathname: string, candidate: string): boolean {
  return pathname === candidate || pathname.startsWith(`${candidate}/`);
}

export function isPublicPath(pathname: string): boolean {
  if (pathname === '/') {
    return true;
  }

  return PUBLIC_PATHS.some(
    (path) => path !== '/' && matchesPath(pathname, path),
  );
}

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => matchesPath(pathname, prefix));
}

export function getSafeInternalPath(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return null;
  }

  if (value.startsWith('/login') || value.startsWith('/auth/resume')) {
    return null;
  }

  return value;
}

export function withNextParam(basePath: string, nextPath: string): string {
  const safeNext = getSafeInternalPath(nextPath);
  if (!safeNext) {
    return basePath;
  }

  const url = new URL(basePath, 'http://localhost');
  url.searchParams.set('next', safeNext);
  return `${url.pathname}${url.search}`;
}
