import { motion } from "framer-motion"
import NeonButton from "./NeonButton"
import { GraduationCap } from "@phosphor-icons/react"

interface HeroSectionProps {
  onGoToLogin: () => void
  onGoToTeacherPortal?: () => void
  onGoToAdminPortal?: () => void
}

export default function HeroSection({ onGoToLogin, onGoToTeacherPortal, onGoToAdminPortal }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-12 lg:px-16 py-20">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass neon-border-blue rounded-full p-6 neon-glow-blue">
              <GraduationCap className="text-6xl text-primary" weight="fill" />
            </div>
          </motion.div>

          <motion.h1
            className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl mb-6 text-gradient-blue-purple animate-fade-in-up leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            NAS REVOLUTION CENTRE
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-foreground/80 max-w-3xl mx-auto mb-12 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Where Multiple Teachers Shape One Student's Future — Smart, Affordable & Disciplined Learning.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <NeonButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onGoToLogin}
          >
            Student Login
          </NeonButton>

          <NeonButton
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={onGoToTeacherPortal}
          >
            Teacher Portal
          </NeonButton>

          <NeonButton
            variant="accent"
            size="lg"
            className="w-full"
            onClick={onGoToAdminPortal}
          >
            Admin Portal
          </NeonButton>

          <NeonButton
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
            }}
          >
            Courses
          </NeonButton>

          <NeonButton
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
            }}
          >
            Notices
          </NeonButton>

          <NeonButton
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
            }}
          >
            Contact Us
          </NeonButton>
        </motion.div>
      </div>
    </section>
  )
}
