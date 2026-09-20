'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomerPortal } from '@/hooks/billing';

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
  label = 'Manage Billing',
}: ManageBillingButtonProps) {
  const portal = useCustomerPortal();

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
