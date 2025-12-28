import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Plus, X, Upload, Calendar, Clock } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import type { TeacherRecord, WeeklyAvailability } from "@/types/admin"

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "Computer Science", "Economics", "Accountancy", "Physical Education", "Fine Arts", "Music", "History", "Political Science", "Geography", "Environmental Science", "Business Studies"]

const daysOfWeek: Array<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"> = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const timeOptions = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
]

interface TeacherFormProps {
  initialData?: Partial<TeacherRecord>
  onSubmit: (data: Partial<TeacherRecord>) => void
  onCancel: () => void
}

export default function TeacherForm({ initialData, onSubmit, onCancel }: TeacherFormProps) {
  const normalizeDbTeacherRow = (row: any): Partial<TeacherRecord> => ({
    id: row?.id,
    name: row?.name,
    email: row?.email,
    contactNumber: row?.contact_number ?? row?.contactNumber ?? null,
    address: row?.address ?? null,
    qualification: row?.qualification ?? null,
    experience: row?.experience ?? null,
    subjects: Array.isArray(row?.subjects) ? row.subjects : (row?.subjects ? [row.subjects] : []),
    classesAssigned: row?.classes_assigned ?? row?.classesAssigned ?? [],
    availability: Array.isArray(row?.availability) ? row.availability : [],
    photoBase64: row?.photo_base64 ?? row?.photoBase64 ?? null,
    employeeId: row?.employee_id ?? row?.employeeId ?? null,
    joiningDate: row?.joining_date ?? row?.joiningDate ?? null,
    approved: typeof row?.approved === 'boolean' ? row.approved : true,
    assignedStudentIds: row?.assigned_student_ids ?? row?.assignedStudentIds ?? [],
  })
  const [formData, setFormData] = useState<Partial<TeacherRecord>>({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    qualification: "",
    experience: "",
    subjects: [],
    classesAssigned: [],
    availability: [],
    photoBase64: null,
    ...initialData,
  })

  const [selectedSubject, setSelectedSubject] = useState("")
  const [availabilityDay, setAvailabilityDay] = useState<string>("")
  const [availabilityFrom, setAvailabilityFrom] = useState("")
  const [availabilityTo, setAvailabilityTo] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoBase64 || null)
  const [currentTab, setCurrentTab] = useState<"basic" | "subjects" | "availability">("basic")
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setPhotoPreview(base64String)
      setFormData(prev => ({ ...prev, photoBase64: base64String }))
    }
    reader.readAsDataURL(file)
  }

  const handleAddSubject = () => {
    if (!selectedSubject) return
    if (formData.subjects?.includes(selectedSubject)) {
      toast.error("Subject already added")
      return
    }
    setFormData(prev => ({
      ...prev,
      subjects: [...(prev.subjects || []), selectedSubject]
    }))
    setSelectedSubject("")
  }

  const handleRemoveSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: (prev.subjects || []).filter(s => s !== subject)
    }))
  }

  const validateAvailabilitySlot = (day: string, from: string, to: string): boolean => {
    if (from >= to) {
      toast.error("End time must be after start time")
      return false
    }

    const overlapping = formData.availability?.some(slot => {
      if (slot.day !== day) return false
      
      const existingFrom = slot.from
      const existingTo = slot.to
      
      return (from < existingTo && to > existingFrom)
    })

    if (overlapping) {
      toast.error(`Overlapping time slot on ${day}`)
      return false
    }

    return true
  }

  const handleAddAvailability = () => {
    if (!availabilityDay || !availabilityFrom || !availabilityTo) {
      toast.error("Please fill all availability fields")
      return
    }

    if (!validateAvailabilitySlot(availabilityDay, availabilityFrom, availabilityTo)) {
      return
    }

    const newSlot: WeeklyAvailability = {
      day: availabilityDay as "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun",
      from: availabilityFrom,
      to: availabilityTo,
    }

    setFormData(prev => ({
      ...prev,
      availability: [...(prev.availability || []), newSlot]
    }))

    setAvailabilityDay("")
    setAvailabilityFrom("")
    setAvailabilityTo("")
    toast.success("Availability added")
  }

  const handleRemoveAvailability = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: (prev.availability || []).filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required")
      return
    }

    if (!formData.subjects || formData.subjects.length === 0) {
      toast.error("At least one subject is required")
      return
    }
    console.log("Submitting form data:", formData)
    try {
      const teacherData = {
        name: formData.name,
        email: formData.email,
        contact_number: formData.contactNumber || null,
        address: formData.address || null,
        qualification: formData.qualification || null,
        experience: formData.experience || null,
        subjects: formData.subjects || [],
        classes_assigned: formData.classesAssigned || [],
        availability: formData.availability || [],
        photo_base64: formData.photoBase64 || null,
      }

      let result
      if (initialData?.id) {
        // Update existing teacher
        const { data, error } = await supabase
          .from('teachers')
          .update(teacherData)
          .eq('id', initialData.id)
          .select()
        result = { data, error }
      } else {
        // Insert new teacher
        const { data, error } = await supabase
          .from('teachers')
          .insert([teacherData])
          .select()
        result = { data, error }
      }

      if (result.error) {
        console.error('Supabase error:', result.error)
        toast.error(`Failed to ${initialData?.id ? 'update' : 'add'} teacher: ${result.error.message}`)
        return
      }

      toast.success(`Teacher ${initialData?.id ? 'updated' : 'added'} successfully!`)
      // Supabase returns an array of rows for insert/update with .select()
      const savedRow = Array.isArray(result.data) ? result.data[0] : result.data
      console.log("Saved data:", savedRow)

      // Normalize DB keys to front-end shape and pass up the saved record so parent can update local state
      const normalized = savedRow ? normalizeDbTeacherRow(savedRow) : formData
      onSubmit(normalized)
    } catch (error) {
      console.error('Error saving teacher:', error)
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <div className="space-y-4">
  <Tabs value={currentTab} onValueChange={(v: string) => setCurrentTab(v as "basic" | "subjects" | "availability")} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                  />
                  <button
                    onClick={() => {
                      setPhotoPreview(null)
                      setFormData(prev => ({ ...prev, photoBase64: null }))
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                  <Upload size={24} className="text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload size={16} />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Max 2MB (JPG, PNG)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Teacher name"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="teacher@example.com"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                id="phone"
                value={formData.contactNumber || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Full address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={formData.qualification || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                placeholder="e.g., M.Sc. Physics"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={formData.experience || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g., 5 years"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Subjects</Label>

            <div className="flex items-center gap-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                onClick={handleAddSubject}
                disabled={!selectedSubject}
                className="gap-2"
                title="Add subject"
              >
                <Plus size={16} />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {(formData.subjects || []).length > 0 ? (
                (formData.subjects || []).map((s) => (
                  <Badge key={s} className="flex items-center gap-2">
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(s)}
                      className="p-1 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove ${s}`}
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No subjects added</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Add Weekly Availability</Label>
            <div className="grid grid-cols-4 gap-2">
              <Select value={availabilityDay} onValueChange={setAvailabilityDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={availabilityFrom} onValueChange={setAvailabilityFrom}>
                <SelectTrigger>
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={availabilityTo} onValueChange={setAvailabilityTo}>
                <SelectTrigger>
                  <SelectValue placeholder="To" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                onClick={handleAddAvailability}
                disabled={!availabilityDay || !availabilityFrom || !availabilityTo}
                className="gap-2"
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Weekly Schedule ({formData.availability?.length || 0} slots)</Label>
            <div className="space-y-2 min-h-[100px] p-3 border rounded-lg">
              {formData.availability && formData.availability.length > 0 ? (
                formData.availability.map((slot, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 10, opacity: 0 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span className="font-medium text-sm">{slot.day}</span>
                      <Clock size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {slot.from} - {slot.to}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAvailability(index)}
                      className="p-1 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No availability set</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        {/* If not on last tab, show Next button; on last tab show submit text/button only */}
        {currentTab !== "availability" ? (
          <Button
            type="button"
            onClick={() => {
              if (currentTab === "basic") setCurrentTab("subjects")
              else if (currentTab === "subjects") setCurrentTab("availability")
            }}
            className="ml-2"
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            {initialData?.id ? "Save Changes" : "Add Teacher"}
          </Button>
        )}
      </DialogFooter>
    </div>
  )
}
