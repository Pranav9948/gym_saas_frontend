"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      closeButton
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-emerald-500 shrink-0" />
        ),
        info: (
          <InfoIcon className="size-5 text-sky-500 shrink-0" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5 text-amber-500 shrink-0" />
        ),
        error: (
          <OctagonXIcon className="size-5 text-red-500 shrink-0" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin text-muted-foreground shrink-0" />
        ),
      }}
      style={
        {
          "--normal-bg": "hsl(var(--popover))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group bg-popover text-popover-foreground border border-border rounded-xl shadow-xl backdrop-blur-md p-4 pr-10 flex gap-3 items-start",
          title:
            "text-sm font-semibold text-popover-foreground",
          description:
            "text-xs text-muted-foreground mt-1",
          actionButton:
            "inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground",
          cancelButton:
            "inline-flex h-8 items-center justify-center rounded-md border border-border bg-transparent px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground",
          closeButton:
            "absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground",

          success:
            "border-emerald-500/30 bg-emerald-500/10",
          error:
            "border-red-500/30 bg-red-500/10",
          warning:
            "border-amber-500/30 bg-amber-500/10",
          info:
            "border-sky-500/30 bg-sky-500/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }