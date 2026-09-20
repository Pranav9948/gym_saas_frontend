import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_BASE_URL } from '@/config/api.config';
import { isJwtExpired, decodeJwtPayload } from '@/lib/helpers/jwt';
import {
  LOGIN_PATH,
  RESUME_PATH,
  withNextParam,
} from '@/lib/auth/protected-routes';

async function verifyAccessTokenWithApi(token: string): Promise<boolean> {
  try {
    const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (meResponse.ok) {
      return true;
    }

    const payload = decodeJwtPayload<{ role?: string }>(token);
    if (payload?.role !== 'SUPER_ADMIN') {
      return false;
    }

    const adminResponse = await fetch(`${API_BASE_URL}/super-admin/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    return adminResponse.ok;
  } catch {
    return false;
  }
}

export async function requireDashboardSession(): Promise<void> {
  const token = (await cookies()).get('accessToken')?.value;
  const pathname = (await headers()).get('x-pathname') || '/dashboard';
  const nextTarget = pathname.startsWith('/') ? pathname : '/dashboard';

  if (!token) {
    redirect(withNextParam(LOGIN_PATH, nextTarget));
  }

  if (isJwtExpired(token)) {
    redirect(withNextParam(RESUME_PATH, nextTarget));
  }

  const valid = await verifyAccessTokenWithApi(token);
  if (!valid) {
    redirect(withNextParam(LOGIN_PATH, nextTarget));
  }
}
