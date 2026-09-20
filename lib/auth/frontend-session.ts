type AuthType = 'user' | 'superAdmin';

async function syncAccessSessionCookie(
  accessToken: string | null,
  authType: AuthType = 'user',
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  if (!accessToken) {
    const response = await fetch('/api/auth/session', {
      method: 'DELETE',
      credentials: 'include',
    });
    // 404 means the cookie/route is already gone — treat as cleared.
    if (!response.ok && response.status !== 404) {
      console.error('Failed to clear access session cookie', response.status);
    }
    return;
  }

  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ accessToken, authType }),
  });
  if (!response.ok) {
    console.error('Failed to persist access session cookie', response.status);
  }
}

export async function persistAccessSessionCookie(
  accessToken: string | null,
  authType: AuthType = 'user',
): Promise<void> {
  try {
    await syncAccessSessionCookie(accessToken, authType);
  } catch (error) {
    console.error('Session cookie sync failed', error);
  }
}
