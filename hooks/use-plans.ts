import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansService } from '@/services/plans-service';
import { CreatePlanRequest, UpdatePlanRequest } from '@/types/plans';
import { useToast } from './use-toast';
import { Plan } from '@/types';

const PLANS_QUERY_KEY = ['plans'];
const PLAN_DETAIL_QUERY_KEY = (id: string) => ['plans', id];

export function usePlans() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all plans
  const {
    data: plans = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: PLANS_QUERY_KEY,
    queryFn: () => plansService.getAllPlans(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create plan mutation
  const createMutation = useMutation({
    mutationFn: (data: CreatePlanRequest) => plansService.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLANS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Plan created successfully.',
      });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to delete plan.';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  // Update plan mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanRequest }) =>
      plansService.updatePlan(id, data),
    onSuccess: (updatedPlan) => {
      queryClient.invalidateQueries({ queryKey: PLANS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: PLAN_DETAIL_QUERY_KEY(updatedPlan.id),
      });
      toast({
        title: 'Success',
        description: 'Plan updated successfully.',
      });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to delete plan.';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  // Delete plan mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => plansService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLANS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Plan deleted successfully.',
      });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to delete plan.';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  return {
    plans,
    isLoading,
    error,
    refetch,
    createPlan: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updatePlan: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deletePlan: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

// Hook for fetching single plan
export function usePlanById(id: string | undefined) {
  const {
    data: plan,
    isLoading,
    error,
  } = useQuery({
    queryKey: id ? PLAN_DETAIL_QUERY_KEY(id) : [],
    queryFn: () => (id ? plansService.getPlanById(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return { plan: plan as Plan | null, isLoading, error };
}
