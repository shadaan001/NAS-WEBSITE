import { motion } from "framer-motion"

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  label?: string
}

export default function CircularProgress({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  label = "Attendance"
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const getColor = (pct: number) => {
    if (pct >= 90) return "#00E676"
    if (pct >= 75) return "#2A8BF2"
    if (pct >= 60) return "#FFA500"
    return "#FF3B30"
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1a2942"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-heading text-foreground">
          {percentage}%
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}
