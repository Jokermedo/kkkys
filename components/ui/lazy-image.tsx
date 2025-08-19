"use client"

import { useState, useRef, useEffect } from "react"
import { OptimizedImage } from "./optimized-image"
import { cn } from "@/lib/utils"

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  quality?: number
  placeholder?: string
  threshold?: number
  rootMargin?: string
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  quality = 75,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+",
  threshold = 0.1,
  rootMargin = "50px",
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={imgRef} className={cn("relative", className)}>
      {!isInView ? (
        <div className="bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ width, height }} />
      ) : (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          placeholder="blur"
          blurDataURL={placeholder}
          onLoad={() => setIsLoaded(true)}
          className={cn("transition-all duration-500", isLoaded ? "blur-0" : "blur-sm")}
        />
      )}
    </div>
  )
}
