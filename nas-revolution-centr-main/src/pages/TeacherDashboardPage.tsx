import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  House, 
  CalendarCheck, 
  Users, 
  GearSix,
  BookOpen,
  ChartBar,
  ClipboardText,
  VideoCamera
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { teachers } from "@/data/attendanceData"
import { supabase } from "@/lib/supabase"
import type { Teacher } from "@/types"

interface TeacherDashboardPageProps {
  teacherId: string
  onNavigate: (page: "dashboard" | "attendance" | "students" | "profile" | "assignments" | "reports" | "upload-lectures") => void
}

export default function TeacherDashboardPage({ teacherId, onNavigate }: TeacherDashboardPageProps) {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [stats, setStats] = useState({
    classesAssigned: 0,
    studentsAssigned: 0,
    attendanceToday: 0,
    pendingTasks: 0
  })

  useEffect(() => {
    const loadTeacherData = async () => {
      // Try reading admin cache from KV; if KV is unavailable (dev), fall back to Supabase/local data
      let adminTeachers: any[] = []
      try {
        adminTeachers = await window.spark.kv.get<any[]>("admin-teachers-records") || []
      } catch (kvErr) {
        console.warn('Failed to read admin-teachers-records KV in dashboard:', kvErr)
        adminTeachers = []
      }

      // Match id loosely (number/string) by converting to string for comparison
      let teacherData = adminTeachers.find((t: any) => (t?.id?.toString ? t.id.toString() : String(t.id)) === teacherId)

      // If not in KV cache, try Supabase directly (handles Supabase-only teachers)
      if (!teacherData) {
        try {
          const { data: supData, error: supError } = await supabase.from('teachers').select('*').eq('id', teacherId).limit(1)
          if (supError) {
            console.error('Supabase fetch error in dashboard:', supError)
          }
          const supTeacher = Array.isArray(supData) && supData.length > 0 ? supData[0] : null
          if (supTeacher) {
            const approved = (typeof supTeacher.is_active === 'boolean')
              ? supTeacher.is_active
              : (typeof supTeacher.approved === 'boolean' ? supTeacher.approved : true)

            teacherData = {
              ...supTeacher,
              id: supTeacher.id,
              name: supTeacher.name,
              subjects: supTeacher.subjects || [],
              approved
            }
          }
        } catch (supErr) {
          console.debug('Error fetching teacher from Supabase in dashboard:', supErr)
        }
      }

      // Fallback to local seed data
      if (!teacherData) {
        teacherData = teachers.find(t => (t?.id?.toString ? t.id.toString() : String(t.id)) === teacherId)
      }
      
      if (teacherData) {
        setTeacher(teacherData)
        
        setStats({
          classesAssigned: teacherData.subjects?.length * 3 || 3,
          studentsAssigned: 45,
          attendanceToday: 38,
          pendingTasks: 5
        })
      }
    }
    
    loadTeacherData()
  }, [teacherId])

  const quickActions = [
    {
      icon: CalendarCheck,
      label: "Mark Attendance",
      gradient: "from-primary to-[#1e5fa8]",
      onClick: () => onNavigate("attendance")
    },
    {
      icon: Users,
      label: "View Students",
      gradient: "from-primary to-[#1e5fa8]",
      onClick: () => onNavigate("students")
    },
    {
      icon: BookOpen,
      label: "Assignments",
      gradient: "from-primary to-[#1e5fa8]",
      onClick: () => onNavigate("assignments")
    },
    {
      icon: VideoCamera,
      label: "Upload Lectures",
      gradient: "from-primary to-[#1e5fa8]",
      onClick: () => onNavigate("upload-lectures")
    },
    {
      icon: ChartBar,
      label: "Reports",
      gradient: "from-primary to-[#1e5fa8]",
      onClick: () => onNavigate("reports")
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-6"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-[#1e5fa8] text-white text-xl font-bold">
              {teacher.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-heading text-foreground">
              Welcome, {teacher.name.split(' ')[1]}!
            </h1>
            <p className="text-muted-foreground">
              {teacher.subjects.join(', ')} Teacher • ID: {teacher.id}
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-4 text-white">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-400/50 card-shadow hover:card-shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <ClipboardText size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.classesAssigned}</p>
                  <p className="text-xs text-gray-300">Classes</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-400/50 card-shadow hover:card-shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Users size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.studentsAssigned}</p>
                  <p className="text-xs text-gray-300">Students</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-400/50 card-shadow hover:card-shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <CalendarCheck size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.attendanceToday}</p>
                  <p className="text-xs text-gray-300">Present Today</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-400/50 card-shadow hover:card-shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <ChartBar size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.pendingTasks}</p>
                  <p className="text-xs text-gray-300">Pending</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-4 text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, idx) => (
              <motion.button
                key={action.label}
                onClick={action.onClick}
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <Card className="relative p-5 bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-400/50 card-shadow hover:card-shadow-lg transition-all duration-300">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow duration-300`}>
                      <action.icon size={32} weight="fill" className="text-white" />
                    </div>
                    <p className="font-semibold text-sm text-white">{action.label}</p>
                  </div>
                </Card>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 bg-white/5 backdrop-blur-xl border-white/10 card-shadow">
            <h3 className="font-semibold mb-3 text-white">Today's Schedule</h3>
            <div className="space-y-3">
              {teacher.subjects.map((subject, idx) => (
                <div key={subject} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:border-blue-400/30 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                      idx === 0 ? "from-blue-500 to-purple-600" :
                      idx === 1 ? "from-purple-500 to-pink-600" :
                      "from-blue-600 to-purple-700"
                    } flex items-center justify-center shadow-lg`}>
                      <BookOpen size={20} weight="fill" className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">{subject}</p>
                      <p className="text-xs text-gray-300">Class 10-A</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    {idx === 0 ? "9:00 AM" : idx === 1 ? "11:00 AM" : "2:00 PM"}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
