import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MagnifyingGlass, X, User, CheckCircle } from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TeacherRecord, StudentRecord } from "@/types/admin"

interface TeacherAssignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacher: TeacherRecord
  students: StudentRecord[]
  onAssign: (teacherId: string, studentIds: string[]) => void
}

export default function TeacherAssignModal({
  open,
  onOpenChange,
  teacher,
  students,
  onAssign,
}: TeacherAssignModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    teacher.assignedStudentIds || []
  )

  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [students, searchQuery])

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId)
      } else {
        return [...prev, studentId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([])
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id))
    }
  }

  const handleSave = () => {
    onAssign(teacher.id, selectedStudentIds)
  }

  const handleCancel = () => {
    setSelectedStudentIds(teacher.assignedStudentIds || [])
    onOpenChange(false)
  }

  const newlyAssigned = selectedStudentIds.filter(
    id => !(teacher.assignedStudentIds || []).includes(id)
  ).length

  const removed = (teacher.assignedStudentIds || []).filter(
    id => !selectedStudentIds.includes(id)
  ).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-[#1a1f3a] border-white/10 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Assign Students to {teacher.name}</DialogTitle>
          <DialogDescription className="text-gray-300">
            Select students to assign to this teacher. Changes will be synced across both teacher and student records.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <MagnifyingGlass 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              />
              <Input
                placeholder="Search by name, roll number, or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              {selectedStudentIds.length === filteredStudents.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              {selectedStudentIds.length} selected
            </Badge>
            {newlyAssigned > 0 && (
              <Badge variant="default" className="bg-success/20 text-success border-success/30">
                +{newlyAssigned} new
              </Badge>
            )}
            {removed > 0 && (
              <Badge variant="destructive">
                -{removed} removed
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[400px] rounded-lg border border-white/10 p-3 bg-white/5">
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id)
                    const wasOriginallyAssigned = (teacher.assignedStudentIds || []).includes(student.id)
                    const isNewlyAdded = isSelected && !wasOriginallyAssigned
                    const isBeingRemoved = !isSelected && wasOriginallyAssigned

                    return (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          isSelected 
                            ? 'bg-blue-500/10 border-blue-400/30' 
                            : 'hover:bg-white/5 border-white/10'
                        }`}
                      >
                        <Checkbox
                          id={student.id}
                          checked={isSelected}
                          onCheckedChange={() => handleToggleStudent(student.id)}
                        />
                        <label
                          htmlFor={student.id}
                          className="flex-1 flex items-center gap-3 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                            {student.profilePhoto ? (
                              <img
                                src={student.profilePhoto}
                                alt={student.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User size={20} className="text-blue-400" weight="fill" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm text-white">{student.name}</p>
                              {isSelected && (
                                <CheckCircle size={14} className="text-success" weight="fill" />
                              )}
                            </div>
                            <p className="text-xs text-gray-300">
                              Roll: {student.rollNumber} • {student.class}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {isNewlyAdded && (
                              <Badge variant="default" className="bg-success/20 text-success border-success/30 text-xs">
                                New
                              </Badge>
                            )}
                            {isBeingRemoved && (
                              <Badge variant="destructive" className="text-xs">
                                Remove
                              </Badge>
                            )}
                          </div>
                        </label>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <User size={48} className="text-gray-400 mb-3" />
                    <p className="text-sm text-gray-300">
                      {searchQuery ? "No students found matching your search" : "No students available"}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {selectedStudentIds.length > 0 && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm font-medium mb-2 text-white">Selected Students:</p>
              <div className="flex flex-wrap gap-1.5">
                {students
                  .filter(s => selectedStudentIds.includes(s.id))
                  .map(student => (
                    <Badge key={student.id} variant="secondary" className="gap-1.5 pr-1 bg-white/10 hover:bg-white/20 text-white border-white/20">
                      {student.name}
                      <button
                        onClick={() => handleToggleStudent(student.id)}
                        className="hover:text-destructive ml-1 p-0.5 rounded-full hover:bg-destructive/10"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
            Save Assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
