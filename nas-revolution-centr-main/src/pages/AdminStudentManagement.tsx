import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import { 
  Users, 
  Plus, 
  MagnifyingGlass, 
  Pencil, 
  Trash,
  User,
  Phone,
  EnvelopeSimple,
  MapPin,
  Book,
  ChalkboardTeacher,
  CalendarCheck,
  Image as ImageIcon,
  ArrowLeft,
  Key,
  CheckCircle
} from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import GradientBackground from "@/components/school/GradientBackground"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { StudentRecord, TeacherRecord } from "@/types/admin"
import { Progress } from "@/components/ui/progress"
import { calculateAttendanceSummary } from "@/data/attendanceData"
import type { AttendanceRecord } from "@/types"
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase"


const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11 Science", "Class 11 Commerce", "Class 12 Science", "Class 12 Commerce"]
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "Computer Science"]

interface AdminStudentManagementProps {
  onBack?: () => void
}

export default function AdminStudentManagement({ onBack }: AdminStudentManagementProps = {}) {
  const [students, setStudents] = useKV<StudentRecord[]>("admin-students-records", [])
  const [teachers, setTeachers] = useKV<TeacherRecord[]>("admin-teachers-records", [])
  const [attendance] = useKV<AttendanceRecord[]>("admin-attendance-records", [])
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  
  const [formData, setFormData] = useState({
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
    subjects: [] as string[],
    assignedTeachers: [] as { teacherId: string; teacherName: string; subject: string }[],
    assignedTeacherIds: [] as string[],
    username: "",
    password: "",
    hasCredentials: false
  })

  const resetFormData = () => {
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
      username: "",
      password: "",
      hasCredentials: false
    })
  }

  const studentsList = students || []
  const teachersList = teachers || []

  const filteredStudents = studentsList.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.includes(searchQuery)
  )

  // Function to fetch all students from the database
  const fetchStudents = async () => {
    const { data: students, error } = await supabase.from("Students").select("*");
    if (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students.");
      return;
    }
    console.log("Fetched students:", students);
    setStudents(students || []);
  };

  // Function to fetch all teachers from the database
  const fetchTeachers = async () => {
    const { data: teachers, error } = await supabase.from("teachers").select("*");
    if (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to fetch teachers.");
      return;
    }
    console.log("Fetched teachers:", teachers);
    setTeachers(teachers || []);
  };

  // Call fetchStudents and fetchTeachers on component mount
  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  const handleEdit = async () => {
    if (!editingStudent) return

    const sanitizedStudent = {
      ...editingStudent,
      subjects: Array.isArray(editingStudent.subjects) ? editingStudent.subjects : [],
      assignedTeachers: Array.isArray(editingStudent.assignedTeachers) ? editingStudent.assignedTeachers : [],
      assignedTeacherIds: Array.isArray(editingStudent.assignedTeacherIds) ? editingStudent.assignedTeacherIds : []
    }

    console.log("Updating student:", sanitizedStudent)

    const { data, error } = await supabase
      .from("Students")
      .update(sanitizedStudent)
      .eq("id", editingStudent.id)
      .select()

    if (error) {
      console.error("Error updating student:", error)
      toast.error("Failed to update student.")
      return
    }

    console.log("Student updated successfully:", data)
    setStudents((current) =>
      (current || []).map(student =>
        student.id === editingStudent.id ? { ...student, ...sanitizedStudent } : student
      )
    )
    setIsEditOpen(false)
    setEditingStudent(null)
    toast.success("Student updated successfully")
    
    if (sanitizedStudent.hasCredentials && sanitizedStudent.username) {
      toast.success("Login credentials are active for this student", { duration: 5000 })
    }
  }

  const handleDelete = async (id: string) => {
    console.log("Deleting student with ID:", id)

    const { error } = await supabase.from("Students").delete().eq("id", id)

    if (error) {
      console.error("Error deleting student:", error)
      toast.error("Failed to delete student.")
      return
    }

    console.log("Student deleted successfully with ID:", id)
    setStudents((current) => (current || []).filter(student => student.id !== id))
    toast.success("Student deleted successfully")
  }

  const handleAddSubject = (subject: string) => {
    if (editingStudent) {
      setEditingStudent({
        ...editingStudent,
        subjects: [...(editingStudent.subjects || []), subject]
      })
    } else {
      setFormData(prev => ({
        ...prev,
        subjects: [...(prev.subjects || []), subject]
      }))
    }
  }

  const handleRemoveSubject = (subject: string) => {
    if (editingStudent) {
      setEditingStudent({
        ...editingStudent,
        subjects: (editingStudent.subjects || []).filter(s => s !== subject)
      })
    } else {
      setFormData(prev => ({
        ...prev,
        subjects: (prev.subjects || []).filter(s => s !== subject)
      }))
    }
  }

  const handleAssignTeacher = (teacherId: string, subject: string) => {
    const teacher = teachersList.find(t => t.id === teacherId)
    if (!teacher) return

    const assignment = {
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject
    }

    if (editingStudent) {
      const currentTeacherIds = editingStudent.assignedTeacherIds || []
      const updatedTeacherIds = currentTeacherIds.includes(teacherId) 
        ? currentTeacherIds 
        : [...currentTeacherIds, teacherId]
      
      setEditingStudent({
        ...editingStudent,
        assignedTeachers: [...(editingStudent.assignedTeachers || []), assignment],
        assignedTeacherIds: updatedTeacherIds
      })
    } else {
      const currentTeacherIds = formData.assignedTeacherIds || []
      const updatedTeacherIds = currentTeacherIds.includes(teacherId) 
        ? currentTeacherIds 
        : [...currentTeacherIds, teacherId]
      
      setFormData(prev => ({
        ...prev,
        assignedTeachers: [...(prev.assignedTeachers || []), assignment],
        assignedTeacherIds: updatedTeacherIds
      }))
    }
  }

  const handleRemoveTeacher = (teacherId: string, subject: string) => {
    if (editingStudent) {
      const updatedAssignments = (editingStudent.assignedTeachers || []).filter(
        a => !(a.teacherId === teacherId && a.subject === subject)
      )
      
      const remainingTeacherIds = Array.from(new Set(updatedAssignments.map(a => a.teacherId)))
      
      setEditingStudent({
        ...editingStudent,
        assignedTeachers: updatedAssignments,
        assignedTeacherIds: remainingTeacherIds
      })
    } else {
      const updatedAssignments = (formData.assignedTeachers || []).filter(
        a => !(a.teacherId === teacherId && a.subject === subject)
      )
      
      const remainingTeacherIds = Array.from(new Set(updatedAssignments.map(a => a.teacherId)))
      
      setFormData(prev => ({
        ...prev,
        assignedTeachers: updatedAssignments,
        assignedTeacherIds: remainingTeacherIds
      }))
    }
  }

  const getStudentAttendance = (studentId: string) => {
    const studentAttendance = attendance?.filter(a => a.studentId === studentId) || []
    return calculateAttendanceSummary(studentAttendance)
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
          <Users size={28} weight="fill" />
        </BubbleIcon>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Student Management</h1>
          <p className="text-sm text-gray-300">Manage student records and assignments</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30">
                <Plus size={18} weight="bold" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#1a1f3a] border-white/10 text-white backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Add New Student</DialogTitle>
              </DialogHeader>
              <StudentForm 
                data={formData}
                onChange={setFormData}
                teachers={teachersList}
                onAddSubject={handleAddSubject}
                onRemoveSubject={handleRemoveSubject}
                onAssignTeacher={handleAssignTeacher}
                onRemoveTeacher={handleRemoveTeacher}
                isEditMode={false}
                setStudents={setStudents}
                supabase={supabase}
                toast={toast}
                onClose={() => setIsAddOpen(false)}
                resetForm={resetFormData}
              />

            </DialogContent>
          </Dialog>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <MagnifyingGlass 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          />
          <Input
            placeholder="Search by name, class, or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {filteredStudents.map((student, idx) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none" />
            <Card className="relative p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 shadow-2xl">
              <div className="flex items-start gap-3">
                <BubbleIcon size="md" variant="blue">
                  <User size={24} weight="fill" />
                </BubbleIcon>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{student.name}</h3>
                        {student.hasCredentials && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/20 border border-success/30">
                            <CheckCircle size={12} weight="fill" className="text-success" />
                            <span className="text-[10px] font-semibold text-success">Login Active</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">{student.class} • Roll {student.rollNumber}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedStudent(student)
                          setIsViewOpen(true)
                        }}
                        className="hover:bg-white/10"
                      >
                        <Book size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingStudent(student)
                          setIsEditOpen(true)
                        }}
                        className="hover:bg-white/10"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(student.id)}
                        className="hover:bg-white/10"
                      >
                        <Trash size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {student.email && (
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <EnvelopeSimple size={14} />
                        <span>{student.email}</span>
                      </div>
                    )}
                    {student.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Phone size={14} />
                        <span>{student.phone}</span>
                      </div>
                    )}
                  </div>

                  {(student.subjects || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(student.subjects || []).slice(0, 3).map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20">
                          {subject}
                        </Badge>
                      ))}
                      {(student.subjects || []).length > 3 && (
                        <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                          +{(student.subjects || []).length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 backdrop-blur-xl border border-white/10">
              <Users size={40} weight="fill" className="text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">
              {searchQuery ? "No students found matching your search" : "No students added yet"}
            </p>
          </motion.div>
        )}
      </motion.div>

      {editingStudent && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#1a1f3a] border-white/10 text-white backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Edit Student</DialogTitle>
            </DialogHeader>
            <StudentForm 
              data={editingStudent}
              onChange={setEditingStudent}
              teachers={teachersList}
              onAddSubject={handleAddSubject}
              onRemoveSubject={handleRemoveSubject}
              onAssignTeacher={handleAssignTeacher}
              onRemoveTeacher={handleRemoveTeacher}
              isEditMode={true}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white">Cancel</Button>
              <Button onClick={handleEdit} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedStudent && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#1a1f3a] border-white/10 text-white backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Student Details</DialogTitle>
            </DialogHeader>
            <StudentDetails 
              student={selectedStudent} 
              attendance={getStudentAttendance(selectedStudent.id)}
            />
          </DialogContent>
        </Dialog>
      )}
      </div>
    </>
  )
}

