import { motion } from "framer-motion"
import { 
  User, 
  Phone, 
  EnvelopeSimple, 
  Pencil, 
  Trash, 
  Eye,
  ChalkboardTeacher,
  Book
} from "@phosphor-icons/react"
import BubbleIcon from "./school/BubbleIcon"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import type { StudentWithRelations } from "@/lib/useLocalDB"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface StudentCardProps {
  student: StudentWithRelations
  index: number
  onEdit: (student: StudentWithRelations) => void
  onDelete: (id: string) => void
  onView: (student: StudentWithRelations) => void
}

export default function StudentCard({ student, index, onEdit, onDelete, onView }: StudentCardProps) {
  const initials = student.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const hasPendingPayments = student.payments && student.payments.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="transition-transform"
    >
      <Card className="p-4 rounded-2xl card-shadow hover:card-shadow-lg transition-shadow duration-300 relative overflow-hidden group">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              {student.photoBase64 ? (
                <AvatarImage src={student.photoBase64} alt={student.name} />
              ) : null}
              <AvatarFallback className="bg-gradient-blue-white text-primary font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            {hasPendingPayments && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-white text-heading truncate">
                  {student.name}
                </h3>
                <p className="text-sm text-white/70">
                  {student.class} • Roll {student.rollNumber}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 mb-3">
              {student.email && (
                <div className="flex items-center gap-2 text-xs text-white/70 truncate">
                  <EnvelopeSimple size={14} className="flex-shrink-0" />
                  <span className="truncate">{student.email}</span>
                </div>
              )}
              {student.phone && (
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <Phone size={14} className="flex-shrink-0" />
                  <span>{student.phone}</span>
                </div>
              )}
            </div>

            {student.subjects && student.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {student.subjects.slice(0, 3).map((subject) => (
                  <Badge key={subject} variant="secondary" className="text-xs">
                    <Book size={12} className="mr-1" weight="fill" />
                    {subject}
                  </Badge>
                ))}
                {student.subjects.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{student.subjects.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {student?.assignedTeachers && Array.isArray(student.assignedTeachers) && student.assignedTeachers.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-white/70 flex items-center gap-1">
                  <ChalkboardTeacher size={14} weight="fill" />
                  Teachers:
                </span>
                <div className="flex -space-x-2">
                  {student.assignedTeachers.slice(0, 3).map((assignment, idx) => (
                    <div
                      key={`${assignment?.teacherId || idx}-${idx}`}
                      className="relative group/teacher"
                      title={assignment?.teacherName && assignment?.subject ? `${assignment.teacherName} (${assignment.subject})` : 'Teacher'}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-secondary/10 text-white ring-2 ring-background transition-transform hover:scale-110">
                        <ChalkboardTeacher size={12} weight="fill" />
                      </div>
                    </div>
                  ))}
                  {student.assignedTeachers.length > 3 && (
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-semibold ring-2 ring-background text-white">
                      +{student.assignedTeachers.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onView(student)}
              className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="View student details"
            >
              <Eye size={18} weight="bold" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(student)}
              className="h-9 w-9 p-0 hover:bg-accent/10 hover:text-accent transition-colors"
              aria-label="Edit student"
            >
              <Pencil size={18} weight="bold" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(student.id)}
              className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="Delete student"
            >
              <Trash size={18} weight="bold" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </motion.div>
  )
}
