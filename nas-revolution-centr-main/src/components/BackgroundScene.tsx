import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface BackgroundSceneProps {
  theme?: "day" | "night"
  speed?: number
}

export default function BackgroundScene({ theme = "day", speed = 0.5 }: BackgroundSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      baseY: number
    }> = []

    const particleCount = window.innerWidth < 768 ? 20 : 40

    for (let i = 0; i < particleCount; i++) {
      const baseY = Math.random() * canvas.height
      particles.push({
        x: Math.random() * canvas.width,
        y: baseY,
        baseY,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.5 + 0.5,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        const color = theme === "night" 
          ? "rgba(138, 110, 255, 0.3)" 
          : "rgba(138, 110, 255, 0.25)"
        ctx.fillStyle = color
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [theme])

  const parallaxTransform = `translateY(${scrollY * speed * 0.3}px)`

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1628]"
        style={{ 
          transform: parallaxTransform,
          transition: "transform 0.1s ease-out"
        }}
      />

      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(76,_29,_149,_0.1),_transparent_50%)]"
        style={{ 
          transform: parallaxTransform,
          transition: "transform 0.1s ease-out"
        }}
      />

      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(59,_130,_246,_0.1),_transparent_50%)]"
        style={{ 
          transform: parallaxTransform,
          transition: "transform 0.1s ease-out"
        }}
      />

      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, oklch(0.60 0.20 250), transparent)",
          transform: parallaxTransform,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.22 310), transparent)",
          transform: parallaxTransform,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.2, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.60 0.20 250 / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.60 0.20 250 / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: parallaxTransform,
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-40"
        style={{ transform: parallaxTransform }}
      />

      <motion.div
        className="absolute top-32 left-20 text-8xl opacity-5"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        📚
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-32 text-7xl opacity-5"
        animate={{
          y: [0, -15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        🎓
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-20 text-6xl opacity-5"
        animate={{
          y: [0, -10, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        ✏️
      </motion.div>
    </div>
  )
}
