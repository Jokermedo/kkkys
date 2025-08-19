"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, MessageCircle } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorId?: string
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return { hasError: true, error, errorId }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo)

    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // Store error locally for debugging
    if (typeof window !== "undefined") {
      const errors = JSON.parse(localStorage.getItem("app_errors") || "[]")
      errors.push(errorDetails)
      localStorage.setItem("app_errors", JSON.stringify(errors.slice(-10))) // Keep last 10 errors
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to monitoring service like Sentry
      // captureException(error, { extra: errorInfo, tags: { errorId: this.state.errorId } })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 text-center border">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">حدث خطأ غير متوقع</h2>
            <p className="text-muted-foreground mb-6">نعتذر عن الإزعاج. يرجى تحديث الصفحة والمحاولة مرة أخرى.</p>

            {this.state.errorId && (
              <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted p-2 rounded">
                معرف الخطأ: {this.state.errorId}
              </p>
            )}

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left mb-4 p-3 bg-muted rounded text-sm">
                <summary className="cursor-pointer font-medium">تفاصيل الخطأ</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto max-h-32 text-muted-foreground">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => window.location.reload()} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                تحديث الصفحة
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")} className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                الصفحة الرئيسية
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-full text-muted-foreground"
              onClick={() => {
                const message = `حدث خطأ في الموقع. معرف الخطأ: ${this.state.errorId}`
                window.open(`https://wa.me/971501234567?text=${encodeURIComponent(message)}`, "_blank")
              }}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              الإبلاغ عن المشكلة
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
