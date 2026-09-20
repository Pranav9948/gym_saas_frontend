'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/config/routes';
import {
  refreshAccessToken,
  setAuthType,
  type AuthType,
} from '@/lib/api/client';
import { getSafeInternalPath } from '@/lib/auth/protected-routes';
import { getPersistedAuthSession } from '@/store/authStore';

async function tryRefresh(authType: AuthType): Promise<string | null> {
  setAuthType(authType);
  try {
    return await refreshAccessToken();
  } catch {
    return null;
  }
}

function AuthResumeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    const resume = async () => {
      const nextPath =
        getSafeInternalPath(searchParams.get('next')) ?? ROUTES.DASHBOARD;
      const persisted = getPersistedAuthSession();
      const preferredType: AuthType = persisted.authType;
      const fallbackType: AuthType =
        preferredType === 'superAdmin' ? 'user' : 'superAdmin';

      let token = await tryRefresh(preferredType);
      if (!token) {
        token = await tryRefresh(fallbackType);
      }

      if (cancelled) {
        return;
      }

      if (!token) {
        router.replace(`${ROUTES.LOGIN}?next=${encodeURIComponent(nextPath)}`);
        return;
      }

      router.replace(nextPath);
    };

    void resume();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return <LoadingSpinner fullScreen label="Restoring your session…" />;
}

export default function AuthResumePage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen label="Restoring your session…" />}>
      <AuthResumeClient />
    </Suspense>
  );
}
