import { motion } from "framer-motion"
import { ArrowLeft, User, BookOpen, Clock, Quotes, ImageSquare, Plus } from "@phosphor-icons/react"
import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import BubbleIcon from "@/components/school/BubbleIcon"
import { toast } from "sonner"

interface TeacherInfo {
  id: string
  name: string
  subject: string
  experience: string
  quote: string
  image?: string
  createdAt: string
}

interface AddTeacherInfoPageProps {
  onBack: () => void
}

export default function AddTeacherInfoPage({ onBack }: AddTeacherInfoPageProps) {
  const [teacherInfoList, setTeacherInfoList] = useKV<TeacherInfo[]>("teacher-info-list", [])
  
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    experience: "",
    quote: "",
    image: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.subject.trim() || !formData.experience.trim() || !formData.quote.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    const newTeacher: TeacherInfo = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      subject: formData.subject.trim(),
      experience: formData.experience.trim(),
      quote: formData.quote.trim(),
      image: formData.image.trim() || undefined,
      createdAt: new Date().toISOString()
    }

    setTeacherInfoList((currentList) => [...(currentList || []), newTeacher])

    toast.success(`${formData.name} added successfully!`)
    
    setFormData({
      name: "",
      subject: "",
      experience: "",
      quote: "",
      image: ""
    })
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
        <BubbleIcon size="md" variant="purple">
          <Plus size={28} weight="fill" />
        </BubbleIcon>
        <div>
          <h1 className="text-2xl font-bold text-heading text-foreground">Add Teacher Info</h1>
          <p className="text-sm text-muted-foreground">Add teacher details for the public Teachers Info page</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 rounded-2xl card-shadow">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
                <User size={18} weight="fill" className="text-primary" />
                Teacher Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Dr. Sarah Ahmed"
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="flex items-center gap-2 text-foreground">
                <BookOpen size={18} weight="fill" className="text-primary" />
                Subject *
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="e.g., Mathematics & Physics"
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="flex items-center gap-2 text-foreground">
                <Clock size={18} weight="fill" className="text-primary" />
                Experience *
              </Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                placeholder="e.g., 12 Years"
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote" className="flex items-center gap-2 text-foreground">
                <Quotes size={18} weight="fill" className="text-primary" />
                Quote / Short Description *
              </Label>
              <Textarea
                id="quote"
                value={formData.quote}
                onChange={(e) => handleInputChange("quote", e.target.value)}
                placeholder="e.g., Numbers tell stories, physics reveals truth."
                className="rounded-xl min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="flex items-center gap-2 text-foreground">
                <ImageSquare size={18} weight="fill" className="text-primary" />
                Photo URL (Optional)
              </Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://example.com/photo.jpg (Leave empty for default)"
                className="rounded-xl"
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                If left empty, the first letter of the name will be used as the avatar
              </p>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl py-6 text-lg font-bold"
              size="lg"
            >
              <Plus size={24} weight="bold" className="mr-2" />
              Add Teacher
            </Button>
          </form>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-xl glass border border-primary/30"
      >
        <h3 className="text-sm font-bold text-foreground mb-2">📌 Important Notes:</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• All fields marked with * are required</li>
          <li>• Teacher data will appear on the public "Teachers Info" page</li>
          <li>• You can manage all teachers in the "View All Teachers" section</li>
          <li>• Photo URL must be a valid image link (JPEG, PNG, etc.)</li>
        </ul>
      </motion.div>
    </div>
  )
}
