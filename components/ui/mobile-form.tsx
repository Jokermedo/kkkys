"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface MobileFormProps {
  title?: string
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  isSubmitting?: boolean
  className?: string
}

export function MobileForm({
  title,
  children,
  onSubmit,
  submitLabel = "حفظ",
  cancelLabel = "إلغاء",
  onCancel,
  isSubmitting = false,
  className,
}: MobileFormProps) {
  return (
    <Card className={cn("w-full", className)}>
      {title && (
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full sm:w-auto order-2 sm:order-1 bg-transparent"
                disabled={isSubmitting}
              >
                {cancelLabel}
              </Button>
            )}
            <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

interface MobileFormFieldProps {
  label: string
  children: React.ReactNode
  required?: boolean
  error?: string
  description?: string
}

export function MobileFormField({ label, children, required = false, error, description }: MobileFormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </Label>
      {children}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