interface StudentFormProps {
  data: Partial<StudentRecord>
  onChange: (data: any) => void
  teachers: TeacherRecord[]
  onAddSubject: (subject: string) => void
  onRemoveSubject: (subject: string) => void
  onAssignTeacher: (teacherId: string, subject: string) => void
  onRemoveTeacher: (teacherId: string, subject: string) => void
  isEditMode?: boolean
  setStudents?: (updater: (prev: StudentRecord[]) => StudentRecord[]) => void
  supabase?: any
  toast?: any
  onClose?: () => void
  resetForm?: () => void
}

function StudentForm({ data, onChange, teachers, onAddSubject, onRemoveSubject, onAssignTeacher, onRemoveTeacher, isEditMode, setStudents, supabase, toast, onClose, resetForm }: StudentFormProps) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");
  const [currentTab, setCurrentTab] = useState("basic"); // Track the current tab

  const handleNext = () => {
    if (currentTab === "basic") {
      setCurrentTab("subjects");
    } else if (currentTab === "subjects") {
      setCurrentTab("teachers");
    }
  };

  const handleAddStudent = async () => {
    if (!data.name || !data.class || !data.rollNumber) {
      toast?.error("Please fill required fields")
      return
    }

     const newStudentId = uuidv4()
    
    const newStudent: StudentRecord = {
      id: newStudentId,
      name: data.name!,
      class: data.class!,
      rollNumber: data.rollNumber!,
      phone: data.phone || "",
      address: data.address || "",
      email: data.email || "",
      subjects: data.subjects || [],
      assignedTeachers: data.assignedTeachers || [],
      assignedTeacherIds: data.assignedTeacherIds || [],
      admissionDate: new Date().toISOString().split('T')[0],
      username: data.username || "",
      hasCredentials: false,
      dateOfBirth: data.dateOfBirth,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      bloodGroup: data.bloodGroup
    }

    console.log("Adding new student:", newStudent)

    const { data: insertedData, error } = await supabase
      .from("Students")
      .insert([newStudent])
      .select()

    if (error) {
      console.error("Error adding student:", error)
      toast?.error("Failed to add student.")
      return
    }

    console.log("Student added successfully:", insertedData)
    setStudents?.((current) => [...(current || []), ...(insertedData || [])])
    toast?.success("Student added successfully.")

    resetForm?.()
    onClose?.()
  }

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="subjects">Subjects</TabsTrigger>
        <TabsTrigger value="teachers">Teachers</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={data.name || ""}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              placeholder="Student name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class">Class *</Label>
            <Select value={data.class || ""} onValueChange={(value) => onChange({ ...data, class: value })}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number *</Label>
            <Input
              id="rollNumber"
              value={data.rollNumber || ""}
              onChange={(e) => onChange({ ...data, rollNumber: e.target.value })}
              placeholder="e.g., 15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              placeholder="student@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone || ""}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={data.dateOfBirth || ""}
              onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Input
              id="bloodGroup"
              value={data.bloodGroup || ""}
              onChange={(e) => onChange({ ...data, bloodGroup: e.target.value })}
              placeholder="e.g., O+"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={data.address || ""}
              onChange={(e) => onChange({ ...data, address: e.target.value })}
              placeholder="Full address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianName">Guardian Name</Label>
            <Input
              id="guardianName"
              value={data.guardianName || ""}
              onChange={(e) => onChange({ ...data, guardianName: e.target.value })}
              placeholder="Parent/Guardian name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianPhone">Guardian Phone</Label>
            <Input
              id="guardianPhone"
              value={data.guardianPhone || ""}
              onChange={(e) => onChange({ ...data, guardianPhone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="subjects" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label>Add Subject</Label>
          <div className="flex gap-2">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.filter(s => !data.subjects?.includes(s)).map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={() => {
                if (selectedSubject) {
                  onAddSubject(selectedSubject)
                  setSelectedSubject("")
                }
              }}
              disabled={!selectedSubject}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Assigned Subjects</Label>
          <div className="flex flex-wrap gap-2">
            {data.subjects?.map((subject) => (
              <Badge key={subject} variant="secondary" className="gap-2">
                {subject}
                <button
                  type="button"
                  onClick={() => onRemoveSubject(subject)}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
            {(!data.subjects || data.subjects.length === 0) && (
              <p className="text-sm text-muted-foreground">No subjects assigned</p>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="teachers" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label>Assign Teacher</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={teacherSubject} onValueChange={setTeacherSubject}>
              <SelectTrigger>
                <SelectValue placeholder="For subject" />
              </SelectTrigger>
              <SelectContent>
                {data.subjects?.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={() => {
              if (selectedTeacher && teacherSubject) {
                onAssignTeacher(selectedTeacher, teacherSubject)
                setSelectedTeacher("")
                setTeacherSubject("")
              }
            }}
            disabled={!selectedTeacher || !teacherSubject}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            Assign Teacher
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Assigned Teachers</Label>
          <div className="space-y-2">
            {data.assignedTeachers?.map((assignment, idx) => (
              <div key={`${assignment.teacherId}-${assignment.subject}-${idx}`} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div className="flex items-center gap-2">
                  <BubbleIcon size="sm" variant="green">
                    <ChalkboardTeacher size={16} weight="fill" />
                  </BubbleIcon>
                  <div>
                    <p className="text-sm font-semibold">{assignment.teacherName}</p>
                    <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveTeacher(assignment.teacherId, assignment.subject)}
                >
                  <Trash size={14} className="text-destructive" />
                </Button>
              </div>
            ))}
            {(!data.assignedTeachers || data.assignedTeachers.length === 0) && (
              <p className="text-sm text-muted-foreground">No teachers assigned</p>
            )}
          </div>
        </div>
      </TabsContent>

      <div className="flex justify-end mt-4">
        {currentTab !== "teachers" ? (
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            Next
          </Button>
        ) : (
          !isEditMode && (
            <Button
              onClick={handleAddStudent}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
            >
              Add Student
            </Button>
          )
        )}
      </div>
    </Tabs>
  )
}

function StudentDetails({ student, attendance }: { student: StudentRecord; attendance: any }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <BubbleIcon size="lg" variant="blue">
          <User size={32} weight="fill" />
        </BubbleIcon>
        <div>
          <h3 className="text-lg font-bold text-white">{student.name}</h3>
          <p className="text-sm text-gray-300">{student.class} • Roll {student.rollNumber}</p>
        </div>
      </div>

      {student.hasCredentials && (
        <Card className="p-4 rounded-xl bg-success/10 backdrop-blur-xl border border-success/20">
          <div className="flex items-start gap-3">
            <BubbleIcon size="sm" variant="green">
              <Key size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-2">Login Credentials</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300">Username:</span>
                  <span className="text-sm font-semibold text-white">{student.username}</span>
                </div>
                <p className="text-xs text-gray-400">Password was set by admin</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h4 className="text-sm font-bold text-white mb-3">Contact Information</h4>
        <div className="space-y-2">
          {student.email && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <EnvelopeSimple size={16} className="text-gray-400" />
              <span>{student.email}</span>
            </div>
          )}
          {student.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Phone size={16} className="text-gray-400" />
              <span>{student.phone}</span>
            </div>
          )}
          {student.address && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin size={16} className="text-gray-400" />
              <span>{student.address}</span>
            </div>
          )}
        </div>
      </Card>

      {student.guardianName && (
        <Card className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h4 className="text-sm font-bold text-white mb-3">Guardian Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <User size={16} className="text-gray-400" />
              <span>{student.guardianName}</span>
            </div>
            {student.guardianPhone && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone size={16} className="text-gray-400" />
                <span>{student.guardianPhone}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h4 className="text-sm font-bold text-white mb-3">Attendance Summary</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Overall Attendance</span>
            <span className="text-lg font-bold text-white">{attendance.percentage}%</span>
          </div>
          <Progress value={attendance.percentage} className="h-2" />
          
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center p-2 rounded-lg bg-secondary/10">
              <p className="text-xs text-gray-300">Present</p>
              <p className="text-lg font-bold text-secondary">{attendance.presentDays}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-destructive/10">
              <p className="text-xs text-gray-300">Absent</p>
              <p className="text-lg font-bold text-destructive">{attendance.absentDays}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-accent/10">
              <p className="text-xs text-gray-300">Late</p>
              <p className="text-lg font-bold text-accent">{attendance.lateDays}</p>
            </div>
          </div>
        </div>
      </Card>

      {(student.subjects || []).length > 0 && (
        <Card className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h4 className="text-sm font-bold text-white mb-3">Subjects</h4>
          <div className="flex flex-wrap gap-2">
            {(student.subjects || []).map((subject) => (
              <Badge key={subject} variant="secondary">
                {subject}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {(student.assignedTeachers || []).length > 0 && (
        <Card className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h4 className="text-sm font-bold text-white mb-3">Assigned Teachers</h4>
          <div className="space-y-2">
            {(student.assignedTeachers || []).map((assignment, idx) => (
              <div key={`${assignment.teacherId}-${assignment.subject}-${idx}`} className="flex items-center gap-2 p-2 rounded-lg bg-card">
                <BubbleIcon size="sm" variant="green">
                  <ChalkboardTeacher size={16} weight="fill" />
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
