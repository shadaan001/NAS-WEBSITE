import { House, CalendarCheck, BookOpen, User, UserGear, Bell, CreditCard } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: "home" | "attendance" | "homework" | "profile" | "admin" | "notices" | "payments"
  onTabChange: (tab: "home" | "attendance" | "homework" | "profile" | "admin" | "notices" | "payments") => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home" as const, icon: House, label: "Home" },
    { id: "notices" as const, icon: Bell, label: "Notices" },
    { id: "payments" as const, icon: CreditCard, label: "Payments" },
    { id: "attendance" as const, icon: CalendarCheck, label: "Attendance" },
    { id: "profile" as const, icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200",
                "active:scale-95 min-w-0"
              )}
            >
              <Icon
                size={22}
                weight={isActive ? "fill" : "regular"}
                className={cn(
                  "transition-colors duration-200 text-white",
                  isActive ? "opacity-100" : "opacity-70"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-semibold transition-colors duration-200 text-heading text-white",
                  isActive ? "opacity-100" : "opacity-70"
                )}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
