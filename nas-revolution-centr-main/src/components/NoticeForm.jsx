import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "@phosphor-icons/react"
import { toast } from "sonner"

const CLASSES = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11 Science",
  "Class 11 Commerce",
  "Class 12 Science",
  "Class 12 Commerce"
]

export default function NoticeForm({ open, onOpenChange, notice, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    pinned: false,
    class: null,
    expiryDate: "",
    author: "Admin",
    attachments: []
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title || "",
        content: notice.content || "",
        pinned: notice.pinned || false,
        class: notice.class || null,
        expiryDate: notice.expiryDate ? notice.expiryDate.split('T')[0] : "",
        author: notice.author || "Admin",
        attachments: notice.attachments || []
      })
    } else {
      setFormData({
        title: "",
        content: "",
        pinned: false,
        class: null,
        expiryDate: "",
        author: "Admin",
        attachments: []
      })
    }
    setErrors({})
  }, [notice, open])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }

    if (formData.expiryDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const expiryDate = new Date(formData.expiryDate)
      
      if (expiryDate < today) {
        newErrors.expiryDate = "Expiry date must be today or later"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the form errors")
      return
    }

    const submitData = {
      ...formData,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
      content: `<p>${formData.content}</p>`
    }

    onSubmit(submitData)
    onOpenChange(false)
  }

  const handleFileUpload = (e) => {
    // TODO: Replace with cloud storage upload
    const files = Array.from(e.target.files)
    
    const newAttachments = files.map(file => ({
      name: file.name,
      url: `/uploads/${file.name}`
    }))

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }))

    toast.success(`${files.length} file(s) added`)
  }

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{notice ? "Edit Notice" : "Create New Notice"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notice title"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter notice content"
              rows={6}
              className={errors.content ? "border-destructive" : ""}
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Write the full notice content here
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Target Class</Label>
              <Select
                value={formData.class || "general"}
                onValueChange={(value) => setFormData({ ...formData, class: value === "general" ? null : value })}
              >
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General (All Classes)</SelectItem>
                  {CLASSES.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className={errors.expiryDate ? "border-destructive" : ""}
              />
              {errors.expiryDate && (
                <p className="text-xs text-destructive">{errors.expiryDate}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter author name"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="pinned"
              checked={formData.pinned}
              onCheckedChange={(checked) => setFormData({ ...formData, pinned: checked })}
            />
            <Label htmlFor="pinned" className="cursor-pointer">
              Pin this notice to the top
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-upload').click()}
              >
                <Upload size={16} className="mr-2" />
                Upload Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <p className="text-xs text-muted-foreground">
                PDF, Images, or Documents
              </p>
            </div>

            {formData.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                    <span className="truncate">{attachment.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {notice ? "Update Notice" : "Create Notice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
