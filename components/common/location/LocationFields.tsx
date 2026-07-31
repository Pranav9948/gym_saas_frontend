'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  buildPhoneNumber,
  ensureOptionIncluded,
  getAllCountries,
  getCountryByCode,
  getUniqueCityNames,
  getDialCode,
  getStatesOfCountry,
  type LocationCodes,
  type LocationNames,
} from '@/lib/location'

interface LocationFieldsGroupProps {
  value: LocationNames
  codes: LocationCodes
  onChange: (value: LocationNames, codes: LocationCodes) => void
  disabled?: boolean
  errors?: {
    country?: string
    state?: string
    city?: string
  }
}

export function LocationFieldsGroup({
  value,
  codes,
  onChange,
  disabled,
  errors,
}: LocationFieldsGroupProps) {
  const countries = React.useMemo(() => getAllCountries(), [])
  const states = React.useMemo(
    () => getStatesOfCountry(codes.countryCode),
    [codes.countryCode],
  )
  const cities = React.useMemo(() => {
    const names = getUniqueCityNames(codes.countryCode, codes.stateCode)
    return ensureOptionIncluded(names, value.city)
  }, [codes.countryCode, codes.stateCode, value.city])

  const stateNames = React.useMemo(
    () => ensureOptionIncluded(
      states.map((state) => state.name),
      value.state,
    ),
    [states, value.state],
  )

  const handleCountryChange = (countryCode: string) => {
    const country = getCountryByCode(countryCode)
    if (!country) return

    onChange(
      {
        country: country.name,
        state: '',
        city: '',
      },
      {
        countryCode,
        stateCode: '',
      },
    )
  }

  const handleStateChange = (stateCode: string) => {
    const state = states.find((item) => item.isoCode === stateCode)
    if (!state) return

    onChange(
      {
        ...value,
        state: state.name,
        city: '',
      },
      {
        ...codes,
        stateCode,
      },
    )
  }

  const handleCityChange = (city: string) => {
    onChange(
      {
        ...value,
        city,
      },
      codes,
    )
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="country">
          Country <span className="text-destructive">*</span>
        </Label>
        <Select
          value={codes.countryCode || undefined}
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger
            id="country"
            className={cn('w-full', errors?.country && 'border-destructive')}
          >
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {countries.map((country) => (
              <SelectItem key={country.isoCode} value={country.isoCode}>
                {country.flag ? `${country.flag} ` : ''}
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.country ? (
          <p className="text-xs text-destructive">{errors.country}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">
          State / Province <span className="text-destructive">*</span>
        </Label>
        {stateNames.length > 0 ? (
          <Select
            value={codes.stateCode || undefined}
            onValueChange={handleStateChange}
            disabled={disabled || !codes.countryCode}
          >
            <SelectTrigger
              id="state"
              className={cn('w-full', errors?.state && 'border-destructive')}
            >
              <SelectValue
                placeholder={
                  codes.countryCode ? 'Select state' : 'Select country first'
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {states.map((state) => (
                <SelectItem key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </SelectItem>
              ))}
              {value.state &&
                !states.some((state) => state.name === value.state) ? (
                <SelectItem value={codes.stateCode || value.state}>
                  {value.state}
                </SelectItem>
              ) : null}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="state"
            value={value.state}
            onChange={(event) =>
              onChange(
                { ...value, state: event.target.value, city: '' },
                { ...codes, stateCode: '' },
              )
            }
            placeholder={codes.countryCode ? 'Enter state' : 'Select country first'}
            disabled={disabled || !codes.countryCode}
            className={cn(errors?.state && 'border-destructive')}
          />
        )}
        {errors?.state ? (
          <p className="text-xs text-destructive">{errors.state}</p>
        ) : null}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="city">
          City <span className="text-destructive">*</span>
        </Label>
        {cities.length > 0 ? (
          <Select
            value={value.city || undefined}
            onValueChange={handleCityChange}
            disabled={disabled || !codes.countryCode || (!codes.stateCode && stateNames.length > 0)}
          >
            <SelectTrigger
              id="city"
              className={cn('w-full', errors?.city && 'border-destructive')}
            >
              <SelectValue
                placeholder={
                  codes.stateCode ? 'Select city' : 'Select state first'
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="city"
            value={value.city}
            onChange={(event) => handleCityChange(event.target.value)}
            placeholder={codes.stateCode ? 'Enter city' : 'Select state first'}
            disabled={disabled || !codes.stateCode}
            className={cn(errors?.city && 'border-destructive')}
          />
        )}
        {errors?.city ? (
          <p className="text-xs text-destructive">{errors.city}</p>
        ) : null}
      </div>
    </>
  )
}

interface PhoneInputProps {
  countryCode: string
  value: string
  onChange: (fullPhone: string) => void
  onCountryCodeChange?: (countryCode: string) => void
  disabled?: boolean
  error?: string
  id?: string
  label?: string
}

export function PhoneInput({
  countryCode,
  value,
  onChange,
  onCountryCodeChange,
  disabled,
  error,
  id = 'contactPhone',
  label = 'Phone',
}: PhoneInputProps) {
  const countries = React.useMemo(() => getAllCountries(), [])
  const dialCode = getDialCode(countryCode)
  const nationalNumber = value.startsWith(dialCode)
    ? value.slice(dialCode.length).trim()
    : value.replace(/^\+\d+\s*/, '').trim()

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} <span className="text-destructive">*</span>
      </Label>
      <div className="flex gap-2">
        <Select
          value={countryCode}
          onValueChange={(code) => {
            onCountryCodeChange?.(code)
            onChange(buildPhoneNumber(getDialCode(code), nationalNumber))
          }}
          disabled={disabled}
        >
          <SelectTrigger className="h-10 w-[120px] shrink-0">
            <SelectValue>
              <span className="text-xs text-muted-foreground">{dialCode}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {countries.map((country) => (
              <SelectItem key={country.isoCode} value={country.isoCode}>
                {country.flag ? `${country.flag} ` : ''}
                {country.name} ({getDialCode(country.isoCode)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id={id}
          type="tel"
          value={nationalNumber}
          onChange={(event) => {
            const cleaned = event.target.value.replace(/[^0-9\-() ]/g, '')
            onChange(buildPhoneNumber(dialCode, cleaned))
          }}
          placeholder="98765 43210"
          disabled={disabled}
          aria-invalid={!!error}
          className={cn('flex-1', error && 'border-destructive')}
        />
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
