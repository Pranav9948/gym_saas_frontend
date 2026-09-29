'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { forgotPasswordSchema, resetPasswordSchema } from '@/schemas';
import { authService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { ApiException } from '@/lib/api/errors';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config';

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [step, setStep] = React.useState<'email' | 'code'>('email');

  const emailForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onRequestCode = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
      setEmail(data.email);
      resetForm.reset({
        email: data.email,
        code: '',
        password: '',
        confirmPassword: '',
      });
      setStep('code');
      toast({
        title: 'Code sent',
        description:
          'If an account exists, a 6-digit code was sent to the person who manages it.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Could not start password reset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onReset = async (data: {
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

  if (step === 'code') {
    return (
      <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
        <div className="space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            A 6-digit code was sent to the person who can approve this reset:
          </p>
          <ul className="text-left text-sm text-muted-foreground space-y-1 rounded-lg border bg-muted/40 px-4 py-3">
            <li>
              <span className="font-medium text-foreground">Gym owners</span> —
              Super Admin
            </li>
            <li>
              <span className="font-medium text-foreground">Staff</span> — Gym
              owner
            </li>
            <li>
              <span className="font-medium text-foreground">Trainers & members</span>{' '}
              — Gym staff
            </li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Enter the code they give you, then choose a new password for{' '}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">6-digit code</p>
          <Controller
            name="code"
            control={resetForm.control}
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
          {resetForm.formState.errors.code?.message ? (
            <p className="text-center text-sm text-destructive">
              {resetForm.formState.errors.code.message}
            </p>
          ) : null}
        </div>

        <FormField
          name="password"
          control={resetForm.control}
          label="New password"
          type="password"
          placeholder="••••••••"
          error={resetForm.formState.errors.password?.message}
          disabled={isLoading}
          description="At least 8 characters with uppercase, lowercase, number, and special character"
        />

        <FormField
          name="confirmPassword"
          control={resetForm.control}
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={resetForm.formState.errors.confirmPassword?.message}
          disabled={isLoading}
        />

        <Button type="submit" className="w-full" loading={isLoading}>
          Update password
        </Button>

        <button
          type="button"
          className="w-full text-center text-sm text-primary hover:underline"
          onClick={() => setStep('email')}
          disabled={isLoading}
        >
          Use a different email
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={emailForm.handleSubmit(onRequestCode)} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter your login email. A 6-digit code will be shown to Super Admin, your
        gym owner, or gym staff — depending on your role.
      </p>
      <FormField
        name="email"
        control={emailForm.control}
        label="Email"
        type="email"
        placeholder="your@email.com"
        error={emailForm.formState.errors.email?.message}
        disabled={isLoading}
      />

      <Button type="submit" className="w-full" loading={isLoading}>
        Send reset code
      </Button>

      <div className="text-center text-sm">
        <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </form>
  );
}
