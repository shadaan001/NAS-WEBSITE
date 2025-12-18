import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BubbleIconProps {
  children: ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "blue" | "green" | "orange" | "purple" | "pink"
}

export default function BubbleIcon({ children, className, size = "md", variant = "blue" }: BubbleIconProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  }

  const variantClasses = {
    blue: "bg-gradient-to-br from-[#2A8BF2]/20 to-[#2A8BF2]/10 text-white",
    green: "bg-gradient-to-br from-[#00E676]/20 to-[#00E676]/10 text-white",
    orange: "bg-gradient-to-br from-[#FFA500]/20 to-[#FFA500]/10 text-white",
    purple: "bg-gradient-to-br from-purple-500/20 to-purple-500/10 text-white",
    pink: "bg-gradient-to-br from-pink-500/20 to-pink-500/10 text-white",
  }

  return (
    <div
      className={cn(
        "bubble-icon card-shadow transition-all duration-300",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  )
}
