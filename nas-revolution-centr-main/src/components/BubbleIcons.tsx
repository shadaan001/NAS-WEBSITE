import { motion } from "framer-motion"
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  CalendarCheck, 
  GraduationCap,
  ChartBar,
  Bell,
  Gear
} from "@phosphor-icons/react"

type IconType = "users" | "book" | "payment" | "attendance" | "graduation" | "chart" | "bell" | "gear"

interface BubbleIconProps {
  icon: IconType
  label: string
  onClick?: () => void
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "accent" | "success"
  animated?: boolean
}

const iconMap = {
  users: Users,
  book: BookOpen,
  payment: CreditCard,
  attendance: CalendarCheck,
  graduation: GraduationCap,
  chart: ChartBar,
  bell: Bell,
  gear: Gear,
}

const sizeClasses = {
  sm: "w-12 h-12 text-2xl",
  md: "w-16 h-16 text-3xl",
  lg: "w-20 h-20 text-4xl",
}

const variantClasses = {
  primary: "from-primary/80 to-primary/60 text-primary-foreground",
  secondary: "from-secondary/80 to-secondary/60 text-secondary-foreground",
  accent: "from-accent/80 to-accent/60 text-accent-foreground",
  success: "from-success/80 to-success/60 text-white",
}

export default function BubbleIcon({ 
  icon, 
  label, 
  onClick, 
  size = "md", 
  variant = "primary",
  animated = true 
}: BubbleIconProps) {
  const Icon = iconMap[icon]

  return (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={animated ? { y: [0, -8, 0] } : undefined}
      transition={animated ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <motion.div
        className={`
          ${sizeClasses[size]}
          rounded-full
          bg-gradient-to-br ${variantClasses[variant]}
          flex items-center justify-center
          shadow-lg
          relative
          overflow-hidden
          transition-all duration-300
        `}
        style={{
          boxShadow: variant === "primary" 
            ? "0 4px 20px oklch(0.60 0.15 240 / 0.3)" 
            : variant === "accent"
            ? "0 4px 20px oklch(0.70 0.15 40 / 0.3)"
            : "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
        whileHover={{
          boxShadow: variant === "primary"
            ? "0 8px 30px oklch(0.60 0.15 240 / 0.5)"
            : variant === "accent"
            ? "0 8px 30px oklch(0.70 0.15 40 / 0.5)"
            : "0 8px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <motion.div
          className="relative z-10"
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon weight="fill" />
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/50"
          initial={{ scale: 1, opacity: 0 }}
          whileHover={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>

      <motion.span
        className="text-xs sm:text-sm font-medium text-foreground/80 text-center max-w-[80px]"
        initial={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

interface BubbleIconGridProps {
  icons: Array<{
    icon: IconType
    label: string
    onClick?: () => void
    variant?: "primary" | "secondary" | "accent" | "success"
  }>
  animated?: boolean
}

export function BubbleIconGrid({ icons, animated = true }: BubbleIconGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 p-6">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <BubbleIcon
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
            variant={item.variant}
            animated={animated}
          />
        </motion.div>
      ))}
    </div>
  )
}
