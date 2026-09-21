'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBillingSummary, useCustomerPortal } from '@/hooks/billing';

interface ManageBillingButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  label?: string;
}

export function ManageBillingButton({
  variant = 'outline',
  size = 'default',
  className,
  label = 'Manage Subscription',
}: ManageBillingButtonProps) {
  const { data, isLoading } = useBillingSummary();
  const portal = useCustomerPortal();
  const isPaid = data?.data.isPaid === true;

  if (isLoading || !isPaid) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={portal.isPending}
      onClick={() => portal.mutate()}
    >
      {portal.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
      {label}
    </Button>
  );
}
