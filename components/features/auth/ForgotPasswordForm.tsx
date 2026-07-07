'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common';
import { forgotPasswordSchema } from '@/schemas';
import { authService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { ApiException } from '@/lib/api/errors';
import Link from 'next/link';
import { ROUTES } from '@/config';

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);

      setSubmitted(true);
      toast({
        title: 'Success',
        description: 'Check your email for password reset instructions',
      });
    } catch (error) {
      const message = error instanceof ApiException
        ? error.getUserMessage()
        : 'Failed to send reset email. Please try again.';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <div>
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to your email. Check your inbox and spam folder.
          </p>
        </div>
        <Link href={ROUTES.LOGIN}>
          <Button variant="outline" className="w-full">
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        disabled={isLoading}
      />

      <Button type="submit" className="w-full" loading={isLoading}>
        Send Reset Link
      </Button>

      <div className="text-center text-sm">
        <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </form>
  );
}
