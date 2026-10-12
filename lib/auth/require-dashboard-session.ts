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

  // No access token cookie at all. The cookie is intentionally long-lived
  // (see /api/auth/session), so a missing cookie generally means the user
  // has been logged out for a while. Still, try /auth/resume first — it can
  // recover the session via the backend refresh-token cookie (7 days) and
  // only falls back to /login when refresh fails.
  if (!token) {
    redirect(withNextParam(RESUME_PATH, nextTarget));
  }

  if (isJwtExpired(token)) {
    redirect(withNextParam(RESUME_PATH, nextTarget));
  }

  const valid = await verifyAccessTokenWithApi(token);
  if (!valid) {
    redirect(withNextParam(RESUME_PATH, nextTarget));
  }
}
