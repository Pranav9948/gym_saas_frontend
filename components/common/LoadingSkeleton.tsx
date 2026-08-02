'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  variant?: 'table' | 'card' | 'page' | 'list';
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = 'page',
  rows = 4,
  className,
}: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn('space-y-3 rounded-lg border p-5', className)}>
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-3 rounded-lg border p-4', className)}>
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingSkeleton key={index} variant="card" />
        ))}
      </div>
      <LoadingSkeleton variant="table" rows={rows} />
    </div>
  );
}
