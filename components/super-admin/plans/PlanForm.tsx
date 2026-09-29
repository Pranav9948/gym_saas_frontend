'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FeatureEditor } from './FeatureEditor';
import { CreatePlanSchema, CreatePlanFormData } from '@/schemas/plans';
import { CreatePlanRequest } from '@/types/plans';
import { useToast } from '@/hooks/use-toast';
import { Plan, PlanFeatures } from '@/types';

interface PlanFormProps {
  initialData?: Plan;
  onSubmit: (data: CreatePlanRequest) => Promise<void>;
  isLoading?: boolean;
}

export function PlanForm({ initialData, onSubmit, isLoading = false }: PlanFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getNormalizedFeatures = (): PlanFeatures => {
    const baseFeatures: PlanFeatures = {
      maxMembers: 0,
      maxTrainers: 0,
      prioritySupport: false,
    };

    if (!initialData?.features) return baseFeatures;

    const { maxMembers, maxTrainers, prioritySupport, ...rest } = initialData.features;

    return {
      ...baseFeatures,
      maxMembers: maxMembers ?? 0,
      maxTrainers: maxTrainers ?? 0,
      prioritySupport: prioritySupport ?? false,
      ...rest,
    };
  };

  const form = useForm<CreatePlanFormData>({
    resolver: zodResolver(CreatePlanSchema),
    defaultValues: {
      name: initialData?.name ?? undefined,
      price: initialData?.price ?? undefined,
      currency: initialData?.currency ?? 'INR',
      interval: initialData?.interval ?? undefined,
      stripePriceId: initialData?.stripePriceId ?? '',
      features: getNormalizedFeatures(),
    },
  });

  const handleSubmit = async (data: CreatePlanFormData) => {
    try {
      setIsSubmitting(true);
      const { stripePriceId, ...rest } = data;
      await onSubmit({
        ...rest,
        stripePriceId: stripePriceId?.trim() ? stripePriceId : undefined,
      });
      router.push('/super-admin/plans');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to save plan';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Plan Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan name" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FREE">FREE</SelectItem>
                    <SelectItem value="BASIC">BASIC</SelectItem>
                    <SelectItem value="PRO">PRO</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Choose the tier of this plan</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min={0}
                    step="0.01"
                    value={field.value ?? ''}
                    onKeyDown={(e) => {
                      if (e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === '') {
                        field.onChange('');
                        return;
                      }

                      const number = Number(value);

                      if (!Number.isNaN(number)) {
                        field.onChange(Math.max(0, number));
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Enter the price for this plan</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Currency */}
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Input placeholder="INR" {...field} />
                </FormControl>
                <FormDescription>Currency code. Use INR to show rupees in the app.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Billing Interval */}
          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Interval</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing interval" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How often customers are billed</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stripe Price ID */}
          <FormField
            control={form.control}
            name="stripePriceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stripe Price ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="price_xxx" {...field} />
                </FormControl>
                <FormDescription>The Stripe price ID associated with this plan</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Features */}
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FeatureEditor features={field.value} onChange={field.onChange} />
                <FormDescription>Add features included in this plan</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button type="submit" loading={isSubmitting || isLoading}>
              Save Plan
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
