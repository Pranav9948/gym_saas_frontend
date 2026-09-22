import { del, get, patch, post } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  MembershipPackage,
  PackageResponse,
  PackagesResponse,
} from '@/types';

export const packagesService = {
  list: async (includeInactive = false): Promise<PackagesResponse> => {
    return get<PackagesResponse>(API_ENDPOINTS.PACKAGES.LIST, {
      includeInactive: includeInactive ? 'true' : undefined,
    });
  },

  create: async (data: {
    name: string;
    description?: string;
    durationDays: number;
    price: number;
    currency?: string;
    features?: string[];
    featureLimits?: Record<string, number>;
  }): Promise<PackageResponse> => {
    return post<PackageResponse>(API_ENDPOINTS.PACKAGES.CREATE, data);
  },

  update: async (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      durationDays: number;
      price: number;
      currency: string;
      isActive: boolean;
      features: string[];
      featureLimits: Record<string, number>;
    }>,
  ): Promise<PackageResponse> => {
    return patch<PackageResponse>(API_ENDPOINTS.PACKAGES.UPDATE(id), data);
  },

  remove: async (id: string): Promise<{ success: true; message?: string }> => {
    return del(API_ENDPOINTS.PACKAGES.DELETE(id));
  },
};

export type { MembershipPackage };
