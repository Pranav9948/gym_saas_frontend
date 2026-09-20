'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES, getPostLoginRoute } from '@/config/routes';
import { useAuth } from '@/hooks';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const homeRoute = user ? getPostLoginRoute(user.role) : ROUTES.HOME;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">401</p>
      <h1 className="text-3xl font-bold tracking-tight">Unauthorized</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        You need to sign in to access this page.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href={ROUTES.LOGIN}>Sign in</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={homeRoute}>Go to home</Link>
        </Button>
      </div>
    </div>
  );
}
