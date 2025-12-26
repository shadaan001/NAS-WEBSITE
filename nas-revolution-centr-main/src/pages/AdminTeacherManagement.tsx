import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import { 
  ChalkboardTeacher, 
  Plus, 
  MagnifyingGlass, 
  Pencil, 
  Trash,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  FunnelSimple,
  ArrowLeft
} from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import GradientBackground from "@/components/school/GradientBackground"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { TeacherRecord, StudentRecord } from "@/types/admin"
import { seedTeachers } from "@/data/mockSeed"
import TeacherCard from "@/components/TeacherCard"
import TeacherForm from "@/components/TeacherForm"
import TeacherAssignModal from "@/components/TeacherAssignModal"
import CredentialModal from "@/components/CredentialModal"
import { AuthHelper } from "@/lib/useAuth"
import { supabase } from "@/lib/supabase"

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "Computer Science", "Economics", "Accountancy", "Physical Education", "Fine Arts", "Music", "History", "Political Science", "Geography", "Environmental Science", "Business Studies"]

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface AdminTeacherManagementProps {
  onBack?: () => void
}

export default function AdminTeacherManagement({ onBack }: AdminTeacherManagementProps = {}) {
  const [teachers, setTeachers] = useKV<TeacherRecord[]>("admin-teachers-records", [])
  const [students, setStudents] = useKV<StudentRecord[]>("admin-students-records", [])
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSubject, setFilterSubject] = useState<string>("all")
  const [filterDay, setFilterDay] = useState<string>("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(null)
  const [assigningTeacher, setAssigningTeacher] = useState<TeacherRecord | null>(null)
  const [deletingTeacher, setDeleteingTeacher] = useState<TeacherRecord | null>(null)
  const [credentialTeacher, setCredentialTeacher] = useState<TeacherRecord | null>(null)
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false)

  const normalizeDbTeacherRow = (row: any): TeacherRecord => ({
    id: row?.id,
    name: row?.name,
    email: row?.email,
    contactNumber: row?.contact_number ?? row?.contactNumber ?? null,
    address: row?.address ?? null,
    qualification: row?.qualification ?? null,
    experience: row?.experience ?? null,
    subjects: Array.isArray(row?.subjects) ? row.subjects : (row?.subjects ? [row.subjects] : []),
    classesAssigned: row?.classes_assigned ?? row?.classesAssigned ?? [],
    availability: Array.isArray(row?.availability) ? row.availability : [],
    photoBase64: row?.photo_base64 ?? row?.photoBase64 ?? null,
    employeeId: row?.employee_id ?? row?.employeeId ?? null,
    joiningDate: row?.joining_date ?? row?.joiningDate ?? null,
    approved: typeof row?.approved === 'boolean' ? row.approved : true,
    assignedStudentIds: row?.assigned_student_ids ?? row?.assignedStudentIds ?? [],
  })

  useEffect(() => {
    console.log("Fetching teachers...")
    const fetchTeachers = async () => {
      const { data: teachersData, error } = await supabase
        .from('teachers')
        .select('*')

      if (error) {
        console.error('Failed to fetch teachers:', error)
        return
      }

      const normalized = (teachersData || []).map((r: any) => normalizeDbTeacherRow(r))
      setTeachers(normalized)
    }
    fetchTeachers()
  }, [setTeachers])

  const teachersList = teachers || []
  const studentsList = students || []

  const filteredTeachers = teachersList.filter(teacher => {
    const q = searchQuery.toLowerCase()
    const subjects = teacher.subjects || []
    const availability = teacher.availability || []

    const matchesSearch = (
      (teacher.name || "").toLowerCase().includes(q) ||
      (teacher.email || "").toLowerCase().includes(q) ||
      subjects.some(s => (s || "").toLowerCase().includes(q))
    )

    const matchesSubject = filterSubject === "all" || subjects.includes(filterSubject)

    const matchesDay = filterDay === "all" || availability.some(a => a.day === filterDay)

    return matchesSearch && matchesSubject && matchesDay
  })

  const handleAddTeacher = (teacherData: Partial<TeacherRecord> | TeacherRecord) => {
    // TeacherForm now returns the saved, normalized teacher record from DB.
    if (!teacherData || !teacherData.name || !teacherData.email) {
      toast.error("Please fill required fields")
      return
    }

    const duplicate = teachersList.find(
      t => t.name.toLowerCase() === teacherData.name?.toLowerCase() && 
           t.contactNumber === teacherData.contactNumber
    )

    if (duplicate) {
      toast.error("Teacher with same name and contact already exists")
      return
    }

    setTeachers((current) => [...(current || []), teacherData as TeacherRecord])
    setIsAddOpen(false)
    toast.success("Teacher added successfully")
  }

  const handleUpdateTeacher = (teacherData: Partial<TeacherRecord> | TeacherRecord) => {
    if (!editingTeacher) return

    setTeachers((current) => 
      (current || []).map(t => t.id === editingTeacher.id ? { ...t, ...(teacherData as TeacherRecord) } : t)
    )
    setIsEditOpen(false)
    setEditingTeacher(null)
    toast.success("Teacher updated successfully")
  }

  const handleDeleteTeacher = async () => {
    if (!deletingTeacher) return

    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', deletingTeacher.id)

      if (error) {
        console.error('Supabase delete error:', error)
        toast.error('Failed to delete teacher')
        return
      }

      setTeachers((current) => (current || []).filter(t => t.id !== deletingTeacher.id))
      
      setStudents((current) =>
        (current || []).map(student => ({
          ...student,
          assignedTeacherIds: student.assignedTeacherIds?.filter(id => id !== deletingTeacher.id),
          assignedTeachers: (student.assignedTeachers || []).filter(t => t.teacherId !== deletingTeacher.id)
        }))
      )

      setIsDeleteConfirmOpen(false)
      setDeleteingTeacher(null)
      toast.success("Teacher deleted and removed from all student assignments")
    } catch (err) {
      console.error('Error deleting teacher:', err)
      toast.error('An unexpected error occurred while deleting')
    }
  }

  const handleToggleApproval = async (teacher: TeacherRecord) => {
    const newApprovalState = !teacher.approved
    try {
      const { error } = await supabase
        .from('teachers')
        .update({ is_active: newApprovalState })
        .eq('id', teacher.id)

      if (error) {
        console.error('Supabase update approval error:', error)
        toast.error('Failed to update approval')
        return
      }

      setTeachers((current) =>
        (current || []).map(t => t.id === teacher.id ? { ...t, approved: newApprovalState } : t)
      )
      toast.success(
        newApprovalState 
          ? `${teacher.name} approved for login access` 
          : `${teacher.name} login access revoked`
      )
    } catch (err) {
      console.error('Error toggling approval:', err)
      toast.error('An unexpected error occurred')
    }
  }

  const handleAssignStudents = (teacherId: string, studentIds: string[]) => {
    const teacher = teachersList.find(t => t.id === teacherId)
    if (!teacher) return

    const previouslyAssigned = teacher.assignedStudentIds || []
    const newlyAssigned = studentIds.filter(id => !previouslyAssigned.includes(id))
    const removed = previouslyAssigned.filter(id => !studentIds.includes(id))

    // Update DB and local state
    setTeachers((current) =>
      (current || []).map(t => t.id === teacherId ? { ...t, assignedStudentIds: studentIds } : t)
    )

    supabase.from('teachers').update({ assigned_student_ids: studentIds }).eq('id', teacherId).then(({ error }) => {
      if (error) console.error('Failed to update teacher assigned students:', error)
    })

    setStudents((current) =>
      (current || []).map(student => {
        if (newlyAssigned.includes(student.id)) {
          const updatedAssignedTeacherIds = [...(student.assignedTeacherIds || []), teacherId]
          return {
            ...student,
            assignedTeacherIds: updatedAssignedTeacherIds
          }
        }
        if (removed.includes(student.id)) {
          return {
            ...student,
            assignedTeacherIds: (student.assignedTeacherIds || []).filter(id => id !== teacherId)
          }
        }
        return student
      })
    )

    setIsAssignOpen(false)
    setAssigningTeacher(null)
    toast.success(`Students assigned to ${teacher.name}`)
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
        <BubbleIcon size="md" variant="green">
          <ChalkboardTeacher size={28} weight="fill" />
        </BubbleIcon>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Teacher Management</h1>
          <p className="text-sm text-gray-300">Manage teacher records, availability & assignments</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30">
                <Plus size={18} weight="bold" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl bg-[#1a1f3a] border-white/10 text-white backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Add New Teacher</DialogTitle>
                <DialogDescription className="text-gray-300">Add a new teacher with subjects, availability, and photo</DialogDescription>
              </DialogHeader>
              <TeacherForm 
                onSubmit={handleAddTeacher}
                onCancel={() => setIsAddOpen(false)}
              />
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          />
          <Input
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="h-10">
                <FunnelSimple size={16} className="mr-2" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={filterDay} onValueChange={setFilterDay}>
              <SelectTrigger className="h-10">
                <Clock size={16} className="mr-2" />
                <SelectValue placeholder="Filter by day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {daysOfWeek.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {teachersList.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 backdrop-blur-xl border border-white/10">
            <ChalkboardTeacher size={40} weight="fill" className="text-gray-400" />
          </div>
          <p className="text-gray-400 text-lg">
            No teachers found. Click "Add" to create your first teacher record.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredTeachers.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              layout
            >
              <TeacherCard
                teacher={teacher}
                onEdit={() => {
                  setEditingTeacher(teacher)
                  setIsEditOpen(true)
                }}
                onDelete={() => {
                  setDeleteingTeacher(teacher)
                  setIsDeleteConfirmOpen(true)
                }}
                onAssign={() => {
                  setAssigningTeacher(teacher)
                  setIsAssignOpen(true)
                }}
                onToggleApproval={() => handleToggleApproval(teacher)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTeachers.length === 0 && teachersList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 backdrop-blur-xl border border-white/10">
              <MagnifyingGlass size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">
              No teachers found matching your filters.
            </p>
          </motion.div>
        )}
      </motion.div>

      {editingTeacher && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl bg-[#1a1f3a] border-white/10 text-white backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Edit Teacher</DialogTitle>
              <DialogDescription className="text-gray-300">Update teacher information, subjects, and availability</DialogDescription>
            </DialogHeader>
            <TeacherForm 
              initialData={editingTeacher}
              onSubmit={handleUpdateTeacher}
              onCancel={() => {
                setIsEditOpen(false)
                setEditingTeacher(null)
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {assigningTeacher && (
        <TeacherAssignModal
          open={isAssignOpen}
          onOpenChange={setIsAssignOpen}
          teacher={assigningTeacher}
          students={studentsList}
          onAssign={handleAssignStudents}
        />
      )}

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="bg-[#1a1f3a] border-white/10 text-white backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Delete Teacher</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete {deletingTeacher?.name}? This will remove the teacher from all student assignments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDeleteConfirmOpen(false)
              setDeleteingTeacher(null)
            }} className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTeacher}>
              Delete Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {credentialTeacher && (
        <CredentialModal
          isOpen={isCredentialModalOpen}
          onClose={() => {
            setIsCredentialModalOpen(false)
            setCredentialTeacher(null)
          }}
          userId={credentialTeacher.id}
          userName={credentialTeacher.name}
          role="teacher"
          adminId={AuthHelper.getSession()?.userId || "ADMIN001"}
        />
      )}
      </div>
    </>
  )
}
