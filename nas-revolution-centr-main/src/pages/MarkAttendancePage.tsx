import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarBlank, MagnifyingGlass, Check, X, Clock, Funnel } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"
import type { Student, AttendanceRecord, Teacher } from "@/types"
import { teachers } from "@/data/attendanceData"

interface MarkAttendancePageProps {
  teacherId: string
}

export default function MarkAttendancePage({ teacherId }: MarkAttendancePageProps) {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("Class 10-A")
  const [searchQuery, setSearchQuery] = useState("")
  
  const [attendanceData, setAttendanceData] = useKV<AttendanceRecord[]>("teacher-attendance-records", [])
  const [students, setStudents] = useState<Student[]>([])
  const [todayAttendance, setTodayAttendance] = useState<Map<string, "present" | "absent" | "late">>(new Map())
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [savedCount, setSavedCount] = useState(0)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const teacherData = teachers.find(t => t.id === teacherId)
    if (teacherData) {
      setTeacher(teacherData)
      if (teacherData.subjects.length > 0 && !selectedSubject) {
        setSelectedSubject(teacherData.subjects[0])
      }
    }

    const mockStudents: Student[] = [
      { id: "STU001", name: "Rahul Sharma", class: "Class 10-A", rollNumber: "15", phone: "+91 98765 43210", assignedTeachers: [] },
      { id: "STU002", name: "Priya Patel", class: "Class 10-A", rollNumber: "12", phone: "+91 98765 43211", assignedTeachers: [] },
      { id: "STU003", name: "Amit Kumar", class: "Class 10-A", rollNumber: "08", phone: "+91 98765 43212", assignedTeachers: [] },
      { id: "STU004", name: "Sneha Verma", class: "Class 10-A", rollNumber: "22", phone: "+91 98765 43213", assignedTeachers: [] },
      { id: "STU005", name: "Rohan Singh", class: "Class 10-A", rollNumber: "18", phone: "+91 98765 43214", assignedTeachers: [] },
      { id: "STU006", name: "Anjali Gupta", class: "Class 10-A", rollNumber: "05", phone: "+91 98765 43215", assignedTeachers: [] },
      { id: "STU007", name: "Vikram Reddy", class: "Class 10-A", rollNumber: "25", phone: "+91 98765 43216", assignedTeachers: [] },
      { id: "STU008", name: "Kavya Nair", class: "Class 10-A", rollNumber: "10", phone: "+91 98765 43217", assignedTeachers: [] },
      { id: "STU009", name: "Arjun Mehta", class: "Class 10-A", rollNumber: "03", phone: "+91 98765 43218", assignedTeachers: [] },
      { id: "STU010", name: "Diya Kapoor", class: "Class 10-A", rollNumber: "07", phone: "+91 98765 43219", assignedTeachers: [] },
    ]
    setStudents(mockStudents)

    const existingAttendance = new Map<string, "present" | "absent" | "late">()
    if (attendanceData) {
      attendanceData.forEach(record => {
        if (record.date === today && record.teacherId === teacherId && record.subject === selectedSubject) {
          existingAttendance.set(record.studentId, record.status)
        }
      })
    }
    setTodayAttendance(existingAttendance)
  }, [teacherId, selectedSubject, attendanceData, today])

  const handleAttendanceToggle = (studentId: string, status: "present" | "absent" | "late") => {
    setTodayAttendance(prev => {
      const newMap = new Map(prev)
      if (newMap.get(studentId) === status) {
        newMap.delete(studentId)
      } else {
        newMap.set(studentId, status)
      }
      return newMap
    })
  }

  const handleSaveAttendance = () => {
    if (!teacher || !selectedSubject) {
      toast.error("Please select a subject")
      return
    }

    if (todayAttendance.size === 0) {
      toast.error("Please mark attendance for at least one student")
      return
    }

    setAttendanceData(currentRecords => {
      const filteredRecords = (currentRecords || []).filter(
        record => !(record.date === today && record.teacherId === teacherId && record.subject === selectedSubject)
      )

      const newRecords: AttendanceRecord[] = []
      todayAttendance.forEach((status, studentId) => {
        const student = students.find(s => s.id === studentId)
        if (student) {
          newRecords.push({
            id: `ATT_${today}_${teacherId}_${studentId}_${selectedSubject}`,
            studentId,
            teacherId,
            teacherName: teacher.name,
            subject: selectedSubject,
            date: today,
            status,
            timestamp: new Date().toISOString()
          })
        }
      })

      setSavedCount(newRecords.length)
      setShowConfirmation(true)
      setTimeout(() => setShowConfirmation(false), 3000)

      return [...filteredRecords, ...newRecords]
    })

    toast.success(`Attendance saved for ${todayAttendance.size} students`)
  }

  const filteredStudents = students.filter(student => 
    student.class === selectedClass &&
    (searchQuery === "" || 
     student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     student.rollNumber.includes(searchQuery))
  )

  const presentCount = Array.from(todayAttendance.values()).filter(s => s === "present").length
  const absentCount = Array.from(todayAttendance.values()).filter(s => s === "absent").length
  const lateCount = Array.from(todayAttendance.values()).filter(s => s === "late").length

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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[oklch(0.70_0.20_240)] to-[oklch(0.60_0.18_260)] flex items-center justify-center shadow-lg">
            <CalendarBlank size={24} weight="fill" className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-heading">Mark Attendance</h1>
            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 card-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacher.subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                    <SelectItem value="Class 10-B">Class 10-B</SelectItem>
                    <SelectItem value="Class 9-A">Class 9-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 card-shadow">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-[oklch(0.97_0.01_150)] rounded-xl">
                <p className="text-2xl font-bold text-[oklch(0.55_0.18_150)]">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="text-center p-3 bg-[oklch(0.97_0.01_0)] rounded-xl">
                <p className="text-2xl font-bold text-[oklch(0.60_0.22_25)]">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
              <div className="text-center p-3 bg-[oklch(0.97_0.01_60)] rounded-xl">
                <p className="text-2xl font-bold text-[oklch(0.65_0.18_40)]">{lateCount}</p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {filteredStudents.map((student, idx) => {
            const status = todayAttendance.get(student.id)
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-4 card-shadow hover:card-shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="w-12 h-12 border-2 border-border">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">Roll No: {student.rollNumber}</p>
                      </div>
                      {status && (
                        <Badge 
                          variant="secondary"
                          className={
                            status === "present" ? "bg-[oklch(0.65_0.18_150)] text-white" :
                            status === "absent" ? "bg-[oklch(0.60_0.22_25)] text-white" :
                            "bg-[oklch(0.70_0.18_40)] text-white"
                          }
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 ml-3">
                      <Button
                        size="sm"
                        variant={status === "present" ? "default" : "outline"}
                        onClick={() => handleAttendanceToggle(student.id, "present")}
                        className={status === "present" ? "bg-[oklch(0.65_0.18_150)] hover:bg-[oklch(0.60_0.15_150)]" : ""}
                      >
                        <Check size={16} weight="bold" />
                      </Button>
                      <Button
                        size="sm"
                        variant={status === "absent" ? "default" : "outline"}
                        onClick={() => handleAttendanceToggle(student.id, "absent")}
                        className={status === "absent" ? "bg-[oklch(0.60_0.22_25)] hover:bg-[oklch(0.55_0.20_25)]" : ""}
                      >
                        <X size={16} weight="bold" />
                      </Button>
                      <Button
                        size="sm"
                        variant={status === "late" ? "default" : "outline"}
                        onClick={() => handleAttendanceToggle(student.id, "late")}
                        className={status === "late" ? "bg-[oklch(0.70_0.18_40)] hover:bg-[oklch(0.65_0.16_40)]" : ""}
                      >
                        <Clock size={16} weight="bold" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {filteredStudents.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No students found</p>
          </Card>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky bottom-20 pt-4"
        >
          <Button
            onClick={handleSaveAttendance}
            disabled={todayAttendance.size === 0}
            className="w-full bg-gradient-to-r from-[oklch(0.70_0.20_240)] to-[oklch(0.60_0.18_260)] hover:from-[oklch(0.75_0.22_240)] hover:to-[oklch(0.65_0.20_260)] text-white font-semibold py-6 rounded-xl shadow-lg"
          >
            Save Attendance ({todayAttendance.size} students)
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50"
          >
            <Card className="p-6 bg-gradient-to-br from-[oklch(0.65_0.18_150)] to-[oklch(0.60_0.15_170)] text-white shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Check size={24} weight="bold" />
                </div>
                <div>
                  <p className="font-bold">Attendance Saved!</p>
                  <p className="text-sm text-white/80">{savedCount} students marked</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
