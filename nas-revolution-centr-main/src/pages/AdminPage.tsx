import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { UserGear, ChalkboardTeacher, CalendarCheck, Users, Plus, Trash, Pencil } from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { teachers as defaultTeachers, studentTeacherAssignments as defaultAssignments, attendanceRecords, calculateAttendanceSummary } from "@/data/attendanceData"
import type { Teacher, TeacherAssignment, AttendanceRecord } from "@/types"

interface StudentInfo {
  id: string
  name: string
  class: string
  rollNumber: string
}

export default function AdminPage() {
  const [teachers, setTeachers] = useKV<Teacher[]>("admin-teachers", defaultTeachers)
  const [assignments, setAssignments] = useKV<TeacherAssignment[]>("student-teacher-assignments", defaultAssignments)
  const [students] = useKV<StudentInfo[]>("admin-students", [
    { id: "STU001", name: "Rahul Sharma", class: "Class 10-A", rollNumber: "15" },
    { id: "STU002", name: "Priya Singh", class: "Class 10-A", rollNumber: "16" },
    { id: "STU003", name: "Amit Kumar", class: "Class 10-B", rollNumber: "12" },
  ])
  
  const [selectedStudent, setSelectedStudent] = useState<string>("STU001")
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false)
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false)
  const [isEditAttendanceOpen, setIsEditAttendanceOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null)
  
  const [newAssignment, setNewAssignment] = useState({
    teacherId: "",
    subject: "",
  })
  
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    subject: "",
    contactNumber: "",
  })

  const teachersList = teachers || []
  const assignmentsList = assignments || []
  const studentsList = students || []

  const handleAddAssignment = () => {
    const teacher = teachersList.find(t => t.id === newAssignment.teacherId)
    if (!teacher) {
      toast.error("Please select a teacher")
      return
    }
    
    if (!newAssignment.subject) {
      toast.error("Please enter a subject")
      return
    }
    
    const assignment: TeacherAssignment = {
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject: newAssignment.subject,
    }
    
    setAssignments((current) => [...(current || []), assignment])
    setNewAssignment({ teacherId: "", subject: "" })
    setIsAddAssignmentOpen(false)
    toast.success("Teacher assigned successfully")
  }

  const handleRemoveAssignment = (teacherId: string, subject: string) => {
    setAssignments((current) => 
      (current || []).filter(a => !(a.teacherId === teacherId && a.subject === subject))
    )
    toast.success("Assignment removed")
  }

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.subject) {
      toast.error("Please fill all fields")
      return
    }
    
    const teacher: Teacher = {
      id: `TCH${String(teachersList.length + 1).padStart(3, '0')}`,
      name: newTeacher.name,
      email: newTeacher.email,
      subjects: [newTeacher.subject],
      contactNumber: newTeacher.contactNumber,
      employeeId: `EMP${String(teachersList.length + 1).padStart(3, '0')}`,
    }
    
    setTeachers((current) => [...(current || []), teacher])
    setNewTeacher({ name: "", email: "", subject: "", contactNumber: "" })
    setIsAddTeacherOpen(false)
    toast.success("Teacher added successfully")
  }

  const studentAttendance = calculateAttendanceSummary(
    attendanceRecords.filter(r => r.studentId === selectedStudent)
  )

  const recentRecords = attendanceRecords
    .filter(r => r.studentId === selectedStudent)
    .slice(0, 20)

  return (
    <div className="pb-20 px-4 pt-16 space-y-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <BubbleIcon size="md" variant="purple">
          <UserGear size={28} weight="fill" />
        </BubbleIcon>
        <div>
          <h1 className="text-2xl font-bold text-heading text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage teachers and assignments</p>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4 mt-0">
          <Card className="p-4 rounded-2xl card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-heading text-foreground">Teacher Assignments</h2>
              <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus size={16} weight="bold" />
                    Assign
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Teacher to Subject</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="teacher">Teacher</Label>
                      <Select value={newAssignment.teacherId} onValueChange={(value) => setNewAssignment(prev => ({ ...prev, teacherId: value }))}>
                        <SelectTrigger id="teacher">
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachersList.map(teacher => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name} - {teacher.subjects.join(", ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={newAssignment.subject}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="e.g., Mathematics"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddAssignment}>Assign Teacher</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              {assignmentsList.map((assignment, idx) => (
                <div key={`${assignment.teacherId}-${assignment.subject}-${idx}`} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <BubbleIcon size="sm" variant="blue">
                      <ChalkboardTeacher size={18} weight="fill" />
                    </BubbleIcon>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{assignment.subject}</p>
                      <p className="text-xs text-muted-foreground">{assignment.teacherName}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveAssignment(assignment.teacherId, assignment.subject)}
                  >
                    <Trash size={16} className="text-destructive" />
                  </Button>
                </div>
              ))}
              {assignmentsList.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No assignments yet</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4 mt-0">
          <Card className="p-4 rounded-2xl card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-heading text-foreground">All Teachers</h2>
              <Dialog open={isAddTeacherOpen} onOpenChange={setIsAddTeacherOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus size={16} weight="bold" />
                    Add Teacher
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Teacher</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newTeacher.name}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Mr. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newTeacher.email}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john.doe@school.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teacherSubject">Primary Subject</Label>
                      <Input
                        id="teacherSubject"
                        value={newTeacher.subject}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="e.g., Mathematics"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input
                        id="contact"
                        value={newTeacher.contactNumber}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, contactNumber: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddTeacher}>Add Teacher</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              {teachersList.map((teacher) => (
                <div key={teacher.id} className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-start gap-3">
                    <BubbleIcon size="sm" variant="green">
                      <ChalkboardTeacher size={20} weight="fill" />
                    </BubbleIcon>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{teacher.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{teacher.email}</p>
                      <p className="text-xs text-muted-foreground">{teacher.contactNumber}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {teacher.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4 mt-0">
          <Card className="p-4 rounded-2xl card-shadow">
            <div className="mb-4">
              <Label htmlFor="studentSelect">Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger id="studentSelect" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {studentsList.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.class} (Roll {student.rollNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4 p-3 rounded-xl bg-primary/5">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-heading">{studentAttendance.totalDays}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Present</p>
                <p className="text-lg font-bold text-secondary text-heading">{studentAttendance.presentDays}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Absent</p>
                <p className="text-lg font-bold text-destructive text-heading">{studentAttendance.absentDays}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">%</p>
                <p className="text-lg font-bold text-primary text-heading">{studentAttendance.percentage}%</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-heading mb-2">Recent Records</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">{record.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.teacherName} • {new Date(record.date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={record.status === "present" ? "default" : record.status === "absent" ? "destructive" : "secondary"}>
                      {record.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingRecord(record)
                        setIsEditAttendanceOpen(true)
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditAttendanceOpen} onOpenChange={setIsEditAttendanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{editingRecord.subject}</p>
                <p className="text-xs text-muted-foreground">{editingRecord.teacherName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(editingRecord.date).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={editingRecord.status}>
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
                  defaultValue={editingRecord.remarks || ""}
                  placeholder="Optional remarks"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAttendanceOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("Attendance updated")
              setIsEditAttendanceOpen(false)
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
