import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trash, User, BookOpen, Clock } from "@phosphor-icons/react"
import { useKV } from "@github/spark/hooks"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BubbleIcon from "@/components/school/BubbleIcon"
import { toast } from "sonner"
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
import { useState } from "react"

interface TeacherInfo {
  id: string
  name: string
  subject: string
  experience: string
  quote: string
  image?: string
  createdAt: string
}

interface ViewAllTeachersPageProps {
  onBack: () => void
}

export default function ViewAllTeachersPage({ onBack }: ViewAllTeachersPageProps) {
  const [teacherInfoList, setTeacherInfoList] = useKV<TeacherInfo[]>("teacher-info-list", [])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setTeacherInfoList((currentList) => (currentList || []).filter(teacher => teacher.id !== id))
    toast.success("Teacher removed successfully")
    setDeleteTarget(null)
  }

  return (
    <div className="pb-24 px-4 pt-6 space-y-6">
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-primary/30 text-foreground hover:border-primary/60 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft weight="bold" size={20} />
        <span className="font-semibold">Back to Dashboard</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-2"
      >
        <BubbleIcon size="md" variant="blue">
          <User size={28} weight="fill" />
        </BubbleIcon>
        <div>
          <h1 className="text-2xl font-bold text-heading text-foreground">View All Teachers</h1>
          <p className="text-sm text-muted-foreground">
            Manage teacher information ({teacherInfoList?.length || 0} total)
          </p>
        </div>
      </motion.div>

      {!teacherInfoList || teacherInfoList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 rounded-2xl card-shadow text-center">
            <div className="flex flex-col items-center gap-4">
              <BubbleIcon size="lg" variant="purple">
                <User size={40} weight="fill" />
              </BubbleIcon>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">No Teachers Added Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Go to "Add Teacher Info" to add your first teacher
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {teacherInfoList.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card className="p-4 rounded-2xl card-shadow">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.60 0.20 250), oklch(0.55 0.22 310))",
                        color: "#FFFFFF",
                        boxShadow: "0 0 20px oklch(0.60 0.20 250 / 0.4)",
                      }}
                    >
                      {teacher.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground mb-1 truncate">
                        {teacher.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <BookOpen size={14} weight="fill" />
                          <span>{teacher.subject}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={14} weight="fill" />
                          <span>{teacher.experience}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground italic line-clamp-2">
                        "{teacher.quote}"
                      </p>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteTarget(teacher.id)}
                      className="flex-shrink-0 rounded-xl"
                    >
                      <Trash size={18} weight="fill" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this teacher from the list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
