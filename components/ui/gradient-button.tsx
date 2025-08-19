"use client"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GradientButtonProps extends ButtonProps {
  gradient?: "primary" | "secondary" | "accent"
}

export function GradientButton({ className, gradient = "primary", children, ...props }: GradientButtonProps) {
  const gradientClasses = {
    primary: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
    secondary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
    accent: "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
  }

  return (
    <Button
      className={cn(
        "relative overflow-hidden text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105",
        gradientClasses[gradient],
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
    </Button>
  )
}
