'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { UsageMeter } from '@/components/owner/UsageMeter';
import { useBillingUsage } from '@/hooks/billing';
import { BillingSectionError } from './BillingSectionError';

interface FeatureUsageSectionProps {
  compact?: boolean;
}

export function FeatureUsageSection({ compact = false }: FeatureUsageSectionProps) {
  const { data, isLoading, isError, refetch } = useBillingUsage();
  const usage = data?.data;

  if (isLoading) {
    return (
      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-3'}>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        {!compact ? <Skeleton className="h-16 w-full" /> : null}
      </div>
    );
  }

  if (isError || !usage) {
    return (
      <BillingSectionError
        message="Unable to load usage limits."
        onRetry={() => refetch()}
      />
    );
  }

  const meters = [
    { label: 'Members', stat: usage.members },
    { label: 'Trainers', stat: usage.trainers },
    { label: 'Staff', stat: usage.staff },
  ];

  return (
    <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-3'}>
      {meters.map(({ label, stat }) => (
        <UsageMeter
          key={label}
          label={label}
          current={stat.used}
          max={stat.isUnlimited ? null : stat.limit}
          isUnlimited={stat.isUnlimited}
        />
      ))}
    </div>
  );
}
