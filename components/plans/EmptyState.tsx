'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick?: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Package className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No subscription plans found</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Start by creating your first subscription plan.
      </p>
      <Link href="/super-admin/plans/create">
        <Button onClick={onCreateClick} className='cursor-pointer'>Create Plan</Button>
      </Link>
    </div>
  );
}
