import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Keep the cookie alive much longer than the JWT itself (15m). This way,
// when the JWT expires the cookie is still present, requireDashboardSession
// can detect the expired token and redirect to /auth/resume (which refreshes
// using the backend refresh-token cookie) instead of bouncing straight to
// /login. Matches the 7-day refresh token lifetime.
const ACCESS_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function accessCookieOptions(maxAge = ACCESS_TOKEN_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

function isLikelyJwt(value: unknown): value is string {
  return typeof value === 'string' && value.split('.').length === 3;
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid session payload' },
        { status: 400 },
      );
    }

    const accessToken =
      typeof body === 'object' && body !== null && 'accessToken' in body
        ? (body as { accessToken?: unknown }).accessToken
        : undefined;

    if (!isLikelyJwt(accessToken)) {
      return NextResponse.json(
        { success: false, message: 'Invalid access token' },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set('accessToken', accessToken, accessCookieOptions());

    const authType =
      typeof body === 'object' &&
      body !== null &&
      'authType' in body &&
      (body as { authType?: unknown }).authType === 'superAdmin'
        ? 'superAdmin'
        : 'user';

    cookieStore.set('authType', authType, accessCookieOptions());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to persist session cookie', error);
    return NextResponse.json(
      { success: false, message: 'Failed to persist session cookie' },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('accessToken', '', accessCookieOptions(0));
    cookieStore.set('authType', '', accessCookieOptions(0));
    cookieStore.delete('accessToken');
    cookieStore.delete('authType');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to clear session cookie', error);
    return NextResponse.json({ success: true });
  }
}
