import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import { BookOpen, Plus, Calendar, Users, CheckCircle, Clock } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  class: string
  dueDate: string
  status: "active" | "completed"
  submissionsCount: number
  totalStudents: number
  createdAt: string
}

interface TeacherAssignmentsProps {
  teacherId: string
  onBack: () => void
}

export default function TeacherAssignments({ teacherId, onBack }: TeacherAssignmentsProps) {
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useKV<Assignment[]>("teacher-assignments", [])

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const storedTeachers = await window.spark.kv.get<any[]>("admin-teachers-records") || []
        let teacherData = storedTeachers.find(t => t.id === teacherId)
        
        if (!teacherData) {
          const { teachers: fallbackTeachers } = await import("@/data/attendanceData")
          teacherData = fallbackTeachers.find(t => t.id === teacherId)
        }
        
        setTeacher(teacherData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading teacher data:", error)
        setTeacher(null)
        setLoading(false)
      }
    }
    
    loadTeacherData()
  }, [teacherId])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    subject: "",
    class: "",
    dueDate: ""
  })

  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.subject || !newAssignment.class || !newAssignment.dueDate) {
      toast.error("Please fill in all required fields")
      return
    }

    const assignment: Assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      status: "active",
      submissionsCount: 0,
      totalStudents: 45,
      createdAt: new Date().toISOString()
    }

    setAssignments((current) => [assignment, ...(current || [])])
    
    setNewAssignment({
      title: "",
      description: "",
      subject: "",
      class: "",
      dueDate: ""
    })
    
    setIsDialogOpen(false)
    toast.success("Assignment created successfully!")
  }

  const handleDeleteAssignment = (id: string) => {
    setAssignments((current) => (current || []).filter(a => a.id !== id))
    toast.success("Assignment deleted")
  }

  const getStatusColor = (assignment: Assignment) => {
    if (assignment.status === "completed") return "bg-green-500 text-white"
    const dueDate = new Date(assignment.dueDate)
    const today = new Date()
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilDue < 0) return "bg-red-500 text-white"
    if (daysUntilDue <= 2) return "bg-yellow-500 text-white"
    return "bg-blue-500 text-white"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-16">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <div className="text-muted-foreground">Loading assignments...</div>
          </div>
        </div>
      ) : !teacher ? (
        <div className="flex items-center justify-center min-h-screen">
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
            <Card className="p-8 bg-white/5 backdrop-blur-xl border-white/10">
              <p className="text-xl font-semibold text-destructive mb-2">Teacher not found</p>
              <p className="text-foreground/70 mb-4">Unable to load teacher data. Please try again.</p>
              <Button onClick={onBack} className="bg-primary text-primary-foreground">
                Go Back to Dashboard
              </Button>
            </Card>
          </div>
        </div>
      ) : (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-6"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </button>
        
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Assignments</h1>
            <p className="text-gray-300">Manage and track student assignments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
                <Plus size={20} weight="bold" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter assignment title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={newAssignment.subject}
                    onValueChange={(value) => setNewAssignment({ ...newAssignment, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Computer">Computer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select
                    value={newAssignment.class}
                    onValueChange={(value) => setNewAssignment({ ...newAssignment, class: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6-A">Class 6-A</SelectItem>
                      <SelectItem value="7-A">Class 7-A</SelectItem>
                      <SelectItem value="8-A">Class 8-A</SelectItem>
                      <SelectItem value="9-A">Class 9-A</SelectItem>
                      <SelectItem value="10-A">Class 10-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter assignment details"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAssignment} className="bg-primary text-primary-foreground">
                  Create Assignment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {!assignments || assignments.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Card className="p-12 text-center bg-white/5 backdrop-blur-xl border-white/10">
              <BookOpen size={64} className="mx-auto mb-4 text-gray-400" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2 text-white">No Assignments Yet</h3>
              <p className="text-gray-300 mb-4">Create your first assignment to get started</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Plus size={20} />
                Create Assignment
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-4">
            {(assignments || []).map((assignment) => {
              const submissionPercentage = (assignment.submissionsCount / assignment.totalStudents) * 100
              const dueDate = new Date(assignment.dueDate)
              const isOverdue = dueDate < new Date() && assignment.status === "active"
              
              return (
                <motion.div
                  key={assignment.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-5 bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-400/50 card-shadow hover:card-shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-white">{assignment.title}</h3>
                          <Badge className={getStatusColor(assignment)}>
                            {isOverdue ? "Overdue" : assignment.status === "completed" ? "Completed" : "Active"}
                          </Badge>
                        </div>
                        {assignment.description && (
                          <p className="text-sm text-gray-300 mb-3">{assignment.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <BookOpen size={16} />
                            <span>{assignment.subject}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <Users size={16} />
                            <span>Class {assignment.class}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <Calendar size={16} />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Submissions</span>
                        <span className="font-semibold text-white">
                          {assignment.submissionsCount} / {assignment.totalStudents}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                          style={{ width: `${submissionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                        onClick={() => toast.info("View submissions feature coming soon")}
                      >
                        <CheckCircle size={16} />
                        View Submissions
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-400 hover:bg-red-500/10 border-red-500/30"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </motion.div>
      )}
    </div>
  )
}
