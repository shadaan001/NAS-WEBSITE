import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { List, X, GraduationCap } from "@phosphor-icons/react"
import { navLinks, siteConfig } from "@/data/siteConfig"
import NeonButton from "./NeonButton"
import { cn } from "@/lib/utils"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/nas-logo.png"
              alt="NAS Revolution Centre Logo"
              className="w-20 h-20 object-contain"
            />
            <div>
              <h1 className="font-heading font-bold text-xl md:text-2xl text-gradient-blue-purple leading-tight">
                {siteConfig.name}
              </h1>
              <p className="text-xs text-muted-foreground hidden md:block">{siteConfig.tagline}</p>
            </div>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.path}
                href={link.path}
                className="font-heading text-foreground/80 hover:text-primary transition-colors duration-300 relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <NeonButton variant="primary" size="md">
              Enroll Now
            </NeonButton>
          </motion.div>

          <button
            className="lg:hidden text-foreground hover:text-primary transition-colors p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="text-3xl" weight="bold" />
            ) : (
              <List className="text-3xl" weight="bold" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden glass-strong border-t border-border/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className="font-heading text-lg text-foreground/80 hover:text-primary transition-colors py-2 border-b border-border/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <NeonButton variant="primary" size="md" className="mt-4">
                Enroll Now
              </NeonButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
