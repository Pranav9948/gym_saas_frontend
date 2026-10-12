'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, UploadCloud } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/common'
import { LocationFieldsGroup, PhoneInput } from '@/components/common/location'
import { updateTenantSchema, type UpdateTenantFormData } from '@/schemas/settings.schema'
import { tenantService, queryKeys } from '@/services'
import { useToast } from '@/hooks/use-toast'
import { useOwnerTenant } from '@/hooks/useOwnerTenant'
import { useAuthStore } from '@/store/authStore'
import { ApiException } from '@/lib/api/errors'
import {
  getCountryByCode,
  getDialCode,
  guessDefaultCountryCode,
  resolveLocationFromNames,
  splitPhoneNumber,
  type LocationCodes,
  type LocationNames,
} from '@/lib/location'
import { resolveMediaUrl } from '@/lib/helpers/media'
import type { Tenant } from '@/types'

interface GymProfileFormBodyProps {
  tenant: Tenant
}

function GymProfileFormBody({ tenant }: GymProfileFormBodyProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const setTenant = useAuthStore((state) => state.setTenant)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const resolvedLocation = React.useMemo(
    () =>
      resolveLocationFromNames(
        tenant.country,
        tenant.state ?? '',
        tenant.city,
      ),
    [tenant.country, tenant.state, tenant.city],
  )

  const parsedPhone = React.useMemo(
    () => splitPhoneNumber(tenant.contactPhone ?? ''),
    [tenant.contactPhone],
  )

  const [locationNames, setLocationNames] = React.useState<LocationNames>({
    country: resolvedLocation.country,
    state: resolvedLocation.state,
    city: resolvedLocation.city,
  })

  const [locationCodes, setLocationCodes] = React.useState<LocationCodes>({
    countryCode: resolvedLocation.countryCode || parsedPhone.countryCode,
    stateCode: resolvedLocation.stateCode,
  })

  const [phoneCountryCode, setPhoneCountryCode] = React.useState(
    resolvedLocation.countryCode || parsedPhone.countryCode || guessDefaultCountryCode(),
  )

  const [logoPreview, setLogoPreview] = React.useState<string | null>(
    resolveMediaUrl(tenant.logoUrl),
  )

  const form = useForm<UpdateTenantFormData>({
    resolver: zodResolver(updateTenantSchema),
    defaultValues: {
      name: tenant.name,
      address: tenant.address ?? '',
      city: resolvedLocation.city,
      state: resolvedLocation.state,
      country: resolvedLocation.country,
      contactEmail: tenant.contactEmail,
      contactPhone: tenant.contactPhone,
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateTenantFormData) => tenantService.updateTenant(data),
    onSuccess: (response) => {
      if (response.data) {
        setTenant(response.data)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.current() })
      toast({
        title: 'Profile updated',
        description: 'Your gym profile was saved successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not save profile',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Something went wrong.',
        variant: 'destructive',
      })
    },
  })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => tenantService.uploadLogo(file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.current() })
      if (response.data && typeof response.data === 'object' && 'logoUrl' in response.data) {
        setLogoPreview(resolveMediaUrl((response.data as { logoUrl?: string }).logoUrl) ?? logoPreview)
      }
      toast({
        title: 'Logo uploaded',
        description: 'Your gym logo was updated.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not upload logo',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Something went wrong.',
        variant: 'destructive',
      })
    },
  })

  const handleLocationChange = (names: LocationNames, codes: LocationCodes) => {
    setLocationNames(names)
    setLocationCodes(codes)
    form.setValue('country', names.country, { shouldValidate: true })
    form.setValue('state', names.state, { shouldValidate: true })
    form.setValue('city', names.city, { shouldValidate: true })

    if (codes.countryCode) {
      setPhoneCountryCode(codes.countryCode)
      const dialCode = getDialCode(codes.countryCode)
      const currentPhone = form.getValues('contactPhone') ?? ''
      const nationalNumber = currentPhone.replace(/^\+\d+\s*/, '').trim()
      form.setValue(
        'contactPhone',
        nationalNumber ? `${dialCode} ${nationalNumber}` : dialCode,
        { shouldValidate: true },
      )
    }
  }

  const handlePhoneCountryChange = (code: string) => {
    setPhoneCountryCode(code)
    const country = getCountryByCode(code)
    if (!country) return

    setLocationNames({
      country: country.name,
      state: '',
      city: '',
    })
    setLocationCodes({
      countryCode: code,
      stateCode: '',
    })
    form.setValue('country', country.name, { shouldValidate: true })
    form.setValue('state', '', { shouldValidate: true })
    form.setValue('city', '', { shouldValidate: true })
  }

  const handleLogoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      toast({
        title: 'Invalid file',
        description: 'Please upload a PNG, JPEG, WEBP, or SVG image.',
        variant: 'destructive',
      })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Logo must be 2MB or smaller.',
        variant: 'destructive',
      })
      return
    }

    setLogoPreview(URL.createObjectURL(file))
    await uploadMutation.mutateAsync(file)
    event.target.value = ''
  }

  const onSubmit = form.handleSubmit(async (data) => {
    await updateMutation.mutateAsync({
      ...data,
      country: locationNames.country,
      state: locationNames.state,
      city: locationNames.city,
    })
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gym Profile</CardTitle>
        <CardDescription>Update your gym details, location, and branding.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreview}
                  alt="Gym logo"
                  className="size-full object-cover"
                />
              ) : (
                <UploadCloud className="size-6 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Gym logo</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPEG, WEBP, or SVG — up to 2MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={handleLogoSelect}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1"
                disabled={uploadMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload logo'
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="gymName">Gym name</Label>
              <Input
                id="gymName"
                {...form.register('name')}
                aria-invalid={!!form.formState.errors.name}
              />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                rows={2}
                {...form.register('address')}
                aria-invalid={!!form.formState.errors.address}
              />
              {form.formState.errors.address ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.address.message}
                </p>
              ) : null}
            </div>

            <LocationFieldsGroup
              value={locationNames}
              codes={locationCodes}
              onChange={handleLocationChange}
              disabled={updateMutation.isPending}
              errors={{
                country: form.formState.errors.country?.message,
                state: form.formState.errors.state?.message,
                city: form.formState.errors.city?.message,
              }}
            />

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                type="email"
                {...form.register('contactEmail')}
                aria-invalid={!!form.formState.errors.contactEmail}
              />
              {form.formState.errors.contactEmail ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.contactEmail.message}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <PhoneInput
                countryCode={phoneCountryCode}
                value={form.watch('contactPhone') ?? ''}
                onChange={(phone) =>
                  form.setValue('contactPhone', phone, { shouldValidate: true })
                }
                onCountryCodeChange={handlePhoneCountryChange}
                disabled={updateMutation.isPending}
                error={form.formState.errors.contactPhone?.message}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={updateMutation.isPending}>
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function GymProfileForm() {
  const { tenant, isLoading, isError, refetch } = useOwnerTenant()

  if (isLoading) {
    return <LoadingSpinner label="Loading gym profile..." />
  }

  if (isError || !tenant) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Could not load gym profile. Please refresh and try again.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <GymProfileFormBody
      key={`${tenant.id}-${tenant.updatedAt}-${tenant.city}-${tenant.state}`}
      tenant={tenant}
    />
  )
}
