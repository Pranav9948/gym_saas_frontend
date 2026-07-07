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
      router.push(ROUTES.HOME);
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 md:px-4 px-0">
      <div className="w-full max-w-lg space-y-8">
        <div className="bg-background rounded-lg shadow-lg md:px-8 sm:px-2 p-0">
          {children}
        </div>
      </div>
    </div>
  );
}
