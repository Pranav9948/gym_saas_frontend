'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlobalErrorUI } from '@/components/common/GlobalErrorUI';
import { ROUTES } from '@/config/routes';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <GlobalErrorUI
      title="Something went wrong"
      description={error.message || 'An unexpected error occurred.'}
      actions={
        <>
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.HOME}>Go home</Link>
          </Button>
        </>
      }
    />
  );
}
