// ===========================================
// API Types - Request/Response DTOs
// ===========================================

import type {
  Member,
  Trainer,
  Attendance,
  AttendanceStats,
  MemberGoal,
  Tenant,
  Plan,
  OwnerWithGym,
  GoalType,
  BillingInterval,
  InviteRole,
  DirectCreateRole,
} from './models';

// Pagination
export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Members
export interface CreateMemberRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  assignedTrainerId?: string | null;
}

export interface UpdateMemberRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  assignedTrainerId?: string | null;
}

export interface PaginatedMembersResponse {
  success: true;
  members: Member[];
  meta: PaginatedMeta;
}

export interface MemberResponse {
  success: true;
  data: Member;
}

export interface MemberAttendanceResponse {
  success: true;
  data: Attendance[];
}

// Trainers
export interface CreateTrainerRequest {
  userId: string;
  specialization: string;
  bio?: string;
}

export interface UpdateTrainerRequest {
  specialization?: string;
  bio?: string;
}

export interface PaginatedTrainersResponse {
  success: true;
  trainers: Trainer[];
  meta: PaginatedMeta;
}

export interface TrainerResponse {
  success: true;
  data: Trainer;
}

export interface TrainerMembersResponse {
  success: true;
  members: Member[];
  meta: PaginatedMeta;
}

// Attendance
export interface MarkAttendanceRequest {
  memberId: string;
  deviceInfo?: string;
}

export interface AttendanceResponse {
  success: true;
  data: Attendance;
}

export interface TodayAttendanceResponse {
  success: true;
  data: Attendance[];
}

export interface AttendanceHistoryResponse {
  success: true;
  data: Attendance[];
}

export interface AttendanceStatsResponse {
  success: true;
  data: AttendanceStats;
}

// Goals
export interface CreateGoalRequest {
  goalType: GoalType;
  currentWeight: number;
  targetWeight: number;
  durationWeeks: number;
  height: number;
}

export interface GoalResponse {
  success: true;
  data: MemberGoal;
}

export interface MemberGoalsResponse {
  success: true;
  data: MemberGoal[];
}

// Tenant
export interface UpdateTenantRequest {
  name?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  isActive?: boolean;
}

export interface TenantResponse {
  success: true;
  data: Tenant;
}

export interface InviteUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: InviteRole;
}

export interface DirectCreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: DirectCreateRole;
  password: string;
  specialization?: string;
  bio?: string;
}

export interface AcceptInviteRequest {
  token: string;
  password: string;
}

export interface UpgradePlanRequest {
  planName: 'BASIC' | 'PRO';
  interval: BillingInterval;
}

// Billing
export interface CheckoutSessionRequest {
  planId: string;
}

export interface CheckoutSessionResponse {
  success: true;
  data: {
    url: string;
  };
}

export interface PlansResponse {
  success: true;
  data: Plan[];
}

// Super Admin
export interface SuperAdminLoginRequest {
  email: string;
  password: string;
}

export interface SuperAdminSetupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PaginatedOwnersResponse {
  success: true;
  data: OwnerWithGym[];
  meta: PaginatedMeta;
}

export interface CreatePlanRequest {
  name: 'FREE' | 'BASIC' | 'PRO';
  price: number;
  currency: string;
  interval: BillingInterval;
  stripePriceId?: string;
  features: Record<string, unknown>;
}

export type UpdatePlanRequest = Partial<CreatePlanRequest>;
