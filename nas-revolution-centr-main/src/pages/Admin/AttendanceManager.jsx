import { useState, useEffect } from "react"
import {
  CalendarCheck,
  Users,
  ChartBar,
  Warning,
  Trash
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import AttendanceCalendar from "@/components/AttendanceCalendar"
import AttendanceModal from "@/components/AttendanceModal"
import { LocalDB } from "@/lib/useLocalDB"
import {
  generateMonthlyReport,
  bulkMarkHoliday,
  getStudentAttendanceSummary
} from "@/lib/attendanceUtils"

export default function AdminAttendanceManager() {
  const [teachers, setTeachers] = useState([])
  const [selectedTeacherId, setSelectedTeacherId] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [bulkStartDate, setBulkStartDate] = useState("")
  const [bulkEndDate, setBulkEndDate] = useState("")
  const [overallStats, setOverallStats] = useState(null)
  const [students, setStudents] = useState([])

  useEffect(() => {
    const allTeachers = LocalDB.getAllTeachers()
    setTeachers(allTeachers)
    
    if (allTeachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(allTeachers[0].id)
    }
    
    const allStudents = LocalDB.getAllStudents()
    setStudents(allStudents)
  }, [])

  useEffect(() => {
    if (selectedTeacherId) {
      const teacher = LocalDB.getTeacher(selectedTeacherId)
      setSelectedTeacher(teacher)
    }
  }, [selectedTeacherId])

  useEffect(() => {
    loadOverallStats()
  }, [currentDate])

  const loadOverallStats = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    
    let totalScheduled = 0
    let totalHeld = 0
    let totalCancelled = 0
    const teacherPerformance = []
    
    teachers.forEach(teacher => {
      const report = generateMonthlyReport(teacher.id, year, month)
      totalScheduled += report.summary.scheduledDays
      totalHeld += report.summary.heldDays
      totalCancelled += report.summary.cancelledDays
      
      teacherPerformance.push({
        teacherId: teacher.id,
        teacherName: teacher.name,
        ...report.summary
      })
    })
    
    setOverallStats({
      totalScheduled,
      totalHeld,
      totalCancelled,
      teacherPerformance
    })
  }

  const handleDayClick = (dateStr, record) => {
    setSelectedDate(dateStr)
    setSelectedRecord(record)
    setShowModal(true)
  }

  const handleSaveAttendance = () => {
    loadOverallStats()
  }

  const handleBulkMarkHoliday = () => {
    if (!bulkStartDate || !bulkEndDate) {
      toast.error("Please select start and end dates")
      return
    }
    
    if (!selectedTeacherId) {
      toast.error("Please select a teacher")
      return
    }
    
    // WARNING: Manual edits are audit-sensitive — add server-side audit logs in production
    const modified = bulkMarkHoliday(selectedTeacherId, bulkStartDate, bulkEndDate)
    
    if (modified) {
      toast.success("Dates marked as cancelled (holiday)")
      loadOverallStats()
      setBulkStartDate("")
      setBulkEndDate("")
    } else {
      toast.info("No records found in the selected date range")
    }
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
      .filter(s => s.attendance.totalClasses > 0 && s.attendance.percentage < 75)
      .sort((a, b) => a.attendance.percentage - b.attendance.percentage)
      .slice(0, 10)
  }

  const lowAttendanceStudents = getLowAttendanceStudents()

  return (
    <div className="p-6 pb-24 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Attendance Management</h1>
          <p className="text-muted-foreground mt-1">Admin Dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Scheduled</p>
              <p className="text-3xl font-bold mt-1">
                {overallStats?.totalScheduled || 0}
              </p>
            </div>
            <CalendarCheck className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Held</p>
              <p className="text-3xl font-bold mt-1 text-success">
                {overallStats?.totalHeld || 0}
              </p>
            </div>
            <CalendarCheck className="h-8 w-8 text-success" weight="fill" />
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Cancelled</p>
              <p className="text-3xl font-bold mt-1 text-destructive">
                {overallStats?.totalCancelled || 0}
              </p>
            </div>
            <CalendarCheck className="h-8 w-8 text-destructive" />
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Select Teacher</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="teacher-select">Teacher</Label>
            <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
              <SelectTrigger id="teacher-select">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subjects.join(", ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {selectedTeacher && (
        <AttendanceCalendar
          teacherId={selectedTeacherId}
          year={currentDate.getFullYear()}
          month={currentDate.getMonth() + 1}
          teacher={selectedTeacher}
          onDayClick={handleDayClick}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Bulk Mark Holiday
          </h3>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
            <div className="flex gap-2 items-start">
              <Warning className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm text-destructive">
                <p className="font-medium">Warning: Manual edits are audit-sensitive</p>
                <p className="text-xs mt-1">Add server-side audit logs in production</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={bulkStartDate}
                onChange={(e) => setBulkStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={bulkEndDate}
                onChange={(e) => setBulkEndDate(e.target.value)}
              />
            </div>
            <Button
              onClick={handleBulkMarkHoliday}
              disabled={!selectedTeacherId || !bulkStartDate || !bulkEndDate}
              className="w-full"
            >
              Mark as Cancelled (Holiday)
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChartBar className="h-5 w-5" />
            Teacher Performance
          </h3>
          <ScrollArea className="h-64">
            {!overallStats?.teacherPerformance?.length ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No data available
              </p>
            ) : (
              <div className="space-y-2">
                {overallStats.teacherPerformance.map(teacher => (
                  <div
                    key={teacher.teacherId}
                    className="p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{teacher.teacherName}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span>Scheduled: {teacher.scheduledDays}</span>
                          <span className="text-success">Held: {teacher.heldDays}</span>
                          <span className="text-destructive">Cancelled: {teacher.cancelledDays}</span>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {teacher.scheduledDays > 0 
                          ? Math.round((teacher.heldDays / teacher.scheduledDays) * 100)
                          : 0}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>

      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Students with Low Attendance (&lt; 75%)
        </h3>
        <ScrollArea className="h-64">
          {lowAttendanceStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No students with low attendance
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowAttendanceStudents.map(student => (
                <div
                  key={student.id}
                  className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.class} • {student.rollNumber}
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-lg font-bold text-destructive">
                        {student.attendance.percentage}%
                      </p>
                      <p className="text-xs text-muted-foreground">
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

      <AttendanceModal
        open={showModal}
        onOpenChange={setShowModal}
        teacher={selectedTeacher}
        date={selectedDate}
        existingRecord={selectedRecord}
        onSave={handleSaveAttendance}
      />
    </div>
  )
}
