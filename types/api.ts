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
  packageId?: string;
  paymentStatus?: 'PAID' | 'PENDING' | 'OVERDUE' | 'UNPAID';
  expirationWindow?: 'expiring_7' | 'expiring_today' | 'expired';
  search?: string;
}

// Members
export interface CreateMemberRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  assignedTrainerId?: string | null;
  packageId: string;
  paymentStatus?: 'PAID' | 'PENDING';
}

export interface UpdateMemberRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  assignedTrainerId?: string | null;
  packageId?: string;
  paymentStatus?: 'PAID' | 'PENDING';
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

export interface PackagesResponse {
  success: true;
  data: import('./models').MembershipPackage[];
}

export interface PackageResponse {
  success: true;
  data: import('./models').MembershipPackage;
}

export interface TrainerOverviewMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: import('./models').MemberStatus;
  trainingStatus: 'ACTIVE' | 'INACTIVE';
  membershipExpiresAt?: string | null;
  membershipPackage?: { id: string; name: string } | null;
}

export interface TrainerOverview {
  id: string;
  specialization: string | null;
  bio: string | null;
  userId: string;
  createdAt: string;
  assignedMemberCount: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
  };
  members: TrainerOverviewMember[];
}

export interface TrainerOverviewResponse {
  success: true;
  data: TrainerOverview[];
}

export interface TrainerPerformance {
  trainer: {
    id: string;
    specialization: string | null;
    bio: string | null;
    userId: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      isActive: boolean;
    };
  };
  from: string;
  to: string;
  totalDaysInRange: number;
  daysPresent: number;
  assignedMembers: Array<
    TrainerOverviewMember & {
      paymentStatus?: import('./models').MemberPaymentStatus;
    }
  >;
}

export interface TrainerPerformanceResponse {
  success: true;
  data: TrainerPerformance;
}

export interface StaffAttendancePerson {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  daysPresent: number;
}

export interface StaffMetrics {
  from: string;
  to: string;
  totalDaysInRange: number;
  staff: StaffAttendancePerson[];
}

export interface StaffMetricsResponse {
  success: true;
  data: StaffMetrics;
}
