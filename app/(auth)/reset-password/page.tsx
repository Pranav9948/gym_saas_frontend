import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/features/auth';

export const metadata = {
  title: 'Reset Password - GymFlow',
  description: 'Set your new GymFlow password',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
