import { useState } from "react"
import { motion } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import { BookOpen, Plus, Trash, Users, ChalkboardTeacher } from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { ClassRecord, SubjectRecord, TeacherRecord, StudentRecord } from "@/types/admin"

export default function AdminClassManagement() {
  const [classes, setClasses] = useKV<ClassRecord[]>("admin-class-records", [])
  const [subjects, setSubjects] = useKV<SubjectRecord[]>("admin-subject-records", [])
  const [teachers] = useKV<TeacherRecord[]>("admin-teachers-records", [])
  const [students] = useKV<StudentRecord[]>("admin-students-records", [])
  
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false)
  
  const [classFormData, setClassFormData] = useState({
    name: "",
    section: ""
  })

  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    code: "",
    description: ""
  })

  const classList = classes || []
  const subjectsList = subjects || []
  const teachersList = teachers || []
  const studentsList = students || []

  const handleAddClass = () => {
    if (!classFormData.name) {
      toast.error("Please enter class name")
      return
    }

    const newClass: ClassRecord = {
      id: `CLS${String(classList.length + 1).padStart(3, '0')}`,
      ...classFormData,
      subjects: [],
      assignedTeachers: [],
      studentCount: studentsList.filter(s => s.class === classFormData.name).length
    }

    setClasses((current) => [...(current || []), newClass])
    setClassFormData({ name: "", section: "" })
    setIsAddClassOpen(false)
    toast.success("Class added successfully")
  }

  const handleAddSubject = () => {
    if (!subjectFormData.name || !subjectFormData.code) {
      toast.error("Please fill required fields")
      return
    }

    const newSubject: SubjectRecord = {
      id: `SUB${String(subjectsList.length + 1).padStart(3, '0')}`,
      ...subjectFormData,
      classes: [],
      assignedTeachers: []
    }

    setSubjects((current) => [...(current || []), newSubject])
    setSubjectFormData({ name: "", code: "", description: "" })
    setIsAddSubjectOpen(false)
    toast.success("Subject added successfully")
  }

  const handleDeleteClass = (id: string) => {
    setClasses((current) => (current || []).filter(c => c.id !== id))
    toast.success("Class deleted")
  }

  const handleDeleteSubject = (id: string) => {
    setSubjects((current) => (current || []).filter(s => s.id !== id))
    toast.success("Subject deleted")
  }

  const handleAssignTeacherToSubject = (subjectId: string, teacherId: string) => {
    setSubjects((current) =>
      (current || []).map(sub => {
        if (sub.id === subjectId) {
          const currentTeachers = sub.assignedTeachers || []
          if (!currentTeachers.includes(teacherId)) {
            return { ...sub, assignedTeachers: [...currentTeachers, teacherId] }
          }
        }
        return sub
      })
    )
    toast.success("Teacher assigned to subject")
  }

  return (
    <div className="pb-24 px-4 pt-16 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-2"
      >
        <BubbleIcon size="md" variant="orange">
          <BookOpen size={28} weight="fill" />
        </BubbleIcon>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Class & Subject Management</h1>
          <p className="text-sm text-gray-300">Organize classes and subjects</p>
        </div>
      </motion.div>

      <Tabs defaultValue="classes" className="animate-fade-in">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30">
                  <Plus size={18} weight="bold" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1f3a] border-white/10 text-white backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Add New Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="className">Class Name *</Label>
                    <Input
                      id="className"
                      value={classFormData.name}
                      onChange={(e) => setClassFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Class 10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section (Optional)</Label>
                    <Input
                      id="section"
                      value={classFormData.section}
                      onChange={(e) => setClassFormData(prev => ({ ...prev, section: e.target.value }))}
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddClass} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">Add Class</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {classList.map((cls, idx) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-4 rounded-2xl card-shadow">
                  <div className="flex items-start gap-3">
                    <BubbleIcon size="md" variant="blue">
                      <Users size={24} weight="fill" />
                    </BubbleIcon>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-foreground">
                            {cls.name}{cls.section && ` - ${cls.section}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {cls.studentCount} student{cls.studentCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClass(cls.id)}
                        >
                          <Trash size={16} className="text-destructive" />
                        </Button>
                      </div>

                      {cls.subjects.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1.5">Subjects:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {cls.subjects.map((subject) => (
                              <Badge key={subject} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {cls.assignedTeachers && cls.assignedTeachers.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1.5">Teachers:</p>
                          <div className="space-y-1">
                            {cls.assignedTeachers.map((assignment, idx) => {
                              const teacher = teachersList.find(t => t.id === assignment.teacherId)
                              return (
                                <div key={idx} className="text-xs flex items-center gap-1.5">
                                  <ChalkboardTeacher size={12} className="text-muted-foreground" />
                                  <span>{teacher?.name} - {assignment.subject}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {classList.length === 0 && (
              <Card className="p-8 rounded-2xl card-shadow">
                <div className="text-center">
                  <BubbleIcon size="lg" variant="blue" className="mx-auto mb-3">
                    <Users size={32} weight="fill" />
                  </BubbleIcon>
                  <p className="text-sm text-muted-foreground">No classes added yet</p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={18} weight="bold" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subjectName">Subject Name *</Label>
                    <Input
                      id="subjectName"
                      value={subjectFormData.name}
                      onChange={(e) => setSubjectFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subjectCode">Subject Code *</Label>
                    <Input
                      id="subjectCode"
                      value={subjectFormData.code}
                      onChange={(e) => setSubjectFormData(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="e.g., MATH101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={subjectFormData.description}
                      onChange={(e) => setSubjectFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddSubject}>Add Subject</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {subjectsList.map((subject, idx) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-4 rounded-2xl card-shadow">
                  <div className="flex items-start gap-3">
                    <BubbleIcon size="md" variant="green">
                      <BookOpen size={24} weight="fill" />
                    </BubbleIcon>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-foreground">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">Code: {subject.code}</p>
                          {subject.description && (
                            <p className="text-xs text-muted-foreground mt-1">{subject.description}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSubject(subject.id)}
                        >
                          <Trash size={16} className="text-destructive" />
                        </Button>
                      </div>

                      {subject.assignedTeachers && subject.assignedTeachers.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1.5">Assigned Teachers:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {subject.assignedTeachers.map((teacherId) => {
                              const teacher = teachersList.find(t => t.id === teacherId)
                              return (
                                <Badge key={teacherId} variant="secondary" className="text-xs">
                                  {teacher?.name}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <AssignTeacherToSubject
                          subjectId={subject.id}
                          teachers={teachersList}
                          assignedTeachers={subject.assignedTeachers || []}
                          onAssign={handleAssignTeacherToSubject}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {subjectsList.length === 0 && (
              <Card className="p-8 rounded-2xl card-shadow">
                <div className="text-center">
                  <BubbleIcon size="lg" variant="green" className="mx-auto mb-3">
                    <BookOpen size={32} weight="fill" />
                  </BubbleIcon>
                  <p className="text-sm text-muted-foreground">No subjects added yet</p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AssignTeacherToSubject({ 
  subjectId, 
  teachers, 
  assignedTeachers,
  onAssign 
}: { 
  subjectId: string
  teachers: TeacherRecord[]
  assignedTeachers: string[]
  onAssign: (subjectId: string, teacherId: string) => void
}) {
  const [selectedTeacher, setSelectedTeacher] = useState("")

  const availableTeachers = teachers.filter(t => !assignedTeachers.includes(t.id))

  if (availableTeachers.length === 0) return null

  return (
    <div className="flex gap-2">
      <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Assign teacher" />
        </SelectTrigger>
        <SelectContent>
          {availableTeachers.map(teacher => (
            <SelectItem key={teacher.id} value={teacher.id}>
              {teacher.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        onClick={() => {
          if (selectedTeacher) {
            onAssign(subjectId, selectedTeacher)
            setSelectedTeacher("")
          }
        }}
        disabled={!selectedTeacher}
      >
        <Plus size={14} />
      </Button>
    </div>
  )
}
