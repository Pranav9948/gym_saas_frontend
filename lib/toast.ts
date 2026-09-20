// ===========================================
// Toast Helpers - Standardized Sonner notifications
// ===========================================

import { toast as sonnerToast } from 'sonner';

export const appToast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, description ? { description } : undefined),
  error: (message: string, description?: string) =>
    sonnerToast.error(message, description ? { description } : undefined),
  warning: (message: string, description?: string) =>
    sonnerToast.warning(message, description ? { description } : undefined),
  info: (message: string, description?: string) =>
    sonnerToast.info(message, description ? { description } : undefined),
};

export { sonnerToast as toast };
