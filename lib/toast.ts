// ===========================================
// Toast Helpers - Standardized Sonner notifications
// ===========================================

import { toast as sonnerToast } from 'sonner';

const defaults = { duration: 3200 };

export const appToast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, {
      ...defaults,
      ...(description ? { description } : {}),
    }),
  error: (message: string, description?: string) =>
    sonnerToast.error(message, {
      duration: 5000,
      ...(description ? { description } : {}),
    }),
  warning: (message: string, description?: string) =>
    sonnerToast.warning(message, {
      ...defaults,
      ...(description ? { description } : {}),
    }),
  info: (message: string, description?: string) =>
    sonnerToast.info(message, {
      ...defaults,
      ...(description ? { description } : {}),
    }),
};

export { sonnerToast as toast };
