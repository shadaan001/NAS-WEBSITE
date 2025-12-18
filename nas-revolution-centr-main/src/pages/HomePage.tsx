import { useState } from "react"
import BackgroundScene from "@/components/BackgroundScene"
import AnimatedHero from "@/components/AnimatedHero"
import FeaturesSection from "@/components/FeaturesSection"
import Footer from "@/components/Footer"
import NASChatBox from "@/components/NASChatBox"
import { User, UserGear, CreditCard, BookOpen, Phone, Sparkle, Chalkboard, ChatCircleDots } from "@phosphor-icons/react"
import "../components/Animations.css"

interface HomePageProps {
  onGoToLogin: () => void
  onGoToTeacherPortal?: () => void
  onGoToAdminPortal?: () => void
  onGoToPayments?: () => void
  onGoToCourses?: () => void
  onGoToContact?: () => void
  onGoToIslamicVideos?: () => void
  onGoToCredentials?: () => void
  onGoToTeachersInfo?: () => void
}

export default function HomePage({
  onGoToLogin,
  onGoToTeacherPortal,
  onGoToAdminPortal,
  onGoToPayments,
  onGoToCourses,
  onGoToContact,
  onGoToIslamicVideos,
  onGoToTeachersInfo,
}: HomePageProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const heroButtons = [
    { label: "Student Login", icon: <User weight="fill" />, variant: "primary" as const, onClick: onGoToLogin },
    { label: "Teacher Portal", icon: <UserGear weight="fill" />, variant: "secondary" as const, onClick: onGoToTeacherPortal || (() => {}) },
    { label: "Admin Portal", icon: <UserGear weight="fill" />, variant: "accent" as const, onClick: onGoToAdminPortal || (() => {}) },
    { label: "Islamic Videos", icon: <span className="text-2xl">🕌</span>, variant: "outline" as const, onClick: onGoToIslamicVideos || (() => {}) },
    { label: "Courses", icon: <BookOpen weight="fill" />, variant: "outline" as const, onClick: onGoToCourses || (() => {}) },
    { label: "Teachers Info", icon: <Chalkboard weight="fill" />, variant: "outline" as const, onClick: onGoToTeachersInfo || (() => {}) },
    { label: "Payments", icon: <CreditCard weight="fill" />, variant: "outline" as const, onClick: onGoToPayments || (() => {}) },
    { label: "Contact Us", icon: <Phone weight="fill" />, variant: "outline" as const, onClick: onGoToContact || (() => {}) },
    { label: "NAS Chat Box", icon: <ChatCircleDots weight="fill" />, variant: "outline" as const, onClick: () => setIsChatOpen(true) },
  ]

  return (
    <>
      <BackgroundScene theme="day" speed={0.5} />

      <AnimatedHero
        title="NAS REVOLUTION CENTRE"
        subtitle="Where Multiple Teachers Shape One Student's Future — Smart, Affordable & Disciplined Learning"
        buttons={heroButtons}
      />

      <FeaturesSection />
      <Footer />

      <NASChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}