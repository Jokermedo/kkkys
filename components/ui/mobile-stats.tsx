"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileStatProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
  description?: string
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  className?: string
}

export function MobileStat({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  description,
  badge,
  className,
}: MobileStatProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {icon && <div className="text-muted-foreground">{icon}</div>}
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold">{value}</span>
              {badge && (
                <Badge variant={badge.variant || "default"} className="text-xs">
                  {badge.text}
                </Badge>
              )}
            </div>

            {change && (
              <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
                {getTrendIcon()}
                <span>{change}</span>
              </div>
            )}

            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MobileStatsGridProps {
  children: React.ReactNode
  className?: string
}

export function MobileStatsGrid({ children, className }: MobileStatsGridProps) {
  return <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>{children}</div>
}
