import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, MagnifyingGlass, Funnel, Phone, ChartBar } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useKV } from "@github/spark/hooks"
import type { Student, AttendanceRecord, Teacher } from "@/types"
import { teachers } from "@/data/attendanceData"

interface TeacherStudentsPageProps {
  teacherId: string
  onBack: () => void
}

export default function TeacherStudentsPage({ teacherId, onBack }: TeacherStudentsPageProps) {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>("Class 10-A")
  const [searchQuery, setSearchQuery] = useState("")
  const [attendanceData] = useKV<AttendanceRecord[]>("teacher-attendance-records", [])
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    const loadTeacherData = async () => {
      const adminTeachers = await window.spark.kv.get<any[]>("admin-teachers-records") || []
      let teacherData = adminTeachers.find((t: any) => t.id === teacherId)
      
      if (!teacherData) {
        teacherData = teachers.find(t => t.id === teacherId)
      }
      
      if (teacherData) {
        setTeacher(teacherData)
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
    }
    
    loadTeacherData()
  }, [teacherId])

  const calculateStudentAttendance = (studentId: string) => {
    if (!attendanceData) return 0
    
    const studentRecords = attendanceData.filter(
      record => record.studentId === studentId && record.teacherId === teacherId
    )
    
    if (studentRecords.length === 0) return 0
    
    const presentCount = studentRecords.filter(r => r.status === "present" || r.status === "late").length
    return Math.round((presentCount / studentRecords.length) * 100)
  }

  const filteredStudents = students.filter(student => 
    student.class === selectedClass &&
    (searchQuery === "" || 
     student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     student.rollNumber.includes(searchQuery))
  ).sort((a, b) => parseInt(a.rollNumber) - parseInt(b.rollNumber))

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
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Users size={24} weight="fill" className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Students</h1>
            <p className="text-sm text-gray-300">{filteredStudents.length} students</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 card-shadow">
            <div className="space-y-4">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search by name or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Filter by Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
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
          className="space-y-3"
        >
          {filteredStudents.map((student, idx) => {
            const attendancePercentage = calculateStudentAttendance(student.id)
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-400/50 card-shadow hover:card-shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14 border-2 border-white/20">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-white">{student.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-xs border-white/30 text-white">
                              Roll: {student.rollNumber}
                            </Badge>
                            <span className="text-xs text-gray-300">{student.class}</span>
                          </div>
                        </div>
                      </div>
                      
                      {student.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone size={16} />
                          <span>{student.phone}</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <ChartBar size={16} className="text-blue-400" />
                            <span className="font-medium text-white">Attendance</span>
                          </div>
                          <span className={`font-bold ${
                            attendancePercentage >= 75 ? "text-green-400" :
                            attendancePercentage >= 50 ? "text-yellow-400" :
                            "text-red-400"
                          }`}>
                            {attendancePercentage}%
                          </span>
                        </div>
                        <Progress 
                          value={attendancePercentage} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {filteredStudents.length === 0 && (
          <Card className="p-8 text-center">
            <Users size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No students found</p>
          </Card>
        )}
      </div>
    </div>
  )
}
