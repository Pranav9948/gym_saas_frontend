'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';

export function SuperAdminNavbar() {
  const { user } = useAuth();

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Welcome, {user?.firstName || 'Super Admin'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/settings/profile">
            <Button variant="ghost" size="sm">
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
