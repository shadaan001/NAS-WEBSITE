import { motion } from "framer-motion"
import { 
  UserPlus, 
  ChalkboardTeacher, 
  ClipboardText, 
  Upload, 
  CurrencyDollar,
  Student
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: "student" | "teacher" | "test" | "marks" | "payment" | "verify"
  color: "blue" | "green" | "orange" | "purple" | "pink" | "indigo"
  onClick: () => void
}

interface QuickActionsPanelProps {
  actions?: QuickAction[]
  onAddStudent?: () => void
  onAddTeacher?: () => void
  onAddTest?: () => void
  onUploadMarks?: () => void
  onVerifyPayments?: () => void
}

const iconMap = {
  student: UserPlus,
  teacher: ChalkboardTeacher,
  test: ClipboardText,
  marks: Upload,
  payment: CurrencyDollar,
  verify: Student,
}

const colorClasses = {
  blue: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl hover:shadow-blue-500/50",
  },
  green: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl hover:shadow-blue-500/50",
  },
  orange: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl hover:shadow-blue-500/50",
  },
  purple: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl hover:shadow-blue-500/50",
  },
  pink: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl hover:shadow-blue-500/50",
  },
  indigo: {
    bg: "bg-white/5 backdrop-blur-xl",
    border: "border-white/10 hover:border-blue-400/50",
    icon: "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30",
    glow: "shadow-2xl hover:shadow-blue-500/50",
  },
}

export default function QuickActionsPanel({
  actions,
  onAddStudent,
  onAddTeacher,
  onAddTest,
  onUploadMarks,
  onVerifyPayments,
}: QuickActionsPanelProps) {
  const defaultActions: QuickAction[] = [
    {
      id: "add-student",
      title: "Add Student",
      description: "Register new student",
      icon: "student",
      color: "blue",
      onClick: onAddStudent || (() => console.log("Add student")),
    },
    {
      id: "add-teacher",
      title: "Add Teacher",
      description: "Register new teacher",
      icon: "teacher",
      color: "green",
      onClick: onAddTeacher || (() => console.log("Add teacher")),
    },
    {
      id: "add-test",
      title: "Add Test",
      description: "Create new test",
      icon: "test",
      color: "orange",
      onClick: onAddTest || (() => console.log("Add test")),
    },
    {
      id: "upload-marks",
      title: "Upload Marks",
      description: "Upload student marks",
      icon: "marks",
      color: "purple",
      onClick: onUploadMarks || (() => console.log("Upload marks")),
    },
    {
      id: "verify-payments",
      title: "Verify Payments",
      description: "Review pending payments",
      icon: "payment",
      color: "pink",
      onClick: onVerifyPayments || (() => console.log("Verify payments")),
    },
  ]

  const displayActions = actions || defaultActions

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold text-heading mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayActions.map((action, index) => {
          const Icon = iconMap[action.icon]
          const colors = colorClasses[action.color]
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Card
                className={`
                  relative overflow-hidden cursor-pointer
                  border-2 ${colors.border} ${colors.bg} ${colors.glow}
                  transition-all duration-300 p-5
                `}
                onClick={action.onClick}
                role="button"
                tabIndex={0}
                aria-label={action.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    action.onClick()
                  }
                }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-10 -mt-10" />
                
                <div className="relative flex flex-col items-center text-center gap-3">
                  <div className={`${colors.icon} rounded-xl p-3 transition-transform duration-300 hover:scale-110`}>
                    <Icon size={28} weight="duotone" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-1">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
