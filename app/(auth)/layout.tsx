'use client';

import React from 'react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/config';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && user) {
      router.push(
        user.role === 'SUPER_ADMIN' ? '/super-admin/plans' : ROUTES.DASHBOARD,
      );
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center  sm:px-4 sm:py-6 md:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        <div className="rounded-xl bg-background shadow-xl border px-4 sm:px-6 md:px-8 ">
          {children}
        </div>
      </div>
    </div>
  );
}
