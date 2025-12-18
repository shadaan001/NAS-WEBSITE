import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface QuickCardProps {
  icon: ReactNode
  title: string
  value: string | number
  subtitle?: string
  variant?: "blue" | "green" | "orange" | "purple"
  onClick?: () => void
  className?: string
}

export default function QuickCard({
  icon,
  title,
  value,
  subtitle,
  variant = "blue",
  onClick,
  className,
}: QuickCardProps) {
  const variantClasses = {
    blue: "border-[#2A8BF2]/30 hover:border-[#2A8BF2]/50",
    green: "border-[#00E676]/30 hover:border-[#00E676]/50",
    orange: "border-[#FFA500]/30 hover:border-[#FFA500]/50",
    purple: "border-purple-500/30 hover:border-purple-500/50",
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-2xl p-4 border-2 card-shadow transition-all duration-300",
        "active:scale-95",
        onClick && "cursor-pointer hover:card-shadow-lg",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/80 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-heading text-white">{value}</p>
          {subtitle && <p className="text-xs text-white/70 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
