import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline"
  size?: "sm" | "md" | "lg"
  glow?: boolean
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md",
    glow = true,
    children,
    ...props 
  }, ref) => {
    const baseStyles = "font-heading font-medium tracking-wide rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: cn(
        "bg-primary text-primary-foreground",
        glow && "hover:neon-glow-blue",
        "hover:scale-105 active:scale-95"
      ),
      secondary: cn(
        "bg-secondary text-secondary-foreground",
        glow && "hover:neon-glow-purple",
        "hover:scale-105 active:scale-95"
      ),
      accent: cn(
        "bg-accent text-accent-foreground",
        glow && "hover:neon-glow-cyan",
        "hover:scale-105 active:scale-95"
      ),
      outline: cn(
        "bg-transparent border-2 border-primary text-primary",
        "hover:bg-primary hover:text-primary-foreground",
        glow && "hover:neon-glow-blue",
        "hover:scale-105 active:scale-95"
      )
    }
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

NeonButton.displayName = "NeonButton"

export default NeonButton
