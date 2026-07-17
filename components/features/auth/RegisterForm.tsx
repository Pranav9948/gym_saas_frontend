'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common';
import { registerGymSchema } from '@/schemas';
import { authService } from '@/services';
import { useAuth } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { ApiException } from '@/lib/api/errors';
import Link from 'next/link';
import { ROUTES } from '@/config';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from "lucide-react";

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gymName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  country: string;
  timezone?: string;
};

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
];

export function RegisterForm() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);


  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneNumberPart, setPhoneNumberPart] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
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
      contactPhone: '',
      contactEmail: '',
      address: '',
      city: '',
      country: '',
      timezone: '',
    },
  });

  React.useEffect(() => {
    setValue(
      "timezone",
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      {
        shouldValidate: true,
      }
    );
  }, [setValue]);

  React.useEffect(() => {
    setValue("country", selectedCountry.name, {
      shouldValidate: true,
    });

    setValue(
      "contactPhone",
      selectedCountry.dialCode,
      {
        shouldValidate: true,
      }
    );
  }, [selectedCountry, setValue]);


  const onSubmit = async (data: RegisterFormData) => {

    console.log('data in RegisterForm', data)

    setIsLoading(true);

    try {
      const registrationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        gymName: data.gymName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        address: data.address,
        city: data.city,
        country: data.country,
        timezone: data.timezone,
      };

      const response = await authService.registerGym(registrationData);

      setAuth(
        response.data.user,
        response.data.tenant,
        response.data.accessToken
      );

      toast({
        title: 'Success',
        description: 'Account created successfully',
      });

      router.push(ROUTES.LOGIN);
    } catch (error) {
      const message = error instanceof ApiException
        ? error.getUserMessage()
        : 'Registration failed. Please try again.';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4">
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

      <Controller
        name="contactPhone"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="contactPhone">
              Contact Phone <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Select
                value={selectedCountry.code}
                onValueChange={(val) => {
                  const country = COUNTRIES.find((c) => c.code === val);
                  if (country) {
                    setSelectedCountry(country);
                    setValue('country', country.name, { shouldValidate: true });
                    setValue('contactPhone', country.dialCode + ' ' + phoneNumberPart, { shouldValidate: true });
                  }
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[100px] h-10 shrink-0 bg-background/50 border border-border flex items-center justify-between gap-1 px-3">
                  <SelectValue placeholder="Code">
                    <span className="flex items-center gap-1">
                      <span>{selectedCountry.flag}</span>
                      <span className="text-xs text-muted-foreground">{selectedCountry.dialCode}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[300px]">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="mr-2 text-base">{c.flag}</span>
                      <span>{c.name} ({c.dialCode})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="234 567 8900"
                value={phoneNumberPart}
                onChange={(e) => {
                  const cleanVal = e.target.value.replace(/[^0-9\-() ]/g, '');
                  setPhoneNumberPart(cleanVal);
                  setValue('contactPhone', selectedCountry.dialCode + ' ' + cleanVal, { shouldValidate: true });
                }}
                maxLength={15 - selectedCountry.dialCode.length - 1}
                disabled={isLoading}
                aria-invalid={!!errors.contactPhone}
                className={cn(
                  'h-10 flex-1 bg-background/50 border border-border',
                  errors.contactPhone && 'border-destructive'
                )}
              />
            </div>
            {errors.contactPhone?.message && (
              <p className="text-xs text-destructive">{errors.contactPhone.message}</p>
            )}
          </div>
        )}
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="city"
          control={control}
          label="City"
          placeholder="New York"
          error={errors.city?.message}
          disabled={isLoading}
        />
        <FormField
          name="country"
          control={control}
          label="Country"
          placeholder="USA"
          error={errors.country?.message}
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href={ROUTES.LOGIN} className="font-medium hover:underline cursor-pointer">
          Login
        </Link>
      </div>
    </form>
  );
}