import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface BubbleIconProps {
  children: ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "blue" | "purple" | "cyan" | "glass"
  float?: boolean
}

export default function BubbleIcon({ 
  children, 
  className,
  size = "md",
  variant = "glass",
  float = false
}: BubbleIconProps) {
  const sizes = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-20 h-20 text-3xl"
  }
  
  const variants = {
    blue: "glass neon-border-blue text-primary",
    purple: "glass neon-border-purple text-secondary",
    cyan: "glass border-accent shadow-[0_0_10px_oklch(0.75_0.20_200_/_0.3)] text-accent",
    glass: "glass text-foreground"
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-300",
        "hover:scale-110 hover:rotate-6",
        sizes[size],
        variants[variant],
        float && "animate-float",
        className
      )}
    >
      {children}
    </div>
  )
}
