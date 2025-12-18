import { motion } from "framer-motion"
import { useEffect } from "react"

interface OpeningAnimationProps {
  onComplete: () => void
}

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 6000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0a0e1a 100%)",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 5.2 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, rgba(42, 139, 242, 0.2) 0%, transparent 60%),
                radial-gradient(circle at 70% 60%, rgba(147, 51, 234, 0.2) 0%, transparent 60%),
                radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 70%)
              `,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 1 + "px",
                height: Math.random() * 4 + 1 + "px",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 
                  ? "rgba(42, 139, 242, 0.8)" 
                  : i % 3 === 1 
                  ? "rgba(147, 51, 234, 0.8)" 
                  : "rgba(236, 72, 153, 0.8)",
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -30, -60],
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 4,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 2, times: [0, 0.1, 1] }}
        style={{
          background: "radial-gradient(circle at center, rgba(42, 139, 242, 0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute -inset-16 blur-3xl"
            style={{
              background: "linear-gradient(135deg, rgba(42, 139, 242, 0.4), rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.4))",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.h1
            className="relative text-5xl md:text-7xl lg:text-8xl font-bold text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              fontFamily: "Montserrat, sans-serif",
              background: "linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 40px rgba(42, 139, 242, 0.5)",
            }}
          >
            NAS REVOLUTION CENTRE
          </motion.h1>
        </motion.div>

        <motion.div
          className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
        />

        <motion.p
          className="mt-8 text-xl md:text-2xl text-center text-muted-foreground max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Empowering minds, shaping futures
        </motion.p>

        <motion.div
          className="mt-12 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.5 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, #2A8BF2, #9333ea, #ec4899)",
                boxShadow: "0 0 20px rgba(42, 139, 242, 0.6)",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, rgba(10, 14, 26, 0.9) 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
    </motion.div>
  )
}
