// ===========================================
// Filters Store - Global search, sort, filters
// ===========================================

import { create } from 'zustand';
import type { MemberStatus } from '@/types';

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: string;
  direction: SortDirection;
}

interface FiltersState {
  // Global search
  globalSearch: string;

  // Members filters
  membersFilters: {
    search: string;
    status: MemberStatus | 'ALL';
    trainerId: string | null;
  };
  membersSort: SortConfig;

  // Trainers filters
  trainersFilters: {
    search: string;
  };
  trainersSort: SortConfig;

  // Attendance filters
  attendanceFilters: {
    date: string; // YYYY-MM-DD
    search: string;
  };

  // Actions
  setGlobalSearch: (search: string) => void;

  // Members
  setMembersSearch: (search: string) => void;
  setMembersStatus: (status: MemberStatus | 'ALL') => void;
  setMembersTrainer: (trainerId: string | null) => void;
  setMembersSort: (field: string, direction?: SortDirection) => void;
  resetMembersFilters: () => void;

  // Trainers
  setTrainersSearch: (search: string) => void;
  setTrainersSort: (field: string, direction?: SortDirection) => void;
  resetTrainersFilters: () => void;

  // Attendance
  setAttendanceDate: (date: string) => void;
  setAttendanceSearch: (search: string) => void;
  resetAttendanceFilters: () => void;

  // Reset all
  resetAllFilters: () => void;
}

const initialMembersFilters = {
  search: '',
  status: 'ALL' as const,
  trainerId: null,
};

const initialTrainersFilters = {
  search: '',
};

const initialAttendanceFilters = {
  date: new Date().toISOString().split('T')[0],
  search: '',
};

const initialMembersSort: SortConfig = {
  field: 'createdAt',
  direction: 'desc',
};

const initialTrainersSort: SortConfig = {
  field: 'createdAt',
  direction: 'desc',
};

export const useFiltersStore = create<FiltersState>((set) => ({
  // Initial state
  globalSearch: '',
  membersFilters: initialMembersFilters,
  membersSort: initialMembersSort,
  trainersFilters: initialTrainersFilters,
  trainersSort: initialTrainersSort,
  attendanceFilters: initialAttendanceFilters,

  // Global search
  setGlobalSearch: (globalSearch) => set({ globalSearch }),

  // Members
  setMembersSearch: (search) =>
    set((state) => ({
      membersFilters: { ...state.membersFilters, search },
    })),

  setMembersStatus: (status) =>
    set((state) => ({
      membersFilters: { ...state.membersFilters, status },
    })),

  setMembersTrainer: (trainerId) =>
    set((state) => ({
      membersFilters: { ...state.membersFilters, trainerId },
    })),

  setMembersSort: (field, direction) =>
    set((state) => ({
      membersSort: {
        field,
        direction:
          direction ??
          (state.membersSort.field === field &&
          state.membersSort.direction === 'asc'
            ? 'desc'
            : 'asc'),
      },
    })),

  resetMembersFilters: () =>
    set({
      membersFilters: initialMembersFilters,
      membersSort: initialMembersSort,
    }),

  // Trainers
  setTrainersSearch: (search) =>
    set((state) => ({
      trainersFilters: { ...state.trainersFilters, search },
    })),

  setTrainersSort: (field, direction) =>
    set((state) => ({
      trainersSort: {
        field,
        direction:
          direction ??
          (state.trainersSort.field === field &&
          state.trainersSort.direction === 'asc'
            ? 'desc'
            : 'asc'),
      },
    })),

  resetTrainersFilters: () =>
    set({
      trainersFilters: initialTrainersFilters,
      trainersSort: initialTrainersSort,
    }),

  // Attendance
  setAttendanceDate: (date) =>
    set((state) => ({
      attendanceFilters: { ...state.attendanceFilters, date },
    })),

  setAttendanceSearch: (search) =>
    set((state) => ({
      attendanceFilters: { ...state.attendanceFilters, search },
    })),

  resetAttendanceFilters: () =>
    set({
      attendanceFilters: initialAttendanceFilters,
    }),

  // Reset all
  resetAllFilters: () =>
    set({
      globalSearch: '',
      membersFilters: initialMembersFilters,
      membersSort: initialMembersSort,
      trainersFilters: initialTrainersFilters,
      trainersSort: initialTrainersSort,
      attendanceFilters: initialAttendanceFilters,
    }),
}));

// Selectors
export const selectMembersFilters = (state: FiltersState) =>
  state.membersFilters;
export const selectMembersSort = (state: FiltersState) => state.membersSort;
export const selectTrainersFilters = (state: FiltersState) =>
  state.trainersFilters;
export const selectTrainersSort = (state: FiltersState) => state.trainersSort;
export const selectAttendanceFilters = (state: FiltersState) =>
  state.attendanceFilters;
