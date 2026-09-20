import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function accessCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  };
}

function isLikelyJwt(value: unknown): value is string {
  return typeof value === 'string' && value.split('.').length === 3;
}

export async function POST(request: Request) {
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
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('authType');
  return NextResponse.json({ success: true });
}
