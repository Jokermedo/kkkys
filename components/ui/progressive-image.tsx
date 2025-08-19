"use client"

import { useState, useEffect } from "react"
import { OptimizedImage } from "./optimized-image"
import { cn } from "@/lib/utils"

interface ProgressiveImageProps {
  src: string
  lowQualitySrc?: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  width,
  height,
  className,
  priority = false,
}: ProgressiveImageProps) {
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false)
  const [isLowQualityLoaded, setIsLowQualityLoaded] = useState(false)

  // تحميل الصورة عالية الجودة في الخلفية
  useEffect(() => {
    const img = new Image()
    img.onload = () => setIsHighQualityLoaded(true)
    img.src = src
  }, [src])

  const lowQualityUrl = lowQualitySrc || `${src}?q=10&blur=10`

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* الصورة منخفضة الجودة */}
      {!isHighQualityLoaded && (
        <OptimizedImage
          src={lowQualityUrl}
          alt={alt}
          width={width}
          height={height}
          quality={10}
          priority={priority}
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            isLowQualityLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setIsLowQualityLoaded(true)}
        />
      )}

      {/* الصورة عالية الجودة */}
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={85}
        priority={priority}
        className={cn("transition-opacity duration-500", isHighQualityLoaded ? "opacity-100" : "opacity-0")}
      />

      {/* مؤشر التحميل */}
      {!isHighQualityLoaded && !isLowQualityLoaded && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  )
}
