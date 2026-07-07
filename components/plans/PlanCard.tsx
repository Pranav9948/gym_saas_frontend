'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Plan } from '@/types';

interface PlanCardProps {
  plan: Plan;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function PlanCard({ plan, onDelete, isDeleting = false }: PlanCardProps) {
  return (
    <Card className="p-4 border-2 border-orange-600">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{plan.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true })}
            </p>
          </div>
          <Badge variant="outline">{plan.interval}</Badge>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">
            {plan.currency} {plan.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">/{plan.interval.toLowerCase()}</span>
        </div>

        {/* Stripe Price ID */}
        {plan.stripePriceId && (
          <div className="text-xs bg-muted p-2 rounded">
            <span className="font-medium">Stripe ID:</span> {plan.stripePriceId}
          </div>
        )}

        {/* Features */}

        {Object.keys(plan.features).length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium ">Features</label>

            <div className="space-y-2 mt-2">
              {Object.entries(plan.features).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-md border p-3 border-white"
                >
                  <span className="font-medium">{key}</span>

                  <Badge variant="secondary">
                    {value === -1
                      ? "Unlimited"
                      : typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : String(value)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Link href={`/plans/${plan.id}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full border-yellow-400">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive w-12"
            onClick={() => onDelete(plan.id)}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
