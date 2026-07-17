'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { usePlans } from '@/hooks/super-admin';
import { PlansTable } from '@/components/super-admin/plans';
import { PlanCard } from '@/components/super-admin/plans';
import { EmptyState } from '@/components/super-admin/plans';
import { LoadingTableSkeleton, LoadingCardsSkeleton } from '@/components/super-admin/plans';

export default function PlansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const { plans, isLoading, error, deletePlan, isDeleting } = usePlans();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.currency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Plans</h1>
          <p className="text-muted-foreground mt-1">
            Manage subscription plans for tenants.
          </p>
        </div>
        <Link href="/super-admin/plans/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search plans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        isMobile ? <LoadingCardsSkeleton /> : <LoadingTableSkeleton />
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Failed to load plans</p>
          <p className="text-destructive/80">{error instanceof Error ? error.message : 'An error occurred'}</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        plans.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No plans match your search.</p>
          </div>
        )
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <PlansTable
              plans={filteredPlans}
              onDelete={async (id) => {
                await deletePlan(id);
              }}
              isDeleting={isDeleting}
            />
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden">
            <div className="grid grid-cols-1 gap-4">
              {filteredPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onDelete={(id) => {
                    deletePlan(id);
                  }}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
