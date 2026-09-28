import type { MuscleGroup } from '@/types'

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'CHEST',
  'BACK',
  'LEGS',
  'SHOULDERS',
  'BICEPS',
  'TRICEPS',
  'CORE',
  'CARDIO',
  'FULL_BODY',
  'OTHER',
]

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  CHEST: 'Chest',
  BACK: 'Back',
  LEGS: 'Legs',
  SHOULDERS: 'Shoulders',
  BICEPS: 'Biceps',
  TRICEPS: 'Triceps',
  CORE: 'Core',
  CARDIO: 'Cardio',
  FULL_BODY: 'Full body',
  OTHER: 'Other',
}

export const SUGGESTED_EXERCISES: Record<MuscleGroup, string[]> = {
  CHEST: ['Bench Press', 'Incline Dumbbell Press', 'Chest Fly', 'Push-Up'],
  BACK: ['Lat Pulldown', 'Barbell Row', 'Seated Row', 'Deadlift'],
  LEGS: ['Squats', 'Leg Press', 'Lunges', 'Romanian Deadlift', 'Leg Curl'],
  SHOULDERS: ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Face Pull'],
  BICEPS: ['Barbell Curl', 'Dumbbell Curl', 'Hammer Curl'],
  TRICEPS: ['Tricep Pushdown', 'Skull Crusher', 'Close-Grip Bench Press'],
  CORE: ['Plank', 'Cable Crunch', 'Hanging Leg Raise'],
  CARDIO: ['Treadmill', 'Cycling', 'Rowing Machine'],
  FULL_BODY: ['Burpee', 'Kettlebell Swing', 'Clean and Press'],
  OTHER: [],
}

export const MUSCLE_GROUP_THEMES: Record<
  MuscleGroup,
  { wrap: string; icon: string; chip: string; accent: string }
> = {
  CHEST: {
    wrap: 'border-rose-400/50 bg-gradient-to-br from-rose-400/20 to-transparent',
    icon: 'bg-rose-400 text-rose-950',
    chip: 'bg-rose-400/25 text-rose-950 dark:text-rose-100',
    accent: 'border-l-rose-400',
  },
  BACK: {
    wrap: 'border-sky-400/50 bg-gradient-to-br from-sky-400/20 to-transparent',
    icon: 'bg-sky-400 text-sky-950',
    chip: 'bg-sky-400/25 text-sky-950 dark:text-sky-100',
    accent: 'border-l-sky-400',
  },
  LEGS: {
    wrap: 'border-amber-400/50 bg-gradient-to-br from-amber-400/20 to-transparent',
    icon: 'bg-amber-400 text-amber-950',
    chip: 'bg-amber-400/25 text-amber-950 dark:text-amber-100',
    accent: 'border-l-amber-400',
  },
  SHOULDERS: {
    wrap: 'border-violet-400/50 bg-gradient-to-br from-violet-400/20 to-transparent',
    icon: 'bg-violet-400 text-violet-950',
    chip: 'bg-violet-400/25 text-violet-950 dark:text-violet-100',
    accent: 'border-l-violet-400',
  },
  BICEPS: {
    wrap: 'border-orange-400/50 bg-gradient-to-br from-orange-400/20 to-transparent',
    icon: 'bg-orange-400 text-orange-950',
    chip: 'bg-orange-400/25 text-orange-950 dark:text-orange-100',
    accent: 'border-l-orange-400',
  },
  TRICEPS: {
    wrap: 'border-fuchsia-400/50 bg-gradient-to-br from-fuchsia-400/20 to-transparent',
    icon: 'bg-fuchsia-400 text-fuchsia-950',
    chip: 'bg-fuchsia-400/25 text-fuchsia-950 dark:text-fuchsia-100',
    accent: 'border-l-fuchsia-400',
  },
  CORE: {
    wrap: 'border-emerald-400/50 bg-gradient-to-br from-emerald-400/20 to-transparent',
    icon: 'bg-emerald-400 text-emerald-950',
    chip: 'bg-emerald-400/25 text-emerald-950 dark:text-emerald-100',
    accent: 'border-l-emerald-400',
  },
  CARDIO: {
    wrap: 'border-cyan-400/50 bg-gradient-to-br from-cyan-400/20 to-transparent',
    icon: 'bg-cyan-400 text-cyan-950',
    chip: 'bg-cyan-400/25 text-cyan-950 dark:text-cyan-100',
    accent: 'border-l-cyan-400',
  },
  FULL_BODY: {
    wrap: 'border-indigo-400/50 bg-gradient-to-br from-indigo-400/20 to-transparent',
    icon: 'bg-indigo-400 text-indigo-950',
    chip: 'bg-indigo-400/25 text-indigo-950 dark:text-indigo-100',
    accent: 'border-l-indigo-400',
  },
  OTHER: {
    wrap: 'border-zinc-400/40 bg-gradient-to-br from-zinc-400/15 to-transparent',
    icon: 'bg-zinc-300 text-zinc-900',
    chip: 'bg-zinc-400/25 text-zinc-900 dark:text-zinc-100',
    accent: 'border-l-zinc-400',
  },
}
