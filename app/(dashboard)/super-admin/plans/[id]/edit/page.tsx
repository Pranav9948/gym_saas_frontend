'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { PlanForm } from '@/components/super-admin/plans';
import { usePlans, usePlanById } from '@/hooks/super-admin';
import { LoadingFormSkeleton } from '@/components/super-admin/plans';
import Link from 'next/link';
import { CreatePlanRequest } from '@/types/plans';

export default function EditPlanPage() {
  const params = useParams();
  const planId = params.id as string;
  const { plan, isLoading } = usePlanById(planId);
  const { updatePlan, isUpdating } = usePlans();

  const handleSubmit = async (data: CreatePlanRequest) => {
    await updatePlan({ id: planId, data });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Plan</h1>
          </div>
        </div>
        <div className="max-w-2xl">
          <LoadingFormSkeleton />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/super-admin/plans">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Plan Not Found</h1>
          </div>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">The plan you&apos;re trying to edit does not exist.</p>
          <Link href="/super-admin/plans">
            <Button variant="outline" className="mt-4">
              Go Back to Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/super-admin/plans">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Plan</h1>
          <p className="text-muted-foreground mt-1">
            Update the {plan.name} subscription plan.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <PlanForm
          initialData={plan}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
        />
      </div>
    </div>
  );
}
