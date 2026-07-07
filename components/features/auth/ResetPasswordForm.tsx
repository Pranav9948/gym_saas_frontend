'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common';
import { resetPasswordSchema } from '@/schemas';
import { authService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { ApiException } from '@/lib/api/errors';
import Link from 'next/link';
import { ROUTES } from '@/config';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const token = searchParams.get('token');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    if (!token) {
      toast({
        title: 'Error',
        description: 'Invalid reset token',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast({
        title: 'Success',
        description: 'Password reset successful. You can now login with your new password.',
      });

      router.push(ROUTES.LOGIN);
    } catch (error) {
      const message = error instanceof ApiException
        ? error.getUserMessage()
        : 'Failed to reset password. Please try again.';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">Invalid or expired reset link.</p>
        <Link href={ROUTES.FORGOT_PASSWORD}>
          <Button variant="outline" className="w-full">
            Request New Reset Link
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        name="password"
        control={control}
        label="New Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isLoading}
        description="At least 8 characters with uppercase, lowercase, and numbers"
      />

      <FormField
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        disabled={isLoading}
      />

      <Button type="submit" className="w-full" loading={isLoading}>
        Reset Password
      </Button>

      <div className="text-center text-sm">
        <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </form>
  );
}
