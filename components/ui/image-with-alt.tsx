"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageWithAltProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  loading?: "lazy" | "eager"
  sizes?: string
  fill?: boolean
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  role?: string
  "aria-describedby"?: string
  "aria-labelledby"?: string
}

export function ImageWithAlt({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  loading = "lazy",
  sizes,
  fill = false,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
  role,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: ImageWithAltProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleLoad = () => {
    setImageLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setImageError(true)
    onError?.()
  }

  // Fallback for broken images
  if (imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground border border-border rounded",
          className,
        )}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-sm text-center p-4">{alt || "صورة غير متاحة"}</span>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        loading={priority ? "eager" : loading}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        role={role}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        className={cn("transition-opacity duration-300", imageLoaded ? "opacity-100" : "opacity-0")}
        {...props}
      />

      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" aria-hidden="true" />
      )}
    </div>
  )
}
