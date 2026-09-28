'use client';

import type { ReactNode } from 'react';
import { appToast } from '@/lib/toast';

type ToastInput = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: 'default' | 'destructive' | string;
  duration?: number;
};

function asText(value?: ReactNode) {
  return typeof value === 'string' ? value : undefined;
}

function toast(input: ToastInput) {
  const title = asText(input.title) ?? 'Notice';
  const description = asText(input.description);

  if (input.variant === 'destructive') {
    appToast.error(title, description);
    return;
  }

  const lowered = title.toLowerCase();
  if (
    lowered.includes('could not') ||
    lowered.includes('failed') ||
    lowered.includes('denied') ||
    lowered.includes('error')
  ) {
    appToast.error(title, description);
    return;
  }

  appToast.success(title, description);
}

function useToast() {
  return {
    toast,
    dismiss: () => undefined,
  };
}

export { useToast, toast };
