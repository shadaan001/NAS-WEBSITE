import { useState, useEffect } from "react"
import { CalendarCheck, CalendarX, TrendUp, Users } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import AttendanceCalendar from "@/components/AttendanceCalendar"
import AttendanceModal from "@/components/AttendanceModal"
import { LocalDB } from "@/lib/useLocalDB"
import {
  generateMonthlyReport,
  getRecentChanges,
  getStudentAttendanceSummary
} from "@/lib/attendanceUtils"

export default function TeacherAttendance({ teacherId, onBack }) {
  const [loading, setLoading] = useState(true)
  const [teacher, setTeacher] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showLowAttendance, setShowLowAttendance] = useState(false)
  const [monthlyStats, setMonthlyStats] = useState(null)
  const [recentChanges, setRecentChanges] = useState([])
  const [students, setStudents] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        console.log("Loading teacher attendance data for teacherId:", teacherId)
        const storedStudents = await window.spark.kv.get("admin-students-records") || []
        const storedTeachers = await window.spark.kv.get("admin-teachers-records") || []
        
        let teacherData = storedTeachers.find(t => t.id === teacherId)
        
        if (!teacherData) {
          teacherData = LocalDB.getTeacher(teacherId)
        }
        
        if (!teacherData) {
          console.warn("Teacher not found in KV or LocalDB, checking fallback data:", teacherId)
          const { teachers: fallbackTeachers } = await import("@/data/attendanceData")
          teacherData = fallbackTeachers.find(t => t.id === teacherId)
        }
        
        if (teacherData && !teacherData.availability) {
          teacherData = {
            ...teacherData,
            availability: [
              { day: "Mon" },
              { day: "Tue" },
              { day: "Wed" },
              { day: "Thu" },
              { day: "Fri" }
            ]
          }
        }
        
        if (teacherData && teacherData.availability) {
          teacherData.availability = teacherData.availability.map(slot => {
            if (slot.from && slot.to) {
              return { day: slot.day }
            }
            return slot
          })
        }
        
        if (!teacherData) {
          console.error("Teacher not found in any data source:", teacherId)
          if (isMounted) {
            setLoading(false)
          }
          return
        }

        console.log("Teacher data loaded successfully:", teacherData.name)

        const assignedStudents = storedStudents.filter(s =>
          s.assignedTeacherIds?.includes(teacherId)
        )
        
        console.log(`Found ${assignedStudents.length} assigned students`)
        
        if (isMounted) {
          setTeacher(teacherData)
          setStudents(assignedStudents)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error loading attendance data:", error)
        if (isMounted) {
          setTeacher(null)
          setStudents([])
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [teacherId])

  useEffect(() => {
    if (teacher && !loading) {
      loadMonthlyStats()
      loadRecentChanges()
    }
  }, [teacher, currentDate, loading])

  const loadMonthlyStats = () => {
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const report = generateMonthlyReport(teacherId, year, month)
      
      const totalPresent = report.studentStats.reduce((sum, s) => sum + s.present, 0)
      const totalClasses = report.studentStats.reduce((sum, s) => sum + s.total, 0)
      const presentPercentage = totalClasses > 0 
        ? Math.round((totalPresent / totalClasses) * 100)
        : 0
      
      setMonthlyStats({
        ...report.summary,
        presentPercentage
      })
    } catch (error) {
      console.error("Error loading monthly stats:", error)
      setMonthlyStats({
        scheduledDays: 0,
        heldDays: 0,
        cancelledDays: 0,
        presentPercentage: 0
      })
    }
  }

  const loadRecentChanges = () => {
    try {
      const changes = getRecentChanges(teacherId, 10)
      setRecentChanges(changes)
    } catch (error) {
      console.error("Error loading recent changes:", error)
      setRecentChanges([])
    }
  }

  const handleDayClick = (dateStr, record) => {
    setSelectedDate(dateStr)
    setSelectedRecord(record)
    setShowModal(true)
  }

  const handleSaveAttendance = () => {
    loadMonthlyStats()
    loadRecentChanges()
  }

  const getLowAttendanceStudents = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    const sinceDate = firstDay.toISOString().split('T')[0]
    const toDate = lastDay.toISOString().split('T')[0]
    
    return students
      .map(student => {
        const summary = getStudentAttendanceSummary(student.id, sinceDate, toDate)
        return {
          ...student,
          attendance: summary.overall
        }
      })
      .filter(s => s.attendance.percentage < 75)
      .sort((a, b) => a.attendance.percentage - b.attendance.percentage)
  }

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="text-muted-foreground">Loading attendance...</div>
        </div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="bg-gradient-to-br from-[#7904EB] to-[#6003c9] border-[#5503a8]/50 backdrop-blur-sm rounded-2xl p-8">
            <p className="text-xl font-semibold text-destructive mb-2">Teacher not found</p>
            <p className="text-foreground/70 mb-4">Unable to load teacher data. This might happen if you're using a new account that hasn't been set up yet.</p>
            <Button 
              onClick={onBack}
              className="bg-primary text-primary-foreground"
            >
              Go Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="p-6 pb-24 max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </button>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-heading">Attendance Management</h1>
            <p className="text-muted-foreground mt-1">{teacher.name}</p>
          </div>
        </div>
        <Card className="p-12 bg-gradient-to-br from-[#7904EB] to-[#6003c9] border-[#5503a8]/50 backdrop-blur-sm">
          <div className="text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-foreground/70" />
            <h2 className="text-xl font-semibold mb-2 text-white">No students assigned to you</h2>
            <p className="text-foreground/70">
              Please contact the administrator to assign students to your account.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const lowAttendanceStudents = showLowAttendance ? getLowAttendanceStudents() : []

  return (
    <div className="p-6 pb-24 space-y-6 max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to Dashboard</span>
      </button>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Attendance Management</h1>
          <p className="text-muted-foreground mt-1">{teacher.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-[#7904EB] to-[#6003c9] border-[#5503a8]/50 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-foreground/70">Sessions Scheduled</p>
              <p className="text-3xl font-bold mt-1 text-white">
                {monthlyStats?.scheduledDays || 0}
              </p>
            </div>
            <CalendarCheck className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#7904EB] to-[#6003c9] border-[#5503a8]/50 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-foreground/70">Sessions Held</p>
              <p className="text-3xl font-bold mt-1 text-success">
                {monthlyStats?.heldDays || 0}
              </p>
            </div>
            <CalendarCheck className="h-8 w-8 text-success" weight="fill" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#7904EB] to-[#6003c9] border-[#5503a8]/50 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-foreground/70">Sessions Cancelled</p>
              <p className="text-3xl font-bold mt-1 text-destructive">
                {monthlyStats?.cancelledDays || 0}
              </p>
            </div>
            <CalendarX className="h-8 w-8 text-destructive" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#7904EB] to-[#6003c9] border-[#5503a8]/50 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-foreground/70">Overall Present %</p>
              <p className="text-3xl font-bold mt-1 text-primary">
                {monthlyStats?.presentPercentage || 0}%
              </p>
            </div>
            <TrendUp className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      <AttendanceCalendar
        teacherId={teacherId}
        year={currentDate.getFullYear()}
        month={currentDate.getMonth() + 1}
        teacher={teacher}
        onDayClick={handleDayClick}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#7904EB] to-[#6003c9] border-[#5503a8]/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-white" />
            <span className="text-white">Recent Activity</span>
          </h3>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {recentChanges.length === 0 ? (
                <p className="text-sm text-foreground/70 text-center py-8">
                  No recent activity
                </p>
              ) : (
                recentChanges.map((change, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-[#6003c9] text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{change.date}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        change.status === "Held" 
                          ? "bg-success/20 text-success" 
                          : "bg-destructive/20 text-destructive"
                      }`}>
                        {change.status}
                      </span>
                    </div>
                    <div className="text-xs text-foreground/70 mt-1">
                      {change.students?.length || 0} students • Updated {formatDateTime(change.updatedAt || change.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#7904EB] to-[#6003c9] border-[#5503a8]/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendUp className="h-5 w-5 text-white" />
              <span className="text-white">Low Attendance Alert</span>
            </h3>
            <div className="flex items-center gap-2">
              <Switch
                id="low-attendance"
                checked={showLowAttendance}
                onCheckedChange={setShowLowAttendance}
              />
              <Label htmlFor="low-attendance" className="text-sm text-white">
                Show &lt; 75%
              </Label>
            </div>
          </div>
          <ScrollArea className="h-64">
            {!showLowAttendance ? (
              <p className="text-sm text-foreground/70 text-center py-8">
                Enable to view students with attendance below 75%
              </p>
            ) : lowAttendanceStudents.length === 0 ? (
              <p className="text-sm text-foreground/70 text-center py-8">
                No students with low attendance
              </p>
            ) : (
              <div className="space-y-2">
                {lowAttendanceStudents.map(student => (
                  <div
                    key={student.id}
                    className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-white">{student.name}</p>
                        <p className="text-xs text-foreground/70">
                          {student.class} • Roll: {student.rollNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-destructive">
                          {student.attendance.percentage}%
                        </p>
                        <p className="text-xs text-foreground/70">
                          {student.attendance.present}/{student.attendance.totalClasses}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>

      <AttendanceModal
        open={showModal}
        onOpenChange={setShowModal}
        teacher={teacher}
        date={selectedDate}
        existingRecord={selectedRecord}
        onSave={handleSaveAttendance}
      />
    </div>
  )
}
