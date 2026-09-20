'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES, getPostLoginRoute } from '@/config/routes';
import { useAuth } from '@/hooks';

export default function ForbiddenPage() {
  const { user } = useAuth();
  const homeRoute = user ? getPostLoginRoute(user.role) : ROUTES.HOME;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">403</p>
      <h1 className="text-3xl font-bold tracking-tight">Access forbidden</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        You do not have permission to view this resource. Contact your gym
        administrator if you believe this is a mistake.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href={homeRoute}>Go to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.HOME}>Go home</Link>
        </Button>
      </div>
    </div>
  );
}
