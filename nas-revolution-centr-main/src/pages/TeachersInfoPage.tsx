import { motion } from "framer-motion"
import { ArrowLeft } from "@phosphor-icons/react"
import { useState, useRef, MouseEvent } from "react"
import { useKV } from "@github/spark/hooks"
import BackgroundScene from "@/components/BackgroundScene"

interface Teacher {
  id: string
  name: string
  subject?: string
  subjects?: string[]
  email?: string
  contact_number?: string
  is_active?: boolean
  created_at?: string | null
  address?: string
  availability?: string[] // array of json-strings or objects
  classes_assigned?: any[]
  experience?: number | string
  photo_base64?: string | null
  qualification?: string
  quote?: string
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
  // Static card (animations removed) — show full teacher information
  const parseAvailability = (arr?: string[]) => {
    if (!arr || arr.length === 0) return []
    try {
      return arr.map(a => (typeof a === 'string' ? JSON.parse(a) : a))
    } catch (e) {
      return arr.map(a => {
        try { return JSON.parse(a) } catch { return a }
      })
    }
  }

  const availability = parseAvailability(teacher.availability)

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 h-full glass-hover glass">
      <div className="relative z-10 flex flex-col items-start h-full">
        <div className="flex items-center w-full gap-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
            {teacher.photo_base64 ? (
              <img src={teacher.photo_base64} alt={teacher.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              teacher.name ? teacher.name.charAt(0) : '?'
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{teacher.name}</h3>
            <div className="text-sm text-muted-foreground mt-1">{(teacher.subjects && teacher.subjects.join(' + ')) || teacher.subject || ''}</div>
          </div>
          <div className="text-right">
            <div className={`text-sm ${teacher.is_active ? 'text-green-400' : 'text-red-400'}`}>{teacher.is_active ? 'Active' : 'Inactive'}</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-300 space-y-2">
          {teacher.qualification && <div><strong>Qualification:</strong> {teacher.qualification}</div>}
          {teacher.experience !== undefined && <div><strong>Experience:</strong> {teacher.experience} {typeof teacher.experience === 'number' ? 'Years' : ''}</div>}
          {teacher.email && <div><strong>Email:</strong> {teacher.email}</div>}
          {teacher.contact_number && <div><strong>Contact:</strong> {teacher.contact_number}</div>}
          {teacher.address && <div><strong>Address:</strong> {teacher.address}</div>}
          {availability && availability.length > 0 && (
            <div>
              <strong>Availability:</strong>
              <ul className="list-disc list-inside text-sm">
                {availability.map((a, i) => (
                  <li key={i}>{a.day || a.dayOfWeek || JSON.stringify(a)} {a.from ? ` ${a.from} - ${a.to}` : ''}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {teacher.quote && <p className="mt-4 italic text-sm text-muted-foreground">"{teacher.quote}"</p>}
      </div>
    </div>
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
