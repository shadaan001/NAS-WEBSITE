import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  User,
  Phone,
  EnvelopeSimple,
  MapPin,
  CalendarCheck,
  ChalkboardTeacher,
  ChartBar,
  CurrencyDollar,
  FileText,
  Bell,
  GearSix,
  SignOut,
  Copy,
  Download,
  TrendUp,
} from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"
import { LocalDB, type StudentWithRelations } from "@/lib/useLocalDB"
import type { AttendanceRecord } from "@/types"
import type { TestRecord, FeeRecord } from "@/types/admin"
import StudentDashboard from "@/components/StudentDashboard"

interface StudentProfilePageProps {
  studentId: string
  onLogout: () => void
}

export default function StudentProfilePage({ studentId, onLogout }: StudentProfilePageProps) {
  const [student, setStudent] = useState<StudentWithRelations | null>(null)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [tests, setTests] = useState<TestRecord[]>([])
  const [payments, setPayments] = useState<FeeRecord[]>([])
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    const studentData = LocalDB.getStudent(studentId)
    if (studentData) {
      setStudent(studentData)
    }

    const attendanceData = LocalDB.getStudentAttendance(studentId)
    setAttendance(attendanceData)

    const testsData = LocalDB.getStudentTests(studentId)
    setTests(testsData)

    const paymentsData = LocalDB.getStudentPayments(studentId)
    setPayments(paymentsData)
  }, [studentId])

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 rounded-2xl card-shadow">
          <p className="text-muted-foreground">Student not found</p>
        </Card>
      </div>
    )
  }

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const attendanceSummary = calculateAttendanceSummary(attendance)
  const recentTests = tests.slice(0, 5)
  const pendingPayments = payments.filter((p) => p.status !== "paid")

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <div className="pb-24 px-4 pt-16 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className="p-6 rounded-2xl card-shadow text-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
          
          <div className="relative">
            <Avatar className="w-28 h-28 mx-auto mb-4 border-4 border-background shadow-lg">
              {student.photoBase64 ? (
                <AvatarImage src={student.photoBase64} alt={student.name} />
              ) : null}
              <AvatarFallback className="bg-gradient-blue-white text-primary font-bold text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-2xl font-bold text-heading text-foreground mb-1">
              {student.name}
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              {student.class} • Roll No. {student.rollNumber}
            </p>
            {student.dateOfBirth && (
              <p className="text-xs text-muted-foreground">
                DOB: {new Date(student.dateOfBirth).toLocaleDateString("en-IN")}
              </p>
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-base font-bold text-heading text-foreground mb-3 flex items-center gap-2">
          <CalendarCheck size={20} weight="fill" className="text-primary" />
          Attendance Summary
        </h2>
        <Card className="p-5 rounded-2xl card-shadow">
          <div className="text-center mb-4">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-3">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - attendanceSummary.percentage / 100)}`}
                  className="text-secondary transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-heading text-foreground">
                  {attendanceSummary.percentage}%
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Overall Attendance</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-xl bg-secondary/10">
              <p className="text-xs text-muted-foreground mb-1">Present</p>
              <p className="text-2xl font-bold text-secondary">{attendanceSummary.presentDays}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-destructive/10">
              <p className="text-xs text-muted-foreground mb-1">Absent</p>
              <p className="text-2xl font-bold text-destructive">{attendanceSummary.absentDays}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-accent/10">
              <p className="text-xs text-muted-foreground mb-1">Late</p>
              <p className="text-2xl font-bold text-accent">{attendanceSummary.lateDays}</p>
            </div>
          </div>

          {attendanceSummary.bySubject.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Subject-wise Attendance</p>
                {attendanceSummary.bySubject.map((subj) => (
                  <div key={subj.subject} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">{subj.subject}</span>
                      <span className="text-sm font-semibold text-foreground">
                        {subj.percentage}%
                      </span>
                    </div>
                    <Progress value={subj.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </>
          )}

          {attendanceSummary.last7Days.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Last 7 Days</p>
                <div className="flex justify-between gap-1">
                  {attendanceSummary.last7Days.map((day, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <div
                        className={`w-full h-12 rounded-lg flex items-center justify-center text-xs font-semibold ${
                          day.present > day.absent
                            ? "bg-secondary/20 text-secondary"
                            : day.absent > 0
                            ? "bg-destructive/20 text-destructive"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {day.present > 0 ? "P" : day.absent > 0 ? "A" : day.late > 0 ? "L" : "-"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-heading text-foreground flex items-center gap-2">
            <FileText size={20} weight="fill" className="text-primary" />
            Tests & Results
          </h2>
          <Button variant="outline" size="sm" onClick={() => setShowDashboard(true)}>
            <ChartBar size={16} className="mr-2" />
            Progress
          </Button>
        </div>
        <Card className="p-5 rounded-2xl card-shadow">
          {recentTests.length > 0 ? (
            <div className="space-y-3">
              {recentTests.map((test) => {
                const studentMark = test.marks.find((m) => m.studentId === studentId)
                const percentage = studentMark
                  ? ((studentMark.marksObtained / test.maxMarks) * 100).toFixed(1)
                  : "N/A"

                return (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">{test.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {test.subject} • {new Date(test.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-heading text-foreground">
                        {studentMark?.marksObtained || 0}/{test.maxMarks}
                      </p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No test results available yet
            </p>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-base font-bold text-heading text-foreground mb-3 flex items-center gap-2">
          <CurrencyDollar size={20} weight="fill" className="text-primary" />
          Payments
        </h2>
        <Card className="p-5 rounded-2xl card-shadow">
          {pendingPayments.length > 0 && (
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 mb-4">
              <div className="flex items-center gap-3">
                <BubbleIcon size="sm" variant="orange">
                  <CurrencyDollar size={20} weight="fill" />
                </BubbleIcon>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">Pending Payment</p>
                  <p className="text-xs text-muted-foreground">
                    {pendingPayments.length} payment(s) pending
                  </p>
                </div>
                <p className="text-lg font-bold text-accent">
                  ₹{pendingPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {payments.length > 0 ? (
            <div className="space-y-2">
              {payments.slice(0, 5).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                >
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(payment.dueDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <Badge
                    variant={
                      payment.status === "paid"
                        ? "secondary"
                        : payment.status === "overdue"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No payment records available
            </p>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-base font-bold text-heading text-foreground mb-3 flex items-center gap-2">
          <ChalkboardTeacher size={20} weight="fill" className="text-primary" />
          Teacher Contacts
        </h2>
        <Card className="p-5 rounded-2xl card-shadow">
          {(student.assignedTeachers || []).length > 0 ? (
            <div className="space-y-3">
              {(student.assignedTeachers || []).map((assignment, idx) => {
                const teacher = LocalDB.getTeacher(assignment.teacherId)
                return (
                  <div
                    key={`${assignment.teacherId}-${idx}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                  >
                    <BubbleIcon size="sm" variant="green">
                      <ChalkboardTeacher size={20} weight="fill" />
                    </BubbleIcon>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">
                        {assignment.teacherName}
                      </p>
                      <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                    </div>
                    {teacher?.contactNumber && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(teacher.contactNumber, "Phone number")
                        }
                      >
                        <Copy size={16} />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No teachers assigned yet
            </p>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-base font-bold text-heading text-foreground mb-3 flex items-center gap-2">
          <GearSix size={20} weight="fill" className="text-primary" />
          Settings
        </h2>
        
        <Card
          onClick={onLogout}
          className="p-4 rounded-xl card-shadow flex items-center gap-3 cursor-pointer active:scale-95 transition-all bg-destructive/5 border-destructive/20"
        >
          <BubbleIcon size="sm" variant="orange">
            <SignOut size={20} weight="fill" />
          </BubbleIcon>
          <div className="flex-1">
            <p className="font-semibold text-sm text-destructive text-heading">Logout</p>
            <p className="text-xs text-muted-foreground">Sign out of your account</p>
          </div>
        </Card>
      </motion.div>

      <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Performance Dashboard</DialogTitle>
          </DialogHeader>
          <StudentDashboard studentId={studentId} tests={tests} attendance={attendance} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function calculateAttendanceSummary(attendance: AttendanceRecord[]) {
  const totalDays = attendance.length
  const presentDays = attendance.filter((a) => a.status === "present").length
  const absentDays = attendance.filter((a) => a.status === "absent").length
  const lateDays = attendance.filter((a) => a.status === "late").length
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  const bySubject: Array<{
    subject: string
    totalClasses: number
    present: number
    absent: number
    late: number
    percentage: number
  }> = []

  const subjectMap = new Map<string, AttendanceRecord[]>()
  attendance.forEach((a) => {
    if (!subjectMap.has(a.subject)) {
      subjectMap.set(a.subject, [])
    }
    subjectMap.get(a.subject)!.push(a)
  })

  subjectMap.forEach((records, subject) => {
    const total = records.length
    const present = records.filter((r) => r.status === "present").length
    const absent = records.filter((r) => r.status === "absent").length
    const late = records.filter((r) => r.status === "late").length
    bySubject.push({
      subject,
      totalClasses: total,
      present,
      absent,
      late,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    })
  })

  const sortedDates = attendance
    .map((a) => a.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  const last7Dates = sortedDates.slice(0, 7).reverse()

  const last7Days = last7Dates.map((date) => {
    const dayRecords = attendance.filter((a) => a.date === date)
    return {
      date,
      present: dayRecords.filter((r) => r.status === "present").length,
      absent: dayRecords.filter((r) => r.status === "absent").length,
      late: dayRecords.filter((r) => r.status === "late").length,
      totalClasses: dayRecords.length,
    }
  })

  return {
    totalDays,
    presentDays,
    absentDays,
    lateDays,
    percentage,
    bySubject,
    last7Days,
  }
}
