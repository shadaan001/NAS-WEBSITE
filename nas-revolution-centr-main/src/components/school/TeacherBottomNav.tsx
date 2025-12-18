import { motion } from "framer-motion"
import { House, CalendarCheck, Users, User, BookOpen, ChartBar } from "@phosphor-icons/react"

interface TeacherBottomNavProps {
  activeTab: "dashboard" | "attendance" | "students" | "profile" | "assignments" | "reports"
  onTabChange: (tab: "dashboard" | "attendance" | "students" | "profile" | "assignments" | "reports") => void
}

export default function TeacherBottomNav({ activeTab, onTabChange }: TeacherBottomNavProps) {
  const tabs = [
    { id: "dashboard" as const, icon: House, label: "Home" },
    { id: "attendance" as const, icon: CalendarCheck, label: "Attendance" },
    { id: "assignments" as const, icon: BookOpen, label: "Assignments" },
    { id: "reports" as const, icon: ChartBar, label: "Reports" },
    { id: "students" as const, icon: Users, label: "Students" },
    { id: "profile" as const, icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center py-2 px-2 transition-all duration-300"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`relative text-white ${
                    isActive ? "opacity-100" : "opacity-70"
                  }`}
                >
                  <Icon
                    size={22}
                    weight={isActive ? "fill" : "regular"}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span
                  className={`text-[10px] mt-1 font-medium transition-colors text-white ${
                    isActive ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
