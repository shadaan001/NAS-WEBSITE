import { useState } from "react"
import { 
  House, 
  Users, 
  ChalkboardTeacher, 
  CalendarCheck, 
  List,
  X
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type AdminTab = "dashboard" | "students" | "teachers" | "attendance" | "reports" | "classes" | "tests" | "fees" | "profile" | "notices" | "payments"

interface AdminBottomNavProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

export default function AdminBottomNav({ activeTab, onTabChange }: AdminBottomNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = (tab: AdminTab) => {
    onTabChange(tab)
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg z-50">
      <div className="grid grid-cols-5 h-16 max-w-screen-xl mx-auto">
        <NavItem
          icon={House}
          label="Dashboard"
          isActive={activeTab === "dashboard"}
          onClick={() => onTabChange("dashboard")}
        />
        <NavItem
          icon={Users}
          label="Students"
          isActive={activeTab === "students"}
          onClick={() => onTabChange("students")}
        />
        <NavItem
          icon={ChalkboardTeacher}
          label="Teachers"
          isActive={activeTab === "teachers"}
          onClick={() => onTabChange("teachers")}
        />
        <NavItem
          icon={CalendarCheck}
          label="Attendance"
          isActive={activeTab === "attendance"}
          onClick={() => onTabChange("attendance")}
        />
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button
              className={`flex flex-col items-center justify-center gap-1 transition-all text-white ${
                ["reports", "tests", "notices", "payments", "profile"].includes(activeTab)
                  ? "opacity-100"
                  : "opacity-70"
              }`}
            >
              <List size={22} weight={["reports", "tests", "notices", "payments", "profile"].includes(activeTab) ? "fill" : "regular"} />
              <span className={`text-xs font-medium ${["reports", "tests", "notices", "payments", "profile"].includes(activeTab) ? "font-semibold" : ""}`}>
                More
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>More Options</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 mt-6 pb-4">
              <MenuButton
                label="Reports"
                isActive={activeTab === "reports"}
                onClick={() => handleNavClick("reports")}
              />
              <MenuButton
                label="Tests"
                isActive={activeTab === "tests"}
                onClick={() => handleNavClick("tests")}
              />
              <MenuButton
                label="Notices"
                isActive={activeTab === "notices"}
                onClick={() => handleNavClick("notices")}
              />
              <MenuButton
                label="Payments"
                isActive={activeTab === "payments"}
                onClick={() => handleNavClick("payments")}
              />
              <MenuButton
                label="Profile"
                isActive={activeTab === "profile"}
                onClick={() => handleNavClick("profile")}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

interface NavItemProps {
  icon: React.ComponentType<{ size?: number; weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone" }>
  label: string
  isActive: boolean
  onClick: () => void
}

function NavItem({ icon: Icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1 transition-all text-white ${
        isActive
          ? "opacity-100"
          : "opacity-70"
      }`}
    >
      <Icon size={22} weight={isActive ? "fill" : "regular"} />
      <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>
        {label}
      </span>
      {isActive && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-white rounded-full" />
      )}
    </button>
  )
}

interface MenuButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
}

function MenuButton({ label, isActive, onClick }: MenuButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={isActive ? "default" : "outline"}
      className="h-14 text-base font-medium"
    >
      {label}
    </Button>
  )
}
