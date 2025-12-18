import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { CalendarDays, Users, BookOpen, TrendingUp } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import AttendanceReportTable from "@/components/AttendanceReportTable"
import AttendanceReportCharts from "@/components/AttendanceReportCharts"
import { LocalDB } from "@/lib/useLocalDB"
import { getStudentAttendanceSummary } from "@/lib/attendanceUtils"
import { toast } from "sonner"

export default function AttendanceReports() {
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  
  const [selectedTeacher, setSelectedTeacher] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    const allTeachers = LocalDB.getAllTeachers()
    const allStudents = LocalDB.getAllStudents()
    
    setTeachers(allTeachers)
    setStudents(allStudents)
    
    const uniqueClasses = [...new Set(allStudents.map(s => s.class))].filter(Boolean)
    const uniqueSubjects = [...new Set(allTeachers.flatMap(t => t.subjects || []))].filter(Boolean)
    
    setClasses(uniqueClasses)
    setSubjects(uniqueSubjects)
    
    const today = new Date()
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    
    setStartDate(oneMonthAgo.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }, [])

  const reportData = useMemo(() => {
    if (!startDate || !endDate) return []
    
    const allRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]")
    
    let filtered = allRecords.filter(record => {
      if (record.date < startDate || record.date > endDate) return false
      if (selectedTeacher !== "all" && record.teacherId !== selectedTeacher) return false
      if (selectedSubject !== "all" && record.subject !== selectedSubject) return false
      return true
    })
    
    const tableData = []
    
    filtered.forEach(record => {
      const teacher = teachers.find(t => t.id === record.teacherId)
      
      if (record.status === "Held" && record.students) {
        record.students.forEach(studentRecord => {
          const student = students.find(s => s.id === studentRecord.studentId)
          
          if (!student) return
          
          if (selectedStudent !== "all" && student.id !== selectedStudent) return
          if (selectedClass !== "all" && student.class !== selectedClass) return
          
          tableData.push({
            teacher: teacher?.name || record.teacherId,
            teacherId: record.teacherId,
            student: student.name,
            studentId: student.id,
            class: student.class,
            subject: record.subject,
            date: record.date,
            status: record.status,
            attendanceStatus: studentRecord.status
          })
        })
      }
    })
    
    return tableData
  }, [teachers, students, selectedTeacher, selectedStudent, selectedClass, selectedSubject, startDate, endDate])

  const kpiData = useMemo(() => {
    if (!startDate || !endDate) return null
    
    const allRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]")
    
    const filtered = allRecords.filter(record => {
      if (record.date < startDate || record.date > endDate) return false
      if (selectedTeacher !== "all" && record.teacherId !== selectedTeacher) return false
      if (selectedSubject !== "all" && record.subject !== selectedSubject) return false
      return true
    })
    
    const totalScheduled = filtered.length
    const totalHeld = filtered.filter(r => r.status === "Held").length
    const totalCancelled = filtered.filter(r => r.status === "Cancelled").length
    
    let totalStudentRecords = 0
    let presentCount = 0
    let absentCount = 0
    let lateCount = 0
    
    filtered.forEach(record => {
      if (record.status === "Held" && record.students) {
        record.students.forEach(s => {
          const student = students.find(st => st.id === s.studentId)
          if (selectedStudent !== "all" && s.studentId !== selectedStudent) return
          if (selectedClass !== "all" && student && student.class !== selectedClass) return
          
          totalStudentRecords++
          if (s.status === "Present") presentCount++
          else if (s.status === "Absent") absentCount++
          else if (s.status === "Late") lateCount++
        })
      }
    })
    
    const attendancePercentage = totalStudentRecords > 0
      ? Math.round(((presentCount + lateCount) / totalStudentRecords) * 100)
      : 0
    
    return {
      totalScheduled,
      totalHeld,
      totalCancelled,
      attendancePercentage,
      presentCount,
      absentCount,
      lateCount
    }
  }, [reportData, students, selectedStudent, selectedClass, startDate, endDate])

  const chartData = useMemo(() => {
    if (!reportData.length) return { studentWise: [], subjectWise: [], teacherWise: [] }
    
    const studentMap = new Map()
    const subjectMap = new Map()
    const teacherMap = new Map()
    
    reportData.forEach(row => {
      if (!studentMap.has(row.studentId)) {
        studentMap.set(row.studentId, { studentId: row.studentId, name: row.student, present: 0, absent: 0, late: 0, total: 0 })
      }
      const studentData = studentMap.get(row.studentId)
      studentData.total++
      if (row.attendanceStatus === "Present") studentData.present++
      else if (row.attendanceStatus === "Absent") studentData.absent++
      else if (row.attendanceStatus === "Late") studentData.late++
      
      if (!subjectMap.has(row.subject)) {
        subjectMap.set(row.subject, { subject: row.subject, present: 0, absent: 0, late: 0, total: 0 })
      }
      const subjectData = subjectMap.get(row.subject)
      subjectData.total++
      if (row.attendanceStatus === "Present") subjectData.present++
      else if (row.attendanceStatus === "Absent") subjectData.absent++
      else if (row.attendanceStatus === "Late") subjectData.late++
      
      if (!teacherMap.has(row.teacherId)) {
        teacherMap.set(row.teacherId, { teacherId: row.teacherId, name: row.teacher, present: 0, absent: 0, late: 0, total: 0 })
      }
      const teacherData = teacherMap.get(row.teacherId)
      teacherData.total++
      if (row.attendanceStatus === "Present") teacherData.present++
      else if (row.attendanceStatus === "Absent") teacherData.absent++
      else if (row.attendanceStatus === "Late") teacherData.late++
    })
    
    const studentWise = Array.from(studentMap.values()).map(s => ({
      ...s,
      percentage: s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : 0
    }))
    
    const subjectWise = Array.from(subjectMap.values()).map(s => ({
      ...s,
      percentage: s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : 0
    }))
    
    const teacherWise = Array.from(teacherMap.values()).map(t => ({
      ...t,
      percentage: t.total > 0 ? Math.round(((t.present + t.late) / t.total) * 100) : 0
    }))
    
    return { studentWise, subjectWise, teacherWise }
  }, [reportData])

  return (
    <div className="min-h-screen p-6 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-heading text-4xl font-bold text-foreground mb-2">
                Attendance Reports
              </h1>
              <p className="text-muted-foreground">
                Generate comprehensive attendance reports with charts
              </p>
            </div>
          </div>

          <Card className="card-shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-heading text-xl">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="teacher-filter">Teacher</Label>
                  <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                    <SelectTrigger id="teacher-filter">
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teachers</SelectItem>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="student-filter">Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger id="student-filter">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class-filter">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class-filter">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject-filter">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger id="subject-filter">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {kpiData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="bubble-icon w-12 h-12 bg-primary/10 text-primary">
                        <CalendarDays size={24} weight="duotone" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Sessions</p>
                        <p className="text-3xl font-bold text-foreground">{kpiData.totalScheduled}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {kpiData.totalHeld} Held, {kpiData.totalCancelled} Cancelled
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="bubble-icon w-12 h-12 bg-secondary/10 text-secondary">
                        <Users size={24} weight="duotone" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Student Attendance</p>
                        <p className="text-3xl font-bold text-foreground">{kpiData.attendancePercentage}%</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Overall average
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="bubble-icon w-12 h-12 bg-success/10 text-success">
                        <TrendingUp size={24} weight="duotone" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Present</p>
                        <p className="text-3xl font-bold text-success">{kpiData.presentCount}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          + {kpiData.lateCount} Late
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="bubble-icon w-12 h-12 bg-destructive/10 text-destructive">
                        <BookOpen size={24} weight="duotone" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Absent</p>
                        <p className="text-3xl font-bold text-destructive">{kpiData.absentCount}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Students marked absent
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-8"
          >
            <AttendanceReportCharts chartData={chartData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <AttendanceReportTable data={reportData} showFilters={false} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
