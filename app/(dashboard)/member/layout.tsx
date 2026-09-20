'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '@/hooks';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/config';
import { applyAppTheme } from '@/components/theme-sync';

interface MemberLayoutProps {
  children: React.ReactNode;
}

export default function MemberLayout({ children }: MemberLayoutProps) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    applyAppTheme('dark');
  }, []);

  useEffect(() => {
    if (!isLoading && isInitialized) {
      if (!user) {
        router.replace(ROUTES.UNAUTHORIZED);
      } else if (user.role !== 'MEMBER' && user.role !== 'CLIENT') {
        toast({
          title: 'Access Denied',
          description: 'This area is for gym members only.',
          variant: 'destructive',
        });
        router.replace(ROUTES.FORBIDDEN);
      }
    }
  }, [isLoading, isInitialized, user, router, toast]);

  if (
    isLoading ||
    !isInitialized ||
    !user ||
    (user.role !== 'MEMBER' && user.role !== 'CLIENT')
  ) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
