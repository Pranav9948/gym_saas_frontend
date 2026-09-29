'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { DeletePlanDialog } from './DeletePlanDialog';
import { Plan } from '@/types';
import { formatInr } from '@/lib/money';

interface PlansTableProps {
  plans: Plan[];
  onDelete: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

export function PlansTable({ plans, onDelete, isDeleting = false }: PlansTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const handleDeleteClick = (planId: string) => {
    setSelectedPlanId(planId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPlanId) {
      await onDelete(selectedPlanId);
    }
  };

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Billing Interval</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Stripe Price ID</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{plan.interval}</Badge>
                </TableCell>
                <TableCell>{formatInr(plan.price, plan.currency)}</TableCell>
                <TableCell>INR</TableCell>
                <TableCell className="text-xs">
                  {plan.stripePriceId ? (
                    <code className="bg-muted px-2 py-1 rounded">{plan.stripePriceId}</code>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2 max-w-xs">
                    {Object.entries(plan.features).length > 0 ? (
                      <>
                        {Object.entries(plan.features)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="bg-muted/50 flex items-center justify-center gap-2 px-2 rounded-md"
                            >
                              <p className="text-xs text-muted-foreground">{key}</p>
                              <p className="text-sm font-medium break-all">
                                {typeof value === 'boolean' ? String(value) : value}
                              </p>
                            </div>
                          ))}
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        No features
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/super-admin/plans/${plan.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(plan.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeletePlanDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        planName={selectedPlan?.name}
      />
    </>
  );
}
