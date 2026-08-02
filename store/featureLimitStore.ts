'use client';

import { create } from 'zustand';
import type { PlanName } from '@/types/models';

interface FeatureLimitState {
  open: boolean;
  message: string;
  feature: string;
  currentPlan: PlanName;
  limit: number;
  used: number;
  show: (payload: {
    message: string;
    feature: string;
    currentPlan: PlanName;
    limit: number;
    used: number;
  }) => void;
  close: () => void;
}

export const useFeatureLimitStore = create<FeatureLimitState>((set) => ({
  open: false,
  message: '',
  feature: '',
  currentPlan: 'FREE',
  limit: 0,
  used: 0,
  show: (payload) =>
    set({
      open: true,
      message: payload.message,
      feature: payload.feature,
      currentPlan: payload.currentPlan,
      limit: payload.limit,
      used: payload.used,
    }),
  close: () => set({ open: false }),
}));
