import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: "blue" | "purple" | "cyan" | "none"
  animate?: boolean
}

export default function GlassCard({ 
  children, 
  className, 
  hover = true,
  glow = "none",
  animate = true
}: GlassCardProps) {
  const glowClass = {
    blue: "hover:neon-border-blue",
    purple: "hover:neon-border-purple",
    cyan: "hover:border-accent hover:shadow-[0_0_20px_oklch(0.75_0.20_200_/_0.4)]",
    none: ""
  }

  const Component = animate ? motion.div : "div"
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  } : {}

  return (
    <Component
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        hover && "hover:scale-[1.02] hover:border-primary/60",
        glowClass[glow],
        className
      )}
      {...animationProps}
    >
      {children}
    </Component>
  )
}
