import { useState, useEffect } from "react"
import { ArrowLeft, Trash, Pencil, Download, MagnifyingGlass, Play } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { LectureService } from "@/services/lectureService"
import { CourseService } from "@/services/courseService"
import { Lecture, Course } from "@/types"
import { motion } from "framer-motion"

interface ManageLecturesPageProps {
  onBack: () => void
}

export default function ManageLecturesPage({ onBack }: ManageLecturesPageProps) {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCourse, setFilterCourse] = useState<string>("all")
  const [filterSubject, setFilterSubject] = useState<string>("all")
  const [filterTeacher, setFilterTeacher] = useState<string>("all")
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [lectureToDelete, setLectureToDelete] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterLecturesData()
  }, [lectures, searchQuery, filterCourse, filterSubject, filterTeacher])

  const loadData = () => {
    const allLectures = LectureService.getAllLectures()
    const allCourses = CourseService.getAllCourses()
    setLectures(allLectures)
    setCourses(allCourses)
  }

  const filterLecturesData = () => {
    let filtered = [...lectures]

    if (filterCourse !== "all") {
      filtered = filtered.filter((l) => l.courseId === filterCourse)
    }

    if (filterSubject !== "all") {
      filtered = filtered.filter((l) => l.subject === filterSubject)
    }

    if (filterTeacher !== "all") {
      filtered = filtered.filter((l) => l.teacherId === filterTeacher)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.teacherName.toLowerCase().includes(query)
      )
    }

    setFilteredLectures(filtered)
  }

  const getUniqueSubjects = () => {
    return Array.from(new Set(lectures.map((l) => l.subject)))
  }

  const getUniqueTeachers = () => {
    return Array.from(
      new Set(lectures.map((l) => ({ id: l.teacherId, name: l.teacherName })))
    ).filter((t, i, arr) => arr.findIndex((a) => a.id === t.id) === i)
  }

  const handleEditClick = (lecture: Lecture) => {
    setEditingLecture(lecture)
    setEditTitle(lecture.title)
    setEditDescription(lecture.description)
    setIsEditDialogOpen(true)
  }

  const handleEditSave = () => {
    if (!editingLecture) return

    try {
      LectureService.updateLecture(editingLecture.id, {
        title: editTitle,
        description: editDescription,
      })

      toast.success("Lecture updated successfully")
      loadData()
      setIsEditDialogOpen(false)
      setEditingLecture(null)
    } catch (error) {
      toast.error("Failed to update lecture")
    }
  }

  const handleDeleteClick = (id: string) => {
    setLectureToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!lectureToDelete) return

    try {
      LectureService.deleteLecture(lectureToDelete)
      toast.success("Lecture deleted successfully")
      loadData()
      setIsDeleteDialogOpen(false)
      setLectureToDelete(null)
    } catch (error) {
      toast.error("Failed to delete lecture")
    }
  }

  const handleExportCSV = () => {
    try {
      const csv = LectureService.exportToCSV()
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `lectures_export_${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success("Lectures exported to CSV")
    } catch (error) {
      toast.error("Failed to export lectures")
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text">🎬 Manage Lectures</h1>
              <p className="text-muted-foreground mt-2">
                View, edit, and manage all lectures across courses
              </p>
            </div>
            <Button onClick={handleExportCSV} variant="outline" className="glass">
              <Download size={20} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <MagnifyingGlass
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={20}
                    />
                    <Input
                      placeholder="Search lectures..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="glass pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {getUniqueSubjects().map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Teacher</Label>
                  <Select value={filterTeacher} onValueChange={setFilterTeacher}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="All Teachers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teachers</SelectItem>
                      {getUniqueTeachers().map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>Total: {lectures.length} lectures</span>
                <span>•</span>
                <span>Showing: {filteredLectures.length} lectures</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLectures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No lectures found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLectures.map((lecture) => (
                      <TableRow key={lecture.id}>
                        <TableCell className="font-medium">{lecture.courseName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{lecture.subject}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={lecture.title}>
                            {lecture.title}
                          </div>
                        </TableCell>
                        <TableCell>{lecture.teacherName}</TableCell>
                        <TableCell>
                          {new Date(lecture.uploadDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{lecture.views || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditClick(lecture)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(lecture.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Edit Lecture</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="glass"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="glass min-h-[100px]"
              />
            </div>

            {editingLecture && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Course: {editingLecture.courseName}</p>
                <p>Subject: {editingLecture.subject}</p>
                <p>Teacher: {editingLecture.teacherName}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lecture</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lecture? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
