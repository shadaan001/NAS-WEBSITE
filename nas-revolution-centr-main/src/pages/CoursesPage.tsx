import CoursesComponentClass610 from "@/components/Courses_Component_Class6-10"
import GradientBackground from "@/components/school/GradientBackground"
import { ArrowLeft } from "@phosphor-icons/react"

export default function CoursesPage({ onGoToContact, onBack, onGoToPayments }: { onGoToContact?: () => void, onBack?: () => void, onGoToPayments?: () => void }) {
  const handleBackToHome = () => {
    if (onBack) return onBack()
    window.history.back()
  }

  return (
    <div className="min-h-screen relative bg-background">
      <GradientBackground />
      <button
        onClick={handleBackToHome}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-blue-400 transition-colors group bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </button>

  <CoursesComponentClass610 onContact={onGoToContact} onGoToPayments={onGoToPayments} />
    </div>
  )
}
