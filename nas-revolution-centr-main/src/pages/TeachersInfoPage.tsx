import { motion, useMotionValue, useTransform } from "framer-motion"
import { ArrowLeft } from "@phosphor-icons/react"
import { useState, useRef, MouseEvent } from "react"
import { useKV } from "@github/spark/hooks"
import BackgroundScene from "@/components/BackgroundScene"

interface Teacher {
  id: string
  name: string
  subject: string
  experience: string
  quote: string
  image?: string
}

const defaultTeachers: Teacher[] = [
  {
    id: "1",
    name: "Dr. Sarah Ahmed",
    subject: "Mathematics & Physics",
    experience: "12 Years",
    quote: "Numbers tell stories, physics reveals truth."
  },
  {
    id: "2",
    name: "Prof. Mohammed Khan",
    subject: "Computer Science",
    experience: "10 Years",
    quote: "Code is poetry written in logic."
  },
  {
    id: "3",
    name: "Ms. Fatima Hassan",
    subject: "English Literature",
    experience: "8 Years",
    quote: "Words are the windows to wisdom."
  },
  {
    id: "4",
    name: "Dr. Abdullah Rahman",
    subject: "Chemistry & Biology",
    experience: "15 Years",
    quote: "Science is the art of discovery."
  },
  {
    id: "5",
    name: "Mr. Yasir Ali",
    subject: "Islamic Studies",
    experience: "9 Years",
    quote: "Knowledge is a light that guides the soul."
  },
  {
    id: "6",
    name: "Ms. Aisha Siddiqui",
    subject: "History & Geography",
    experience: "7 Years",
    quote: "The past teaches, the present learns."
  }
]

interface HologramCardProps {
  teacher: Teacher
  index: number
}

function HologramCard({ teacher, index }: HologramCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-150, 150], [15, -15])
  const rotateY = useTransform(mouseX, [-150, 150], [-15, 15])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: isHovered ? 0 : [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          },
        }}
      >
        <div
          className="relative overflow-hidden rounded-3xl p-6 h-full"
          style={{
            background: "rgba(10, 14, 26, 0.4)",
            backdropFilter: "blur(20px)",
            border: "2px solid",
            borderImage: "linear-gradient(135deg, oklch(0.60 0.20 250), oklch(0.55 0.22 310)) 1",
            boxShadow: isHovered
              ? "0 0 40px oklch(0.60 0.20 250 / 0.6), inset 0 0 20px oklch(0.60 0.20 250 / 0.2)"
              : "0 0 25px oklch(0.60 0.20 250 / 0.4), inset 0 0 15px oklch(0.60 0.20 250 / 0.1)",
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                oklch(0.60 0.20 250) 2px,
                oklch(0.60 0.20 250) 4px
              )`,
            }}
            animate={{
              y: [0, 20],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {isHovered && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 0.2,
              }}
              style={{
                background: "linear-gradient(135deg, oklch(0.60 0.20 250 / 0.3), oklch(0.55 0.22 310 / 0.3))",
              }}
            />
          )}

          <div className="relative z-10 flex flex-col items-center text-center h-full">
            <motion.div
              className="relative w-32 h-32 mb-4"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, oklch(0.60 0.20 250), oklch(0.55 0.22 310))",
                  boxShadow: "0 0 30px oklch(0.60 0.20 250 / 0.6)",
                }}
              />
              <div
                className="absolute inset-2 rounded-full flex items-center justify-center text-6xl font-bold"
                style={{
                  background: "rgba(10, 14, 26, 0.8)",
                  color: "oklch(0.60 0.20 250)",
                  textShadow: "0 0 20px oklch(0.60 0.20 250)",
                }}
              >
                {teacher.name.charAt(0)}
              </div>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 3px,
                    oklch(0.60 0.20 250 / 0.3) 3px,
                    oklch(0.60 0.20 250 / 0.3) 6px
                  )`,
                }}
                animate={{
                  y: [0, 32],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>

            <motion.h3
              className="text-2xl font-bold mb-2"
              style={{
                color: "oklch(0.60 0.20 250)",
                textShadow: isHovered ? "0 0 15px oklch(0.60 0.20 250)" : "0 0 10px oklch(0.60 0.20 250)",
              }}
            >
              {teacher.name}
            </motion.h3>

            <div
              className="text-sm font-semibold mb-1 px-3 py-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, oklch(0.60 0.20 250 / 0.3), oklch(0.55 0.22 310 / 0.3))",
                border: "1px solid oklch(0.60 0.20 250 / 0.5)",
                color: "#FFFFFF",
              }}
            >
              {teacher.subject}
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              {teacher.experience} Experience
            </p>

            <div className="flex-1 flex items-center">
              <p
                className="text-sm italic"
                style={{
                  color: "oklch(0.70 0.15 250)",
                }}
              >
                "{teacher.quote}"
              </p>
            </div>

            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{
                background: "linear-gradient(90deg, transparent, oklch(0.60 0.20 250), transparent)",
              }}
              animate={{
                opacity: isHovered ? [0.5, 1, 0.5] : 0.3,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface TeachersInfoPageProps {
  onBack: () => void
}

export default function TeachersInfoPage({ onBack }: TeachersInfoPageProps) {
  const [teacherInfoList] = useKV<Teacher[]>("teacher-info-list", [])
  
  const teachers = (teacherInfoList && teacherInfoList.length > 0) ? teacherInfoList : defaultTeachers

  return (
    <>
      <BackgroundScene theme="day" speed={0.5} />
      
      <div className="relative min-h-screen px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 px-4 py-2 rounded-xl glass border border-primary/30 text-foreground hover:border-primary/60 transition-all"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px oklch(0.60 0.20 250 / 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft weight="bold" size={20} />
            <span className="font-semibold">Back to Home</span>
          </motion.button>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, oklch(0.70 0.20 250), oklch(0.65 0.22 310))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 40px oklch(0.60 0.20 250 / 0.5)",
              }}
            >
              Our Teachers
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Meet our dedicated team of educators shaping the future
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <HologramCard key={teacher.id} teacher={teacher} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
