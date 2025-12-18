import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "present" | "absent" | "late" | "pending" | "completed" | "high" | "medium" | "low"
  label?: string
  className?: string
}

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const statusConfig = {
    present: {
      bg: "bg-[#00E676]/20",
      text: "text-[#00E676]",
      label: "Present",
    },
    absent: {
      bg: "bg-[#FF3B30]/20",
      text: "text-[#FF3B30]",
      label: "Absent",
    },
    late: {
      bg: "bg-[#2A8BF2]/20",
      text: "text-[#2A8BF2]",
      label: "Late",
    },
    pending: {
      bg: "bg-[#FFA500]/20",
      text: "text-[#FFA500]",
      label: "Pending",
    },
    completed: {
      bg: "bg-[#00E676]/20",
      text: "text-[#00E676]",
      label: "Completed",
    },
    high: {
      bg: "bg-[#FF3B30]/20",
      text: "text-[#FF3B30]",
      label: "High Priority",
    },
    medium: {
      bg: "bg-[#FFA500]/20",
      text: "text-[#FFA500]",
      label: "Medium Priority",
    },
    low: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      label: "Low Priority",
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        config.bg,
        config.text,
        className
      )}
    >
      {label || config.label}
    </span>
  )
}
