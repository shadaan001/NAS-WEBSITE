import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash, Upload } from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLocalDB } from "@/lib/useLocalDB"
import { toast } from "sonner"

interface TestUploaderProps {
  open: boolean
  onClose: () => void
  onSubmit: (test: any) => void
  test?: any
  teacherId: string
}

const CLASSES = [
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11 Science", "Class 11 Commerce",
  "Class 12 Science", "Class 12 Commerce"
]

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English", "Hindi", "Computer Science",
  "Accountancy", "Business Studies", "Economics",
  "Social Studies", "Geography", "History", "Political Science",
  "Physical Education", "Fine Arts", "Music"
]

export function TestUploader({ open, onClose, onSubmit, test, teacherId }: TestUploaderProps) {
  const [formData, setFormData] = useState({
    title: "",
    class: "",
    subject: "",
    date: "",
    maxMarks: "",
  })
  
  const [studentMarks, setStudentMarks] = useState<Array<{
    studentId: string
    studentName: string
    rollNumber: string
    marks: string
    grade: string
    comments: string
  }>>([])

  useEffect(() => {
    if (test) {
      setFormData({
        title: test.title || "",
        class: test.class || "",
        subject: test.subject || "",
        date: test.date || "",
        maxMarks: test.maxMarks?.toString() || "",
      })
      
      if (test.marks) {
        const marksWithStudents = test.marks.map((m: any) => {
          const student = useLocalDB.getStudent(m.studentId)
          return {
            studentId: m.studentId,
            studentName: student?.name || "Unknown",
            rollNumber: student?.rollNumber || "",
            marks: m.marks?.toString() || "",
            grade: m.grade || "",
            comments: m.comments || "",
          }
        })
        setStudentMarks(marksWithStudents)
      }
    } else {
      setFormData({
        title: "",
        class: "",
        subject: "",
        date: "",
        maxMarks: "",
      })
      setStudentMarks([])
    }
  }, [test, open])

  useEffect(() => {
    if (formData.class && !test) {
      const students = useLocalDB.getAllStudents()
        .filter(s => s.class === formData.class)
        .map(s => ({
          studentId: s.id,
          studentName: s.name,
          rollNumber: s.rollNumber,
          marks: "",
          grade: "",
          comments: "",
        }))
      setStudentMarks(students)
    }
  }, [formData.class, test])

  const calculateGrade = (marks: number, maxMarks: number): string => {
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B+"
    if (percentage >= 60) return "B"
    if (percentage >= 50) return "C"
    if (percentage >= 40) return "D"
    return "F"
  }

  const handleMarksChange = (index: number, marks: string) => {
    const newMarks = [...studentMarks]
    newMarks[index].marks = marks
    
    const marksNum = parseFloat(marks)
    const maxMarks = parseFloat(formData.maxMarks)
    
    if (!isNaN(marksNum) && !isNaN(maxMarks) && maxMarks > 0) {
      newMarks[index].grade = calculateGrade(marksNum, maxMarks)
    } else {
      newMarks[index].grade = ""
    }
    
    setStudentMarks(newMarks)
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.class || !formData.subject || !formData.date || !formData.maxMarks) {
      toast.error("Please fill in all required fields")
      return
    }

    const maxMarks = parseFloat(formData.maxMarks)
    if (isNaN(maxMarks) || maxMarks <= 0) {
      toast.error("Max marks must be a positive number")
      return
    }

    const validMarks = studentMarks
      .filter(m => m.marks && !isNaN(parseFloat(m.marks)))
      .map(m => ({
        studentId: m.studentId,
        marks: parseFloat(m.marks),
        grade: m.grade,
        comments: m.comments,
      }))

    const testData = {
      id: test?.id,
      title: formData.title,
      class: formData.class,
      subject: formData.subject,
      date: formData.date,
      maxMarks,
      teacherId,
      questionPaperURL: null,
      marks: validMarks,
    }

    onSubmit(testData)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-heading text-2xl font-bold text-primary">
            {test ? "Edit Test" : "Create New Test"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Test Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Midterm Exam - Mathematics"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMarks">Max Marks *</Label>
              <Input
                id="maxMarks"
                type="number"
                placeholder="e.g., 100"
                value={formData.maxMarks}
                onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
              />
            </div>
          </div>

          {studentMarks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Student Marks</Label>
                <p className="text-sm text-muted-foreground">{studentMarks.length} students</p>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {studentMarks.map((student, index) => (
                  <motion.div
                    key={student.studentId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="p-4 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-3 items-start">
                      <div className="col-span-3">
                        <p className="font-medium text-sm">{student.studentName}</p>
                        <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor={`marks-${student.studentId}`} className="text-xs">Marks</Label>
                        <Input
                          id={`marks-${student.studentId}`}
                          type="number"
                          placeholder="0"
                          value={student.marks}
                          onChange={(e) => handleMarksChange(index, e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label className="text-xs">Grade</Label>
                        <div className="h-8 flex items-center">
                          <span className="text-sm font-semibold text-primary">
                            {student.grade || "-"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="col-span-5">
                        <Label htmlFor={`comments-${student.studentId}`} className="text-xs">Comments</Label>
                        <Input
                          id={`comments-${student.studentId}`}
                          placeholder="Optional feedback"
                          value={student.comments}
                          onChange={(e) => {
                            const newMarks = [...studentMarks]
                            newMarks[index].comments = e.target.value
                            setStudentMarks(newMarks)
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {test ? "Update Test" : "Create Test"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
