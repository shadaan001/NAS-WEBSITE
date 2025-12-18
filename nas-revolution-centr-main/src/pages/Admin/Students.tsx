// TODO: Replace localStorage with backend API endpoints: /students, /teachers
// TODO: Move validation & integrity checks to server-side endpoints

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Plus,
  MagnifyingGlass,
  FunnelSimple,
  DownloadSimple,
  UserPlus,
  CheckSquare,
} from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import StudentCard from "@/components/StudentCard"
import StudentForm from "@/components/StudentForm"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"
import { LocalDB, type StudentWithRelations } from "@/lib/useLocalDB"
import type { TeacherRecord } from "@/types/admin"
import type { AttendanceRecord } from "@/types"
import { seedStudents, seedTeachers } from "@/data/mockSeed"
import { Progress } from "@/components/ui/progress"

const CLASSES = [
  "All Classes",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11 Science",
  "Class 11 Commerce",
  "Class 12 Science",
  "Class 12 Commerce",
]

export default function AdminStudentsPage() {
  const [students, setStudents] = useKV<StudentWithRelations[]>("admin-students-records", [])
  const [teachers, setTeachers] = useKV<TeacherRecord[]>("admin-teachers-records", [])
  const [attendance] = useKV<AttendanceRecord[]>("admin-attendance-records", [])

  const [searchQuery, setSearchQuery] = useState("")
  const [classFilter, setClassFilter] = useState("All Classes")
  const [teacherFilter, setTeacherFilter] = useState("all")
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false)

  const [editingStudent, setEditingStudent] = useState<StudentWithRelations | null>(null)
  const [viewingStudent, setViewingStudent] = useState<StudentWithRelations | null>(null)

  const [formData, setFormData] = useState<Partial<StudentWithRelations>>({
    name: "",
    class: "",
    rollNumber: "",
    email: "",
    phone: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    dateOfBirth: "",
    bloodGroup: "",
    subjects: [],
    assignedTeachers: [],
    assignedTeacherIds: [],
    assignedSubjects: [],
  })

  useEffect(() => {
    if (!students || students.length === 0) {
      setStudents(() => seedStudents)
    }
    if (!teachers || teachers.length === 0) {
      setTeachers(() => seedTeachers)
    }
  }, [])

  const studentsList = students || []
  const teachersList = teachers || []

  const filteredStudents = studentsList.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.guardianPhone?.includes(searchQuery)

    const matchesClass = classFilter === "All Classes" || student.class === classFilter

    const matchesTeacher =
      teacherFilter === "all" || student.assignedTeacherIds?.includes(teacherFilter)

    return matchesSearch && matchesClass && matchesTeacher
  })

  const handleAdd = () => {
    try {
      if (!formData.name || !formData.class || !formData.rollNumber || !formData.guardianName || !formData.guardianPhone) {
        toast.error("Please fill all required fields")
        return
      }

      const newStudent = LocalDB.addStudent(formData as Omit<StudentWithRelations, "id" | "createdAt">)
      
      setStudents((current) => [...(current || []), newStudent])

      const updatedTeachers = LocalDB.getAllTeachers()
      setTeachers(() => updatedTeachers)

      resetForm()
      setIsAddOpen(false)
      toast.success("Student added successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add student")
    }
  }

  const handleEdit = () => {
    try {
      if (!editingStudent) return

      const updatedStudent = LocalDB.updateStudent(editingStudent.id, editingStudent)
      
      setStudents((current) =>
        (current || []).map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      )

      const updatedTeachers = LocalDB.getAllTeachers()
      setTeachers(() => updatedTeachers)

      setIsEditOpen(false)
      setEditingStudent(null)
      toast.success("Student updated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update student")
    }
  }

  const handleDelete = (id: string) => {
    try {
      LocalDB.deleteStudent(id)
      
      setStudents((current) => (current || []).filter((s) => s.id !== id))

      const updatedTeachers = LocalDB.getAllTeachers()
      setTeachers(() => updatedTeachers)

      if (selectedStudents.has(id)) {
        const newSelected = new Set(selectedStudents)
        newSelected.delete(id)
        setSelectedStudents(newSelected)
      }

      toast.success("Student deleted successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete student")
    }
  }

  const handleView = (student: StudentWithRelations) => {
    setViewingStudent(student)
    setIsViewOpen(true)
  }

  const handleAddSubject = (subject: string) => {
    if (editingStudent) {
      setEditingStudent({
        ...editingStudent,
        subjects: [...(editingStudent.subjects || []), subject],
        assignedSubjects: [...(editingStudent.assignedSubjects || []), subject],
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        subjects: [...(prev.subjects || []), subject],
        assignedSubjects: [...(prev.assignedSubjects || []), subject],
      }))
    }
  }

  const handleRemoveSubject = (subject: string) => {
    if (editingStudent) {
      setEditingStudent({
        ...editingStudent,
        subjects: editingStudent.subjects.filter((s) => s !== subject),
        assignedSubjects: editingStudent.assignedSubjects?.filter((s) => s !== subject) || [],
        assignedTeachers: (editingStudent.assignedTeachers || []).filter((a) => a.subject !== subject),
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        subjects: (prev.subjects || []).filter((s) => s !== subject),
        assignedSubjects: (prev.assignedSubjects || []).filter((s) => s !== subject),
        assignedTeachers: (prev.assignedTeachers || []).filter((a) => a.subject !== subject),
      }))
    }
  }

  const handleAssignTeacher = (teacherId: string, subject: string) => {
    const teacher = teachersList.find((t) => t.id === teacherId)
    if (!teacher) return

    if (teacher.approved === false) {
      toast.error("Cannot assign unapproved teacher")
      return
    }

    const assignment = {
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject,
    }

    if (editingStudent) {
      const teacherIds = editingStudent.assignedTeacherIds || []
      if (!teacherIds.includes(teacherId)) {
        teacherIds.push(teacherId)
      }

      setEditingStudent({
        ...editingStudent,
        assignedTeachers: [...(editingStudent.assignedTeachers || []), assignment],
        assignedTeacherIds: teacherIds,
      })
    } else {
      const teacherIds = formData.assignedTeacherIds || []
      if (!teacherIds.includes(teacherId)) {
        teacherIds.push(teacherId)
      }

      setFormData((prev) => ({
        ...prev,
        assignedTeachers: [...(prev.assignedTeachers || []), assignment],
        assignedTeacherIds: teacherIds,
      }))
    }
  }

  const handleRemoveTeacher = (teacherId: string, subject: string) => {
    if (editingStudent) {
      const remainingAssignments = (editingStudent.assignedTeachers || []).filter(
        (a) => !(a.teacherId === teacherId && a.subject === subject)
      )

      const teacherIds = Array.from(
        new Set(remainingAssignments.map((a) => a.teacherId))
      )

      setEditingStudent({
        ...editingStudent,
        assignedTeachers: remainingAssignments,
        assignedTeacherIds: teacherIds,
      })
    } else {
      const remainingAssignments = (formData.assignedTeachers || []).filter(
        (a) => !(a.teacherId === teacherId && a.subject === subject)
      )

      const teacherIds = Array.from(
        new Set(remainingAssignments.map((a) => a.teacherId))
      )

      setFormData((prev) => ({
        ...prev,
        assignedTeachers: remainingAssignments,
        assignedTeacherIds: teacherIds,
      }))
    }
  }

  const handleBulkAssignTeacher = (teacherId: string) => {
    try {
      if (selectedStudents.size === 0) {
        toast.error("Please select students first")
        return
      }

      LocalDB.bulkAssignTeacherToStudents(teacherId, Array.from(selectedStudents))

      const updatedStudents = LocalDB.getAllStudents()
      setStudents(() => updatedStudents)

      const updatedTeachers = LocalDB.getAllTeachers()
      setTeachers(() => updatedTeachers)

      setIsBulkAssignOpen(false)
      setSelectedStudents(new Set())
      toast.success(`Teacher assigned to ${selectedStudents.size} students`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to bulk assign teacher")
    }
  }

  const handleExportCSV = () => {
    try {
      const studentIds = selectedStudents.size > 0 ? Array.from(selectedStudents) : undefined
      const csv = LocalDB.exportStudentsToCSV(studentIds)

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `students_${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)

      toast.success(
        `Exported ${selectedStudents.size > 0 ? selectedStudents.size : filteredStudents.length} students`
      )
    } catch (error) {
      toast.error("Failed to export CSV")
    }
  }

  const toggleStudentSelection = (studentId: string) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedStudents(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      class: "",
      rollNumber: "",
      email: "",
      phone: "",
      address: "",
      guardianName: "",
      guardianPhone: "",
      dateOfBirth: "",
      bloodGroup: "",
      subjects: [],
      assignedTeachers: [],
      assignedTeacherIds: [],
      assignedSubjects: [],
    })
  }

  const getStudentAttendance = (studentId: string) => {
    const studentAttendance = attendance?.filter((a) => a.studentId === studentId) || []
    const totalDays = studentAttendance.length
    const presentDays = studentAttendance.filter((a) => a.status === "present").length
    const absentDays = studentAttendance.filter((a) => a.status === "absent").length
    const lateDays = studentAttendance.filter((a) => a.status === "late").length
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

    return { totalDays, presentDays, absentDays, lateDays, percentage }
  }

  return (
    <div className="pb-24 px-4 pt-16 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-2"
      >
        <BubbleIcon size="md" variant="blue">
          <Users size={28} weight="fill" />
        </BubbleIcon>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-heading text-foreground">
            Student Management
          </h1>
          <p className="text-sm text-muted-foreground">
            {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus size={18} weight="bold" />
            Add
          </Button>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <StudentForm
              data={formData}
              onChange={setFormData}
              teachers={teachersList}
              onAddSubject={handleAddSubject}
              onRemoveSubject={handleRemoveSubject}
              onAssignTeacher={handleAssignTeacher}
              onRemoveTeacher={handleRemoveTeacher}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="relative">
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by name, roll number, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
            aria-label="Search students"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[200px]" aria-label="Filter by class">
              <FunnelSimple size={16} className="mr-2" />
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              {CLASSES.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={teacherFilter} onValueChange={setTeacherFilter}>
            <SelectTrigger className="w-[200px]" aria-label="Filter by teacher">
              <FunnelSimple size={16} className="mr-2" />
              <SelectValue placeholder="Filter by teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teachers</SelectItem>
              {teachersList
                .filter((t) => t.approved !== false)
                .map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {filteredStudents.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
                className="gap-2"
              >
                <CheckSquare size={16} />
                {selectedStudents.size === filteredStudents.length ? "Deselect" : "Select"} All
              </Button>

              {selectedStudents.size > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBulkAssignOpen(true)}
                    className="gap-2"
                  >
                    <UserPlus size={16} />
                    Assign Teacher ({selectedStudents.size})
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    className="gap-2"
                  >
                    <DownloadSimple size={16} />
                    Export ({selectedStudents.size})
                  </Button>
                </>
              )}

              {selectedStudents.size === 0 && (
                <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
                  <DownloadSimple size={16} />
                  Export All
                </Button>
              )}
            </>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {filteredStudents.map((student, idx) => (
          <div key={student.id} className="flex items-start gap-3">
            <div className="pt-6">
              <Checkbox
                checked={selectedStudents.has(student.id)}
                onCheckedChange={() => toggleStudentSelection(student.id)}
                aria-label={`Select ${student.name}`}
              />
            </div>
            <div className="flex-1">
              <StudentCard
                student={student}
                index={idx}
                onEdit={(s) => {
                  setEditingStudent(s)
                  setIsEditOpen(true)
                }}
                onDelete={handleDelete}
                onView={handleView}
              />
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <Card className="p-8 rounded-2xl card-shadow">
            <div className="text-center">
              <BubbleIcon size="lg" variant="blue" className="mx-auto mb-3">
                <Users size={32} weight="fill" />
              </BubbleIcon>
              <p className="text-sm text-muted-foreground">
                {searchQuery || classFilter !== "All Classes" || teacherFilter !== "all"
                  ? "No students found matching your filters"
                  : "No students added yet. Click 'Add' to create your first student."}
              </p>
            </div>
          </Card>
        )}
      </motion.div>

      {editingStudent && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            <StudentForm
              data={editingStudent}
              onChange={(data) => setEditingStudent({ ...editingStudent, ...data })}
              teachers={teachersList}
              onAddSubject={handleAddSubject}
              onRemoveSubject={handleRemoveSubject}
              onAssignTeacher={handleAssignTeacher}
              onRemoveTeacher={handleRemoveTeacher}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {viewingStudent && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
            </DialogHeader>
            <StudentDetailsView
              student={viewingStudent}
              attendance={getStudentAttendance(viewingStudent.id)}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isBulkAssignOpen} onOpenChange={setIsBulkAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Assign Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Assign a teacher to {selectedStudents.size} selected student
              {selectedStudents.size !== 1 ? "s" : ""}
            </p>
            <div className="space-y-2">
              <Label htmlFor="bulk-teacher">Select Teacher</Label>
              <Select
                onValueChange={(teacherId) => {
                  handleBulkAssignTeacher(teacherId)
                }}
              >
                <SelectTrigger id="bulk-teacher">
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachersList
                    .filter((t) => t.approved !== false)
                    .map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.subjects.join(", ")}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StudentDetailsView({
  student,
  attendance,
}: {
  student: StudentWithRelations
  attendance: { totalDays: number; presentDays: number; absentDays: number; lateDays: number; percentage: number }
}) {
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20 border-4 border-primary/20">
          {student.photoBase64 ? (
            <AvatarImage src={student.photoBase64} alt={student.name} />
          ) : null}
          <AvatarFallback className="bg-gradient-blue-white text-primary font-bold text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-bold text-heading text-foreground">{student.name}</h3>
          <p className="text-sm text-muted-foreground">
            {student.class} • Roll {student.rollNumber}
          </p>
        </div>
      </div>

      <Card className="p-4 rounded-xl bg-muted/30">
        <h4 className="text-sm font-bold text-heading mb-3">Contact Information</h4>
        <div className="space-y-2 text-sm">
          {student.email && <p>Email: {student.email}</p>}
          {student.phone && <p>Phone: {student.phone}</p>}
          {student.address && <p>Address: {student.address}</p>}
          {student.dateOfBirth && (
            <p>DOB: {new Date(student.dateOfBirth).toLocaleDateString("en-IN")}</p>
          )}
          {student.bloodGroup && <p>Blood Group: {student.bloodGroup}</p>}
        </div>
      </Card>

      {student.guardianName && (
        <Card className="p-4 rounded-xl bg-muted/30">
          <h4 className="text-sm font-bold text-heading mb-3">Guardian Information</h4>
          <div className="space-y-2 text-sm">
            <p>Name: {student.guardianName}</p>
            {student.guardianPhone && <p>Phone: {student.guardianPhone}</p>}
          </div>
        </Card>
      )}

      <Card className="p-4 rounded-xl bg-muted/30">
        <h4 className="text-sm font-bold text-heading mb-3">Attendance Summary</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Attendance</span>
            <span className="text-lg font-bold text-heading">{attendance.percentage}%</span>
          </div>
          <Progress value={attendance.percentage} className="h-2" />

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center p-2 rounded-lg bg-secondary/10">
              <p className="text-xs text-muted-foreground">Present</p>
              <p className="text-lg font-bold text-secondary">{attendance.presentDays}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-destructive/10">
              <p className="text-xs text-muted-foreground">Absent</p>
              <p className="text-lg font-bold text-destructive">{attendance.absentDays}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-accent/10">
              <p className="text-xs text-muted-foreground">Late</p>
              <p className="text-lg font-bold text-accent">{attendance.lateDays}</p>
            </div>
          </div>
        </div>
      </Card>

      {student.subjects && student.subjects.length > 0 && (
        <Card className="p-4 rounded-xl bg-muted/30">
          <h4 className="text-sm font-bold text-heading mb-3">Subjects</h4>
          <div className="flex flex-wrap gap-2">
            {student.subjects.map((subject) => (
              <Badge key={subject} variant="secondary">
                {subject}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {student.assignedTeachers && student.assignedTeachers.length > 0 && (
        <Card className="p-4 rounded-xl bg-muted/30">
          <h4 className="text-sm font-bold text-heading mb-3">Assigned Teachers</h4>
          <div className="space-y-2">
            {student.assignedTeachers.map((assignment, idx) => (
              <div
                key={`${assignment.teacherId}-${assignment.subject}-${idx}`}
                className="flex items-center gap-2 p-2 rounded-lg bg-card"
              >
                <BubbleIcon size="sm" variant="green">
                  <Users size={16} weight="fill" />
                </BubbleIcon>
                <div>
                  <p className="text-sm font-semibold">{assignment.teacherName}</p>
                  <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
