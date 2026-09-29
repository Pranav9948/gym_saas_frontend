// ===========================================
// API Types - Request/Response DTOs
// ===========================================

import type {
  Member,
  Trainer,
  Attendance,
  AttendanceStats,
  MemberGoal,
  MembershipPackage,
  Tenant,
  Plan,
  OwnerWithGym,
  GoalType,
  DietPeriod,
  MuscleGroup,
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
  portalPassword?: string;
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
  portalPassword?: string;
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
  primaryGoal: import('./models').PrimaryGoal;
  currentWeight: number;
  targetWeight: number;
  durationWeeks?: number;
  targetDate?: string;
  height?: number;
  notes?: string;
}

export interface WorkoutSessionSet {
  id?: string;
  setNumber: number;
  targetReps: number;
  targetWeight: number;
  actualReps?: number | null;
  actualWeight?: number | null;
  notes?: string | null;
}

export interface WorkoutSessionExercise {
  id?: string;
  name: string;
  notes?: string | null;
  sets: WorkoutSessionSet[];
}

export interface WorkoutReview {
  score: number;
  repetitionCompletion: string;
  weightProgression: string;
  setCompletion: string;
  consistency: string;
  exerciseBreakdown: Array<{ name: string; score: number; note: string }>;
  strengths: string[];
  improvements: string[];
  suggestion: string;
  previousScore: number | null;
  scoreDelta: number | null;
}

export interface WorkoutSession {
  id: string;
  memberId: string;
  date: string;
  notes?: string | null;
  score?: number | null;
  review?: WorkoutReview | null;
  exercises: WorkoutSessionExercise[];
}

export interface LastWorkoutSet {
  setNumber: number;
  reps: number;
  weight: number;
}

export interface LastWorkoutExercise {
  name: string;
  date: string;
  sets: LastWorkoutSet[];
}

export interface LastWorkoutPerformance {
  before: string | null;
  exercises: LastWorkoutExercise[];
}

export interface DietPlanMeal {
  id?: string;
  period: DietPeriod;
  name: string;
  quantity: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  notes?: string | null;
  sortOrder?: number;
}

export interface DietPlan {
  id: string;
  memberId: string;
  date: string;
  notes?: string | null;
  publishedAt?: string | null;
  meals: DietPlanMeal[];
}

export interface MemberWorkoutSet {
  id?: string;
  setNumber: number;
  reps: number;
  weight: number;
}

export interface MemberWorkoutExercise {
  id?: string;
  muscleGroup: MuscleGroup;
  name: string;
  sortOrder?: number;
  sets: MemberWorkoutSet[];
}

export interface MemberWorkoutSession {
  id: string;
  memberId: string;
  date: string;
  notes?: string | null;
  createdAt?: string;
  exercises: MemberWorkoutExercise[];
}

export interface WorkoutLogCatalog {
  muscleGroups: MuscleGroup[];
  exercises: Array<{ muscleGroup: MuscleGroup; name: string }>;
}

export interface WorkoutPerformanceEntry {
  sessionId: string;
  date: string;
  createdAt: string;
  muscleGroup: MuscleGroup;
  name: string;
  sets: MemberWorkoutSet[];
}

export interface WorkoutPerformance {
  muscleGroup: MuscleGroup;
  exercise: string;
  latest: WorkoutPerformanceEntry | null;
  history: WorkoutPerformanceEntry[];
}

export interface WeightLog {
  id: string;
  memberId: string;
  weight: number;
  date: string;
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
  staffPortalEnabled?: boolean;
  trainerPortalEnabled?: boolean;
  memberPortalEnabled?: boolean;
}

export interface TenantResponse {
  success: true;
  data: Tenant;
}

export interface OwnerDashboardSummary {
  checkinsToday: number;
  checkinsYesterday: number;
  checkinsTrendPct: number;
  totalMembers: number;
  activeMembers: number;
  newThisMonth: number;
  monthStart: string;
}

export interface OwnerDashboardAttendanceDay {
  day: string;
  date: string;
  checkins: number;
  today: boolean;
}

export interface OwnerDashboardCheckin {
  id: string;
  name: string;
  checkIn: string;
}

export interface OwnerDashboardMember {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface OwnerDashboard {
  gymName: string;
  summary: OwnerDashboardSummary;
  attendanceTrend: OwnerDashboardAttendanceDay[];
  recentCheckins: OwnerDashboardCheckin[];
  latestMembers: OwnerDashboardMember[];
}

export interface OwnerDashboardResponse {
  success: true;
  data: OwnerDashboard;
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

export interface MemberPortalProfile {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
  };
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    status?: string;
    membershipPackage?: MembershipPackage | null;
    assignedTrainer?: {
      id: string;
      specialization?: string | null;
      user: {
        firstName: string;
        lastName: string;
        avatarUrl?: string | null;
      };
    } | null;
  };
  hasPersonalTraining: boolean;
}

export interface MemberWeeklyProgress {
  week: number | null;
  durationWeeks: number;
  currentWeight: number | null;
  thisWeekTargetKg: number | null;
  thisWeekChangeKg: number | null;
  finalTargetKg: number | null;
  percentToTarget: number;
  targetDate?: string | null;
}

export interface MemberTraining {
  date: string;
  user: MemberPortalProfile['user'];
  member: MemberPortalProfile['member'];
  hasPersonalTraining: boolean;
  hasDietPlan?: boolean;
  dietNotification?: { message: string; date: string } | null;
  todayDiet?: DietPlan | null;
  tomorrowDiet?: DietPlan | null;
  goal: MemberGoal | null;
  weeklyProgress: MemberWeeklyProgress | null;
  today: WorkoutSession | null;
}

export interface MemberPortalProfileResponse {
  success: true;
  data: MemberPortalProfile;
}

export interface MemberTrainingResponse {
  success: true;
  data: MemberTraining;
}

export interface PortalUserResponse {
  success: true;
  data: MemberPortalProfile['user'];
}

export interface PortalWorkoutResponse {
  success: true;
  data: WorkoutSession;
}

export interface MemberHistory {
  workouts: Array<{
    id: string;
    date: string;
    score?: number | null;
    notes?: string | null;
  }>;
  diets: DietPlan[];
  weights: WeightLog[];
  goals: MemberGoal[];
}

export interface MemberHistoryResponse {
  success: true;
  data: MemberHistory;
}
