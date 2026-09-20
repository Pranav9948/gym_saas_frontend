'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { FormField, LoadingSpinner } from '@/components/common'
import { acceptInviteSchema, type AcceptInviteFormData } from '@/schemas/settings.schema'
import { tenantService } from '@/services'
import { useAuthStore } from '@/store/authStore'
import { whenSessionCookieSynced } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import { ROUTES, getPostLoginRoute } from '@/config/routes'
import { ROLE_LABELS } from '@/constants/roles'
import type { InviteRole } from '@/types'

export function AcceptInviteForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const token = searchParams.get('token')

  const previewQuery = useQuery({
    queryKey: ['invite-preview', token],
    queryFn: () => tenantService.getInvitePreview(token!),
    enabled: Boolean(token && token.length >= 10),
    retry: false,
  })

  const form = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      token: token ?? '',
      password: '',
      confirmPassword: '',
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  React.useEffect(() => {
    if (token) {
      setValue('token', token)
    }
  }, [token, setValue])

  const onSubmit = async (data: AcceptInviteFormData) => {
    if (!token) return

    setIsSubmitting(true)
    try {
      const response = await tenantService.acceptInvite({
        token,
        password: data.password,
      })

      setAuth(response.data.user, null, response.data.accessToken)
      await whenSessionCookieSynced()

      toast({
        title: 'Welcome aboard!',
        description: 'Your account is ready. Redirecting to your dashboard…',
      })

      router.push(getPostLoginRoute(response.data.user.role))
    } catch (error) {
      toast({
        title: 'Could not accept invite',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'The invite link may be invalid or expired.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">Invalid or missing invite link.</p>
        <Link href={ROUTES.LOGIN}>
          <Button variant="outline" className="w-full">
            Go to login
          </Button>
        </Link>
      </div>
    )
  }

  if (previewQuery.isLoading) {
    return <LoadingSpinner label="Loading invite…" />
  }

  if (previewQuery.isError || !previewQuery.data?.data) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">
          This invite link is invalid or has expired.
        </p>
        <Link href={ROUTES.LOGIN}>
          <Button variant="outline" className="w-full">
            Go to login
          </Button>
        </Link>
      </div>
    )
  }

  const preview = previewQuery.data.data

  if (preview.expired) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">
          This invite to join {preview.gymName} has expired. Ask your gym owner
          to send a new invite.
        </p>
        <Link href={ROUTES.LOGIN}>
          <Button variant="outline" className="w-full">
            Go to login
          </Button>
        </Link>
      </div>
    )
  }

  const roleLabel = ROLE_LABELS[preview.role as InviteRole] ?? preview.role

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
        <p className="font-medium text-foreground">
          Join {preview.gymName}
        </p>
        <p className="mt-1 text-muted-foreground">
          {preview.firstName} {preview.lastName} · {preview.email}
        </p>
        <p className="mt-1 text-muted-foreground">
          Role: {roleLabel}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="password"
          control={control}
          label="Create password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isSubmitting}
          description="At least 8 characters with uppercase, lowercase, number, and special character"
        />
        <FormField
          name="confirmPassword"
          control={control}
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
        />
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Accept invite &amp; continue
        </Button>
        <div className="text-center text-sm">
          <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
            Already have an account? Log in
          </Link>
        </div>
      </form>
    </div>
  )
}
