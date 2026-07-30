'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common';
import { getPostLoginRoute } from '@/config';
import { applyAppTheme } from '@/components/theme-sync';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'OWNER') {
        applyAppTheme('light');
        setTheme('light');
      } else {
        applyAppTheme('dark');
        setTheme('dark');
      }
      router.push(getPostLoginRoute(user.role));
    }
  }, [isLoading, user, router, setTheme]);

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
