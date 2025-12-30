import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Envelope, Phone, IdentificationCard, BookOpen, SignOut, PencilSimple } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { Teacher } from "@/types"
import { teachers } from "@/data/attendanceData"
import { supabase } from "@/lib/supabase"

interface TeacherProfilePageProps {
  teacherId: string
  onLogout: () => void
}

export default function TeacherProfilePage({ teacherId, onLogout }: TeacherProfilePageProps) {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPhone, setEditedPhone] = useState("")
  const [editedEmail, setEditedEmail] = useState("")

  useEffect(() => {
    const loadTeacherData = async () => {
      // Try reading admin cache from KV; if KV is unavailable (dev), fall back to Supabase/local data
      let adminTeachers: any[] = []
      try {
        adminTeachers = await window.spark.kv.get<any[]>("admin-teachers-records") || []
      } catch (kvErr) {
        console.warn('Failed to read admin-teachers-records KV in profile:', kvErr)
        adminTeachers = []
      }

      let teacherData = adminTeachers.find((t: any) => (t?.id?.toString ? t.id.toString() : String(t.id)) === teacherId)

      // If not found in KV, try Supabase directly (handles Supabase-only teachers)
      if (!teacherData) {
        try {
          const { data: supData, error: supError } = await supabase.from('teachers').select('*').eq('id', teacherId).limit(1)
          if (supError) {
            console.error('Supabase fetch error in profile:', supError)
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
          console.debug('Error fetching teacher from Supabase in profile:', supErr)
        }
      }

      // Fallback to local seed data
      if (!teacherData) {
        teacherData = teachers.find(t => (t?.id?.toString ? t.id.toString() : String(t.id)) === teacherId)
      }

      if (teacherData) {
        setTeacher(teacherData)
        setEditedPhone(teacherData.contactNumber || "")
        setEditedEmail(teacherData.email || "")
      }
    }
    
    loadTeacherData()
  }, [teacherId])

  const handleSave = () => {
    toast.success("Profile updated successfully!")
    setIsEditing(false)
  }

  const handleLogout = () => {
    toast.success("Logged out successfully")
    try {
      onLogout()
    } catch (e) {
      // ignore if onLogout isn't provided or throws
    }

    // Also dispatch global navigation so we always return to home
    try {
      window.dispatchEvent(new CustomEvent('nas:navigate', { detail: { page: 'home' } }))
    } catch (e) {
      // ignore in environments where window isn't available
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
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <User size={24} weight="fill" className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="text-sm text-gray-300">Manage your information</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 card-shadow">
            <div className="flex flex-col items-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Avatar className="w-24 h-24 border-4 border-white/20">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <h2 className="text-2xl font-bold mt-4 text-white">{teacher.name}</h2>
              <p className="text-gray-300">Teacher</p>
              <div className="flex gap-2 mt-3 flex-wrap justify-center">
                {teacher.subjects.map((subject, idx) => (
                  <Badge 
                    key={subject} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 card-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <PencilSimple className="mr-2" size={16} />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false)
                      setEditedPhone(teacher.contactNumber)
                      setEditedEmail(teacher.email)
                    }}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center">
                  <IdentificationCard size={20} weight="fill" className="text-white" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-400">Teacher ID</Label>
                  <p className="font-medium text-white">{teacher.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center">
                  <IdentificationCard size={20} weight="fill" className="text-white" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-400">Employee ID</Label>
                  <p className="font-medium text-white">{teacher.employeeId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center">
                  <Envelope size={20} weight="fill" className="text-white" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-400">Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                    />
                  ) : (
                    <p className="font-medium text-white">{teacher.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center">
                  <Phone size={20} weight="fill" className="text-white" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-400">Contact Number</Label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                    />
                  ) : (
                    <p className="font-medium text-white">{teacher.contactNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center">
                  <BookOpen size={20} weight="fill" className="text-white" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-400">Subjects Teaching</Label>
                  <p className="font-medium text-white">{teacher.subjects.join(', ')}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 card-shadow">
            <h3 className="text-lg font-semibold mb-4 text-white">Class Assignments</h3>
            <div className="space-y-3">
              {["Class 10-A", "Class 10-B", "Class 9-A"].map((className, idx) => (
                <div key={className} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center text-white font-bold text-sm">
                      {className.split('-')[1]}
                    </div>
                    <div>
                      <p className="font-medium text-white">{className}</p>
                      <p className="text-xs text-gray-300">{teacher.subjects[idx % teacher.subjects.length]}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-white/30 text-white">{15 - idx * 2} students</Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full py-6 text-base font-semibold"
          >
            <SignOut className="mr-2" size={20} weight="bold" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
