import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessMessageProps {
  message: string
  className?: string
}

export function SuccessMessage({ message, className }: SuccessMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-3 rounded-md text-sm bg-green-50 text-green-700 border border-green-200",
        className,
      )}
      role="status"
    >
      <CheckCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}
