"use client"

import React from "react"

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState, useMemo } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
}

const ParticleItem = React.memo(function ParticleItem({ particle }: { particle: Particle }) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
        style={{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: particle.size,
          height: particle.size,
          opacity: particle.opacity * 0.3, // Reduce opacity for static version
        }}
      />
    )
  }

  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        opacity: particle.opacity,
      }}
      animate={{
        y: [0, -100, 0],
        x: [0, Math.random() * 50 - 25, 0],
        opacity: [particle.opacity, 0, particle.opacity],
      }}
      transition={{
        duration: particle.duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: Math.random() * 5,
      }}
    />
  )
})

export function ParticleBackground({ count = 15 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const prefersReducedMotion = useReducedMotion()

  const generatedParticles = useMemo(() => {
    const particleCount = prefersReducedMotion ? Math.min(count, 8) : Math.min(count, 15)

    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1, // Smaller particles
      opacity: Math.random() * 0.2 + 0.05, // Lower opacity
      duration: Math.random() * 15 + 15, // Slower animation
    }))
  }, [count, prefersReducedMotion])

  useEffect(() => {
    setParticles(generatedParticles)
  }, [generatedParticles])

  if (prefersReducedMotion && particles.length === 0) {
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <ParticleItem key={particle.id} particle={particle} />
      ))}
    </div>
  )
}
