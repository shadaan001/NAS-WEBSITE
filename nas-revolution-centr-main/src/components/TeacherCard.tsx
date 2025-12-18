import { motion } from "framer-motion"
import { 
  Pencil, 
  Trash,
  UserPlus,
  CheckCircle,
  XCircle,
  EnvelopeSimple,
  Phone,
  MapPin,
  CalendarBlank,
  Clock,
  User,
  BookOpen,
  LockKey
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BubbleIcon from "@/components/school/BubbleIcon"
import type { TeacherRecord } from "@/types/admin"

interface TeacherCardProps {
  teacher: TeacherRecord
  onEdit: () => void
  onDelete: () => void
  onAssign: () => void
  onToggleApproval: () => void
  onCreateCredentials?: () => void
}

export default function TeacherCard({ teacher, onEdit, onDelete, onAssign, onToggleApproval, onCreateCredentials }: TeacherCardProps) {
  const availabilitySummary = teacher.availability && teacher.availability.length > 0
    ? `${teacher.availability.length} day${teacher.availability.length > 1 ? 's' : ''} available`
    : "No availability set"

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none" />
      <Card className="relative p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 shadow-2xl overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {teacher.photoBase64 ? (
              <motion.img
                src={teacher.photoBase64}
                alt={teacher.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-400/30"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              <BubbleIcon size="lg" variant="green">
                <User size={28} weight="fill" />
              </BubbleIcon>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">{teacher.name}</h3>
                  {teacher.approved ? (
                    <CheckCircle size={18} className="text-success flex-shrink-0" weight="fill" />
                  ) : (
                    <XCircle size={18} className="text-destructive flex-shrink-0" weight="fill" />
                  )}
                </div>
                <p className="text-xs text-gray-300">ID: {teacher.employeeId}</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <EnvelopeSimple size={14} className="flex-shrink-0" />
                <span className="truncate">{teacher.email}</span>
              </div>
              {teacher.contactNumber && (
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Phone size={14} className="flex-shrink-0" />
                  <span>{teacher.contactNumber}</span>
                </div>
              )}
              {teacher.address && (
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span className="truncate">{teacher.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <CalendarBlank size={14} className="flex-shrink-0" />
                <span>Joined: {new Date(teacher.joiningDate).toLocaleDateString()}</span>
              </div>
            </div>

            {teacher.subjects && teacher.subjects.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BookOpen size={12} className="text-gray-400" />
                  <p className="text-xs text-gray-300 font-medium">Subjects:</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {teacher.availability && teacher.availability.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Clock size={12} className="text-gray-400" />
                  <p className="text-xs text-gray-300 font-medium">Availability:</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.availability.slice(0, 3).map((slot, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs border-white/20 text-gray-300">
                      {slot.day} {slot.from}-{slot.to}
                    </Badge>
                  ))}
                  {teacher.availability.length > 3 && (
                    <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                      +{teacher.availability.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {teacher.assignedStudentIds && teacher.assignedStudentIds.length > 0 && (
              <div className="mb-3">
                <Badge variant="default" className="text-xs bg-blue-500/20 text-blue-300 border-blue-400/30">
                  {teacher.assignedStudentIds.length} student{teacher.assignedStudentIds.length > 1 ? 's' : ''} assigned
                </Badge>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {onCreateCredentials && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={onCreateCredentials}
                  className="gap-1.5 text-xs h-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
                >
                  <LockKey size={14} />
                  Credentials
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
                className="gap-1.5 text-xs h-8 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <Pencil size={14} />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onAssign}
                className="gap-1.5 text-xs h-8 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <UserPlus size={14} />
                Assign
              </Button>
              <Button
                size="sm"
                variant={teacher.approved ? "outline" : "default"}
                onClick={onToggleApproval}
                className={teacher.approved 
                  ? "gap-1.5 text-xs h-8 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
                  : "gap-1.5 text-xs h-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"}
              >
                {teacher.approved ? (
                  <>
                    <XCircle size={14} />
                    Revoke
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    Approve
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive hover:bg-white/10"
              >
                <Trash size={14} />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
