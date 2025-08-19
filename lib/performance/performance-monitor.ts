interface PerformanceMetrics {
  lcp: number
  fid: number
  cls: number
  ttfb: number
  fcp: number
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  initialize() {
    if (typeof window === "undefined") return

    this.observeLCP()
    this.observeFID()
    this.observeCLS()
    this.observeTTFB()
    this.observeFCP()
    this.monitorResourceLoading()
    this.monitorMemoryUsage()
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.lcp = lastEntry.startTime
        this.reportMetric("LCP", lastEntry.startTime)
      })
      observer.observe({ entryTypes: ["largest-contentful-paint"] })
      this.observers.push(observer)
    } catch (error) {
      console.warn("LCP observation not supported:", error)
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime
          this.reportMetric("FID", entry.processingStart - entry.startTime)
        })
      })
      observer.observe({ entryTypes: ["first-input"] })
      this.observers.push(observer)
    } catch (error) {
      console.warn("FID observation not supported:", error)
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.metrics.cls = clsValue
            this.reportMetric("CLS", clsValue)
          }
        })
      })
      observer.observe({ entryTypes: ["layout-shift"] })
      this.observers.push(observer)
    } catch (error) {
      console.warn("CLS observation not supported:", error)
    }
  }

  private observeTTFB() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.ttfb = entry.responseStart - entry.requestStart
          this.reportMetric("TTFB", entry.responseStart - entry.requestStart)
        })
      })
      observer.observe({ entryTypes: ["navigation"] })
      this.observers.push(observer)
    } catch (error) {
      console.warn("TTFB observation not supported:", error)
    }
  }

  private observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.fcp = entry.startTime
          this.reportMetric("FCP", entry.startTime)
        })
      })
      observer.observe({ entryTypes: ["paint"] })
      this.observers.push(observer)
    } catch (error) {
      console.warn("FCP observation not supported:", error)
    }
  }

  private monitorResourceLoading() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.duration > 1000) {
            console.warn(`Slow resource loading: ${entry.name} took ${entry.duration}ms`)
          }
        })
      })
      observer.observe({ entryTypes: ["resource"] })
      this.observers.push(observer)
    } catch (error) {
      console.warn("Resource monitoring not supported:", error)
    }
  }

  private monitorMemoryUsage() {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn("High memory usage detected")
        }
      }, 30000)
    }
  }

  private reportMetric(name: string, value: number) {
    // In production, send to analytics service
    if (process.env.NODE_ENV === "development") {
      console.log(`Performance metric - ${name}: ${value}`)
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GA_ID) {
      // gtag('event', name, { value: Math.round(value) })
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  cleanup() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
