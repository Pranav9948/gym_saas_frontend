'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { PlanForm } from '@/components/super-admin/plans';
import { usePlans } from '@/hooks/super-admin';
import Link from 'next/link';
import { CreatePlanRequest } from '@/types/plans';

export default function CreatePlanPage() {
  const router = useRouter();
  const { createPlan, isCreating } = usePlans();

  const handleSubmit = async (data: CreatePlanRequest) => {
    await createPlan(data);
  };

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/super-admin/plans">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Plan</h1>
          <p className="text-muted-foreground mt-1">
            Add a new subscription plan for your tenants.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <PlanForm onSubmit={handleSubmit} isLoading={isCreating} />
      </div>
    </div>
  );
}
