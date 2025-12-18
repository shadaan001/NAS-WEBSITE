import { House } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface BackToHomeButtonProps {
  onBackToHome: () => void
}

export default function BackToHomeButton({ onBackToHome }: BackToHomeButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onBackToHome}
      className="fixed top-4 left-4 z-[9999] bg-card/90 backdrop-blur-sm border-border hover:bg-card shadow-lg pointer-events-auto cursor-pointer"
    >
      <House size={18} weight="fill" />
      <span>Home</span>
    </Button>
  )
}
