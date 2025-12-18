import { House, Users, User, ArrowLeft } from "@phosphor-icons/react"
import { motion } from "framer-motion"

interface TeacherBottomNavProps {
  currentTab: "home" | "students" | "profile" | "attendance" | "assignments" | "reports"
  onNavigate: (tab: "home" | "students" | "profile" | "attendance" | "assignments" | "reports") => void
  onBackToHome: () => void
}

export default function TeacherBottomNav({ currentTab, onNavigate, onBackToHome }: TeacherBottomNavProps) {
  const navItems = [
    { id: "home" as const, label: "Dashboard", icon: House },
    { id: "students" as const, label: "Students", icon: Users },
    { id: "profile" as const, label: "Profile", icon: User },
  ]

  return (
    <>
      <button
        onClick={onBackToHome}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-blue-400 transition-colors group bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Home</span>
      </button>

      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      >
        <div className="max-w-md mx-auto px-4 pb-6">
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-2">
            <div className="flex items-center justify-around gap-1">
              {navItems.map((item) => {
                const isActive = currentTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="relative flex-1 group"
                  >
                    <motion.div
                      className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
                          : "hover:bg-white/10"
                      }`}
                      whileHover={{ scale: isActive ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon
                        size={24}
                        weight={isActive ? "fill" : "regular"}
                        className={`transition-colors ${
                          isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium transition-colors ${
                          isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  )
}
