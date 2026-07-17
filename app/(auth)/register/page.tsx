import { Feature, RegisterForm } from '@/components/features/auth';
import { SelectSeparator } from '@/components/ui/select';
import { BarChart3, ClipboardCheck, Dumbbell, Users } from 'lucide-react';

export const metadata = {
  title: 'Register - GymFlow',
  description: 'Create a new GymFlow account',
};

export default function RegisterPage() {
  return (

    <div className="space-y-6 my-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Dumbbell className="h-7 w-7 text-primary" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight my-5">
          Create Your GymFlow Account
        </h1>

        <div className="grid grid-cols-2 gap-3">
          <Feature icon={<Users size={18} />} text="Member Management" />
          <Feature icon={<ClipboardCheck size={18} />} text="Attendance" />
          <Feature icon={<Dumbbell size={18} />} text="Trainer Management" />
          <Feature icon={<BarChart3 size={18} />} text="Analytics" />
        </div>

        <p className="mt-3 text-sm leading-6 text-muted-foreground my-2">
          Start managing your gym with one powerful platform. Track members,
          trainers, attendance, subscriptions, and daily operations—all from
          a single dashboard.
        </p>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-orange-600" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-orange-600 uppercase tracking-wider">
            get started now
          </span>
        </div>
      </div>

      <RegisterForm />
    </div>
  )



}