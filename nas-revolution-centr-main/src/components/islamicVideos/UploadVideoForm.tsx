import { useState } from "react"
import { Upload, Video, Image as ImageIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface UploadVideoFormProps {
  onUploadSuccess: () => void
}

export default function UploadVideoForm({ onUploadSuccess }: UploadVideoFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["video/mp4", "video/mov", "video/quicktime", "video/webm"]
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid video file (MP4, MOV, or WebM)")
        return
      }
      setVideoFile(file)
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPG, PNG, or WebP)")
        return
      }
      setThumbnailFile(file)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a video title")
      return
    }

    if (!videoFile) {
      toast.error("Please select a video file")
      return
    }

    setIsUploading(true)

    try {
      const videoURL = await fileToBase64(videoFile)
      const thumbnailURL = thumbnailFile ? await fileToBase64(thumbnailFile) : ""

      const newVideo = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        videoURL,
        thumbnailURL,
        uploadDate: new Date().toISOString(),
      }

      // TODO: Replace localStorage with real backend storage (Supabase/Firebase).
      const existingVideos = JSON.parse(localStorage.getItem("islamicVideos") || "[]")
      existingVideos.unshift(newVideo)
      localStorage.setItem("islamicVideos", JSON.stringify(existingVideos))

      toast.success("Video uploaded successfully!")
      
      setTitle("")
      setDescription("")
      setVideoFile(null)
      setThumbnailFile(null)
      
      const fileInputs = document.querySelectorAll('input[type="file"]')
      fileInputs.forEach((input) => ((input as HTMLInputElement).value = ""))

      onUploadSuccess()
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload video. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Upload New Islamic Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title *</Label>
            <Input
              id="title"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter video description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-background/50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video File * (MP4, MOV, WebM)</Label>
            <div className="relative">
              <Input
                id="video"
                type="file"
                accept="video/mp4,video/mov,video/quicktime,video/webm"
                onChange={handleVideoChange}
                className="bg-background/50"
              />
              <Video
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
            {videoFile && (
              <p className="text-sm text-primary">
                Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail (Optional - JPG, PNG, WebP)</Label>
            <div className="relative">
              <Input
                id="thumbnail"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleThumbnailChange}
                className="bg-background/50"
              />
              <ImageIcon
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
            {thumbnailFile && (
              <p className="text-sm text-primary">Selected: {thumbnailFile.name}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Upload size={20} weight="bold" className="mr-2" />
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
