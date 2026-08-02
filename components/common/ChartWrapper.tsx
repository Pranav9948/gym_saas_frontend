'use client';

import React from 'react';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

interface ChartWrapperProps {
  config: ChartConfig;
  children: React.ComponentProps<typeof ChartContainer>['children'];
  className?: string;
}

export function ChartWrapper({
  config,
  children,
  className,
}: ChartWrapperProps) {
  return (
    <ChartContainer
      config={config}
      className={cn('aspect-auto min-h-[240px] w-full', className)}
    >
      {children}
    </ChartContainer>
  );
}

export type { ChartConfig };
