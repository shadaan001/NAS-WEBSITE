import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MagnifyingGlass, Funnel, Download, FileArrowDown, ArrowLeft } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TestCard } from "@/components/TestCard"
import { TestUploader } from "@/components/TestUploader"
import { useLocalDB } from "@/lib/useLocalDB"
import { toast } from "sonner"
import GradientBackground from "@/components/school/GradientBackground"
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

const CLASSES = [
  "All Classes",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11 Science", "Class 11 Commerce",
  "Class 12 Science", "Class 12 Commerce"
]

const SUBJECTS = [
  "All Subjects",
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English", "Hindi", "Computer Science",
  "Accountancy", "Business Studies", "Economics",
  "Social Studies", "Geography", "History", "Political Science"
]

interface AdminTestsProps {
  adminId: string
  onBack?: () => void
}

export default function AdminTests({ adminId, onBack }: AdminTestsProps) {
  const [tests, setTests] = useState<any[]>([])
  const [filteredTests, setFilteredTests] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState("All Classes")
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [showUploader, setShowUploader] = useState(false)
  const [editingTest, setEditingTest] = useState<any>(null)
  const [deleteTestId, setDeleteTestId] = useState<string | null>(null)
  const [teachers, setTeachers] = useState<any[]>([])

  useEffect(() => {
    loadTests()
    loadTeachers()
  }, [])

  useEffect(() => {
    filterTests()
  }, [tests, searchQuery, selectedClass, selectedSubject])

  const loadTests = () => {
    const allTests = useLocalDB.getAllTests()
    const testsWithTeachers = allTests.map(test => {
      const teacher = useLocalDB.getTeacher(test.teacherId)
      return {
        ...test,
        teacherName: teacher?.name || "Unknown Teacher"
      }
    })
    setTests(testsWithTeachers)
  }

  const loadTeachers = () => {
    const allTeachers = useLocalDB.getAllTeachers()
    setTeachers(allTeachers)
  }

  const filterTests = () => {
    let filtered = [...tests]

    if (searchQuery) {
      filtered = filtered.filter(test =>
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.class.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedClass !== "All Classes") {
      filtered = filtered.filter(test => test.class === selectedClass)
    }

    if (selectedSubject !== "All Subjects") {
      filtered = filtered.filter(test => test.subject === selectedSubject)
    }

    filtered.sort((a, b) => b.date.localeCompare(a.date))
    setFilteredTests(filtered)
  }

  const handleCreateTest = () => {
    setEditingTest(null)
    setShowUploader(true)
  }

  const handleEditTest = (test: any) => {
    setEditingTest(test)
    setShowUploader(true)
  }

  const handleSubmitTest = (testData: any) => {
    try {
      if (testData.id) {
        useLocalDB.updateTest(testData.id, testData)
        toast.success("Test updated successfully")
      } else {
        useLocalDB.addTest(testData)
        toast.success("Test created successfully")
      }
      loadTests()
      setShowUploader(false)
      setEditingTest(null)
    } catch (error: any) {
      toast.error(error.message || "Failed to save test")
    }
  }

  const handleDeleteTest = (testId: string) => {
    setDeleteTestId(testId)
  }

  const confirmDelete = () => {
    if (deleteTestId) {
      try {
        useLocalDB.deleteTest(deleteTestId)
        toast.success("Test deleted successfully")
        loadTests()
      } catch (error: any) {
        toast.error(error.message || "Failed to delete test")
      }
      setDeleteTestId(null)
    }
  }

  const handleExportTest = (testId: string) => {
    try {
      const csv = useLocalDB.exportTestMarksToCSV(testId)
      const test = tests.find(t => t.id === testId)
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${test?.title.replace(/\s+/g, "_")}_marks.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Marks exported successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to export marks")
    }
  }

  const handleExportAll = () => {
    try {
      const allData = filteredTests.map(test => ({
        title: test.title,
        class: test.class,
        subject: test.subject,
        date: test.date,
        maxMarks: test.maxMarks,
        studentsMarked: test.marks?.length || 0,
        averageMarks: test.marks?.length > 0
          ? Math.round(test.marks.reduce((sum: number, m: any) => sum + m.marks, 0) / test.marks.length)
          : 0
      }))

      const headers = ["Title", "Class", "Subject", "Date", "Max Marks", "Students Marked", "Average Marks"]
      const rows = allData.map(d => [
        d.title,
        d.class,
        d.subject,
        d.date,
        d.maxMarks,
        d.studentsMarked,
        d.averageMarks
      ])

      const csv = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `all_tests_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("All tests exported successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to export tests")
    }
  }

  return (
    <>
      <GradientBackground />
      <div className="min-h-screen p-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
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
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Tests Management</h1>
              <p className="text-gray-300">Create, manage, and track student test results</p>
            </div>
          </div>
          <Button
            onClick={handleCreateTest}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30"
          >
            <Plus size={20} className="mr-2" />
            Create Test
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search tests by title, subject, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-48">
              <Funnel size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLASSES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-48">
              <Funnel size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleExportAll}
            className="whitespace-nowrap"
          >
            <FileArrowDown size={18} className="mr-2" />
            Export All
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between text-sm text-muted-foreground"
        >
          <p>
            Showing {filteredTests.length} of {tests.length} tests
          </p>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {filteredTests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg mb-4">No tests found</p>
              <Button onClick={handleCreateTest} variant="outline">
                <Plus size={18} className="mr-2" />
                Create Your First Test
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TestCard
                    test={test}
                    onEdit={handleEditTest}
                    onDelete={handleDeleteTest}
                    onExport={handleExportTest}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TestUploader
        open={showUploader}
        onClose={() => {
          setShowUploader(false)
          setEditingTest(null)
        }}
        onSubmit={handleSubmitTest}
        test={editingTest}
        teacherId={adminId}
      />

      <AlertDialog open={!!deleteTestId} onOpenChange={() => setDeleteTestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this test? This will remove all student marks and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  )
}
