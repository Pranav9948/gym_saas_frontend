'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/common'
import { LocationFieldsGroup, PhoneInput } from '@/components/common/location'
import { registerGymSchema } from '@/schemas'
import { authService } from '@/services'
import { useAuth } from '@/hooks'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import { ROUTES } from '@/config'
import {
  getCountryByCode,
  getDialCode,
  guessDefaultCountryCode,
  type LocationCodes,
  type LocationNames,
} from '@/lib/location'

type RegisterFormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  gymName: string
  contactPhone: string
  contactEmail: string
  address: string
  city: string
  state: string
  country: string
  timezone?: string
}

export function RegisterForm() {
  const router = useRouter()
  const { setAuth } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const defaultCountryCode = guessDefaultCountryCode()
  const defaultCountry = getCountryByCode(defaultCountryCode)!

  const [locationNames, setLocationNames] = React.useState<LocationNames>({
    country: defaultCountry.name,
    state: '',
    city: '',
  })

  const [locationCodes, setLocationCodes] = React.useState<LocationCodes>({
    countryCode: defaultCountryCode,
    stateCode: '',
  })

  const [phoneCountryCode, setPhoneCountryCode] = React.useState(defaultCountryCode)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerGymSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      gymName: '',
      contactPhone: getDialCode(defaultCountryCode),
      contactEmail: '',
      address: '',
      city: '',
      state: '',
      country: defaultCountry.name,
      timezone: '',
    },
  })

  React.useEffect(() => {
    setValue('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone, {
      shouldValidate: true,
    })
  }, [setValue])

  const handleLocationChange = (names: LocationNames, codes: LocationCodes) => {
    setLocationNames(names)
    setLocationCodes(codes)
    setValue('country', names.country, { shouldValidate: true })
    setValue('state', names.state, { shouldValidate: true })
    setValue('city', names.city, { shouldValidate: true })

    if (codes.countryCode) {
      setPhoneCountryCode(codes.countryCode)
      const dialCode = getDialCode(codes.countryCode)
      const currentPhone = watch('contactPhone') ?? ''
      const nationalNumber = currentPhone.replace(/^\+\d+\s*/, '').trim()
      setValue(
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
    setValue('country', country.name, { shouldValidate: true })
    setValue('state', '', { shouldValidate: true })
    setValue('city', '', { shouldValidate: true })
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      const response = await authService.registerGym({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        gymName: data.gymName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        address: data.address,
        city: locationNames.city,
        state: locationNames.state,
        country: locationNames.country,
        timezone: data.timezone,
      })

      setAuth(response.data.user, response.data.tenant, response.data.accessToken)

      toast({
        title: 'Success',
        description: 'Account created successfully',
      })

      router.push(ROUTES.LOGIN)
    } catch (error) {
      const message =
        error instanceof ApiException
          ? error.getUserMessage()
          : 'Registration failed. Please try again.'

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="firstName"
          control={control}
          label="First Name"
          placeholder="John"
          error={errors.firstName?.message}
          disabled={isLoading}
        />
        <FormField
          name="lastName"
          control={control}
          label="Last Name"
          placeholder="Doe"
          error={errors.lastName?.message}
          disabled={isLoading}
        />
      </div>

      <FormField
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        disabled={isLoading}
      />

      <FormField
        name="gymName"
        control={control}
        label="Gym Name"
        placeholder="My Awesome Gym"
        error={errors.gymName?.message}
        disabled={isLoading}
      />

      <FormField
        name="password"
        control={control}
        label="Password"
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

      <PhoneInput
        countryCode={phoneCountryCode}
        value={watch('contactPhone') ?? ''}
        onChange={(phone) => setValue('contactPhone', phone, { shouldValidate: true })}
        onCountryCodeChange={handlePhoneCountryChange}
        disabled={isLoading}
        error={errors.contactPhone?.message}
      />

      <FormField
        name="contactEmail"
        control={control}
        label="Contact Email"
        type="email"
        placeholder="gym@email.com"
        error={errors.contactEmail?.message}
        disabled={isLoading}
      />

      <FormField
        name="address"
        control={control}
        label="Address"
        placeholder="123 Gym Street"
        error={errors.address?.message}
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LocationFieldsGroup
          value={locationNames}
          codes={locationCodes}
          onChange={handleLocationChange}
          disabled={isLoading}
          errors={{
            country: errors.country?.message,
            state: errors.state?.message,
            city: errors.city?.message,
          }}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full cursor-pointer">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href={ROUTES.LOGIN} className="cursor-pointer font-medium hover:underline">
          Login
        </Link>
      </div>
    </form>
  )
}
