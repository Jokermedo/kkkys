"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Shield, Star, Zap, Award, CheckCircle, Users } from "lucide-react"

const icons = [Shield, Star, Zap, Award, CheckCircle, Users]

export function FloatingElements() {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 6 }, (_, i) => {
        const Icon = icons[i]
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <Icon className="w-6 h-6 text-emerald-400/20" />
          </motion.div>
        )
      })}
    </div>
  )
}
