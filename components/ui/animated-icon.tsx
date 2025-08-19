"use client"

import { motion, useReducedMotion } from "framer-motion"
import type * as React from "react"

type Props = {
  children: React.ReactNode
  className?: string
  "aria-hidden"?: boolean
  title?: string
}
export function AnimatedIcon({ children, className, ...rest }: Props) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.span
      className={className}
      whileHover={prefersReduced ? undefined : { rotate: 3, scale: 1.03 }}
      whileTap={prefersReduced ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      {...rest}
    >
      {children}
    </motion.span>
  )
}
