'use client';

import React from 'react';
import { Controller, FieldValues, Path, UseControllerProps } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<UseControllerProps<TFieldValues>, 'render'> {
  label?: string;
  placeholder?: string;
  error?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export function FormField<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  error,
  type = 'text',
  disabled,
  className,
  description,
  ...rest
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      {...rest}
      render={({ field }) => (
        <div className={cn('space-y-2', className)}>
          {label && (
            <Label htmlFor={name}>
              {label}
              {rest.rules?.required && <span className="text-destructive">*</span>}
            </Label>
          )}
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={error ? 'border-destructive' : ''}
          />
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {error && (
            <p id={`${name}-error`} className="text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
      )}
    />
  );
}
