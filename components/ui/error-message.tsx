import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  message: string
  className?: string
  variant?: "default" | "destructive"
}

export function ErrorMessage({ message, className, variant = "destructive" }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-3 rounded-md text-sm",
        variant === "destructive"
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-gray-50 text-gray-700 border border-gray-200",
        className,
      )}
      role="alert"
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}
