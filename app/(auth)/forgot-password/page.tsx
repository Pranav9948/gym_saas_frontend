import { ForgotPasswordForm } from '@/components/features/auth';

export const metadata = {
  title: 'Forgot Password - GymFlow',
  description: 'Reset your GymFlow password',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}