"use client"

import type React from "react"
import { useEffect, useState, createContext, useContext } from "react"
import { cdnOptimizer } from "@/lib/network/cdn-optimizer"

interface NetworkConditions {
  effectiveType: string
  downlink: number
  rtt: number
  saveData: boolean
}

interface AdaptiveSettings {
  imageQuality: number
  enableAnimations: boolean
  preloadImages: boolean
  lazyLoadThreshold: string
  enableHeavyFeatures: boolean
}

interface NetworkContextType {
  networkConditions: NetworkConditions | null
  adaptiveSettings: AdaptiveSettings
  isOnline: boolean
  connectionQuality: "poor" | "good" | "excellent"
}

const NetworkContext = createContext<NetworkContextType | null>(null)

export function NetworkAdapter({ children }: { children: React.ReactNode }) {
  const [networkConditions, setNetworkConditions] = useState<NetworkConditions | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [adaptiveSettings, setAdaptiveSettings] = useState<AdaptiveSettings>({
    imageQuality: 85,
    enableAnimations: true,
    preloadImages: true,
    lazyLoadThreshold: "200px",
    enableHeavyFeatures: true,
  })

  const getConnectionQuality = (conditions: NetworkConditions | null): "poor" | "good" | "excellent" => {
    if (!conditions) return "good"

    if (conditions.effectiveType === "4g" && conditions.downlink > 10) return "excellent"
    if (conditions.effectiveType === "3g" || (conditions.effectiveType === "4g" && conditions.downlink > 1.5))
      return "good"
    return "poor"
  }

  useEffect(() => {
    const updateNetworkConditions = async () => {
      try {
        const conditions = await cdnOptimizer.measureNetworkQuality()
        setNetworkConditions(conditions)

        const settings = await cdnOptimizer.adaptToNetworkConditions()
        setAdaptiveSettings(settings)

        document.documentElement.style.setProperty("--image-quality", settings.imageQuality.toString())
        document.documentElement.style.setProperty("--lazy-threshold", settings.lazyLoadThreshold)

        if (!settings.enableAnimations) {
          document.documentElement.classList.add("reduce-motion")
        } else {
          document.documentElement.classList.remove("reduce-motion")
        }

        if (!settings.enableHeavyFeatures) {
          document.documentElement.classList.add("low-bandwidth")
        } else {
          document.documentElement.classList.remove("low-bandwidth")
        }
      } catch (error) {
        console.warn("Failed to measure network conditions:", error)
      }
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    updateNetworkConditions()

    if ("connection" in navigator) {
      const connection = (navigator as any).connection
      const handleConnectionChange = () => {
        updateNetworkConditions()
      }

      connection.addEventListener("change", handleConnectionChange)

      return () => {
        connection.removeEventListener("change", handleConnectionChange)
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const contextValue: NetworkContextType = {
    networkConditions,
    adaptiveSettings,
    isOnline,
    connectionQuality: getConnectionQuality(networkConditions),
  }

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
      <div className="sr-only" aria-live="polite">
        {!isOnline && "الاتصال بالإنترنت منقطع"}
        {isOnline &&
          networkConditions &&
          `حالة الشبكة: ${networkConditions.effectiveType}, جودة الصور: ${adaptiveSettings.imageQuality}%`}
      </div>

      {!isOnline && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-destructive text-destructive-foreground p-3 rounded-lg shadow-lg text-center text-sm">
          لا يوجد اتصال بالإنترنت. بعض الميزات قد لا تعمل بشكل صحيح.
        </div>
      )}
    </NetworkContext.Provider>
  )
}

export function useNetworkAdapter(): NetworkContextType {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error("useNetworkAdapter must be used within a NetworkAdapter")
  }
  return context
}

export function useAdaptiveSettings(): AdaptiveSettings {
  const { adaptiveSettings } = useNetworkAdapter()
  return adaptiveSettings
}
