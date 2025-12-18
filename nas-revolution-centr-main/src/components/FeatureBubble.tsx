import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface FeatureBubbleProps {
  children: ReactNode
  title: string
  description: string
  variant?: "blue" | "purple" | "cyan"
  delay?: number
}

export default function FeatureBubble({ 
  children, 
  title, 
  description,
  variant = "blue",
  delay = 0 
}: FeatureBubbleProps) {
  const variants = {
    blue: "neon-border-blue hover:neon-glow-blue text-primary",
    purple: "neon-border-purple hover:neon-glow-purple text-secondary",
    cyan: "border-accent shadow-[0_0_10px_oklch(0.60_0.22_200_/_0.3)] hover:shadow-[0_0_30px_oklch(0.60_0.22_200_/_0.5)] text-accent"
  }

  return (
    <motion.div
      className={cn(
        "glass rounded-3xl p-8 text-center transition-all duration-500 cursor-pointer",
        "hover:scale-105 hover:-translate-y-2",
        variants[variant]
      )}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div
        className="inline-flex items-center justify-center mb-6"
        initial={{ scale: 0.5, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.8, 
          delay: delay + 0.2,
          type: "spring",
          stiffness: 200
        }}
      >
        <div 
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-4xl",
            "glass transition-all duration-300",
            variants[variant]
          )}
        >
          {children}
        </div>
      </motion.div>

      <h3 className="font-heading font-bold text-xl md:text-2xl mb-3 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
