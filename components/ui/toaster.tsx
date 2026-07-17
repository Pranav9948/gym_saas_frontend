'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon } from 'lucide-react'

function getToastIcon(title?: React.ReactNode, variant?: string) {
  const titleString = typeof title === 'string' ? title.toLowerCase() : '';
  if (variant === 'destructive' || variant === 'error') {
    return <OctagonXIcon className="size-5 text-red-500 shrink-0 mt-0.5" />
  }
  if (variant === 'success' || titleString.includes('success')) {
    return <CircleCheckIcon className="size-5 text-emerald-500 shrink-0 mt-0.5" />
  }
  if (variant === 'warning' || titleString.includes('warning')) {
    return <TriangleAlertIcon className="size-5 text-amber-500 shrink-0 mt-0.5" />
  }
  if (variant === 'info' || titleString.includes('info')) {
    return <InfoIcon className="size-5 text-sky-500 shrink-0 mt-0.5" />
  }
  return null
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const icon = getToastIcon(title, props.variant)
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-3 items-start w-full">
              {icon}
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

