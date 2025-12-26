import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type CourseFormProps = {
  initial?: {
    id?: number
    class_name?: string
    grade?: string
    course_fee?: number | string
    subjects?: string[]
    key_features?: string[]
  }
  onSubmit: (data: { id?: number; class_name: string; grade: string; course_fee: number | string; subjects: string[]; key_features: string[] }) => void
  onCancel?: () => void
  submitLabel?: string
}

export default function CourseForm({ initial, onSubmit, onCancel, submitLabel }: CourseFormProps) {
  const [className, setClassName] = useState(initial?.class_name || '')
  const [grade, setGrade] = useState(initial?.grade || '')
  const [fee, setFee] = useState<string>(String(initial?.course_fee ?? ''))
  const [subjectsRaw, setSubjectsRaw] = useState((initial?.subjects || []).join(', '))
  const [featuresRaw, setFeaturesRaw] = useState((initial?.key_features || []).join('\n'))

  useEffect(() => {
    setClassName(initial?.class_name || '')
    setGrade(initial?.grade || '')
    setFee(String(initial?.course_fee ?? ''))
    setSubjectsRaw((initial?.subjects || []).join(', '))
    setFeaturesRaw((initial?.key_features || []).join('\n'))
  }, [initial])

  const handleSubmit = () => {
    if (!className.trim() || !grade.trim() || fee === '') {
      toast.error('Please fill class, grade and fee')
      return
    }

    const subjects = subjectsRaw.split(',').map(s => s.trim()).filter(Boolean)
    const key_features = featuresRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean)

    onSubmit({ id: initial?.id, class_name: className.trim(), grade: grade.trim(), course_fee: Number(fee), subjects, key_features })
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>Class Name</Label>
        <Input value={className} onChange={e => setClassName(e.target.value)} placeholder="e.g., 10th - Science" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Grade</Label>
          <Input value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g., 10" />
        </div>
        <div className="space-y-1">
          <Label>Course Fee</Label>
          <Input value={fee} onChange={e => setFee(e.target.value)} placeholder="e.g., 1200.00" />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Subjects (comma separated)</Label>
        <Input value={subjectsRaw} onChange={e => setSubjectsRaw(e.target.value)} placeholder="Mathematics, Physics" />
      </div>

      <div className="space-y-1">
        <Label>Key Features (one per line)</Label>
        <textarea className="w-full p-2 rounded-md bg-[#0b1220] border border-white/6 text-white" rows={4} value={featuresRaw} onChange={e => setFeaturesRaw(e.target.value)} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>{submitLabel || (initial?.id ? 'Save Changes' : 'Add Course')}</Button>
      </div>
    </div>
  )
}
