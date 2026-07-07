'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading, permissions } = useAuth();
  const router = useRouter();

  // React.useEffect(() => {
  //   if (!isLoading) {
  //     router.push(ROUTES.LOGIN);
  //   }
  // }, [isLoading, user, router]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return null;
  }

  if (requiredRole && !permissions.includes(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground mt-2">
            You do not have permission to access this resource.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
