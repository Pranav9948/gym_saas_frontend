'use client'

import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import { FormField } from '@/components/common'

interface MemberPortalPasswordFieldsProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  passwordError?: string
  confirmError?: string
  disabled?: boolean
  required?: boolean
}

export function MemberPortalPasswordFields<TFieldValues extends FieldValues>({
  control,
  passwordError,
  confirmError,
  disabled,
  required,
}: MemberPortalPasswordFieldsProps<TFieldValues>) {
  return (
    <div className="space-y-3 rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
      <div>
        <p className="text-sm font-medium">Member portal login</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {required
            ? 'Personal training members use this password to open their training dashboard.'
            : 'Optional. Set a password so this member can log in to the member portal.'}
        </p>
      </div>
      <FormField
        name={'portalPassword' as Path<TFieldValues>}
        control={control}
        label={required ? 'Portal password' : 'Portal password (optional)'}
        type="password"
        error={passwordError}
        disabled={disabled}
      />
      <FormField
        name={'confirmPortalPassword' as Path<TFieldValues>}
        control={control}
        label="Confirm portal password"
        type="password"
        error={confirmError}
        disabled={disabled}
      />
    </div>
  )
}
