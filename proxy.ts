import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isJwtExpired } from '@/lib/helpers/jwt';
import {
  isProtectedPath,
  LOGIN_PATH,
  RESUME_PATH,
  withNextParam,
} from '@/lib/auth/protected-routes';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;
  const returnPath = `${pathname}${search}`;

  if (!token) {
    const loginUrl = new URL(
      withNextParam(LOGIN_PATH, returnPath),
      request.url,
    );
    return NextResponse.redirect(loginUrl);
  }

  if (isJwtExpired(token)) {
    const resumeUrl = new URL(
      withNextParam(RESUME_PATH, returnPath),
      request.url,
    );
    return NextResponse.redirect(resumeUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/owner/:path*',
    '/staff/:path*',
    '/member/:path*',
    '/trainer/:path*',
    '/members/:path*',
    '/trainers/:path*',
    '/packages/:path*',
    '/attendance/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/billing/:path*',
    '/reset-codes',
    '/super-admin/:path*',
    '/dashboard',
    '/owner',
    '/staff',
    '/member',
    '/trainer',
    '/members',
    '/trainers',
    '/packages',
    '/attendance',
    '/analytics',
    '/settings',
    '/billing',
    '/super-admin',
  ],
};
