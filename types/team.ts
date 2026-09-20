import type { InviteRole, TenantRole, User } from './models';

export interface TeamMemberDto {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: TenantRole;
  isActive: boolean;
  joinedAt: string;
}

export interface PendingInviteDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: InviteRole;
  expiresAt: string;
  createdAt: string;
}

export interface InvitePreviewDto {
  email: string;
  firstName: string;
  lastName: string;
  role: InviteRole;
  gymName: string;
  expiresAt: string;
  expired: boolean;
}

export interface AcceptInviteResponse {
  success: true;
  message: string;
  data: {
    accessToken: string;
    user: User;
    tenantId: string;
  };
}

export interface TeamMembersResponse {
  success: true;
  data: TeamMemberDto[];
}

export interface PendingInvitesResponse {
  success: true;
  data: PendingInviteDto[];
}

export interface InvitePreviewResponse {
  success: true;
  data: InvitePreviewDto;
}
