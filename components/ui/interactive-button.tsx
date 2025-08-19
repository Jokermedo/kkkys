"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface InteractiveButtonProps extends ButtonProps {
  ripple?: boolean
  magnetic?: boolean
  glow?: boolean
}

export const InteractiveButton = forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ className, children, ripple = true, magnetic = false, glow = false, ...props }, ref) => {
    const prefersReduced = useReducedMotion()

    const buttonVariants = {
      initial: { scale: 1 },
      hover: prefersReduced
        ? {}
        : {
            scale: 1.02,
            transition: { duration: 0.2, ease: "easeOut" },
          },
      tap: prefersReduced
        ? {}
        : {
            scale: 0.98,
            transition: { duration: 0.1 },
          },
    }

    const glowVariants = {
      initial: { opacity: 0, scale: 0.8 },
      hover: prefersReduced
        ? {}
        : {
            opacity: glow ? 0.6 : 0,
            scale: 1.1,
            transition: { duration: 0.3 },
          },
    }

    return (
      <motion.div className="relative inline-block">
        {/* Glow effect */}
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400 to-blue-400 blur-lg -z-10"
            variants={glowVariants}
            initial="initial"
            whileHover="hover"
          />
        )}

        <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
          <Button
            ref={ref}
            className={cn(
              "relative overflow-hidden transition-all duration-200",
              glow && "shadow-lg hover:shadow-xl",
              className,
            )}
            {...props}
          >
            {/* Ripple effect background */}
            {ripple && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0"
                whileHover={
                  prefersReduced
                    ? {}
                    : {
                        opacity: [0, 0.3, 0],
                        x: ["-100%", "100%"],
                        transition: { duration: 0.6, ease: "easeInOut" },
                      }
                }
              />
            )}

            <span className="relative z-10">{children}</span>
          </Button>
        </motion.div>
      </motion.div>
    )
  },
)

InteractiveButton.displayName = "InteractiveButton"
