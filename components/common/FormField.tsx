"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<UseControllerProps<TFieldValues>, "render"> {
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
  type = "text",
  disabled,
  className,
  description,
  ...rest
}: FormFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <Controller
      name={name}
      control={control}
      {...rest}
      render={({ field }) => (
        <div className={cn("space-y-2", className)}>
          {label && (
            <Label htmlFor={name}>
              {label}
              {rest.rules?.required && (
                <span className="text-destructive">*</span>
              )}
            </Label>
          )}

          <div className="relative">
            <Input
              {...field}
              id={name}
              type={inputType}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn(
                "border-border bg-background shadow-sm ring-1 ring-border/40 placeholder:text-muted-foreground/70",
                "focus-visible:ring-2 focus-visible:ring-primary",
                error && "border-destructive ring-destructive/30",
                type === "password" && "pr-10",
              )}
            />

            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

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
