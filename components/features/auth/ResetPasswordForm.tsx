'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
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
  const presetEmail = searchParams.get('email') ?? '';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: presetEmail,
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: {
    email: string;
    code: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(data);
      toast({
        title: 'Password updated',
        description: 'You can now sign in with your new password.',
      });
      router.push(ROUTES.LOGIN);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Could not update password. Check the code and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter your email, the 6-digit code from Super Admin, your gym owner, or
        gym staff, and a new password.
      </p>

      <FormField
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        disabled={isLoading}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">6-digit code</p>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              disabled={isLoading}
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {errors.code?.message ? (
          <p className="text-center text-sm text-destructive">
            {errors.code.message}
          </p>
        ) : null}
      </div>

      <FormField
        name="password"
        control={control}
        label="New password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isLoading}
        description="At least 8 characters with uppercase, lowercase, number, and special character"
      />

      <FormField
        name="confirmPassword"
        control={control}
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        disabled={isLoading}
      />

      <Button type="submit" className="w-full" loading={isLoading}>
        Update password
      </Button>

      <div className="text-center text-sm">
        <Link href={ROUTES.FORGOT_PASSWORD} className="text-primary hover:underline">
          Request a new code
        </Link>
      </div>
    </form>
  );
}
