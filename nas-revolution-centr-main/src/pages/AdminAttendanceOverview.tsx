import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import { 
  CalendarCheck, 
  FunnelSimple,
  CalendarBlank,
  Pencil,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft
} from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import GradientBackground from "@/components/school/GradientBackground"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts"
import type { AttendanceRecord } from "@/types"
import type { StudentRecord, TeacherRecord } from "@/types/admin"

interface AdminAttendanceOverviewProps {
  onBack?: () => void
}

export default function AdminAttendanceOverview({ onBack }: AdminAttendanceOverviewProps = {}) {
  const [attendance, setAttendance] = useKV<AttendanceRecord[]>("admin-attendance-records", [])
  const [students] = useKV<StudentRecord[]>("admin-students-records", [])
  const [teachers] = useKV<TeacherRecord[]>("admin-teachers-records", [])
  
  const [selectedStudent, setSelectedStudent] = useState<string>("all")
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null)
  const [editStatus, setEditStatus] = useState<"present" | "absent" | "late">("present")
  const [editRemarks, setEditRemarks] = useState("")

  const attendanceList = attendance || []
  const studentsList = students || []
  const teachersList = teachers || []

  const subjects = useMemo(() => {
    return Array.from(new Set(attendanceList.map(a => a.subject)))
  }, [attendanceList])

  const filteredAttendance = useMemo(() => {
    return attendanceList.filter(record => {
      if (selectedStudent !== "all" && record.studentId !== selectedStudent) return false
      if (selectedTeacher !== "all" && record.teacherId !== selectedTeacher) return false
      if (selectedSubject !== "all" && record.subject !== selectedSubject) return false
      if (startDate && record.date < startDate) return false
      if (endDate && record.date > endDate) return false
      return true
    })
  }, [attendanceList, selectedStudent, selectedTeacher, selectedSubject, startDate, endDate])

  const stats = useMemo(() => {
    const present = filteredAttendance.filter(a => a.status === "present").length
    const absent = filteredAttendance.filter(a => a.status === "absent").length
    const late = filteredAttendance.filter(a => a.status === "late").length
    const total = filteredAttendance.length

    return {
      total,
      present,
      absent,
      late,
      percentage: total ? Math.round((present / total) * 100) : 0
    }
  }, [filteredAttendance])

  const pieData = [
    { name: "Present", value: stats.present, color: "oklch(0.65 0.15 150)" },
    { name: "Absent", value: stats.absent, color: "oklch(0.58 0.22 25)" },
    { name: "Late", value: stats.late, color: "oklch(0.70 0.15 40)" }
  ].filter(d => d.value > 0)

  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dateStr = date.toISOString().split('T')[0]
      
      const dayRecords = filteredAttendance.filter(a => a.date === dateStr)
      const present = dayRecords.filter(a => a.status === "present").length
      const absent = dayRecords.filter(a => a.status === "absent").length
      const late = dayRecords.filter(a => a.status === "late").length
      
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        present,
        absent,
        late,
        total: dayRecords.length
      }
    })
  }, [filteredAttendance])

  const subjectWiseData = useMemo(() => {
    const subjectMap = new Map<string, { present: number; absent: number; late: number; total: number }>()
    
    filteredAttendance.forEach(record => {
      if (!subjectMap.has(record.subject)) {
        subjectMap.set(record.subject, { present: 0, absent: 0, late: 0, total: 0 })
      }
      const data = subjectMap.get(record.subject)!
      data.total++
      if (record.status === "present") data.present++
      else if (record.status === "absent") data.absent++
      else if (record.status === "late") data.late++
    })

    return Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject,
      ...data,
      percentage: Math.round((data.present / data.total) * 100)
    })).sort((a, b) => b.percentage - a.percentage)
  }, [filteredAttendance])

  const handleEditRecord = () => {
    if (!editingRecord) return

    setAttendance((current) => 
      (current || []).map(r => 
        r.id === editingRecord.id 
          ? { ...r, status: editStatus, remarks: editRemarks }
          : r
      )
    )
    
    setIsEditOpen(false)
    setEditingRecord(null)
    toast.success("Attendance record updated")
  }

  const openEditDialog = (record: AttendanceRecord) => {
    setEditingRecord(record)
    setEditStatus(record.status)
    setEditRemarks(record.remarks || "")
    setIsEditOpen(true)
  }

  return (
    <>
      <GradientBackground />
      <div className="pb-24 px-4 pt-16 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-white/10 p-2"
          >
            <ArrowLeft size={24} weight="bold" className="text-white" />
          </Button>
        )}
        <BubbleIcon size="md" variant="blue">
          <CalendarCheck size={28} weight="fill" />
        </BubbleIcon>
        <div>
          <h1 className="text-2xl font-bold text-heading text-foreground">Attendance Overview</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage attendance records</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 rounded-2xl card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <FunnelSimple size={18} className="text-muted-foreground" />
            <h2 className="text-sm font-bold text-heading">Filters</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {studentsList.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Teacher</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {teachersList.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="h-9">
                  <SelectValue />
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

            <div className="space-y-2">
              <Label className="text-xs">Date Range</Label>
              <div className="flex gap-1">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 text-xs"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {(selectedStudent !== "all" || selectedTeacher !== "all" || selectedSubject !== "all" || startDate || endDate) && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => {
                setSelectedStudent("all")
                setSelectedTeacher("all")
                setSelectedSubject("all")
                setStartDate("")
                setEndDate("")
              }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-4 gap-2"
      >
        <Card className="p-3 rounded-xl text-center">
          <p className="text-xs text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-bold text-heading text-foreground">{stats.total}</p>
        </Card>
        <Card className="p-3 rounded-xl text-center bg-secondary/10">
          <p className="text-xs text-muted-foreground mb-1">Present</p>
          <p className="text-2xl font-bold text-heading text-secondary">{stats.present}</p>
        </Card>
        <Card className="p-3 rounded-xl text-center bg-destructive/10">
          <p className="text-xs text-muted-foreground mb-1">Absent</p>
          <p className="text-2xl font-bold text-heading text-destructive">{stats.absent}</p>
        </Card>
        <Card className="p-3 rounded-xl text-center bg-accent/10">
          <p className="text-xs text-muted-foreground mb-1">Late</p>
          <p className="text-2xl font-bold text-heading text-accent">{stats.late}</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 gap-4"
      >
        <Card className="p-5 rounded-2xl card-shadow">
          <h3 className="text-sm font-bold text-heading mb-4">Attendance Distribution</h3>
          {pieData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">No data to display</p>
          )}
        </Card>

        <Card className="p-5 rounded-2xl card-shadow">
          <h3 className="text-sm font-bold text-heading mb-4">Last 7 Days Trend</h3>
          {last7Days.some(d => d.total > 0) ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: 'oklch(0.50 0.04 240)', fontSize: 11 }}
                  />
                  <YAxis 
                    tick={{ fill: 'oklch(0.50 0.04 240)', fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(1 0 0)', 
                      border: '1px solid oklch(0.88 0.02 240)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="present" 
                    stroke="oklch(0.65 0.15 150)" 
                    strokeWidth={2}
                    name="Present"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="absent" 
                    stroke="oklch(0.58 0.22 25)" 
                    strokeWidth={2}
                    name="Absent"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="late" 
                    stroke="oklch(0.70 0.15 40)" 
                    strokeWidth={2}
                    name="Late"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">No data to display</p>
          )}
        </Card>
      </motion.div>

      {subjectWiseData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 rounded-2xl card-shadow">
            <h3 className="text-sm font-bold text-heading mb-4">Subject-wise Attendance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectWiseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                  <XAxis 
                    dataKey="subject" 
                    tick={{ fill: 'oklch(0.50 0.04 240)', fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fill: 'oklch(0.50 0.04 240)', fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(1 0 0)', 
                      border: '1px solid oklch(0.88 0.02 240)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="present" fill="oklch(0.65 0.15 150)" name="Present" />
                  <Bar dataKey="absent" fill="oklch(0.58 0.22 25)" name="Absent" />
                  <Bar dataKey="late" fill="oklch(0.70 0.15 40)" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-4 rounded-2xl card-shadow">
          <h3 className="text-sm font-bold text-heading mb-3">Recent Records</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAttendance.slice(0, 50).map((record) => {
              const student = studentsList.find(s => s.id === record.studentId)
              
              return (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{student?.name || record.studentId}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.subject} • {record.teacherName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.status === "present" && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle size={12} weight="fill" />
                        Present
                      </Badge>
                    )}
                    {record.status === "absent" && (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle size={12} weight="fill" />
                        Absent
                      </Badge>
                    )}
                    {record.status === "late" && (
                      <Badge variant="secondary" className="gap-1 bg-accent/20 text-accent-foreground">
                        <Clock size={12} weight="fill" />
                        Late
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(record)}
                    >
                      <Pencil size={14} />
                    </Button>
                  </div>
                </div>
              )
            })}
            {filteredAttendance.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No records found</p>
            )}
          </div>
        </Card>
      </motion.div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-sm font-semibold text-foreground">{editingRecord.subject}</p>
                <p className="text-xs text-muted-foreground">{editingRecord.teacherName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(editingRecord.date).toLocaleDateString('en-IN')}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editStatus} onValueChange={(value: any) => setEditStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="Optional remarks"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditRecord}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </>
  )
}
