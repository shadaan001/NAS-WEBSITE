import { motion } from "framer-motion"
import { Calendar, User, BookOpen, FileText, Trash, PencilSimple, Download } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TestCardProps {
  test: {
    id: string
    title: string
    class: string
    subject: string
    date: string
    maxMarks: number
    teacherId: string
    teacherName?: string
    marks?: Array<{
      studentId: string
      marks: number
      grade: string
      comments?: string
    }>
  }
  onEdit?: (test: any) => void
  onDelete?: (testId: string) => void
  onViewMarks?: (testId: string) => void
  onExport?: (testId: string) => void
}

export function TestCard({ test, onEdit, onDelete, onViewMarks, onExport }: TestCardProps) {
  const isUpcoming = new Date(test.date) > new Date()
  const markedStudents = test.marks?.length || 0
  const totalMarks = test.marks?.reduce((sum, m) => sum + m.marks, 0) || 0
  const averageMarks = markedStudents > 0 ? Math.round(totalMarks / markedStudents) : 0
  const averagePercentage = test.maxMarks > 0 ? Math.round((averageMarks / test.maxMarks) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-2 border-border/40 bg-card/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {test.title}
                </h3>
                <Badge 
                  variant={isUpcoming ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    isUpcoming ? "bg-primary/20 text-primary border-primary/30" : ""
                  )}
                >
                  {isUpcoming ? "Upcoming" : "Completed"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="text-primary" size={16} />
                  <span>{test.subject}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="text-secondary" size={16} />
                  <span>{new Date(test.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="text-accent" size={16} />
                  <span>{test.class}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="text-primary" size={16} />
                  <span>Max: {test.maxMarks} marks</span>
                </div>
              </div>
            </div>
          </div>

          {markedStudents > 0 && (
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/30">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Class Average</p>
                <p className="text-2xl font-bold text-heading text-primary">
                  {averagePercentage}%
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Students Marked</p>
                <p className="text-lg font-semibold text-foreground">
                  {markedStudents}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            {onViewMarks && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewMarks(test.id)}
                className="flex-1 hover:bg-primary/10 hover:border-primary/30"
              >
                View Marks
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(test)}
                className="hover:bg-secondary/20"
              >
                <PencilSimple size={16} />
              </Button>
            )}
            
            {onExport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExport(test.id)}
                className="hover:bg-accent/20"
              >
                <Download size={16} />
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(test.id)}
                className="hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash size={16} />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
