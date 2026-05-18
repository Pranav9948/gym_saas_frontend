// ===========================================
// Members Service - Member API calls
// ===========================================

import { get, post, patch, del } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  PaginationParams,
  PaginatedMembersResponse,
  MemberResponse,
  MemberAttendanceResponse,
  CreateMemberRequest,
  UpdateMemberRequest,
} from '@/types';

interface ApiSuccessResponse {
  success: true;
  message?: string;
}

export const membersService = {
  /**
   * Get paginated list of members
   * Note: No server-side search/filter - implement client-side
   */
  getMembers: async (
    params?: PaginationParams,
  ): Promise<PaginatedMembersResponse> => {
    return get<PaginatedMembersResponse>(API_ENDPOINTS.MEMBERS.LIST, params);
  },

  /**
   * Get a single member by ID
   */
  getMember: async (id: string): Promise<MemberResponse> => {
    return get<MemberResponse>(API_ENDPOINTS.MEMBERS.GET(id));
  },

  /**
   * Create a new member
   * Note: Requires ACTIVE subscription and respects plan maxMembers limit
   */
  createMember: async (data: CreateMemberRequest): Promise<MemberResponse> => {
    // Clean up empty strings and nulls
    const cleanData = {
      ...data,
      phone: data.phone || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      assignedTrainerId: data.assignedTrainerId || undefined,
    };
    return post<MemberResponse>(API_ENDPOINTS.MEMBERS.CREATE, cleanData);
  },

  /**
   * Update a member
   */
  updateMember: async (
    id: string,
    data: UpdateMemberRequest,
  ): Promise<MemberResponse> => {
    // Clean up empty strings and nulls
    const cleanData = {
      ...data,
      phone: data.phone || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      assignedTrainerId:
        data.assignedTrainerId === '' ? null : data.assignedTrainerId,
    };
    return patch<MemberResponse>(API_ENDPOINTS.MEMBERS.UPDATE(id), cleanData);
  },

  /**
   * Deactivate (soft delete) a member
   */
  deleteMember: async (id: string): Promise<ApiSuccessResponse> => {
    return del<ApiSuccessResponse>(API_ENDPOINTS.MEMBERS.DELETE(id));
  },

  /**
   * Get member's attendance history
   */
  getMemberAttendance: async (
    id: string,
  ): Promise<MemberAttendanceResponse> => {
    return get<MemberAttendanceResponse>(API_ENDPOINTS.MEMBERS.ATTENDANCE(id));
  },
};
