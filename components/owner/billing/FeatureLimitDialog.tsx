'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config';
import { featureLabelToDisplay } from '@/lib/billing/format';
import { useFeatureLimitStore } from '@/store/featureLimitStore';

export function FeatureLimitDialog() {
  const { open, message, feature, currentPlan, limit, used, close } =
    useFeatureLimitStore();

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-warning" />
            Plan limit reached
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
          <p className="font-medium text-foreground">
            {featureLabelToDisplay(feature)} on {currentPlan}
          </p>
          <p className="mt-1 text-muted-foreground">
            {used} of {limit} used
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={close}>
            Close
          </Button>
          <Button asChild onClick={close}>
            <Link href={ROUTES.OWNER_BILLING}>Go to Billing</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
