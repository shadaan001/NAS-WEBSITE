import { motion } from "framer-motion"
import { 
  Users, 
  ChalkboardTeacher, 
  CurrencyDollar, 
  ClipboardText, 
  TrendUp, 
  TrendDown,
  CalendarCheck
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface KPIWidgetProps {
  title: string
  value: number | string
  icon: "users" | "teachers" | "payments" | "tests" | "attendance" | "calendar"
  color?: "blue" | "green" | "orange" | "purple" | "pink"
  trend?: string
  trendDirection?: "up" | "down"
  tooltip?: string
  delay?: number
}

const iconMap = {
  users: Users,
  teachers: ChalkboardTeacher,
  payments: CurrencyDollar,
  tests: ClipboardText,
  attendance: CalendarCheck,
  calendar: CalendarCheck,
}

const colorClasses = {
  blue: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl",
  },
  green: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl",
  },
  orange: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl",
  },
  purple: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl",
  },
  pink: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl",
  },
}

export default function KPIWidget({
  title,
  value,
  icon,
  color = "blue",
  trend,
  trendDirection,
  tooltip,
  delay = 0,
}: KPIWidgetProps) {
  const Icon = iconMap[icon]
  const colors = colorClasses[color]

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Card 
        className={`
          relative overflow-hidden border-2 ${colors.border} ${colors.bg} ${colors.glow}
          transition-all duration-300 p-6
        `}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16" />
        
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-white/80 font-medium mb-2">{title}</p>
            <div className="flex items-end gap-3">
              <h3 className="text-4xl font-bold text-white tracking-tight">
                {typeof value === "number" ? value.toLocaleString() : value}
              </h3>
              {trend && (
                <div className={`flex items-center gap-1 mb-1 ${
                  trendDirection === "up" ? "text-green-400" : trendDirection === "down" ? "text-red-400" : "text-white/80"
                }`}>
                  {trendDirection === "up" && <TrendUp size={16} weight="bold" />}
                  {trendDirection === "down" && <TrendDown size={16} weight="bold" />}
                  <span className="text-xs font-semibold">{trend}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`${colors.icon} rounded-2xl p-4 transition-transform duration-300 hover:scale-110`}>
            <Icon size={32} weight="duotone" className="text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  )

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return cardContent
}
