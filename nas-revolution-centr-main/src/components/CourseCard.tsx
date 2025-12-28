import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash, BookOpen, PencilSimple, GraduationCap } from '@phosphor-icons/react'
import NeonButton from './NeonButton'

type Course = {
  id: number
  class_name: string
  grade?: string
  course_fee: string | number
  subjects?: string[]
  key_features?: string[]
  created_at?: string
}

interface Props {
  course: Course
  onDelete?: (id: number) => void
  onEdit?: (course: Course) => void
  onContact?: (courseId?: number) => void
  onEnroll?: (courseId?: number) => void
  onRead?: (courseId?: number) => void
  admin?: boolean
}

export default function CourseCard({ course, onDelete, onEdit, onContact, onEnroll, onRead, admin }: Props) {
  return (
    <div className="p-4 bg-[#0f1724] border border-white/6 rounded-lg flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap size={22} weight="duotone" className="text-white" />
          </div>

        </div>

        <div className="flex flex-col items-end gap-2 ml-4">
          <div className="text-right">
            <div className="text-2xl md:text-3xl font-bold text-white">₹{course.course_fee}</div>
            <div className="text-xs text-gray-400">per month</div>
          </div>
        </div>
      </div>
        <div className="min-w-0">
            <h3 className="text-2xl md:text-3xl font-bold truncate text-heading">
              <span className="text-sm text-muted-foreground mr-2">Name:</span>
              <span className="align-middle">{course.class_name}</span>
            </h3>
                      <div className="flex items-center gap-2">
          </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">Grade:</span>
              <span className="text-lg md:text-xl font-bold text-white">{course.grade || '-'}</span>
            </div>
        </div>

      <div className="flex flex-wrap gap-2">
        {course.subjects && course.subjects.length > 0 ? (
            course.subjects.map(s => (
                <Badge key={s} variant="secondary">{s}</Badge>
            ))
        ) : (
            <span className="text-sm text-muted-foreground">No subjects</span>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-3">
        <div className="flex w-full items-center gap-2">
            <div className="flex-1 flex justify-center">
                <Button variant="ghost" size="sm" title="Read" aria-label="Read" onClick={() => onRead ? onRead(course.id) : null}>
                    <BookOpen size={20} />
                </Button>
            </div>

            <div className="flex-1 flex justify-center">
                {admin && onEdit ? (
                    <Button variant="ghost" size="sm" title="Edit" aria-label="Edit" onClick={() => onEdit(course)} className="text-primary">
                        <PencilSimple size={20} />
                    </Button>
                ) : <div />}
            </div>

            <div className="flex-1 flex justify-center">
                {admin && onDelete ? (
                    <Button variant="ghost" size="sm" title="Delete" aria-label="Delete" onClick={() => onDelete(course.id)} className="text-destructive">
                        <Trash size={20} />
                    </Button>
                ) : <div />}
            </div>
        </div>
            <NeonButton
              variant="primary"
              size="md"
              onClick={() => {
                // dispatch a global navigation event that App can listen for
                try {
                  window.dispatchEvent(new CustomEvent('nas:navigate', { detail: { page: 'public-payments' } }))
                } catch (e) {
                  // fallback: navigate to payments route if present
                  window.location.href = '/public-payments'
                }
              }}
            >
              Enroll Now
            </NeonButton>
        <Button variant="outline" className="w-full sm:flex-1" onClick={() => onContact ? onContact(course.id) : window.alert('Contact handler not provided')}>
          Contact Us
        </Button>
      </div>
    </div>
  )
}
