"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  gradient?: "emerald" | "blue" | "purple" | "rainbow"
  animate?: boolean
}

export function GradientText({ children, className, gradient = "emerald", animate = false }: GradientTextProps) {
  const gradientClasses = {
    emerald: "bg-gradient-to-r from-emerald-600 to-emerald-400",
    blue: "bg-gradient-to-r from-blue-600 to-cyan-400",
    purple: "bg-gradient-to-r from-purple-600 to-pink-400",
    rainbow: "bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600",
  }

  const textElement = (
    <span className={cn("bg-clip-text text-transparent font-bold", gradientClasses[gradient], className)}>
      {children}
    </span>
  )

  if (animate) {
    return (
      <motion.div
        className="inline-block"
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        {textElement}
      </motion.div>
    )
  }

  return textElement
}
