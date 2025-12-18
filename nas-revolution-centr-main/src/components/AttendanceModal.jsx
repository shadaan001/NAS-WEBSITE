import { useState, useEffect } from "react"
import { X, Check, Clock } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { createOrUpdateAttendance } from "@/lib/attendanceUtils"
import { LocalDB } from "@/lib/useLocalDB"

export default function AttendanceModal({
  open,
  onOpenChange,
  teacher,
  date,
  existingRecord,
  onSave
}) {
  const [status, setStatus] = useState(existingRecord?.status || null)
  const [students, setStudents] = useState([])
  const [studentAttendance, setStudentAttendance] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open && teacher) {
      try {
        const storedStudents = JSON.parse(localStorage.getItem("admin-students-records") || "[]")
        const assignedStudents = storedStudents.filter(s =>
          s.assignedTeacherIds?.includes(teacher.id)
        )
        setStudents(assignedStudents)

        if (existingRecord) {
          setStatus(existingRecord.status)
          const attendanceMap = {}
          existingRecord.students?.forEach(s => {
            attendanceMap[s.studentId] = s.status
          })
          setStudentAttendance(attendanceMap)
        } else {
          setStatus(null)
          setStudentAttendance({})
        }
      } catch (error) {
        console.error("Error loading students:", error)
        setStudents([])
        setStatus(null)
        setStudentAttendance({})
      }
    }
  }, [open, teacher, existingRecord])

  // ⭐ FIXED SUBJECT FUNCTION — NO CRASH
  const getSubjectForStudent = (student) => {
    if (!student) return "Unknown"

    const assignment = student?.assignedTeachers?.find(
      at => at.teacherId === teacher?.id
    )

    return (
      assignment?.subject ||
      teacher?.subjects?.[0] ||
      "Unknown"
    )
  }

  const getLast7DayStatus = (studentId) => {
    const allRecords = LocalDB.getAllAttendanceRecords()
    const today = new Date(date)
    const last7Days = []

    for (let i = 1; i <= 7; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]

      const record = allRecords.find(r =>
        r.teacherId === teacher.id &&
        r.date === dateStr &&
        r.status === "Held"
      )

      const studentStatus = record?.students?.find(s => s.studentId === studentId)
      if (studentStatus) last7Days.push(studentStatus.status)
    }

    return last7Days.slice(0, 7)
  }

  const handleSetStatus = (newStatus) => {
    setStatus(newStatus)
  }

  const handleMarkAll = (attendanceStatus) => {
    const newAttendance = {}
    students.forEach(student => {
      if (teacher.approved) {
        newAttendance[student.id] = attendanceStatus
      }
    })
    setStudentAttendance(newAttendance)
  }

  const handleToggleStudent = (studentId, attendanceStatus) => {
    setStudentAttendance(prev => ({
      ...prev,
      [studentId]: attendanceStatus
    }))
  }

  const handleSave = async () => {
    if (!status) {
      toast.error("Please set session status (Held or Cancelled)")
      return
    }

    if (!teacher.approved) {
      toast.error("Cannot mark attendance. Ask admin to approve.")
      return
    }

    setIsSaving(true)

    try {
      const subject = getSubjectForStudent(students[0])

      const record = {
        id: `a-${date}-${teacher.id}`,
        teacherId: teacher.id,
        date,
        subject,
        status,
        students: students.map(student => ({
          studentId: student.id,
          status: studentAttendance[student.id] || "Absent",
          timestamp: new Date().toISOString()
        }))
      }

      createOrUpdateAttendance(record)

      toast.success(`Attendance saved for ${date}`)
      onSave?.()
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to save", { description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getStatusIcon = (attendanceStatus) => {
    switch (attendanceStatus) {
      case "Present":
        return <Check className="h-4 w-4" weight="bold" />
      case "Absent":
        return <X className="h-4 w-4" weight="bold" />
      case "Late":
        return <Clock className="h-4 w-4" weight="bold" />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Mark Attendance - {formatDate(date)}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {teacher?.name} • {getSubjectForStudent(students[0])}
          </div>
        </DialogHeader>

        {/* ⭐ OVERFLOW FIXED — removed overflow-hidden */}
        <div className="space-y-4 flex-1 flex flex-col">

          {!status && (
            <div className="flex gap-3">
              <Button
                onClick={() => handleSetStatus("Held")}
                variant="outline"
                className="flex-1 h-12 border-success hover:bg-success/10"
              >
                <Check className="mr-2 h-5 w-5" weight="bold" />
                Set as Held
              </Button>

              <Button
                onClick={() => handleSetStatus("Cancelled")}
                variant="outline"
                className="flex-1 h-12 border-destructive hover:bg-destructive/10"
              >
                <X className="mr-2 h-5 w-5" weight="bold" />
                Set as Cancelled
              </Button>
            </div>
          )}

          {status && (
            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-base">Student Attendance</h3>
                <Badge variant={status === "Held" ? "default" : "destructive"}>
                  {status}
                </Badge>
              </div>
              
              {status === "Held" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkAll("Present")}
                    className="flex-1 h-9 gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span className="text-xs">All Present</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkAll("Late")}
                    className="flex-1 h-9 gap-1.5"
                  >
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">All Late</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkAll("Absent")}
                    className="flex-1 h-9 gap-1.5"
                  >
                    <X className="h-4 w-4" />
                    <span className="text-xs">All Absent</span>
                  </Button>
                </div>
              )}

              <ScrollArea className="flex-1 min-h-0 -mx-6 px-6">
                <div className="space-y-2 pr-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-white">{student.name}</p>
                          <p className="text-xs text-muted-foreground">Class {student.class}</p>
                        </div>
                      </div>

                      {status === "Held" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={studentAttendance[student.id] === "Present" ? "default" : "outline"}
                            className="h-8 px-3"
                            onClick={() => handleToggleStudent(student.id, "Present")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={studentAttendance[student.id] === "Late" ? "secondary" : "outline"}
                            className={cn(
                              "h-8 px-3",
                              studentAttendance[student.id] === "Late" && "bg-accent text-accent-foreground hover:bg-accent/90"
                            )}
                            onClick={() => handleToggleStudent(student.id, "Late")}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={studentAttendance[student.id] === "Absent" ? "destructive" : "outline"}
                            className="h-8 px-3"
                            onClick={() => handleToggleStudent(student.id, "Absent")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {status === "Cancelled" && (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          N/A
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !status}
            className="flex-1"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}