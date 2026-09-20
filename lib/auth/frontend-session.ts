type AuthType = 'user' | 'superAdmin';

export async function persistAccessSessionCookie(
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
    if (!response.ok) {
      throw new Error('Failed to clear access session cookie');
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
    throw new Error('Failed to persist access session cookie');
  }
}
