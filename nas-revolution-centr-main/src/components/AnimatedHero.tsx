import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedHeroProps {
  title: string
  subtitle: string
  buttons: Array<{
    label: string
    icon?: ReactNode
    variant?: "primary" | "secondary" | "accent" | "outline"
    onClick: () => void
  }>
}

export default function AnimatedHero({ title, subtitle, buttons }: AnimatedHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16">
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-16 w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-xl"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="max-w-6xl mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
      >
        <div className="text-center mb-8 sm:mb-10">
          <motion.h1
            className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 md:mb-5 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: "linear-gradient(135deg, oklch(0.70 0.20 250), oklch(0.65 0.22 310))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-foreground max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 font-medium px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {buttons.map((button, index) => {
            const isNASChatBox = button.label === "NAS Chat Box"
            
            return (
              <motion.button
                key={index}
                onClick={button.onClick}
                className={`
                  relative overflow-hidden rounded-xl px-6 sm:px-8 py-3 sm:py-4 font-semibold text-sm sm:text-base transition-all duration-300
                  ${button.variant === "primary" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : button.variant === "secondary"
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : button.variant === "accent"
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : isNASChatBox
                    ? "glass border-2 text-foreground"
                    : "glass border-2 border-primary/30 text-foreground hover:border-primary/60"
                  }
                `}
                style={isNASChatBox ? {
                  background: "rgba(0, 0, 0, 0.2)",
                  borderColor: "oklch(0.60 0.20 250 / 0.4)",
                  boxShadow: "0 0 20px oklch(0.60 0.20 250 / 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
                } : {}}
                whileHover={{
                  scale: 1.05,
                  y: isNASChatBox ? -4 : 0,
                  boxShadow: isNASChatBox
                    ? "0 0 40px oklch(0.65 0.25 250 / 0.6), 0 8px 30px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
                    : button.variant === "outline" 
                    ? "0 0 25px oklch(0.60 0.20 250 / 0.3)"
                    : "0 8px 25px rgba(0, 0, 0, 0.15)",
                  borderColor: isNASChatBox ? "oklch(0.65 0.25 250 / 0.8)" : undefined,
                }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              >
                {isNASChatBox && (
                  <>
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.65 0.25 250 / 0.15), oklch(0.60 0.25 280 / 0.15))",
                      }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute -inset-0.5 rounded-xl opacity-60"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.65 0.25 250), oklch(0.60 0.25 280))",
                        backgroundSize: "200% 200%",
                        filter: "blur(8px)",
                      }}
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </>
                )}

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[oklch(0.60_0.20_250)]/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {button.icon}
                  {button.label}
                </span>
              </motion.button>
            )
          })}
        </motion.div>

        <motion.div
          className="mt-8 sm:mt-10 md:mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-5 glass rounded-full border-2 border-primary/40 shadow-lg relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, oklch(0.60 0.20 250 / 0.2), oklch(0.55 0.22 310 / 0.2))",
              boxShadow: "0 8px 32px oklch(0.60 0.20 250 / 0.3), inset 0 1px 1px oklch(1 0 0 / 0.15)"
            }}
            whileHover={{
              scale: 1.05,
              borderColor: "oklch(0.60 0.20 250 / 0.7)",
              boxShadow: "0 12px 48px oklch(0.60 0.20 250 / 0.5), inset 0 1px 1px oklch(1 0 0 / 0.25)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <motion.div
              className="w-4 h-4 rounded-full bg-gradient-to-br from-success to-accent shadow-lg relative z-10"
              style={{
                boxShadow: "0 0 16px oklch(0.65 0.15 150 / 0.9)"
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <span className="text-sm sm:text-base md:text-lg text-foreground font-bold tracking-wide relative z-10">
              Trusted by <span className="text-accent font-extrabold">many</span> Students & Parents
            </span>
            
            <motion.div
              className="flex gap-1 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="oklch(0.60 0.20 250)"
                  viewBox="0 0 24 24"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + i * 0.1, duration: 0.3 }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </motion.svg>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
