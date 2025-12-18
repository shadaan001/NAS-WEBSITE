import { useState, useEffect } from "react"
import { ArrowLeft, Upload, VideoCamera, Image as ImageIcon } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { LectureService } from "@/services/lectureService"
import { CourseService } from "@/services/courseService"
import { Course } from "@/types"
import { motion } from "framer-motion"

interface UploadLecturePageProps {
  teacherId: string
  onBack: () => void
}

export default function UploadLecturePage({ teacherId, onBack }: UploadLecturePageProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoURL, setVideoURL] = useState("")
  const [thumbnailURL, setThumbnailURL] = useState("")
  const [uploading, setUploading] = useState(false)
  const [teacherName, setTeacherName] = useState("Teacher")

  useEffect(() => {
    loadCourses()
    loadTeacherInfo()
  }, [])

  const loadCourses = () => {
    const allCourses = CourseService.getAllCourses()
    setCourses(allCourses)
  }

  const loadTeacherInfo = () => {
    try {
      const teachers = JSON.parse(localStorage.getItem("teachers") || "[]")
      const teacher = teachers.find((t: any) => t.id === teacherId)
      if (teacher) {
        setTeacherName(teacher.name)
      }
    } catch (error) {
      console.error("Error loading teacher info:", error)
    }
  }

  const getSubjects = () => {
    const course = courses.find((c) => c.id === selectedCourse)
    return course?.subjects || []
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file")
        return
      }
      
      if (file.size > 500 * 1024 * 1024) {
        toast.error("Video file size should be less than 500MB")
        return
      }

      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoURL(url)
      toast.success("Video file selected")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCourse || !selectedSubject || !title || !description) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!videoURL) {
      toast.error("Please upload a video file or provide a video URL")
      return
    }

    setUploading(true)

    try {
      const course = courses.find((c) => c.id === selectedCourse)
      
      const lecture = {
        id: `lecture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        courseId: selectedCourse,
        courseName: course?.title || "",
        subject: selectedSubject,
        title,
        description,
        videoURL,
        thumbnailURL,
        teacherId,
        teacherName,
        uploadDate: new Date().toISOString(),
        views: 0,
      }

      LectureService.saveLecture(lecture)
      
      toast.success("Lecture uploaded successfully!")
      
      setSelectedCourse("")
      setSelectedSubject("")
      setTitle("")
      setDescription("")
      setVideoFile(null)
      setVideoURL("")
      setThumbnailURL("")
      
      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (error) {
      console.error("Error uploading lecture:", error)
      toast.error("Failed to upload lecture. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>

          <h1 className="text-4xl font-bold gradient-text">📤 Upload Lecture</h1>
          <p className="text-muted-foreground mt-2">
            Share educational content with your students
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Lecture Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course *</Label>
                    <Select
                      value={selectedCourse}
                      onValueChange={(value) => {
                        setSelectedCourse(value)
                        setSelectedSubject("")
                      }}
                      required
                    >
                      <SelectTrigger id="course" className="glass">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={selectedSubject}
                      onValueChange={setSelectedSubject}
                      disabled={!selectedCourse}
                      required
                    >
                      <SelectTrigger id="subject" className="glass">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubjects().map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Lecture Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Introduction to Quadratic Equations"
                    className="glass"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of the lecture content..."
                    className="glass min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video">Video File *</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="relative glass"
                      onClick={() => document.getElementById("video-input")?.click()}
                    >
                      <VideoCamera size={20} className="mr-2" />
                      {videoFile ? videoFile.name : "Choose Video"}
                    </Button>
                    <input
                      id="video-input"
                      type="file"
                      accept="video/mp4,video/mov,video/webm"
                      onChange={handleVideoFileChange}
                      className="hidden"
                    />
                    {videoFile && (
                      <span className="text-sm text-muted-foreground">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP4, MOV, WebM (Max 500MB)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoURL">Or Video URL</Label>
                  <Input
                    id="videoURL"
                    value={videoFile ? "" : videoURL}
                    onChange={(e) => setVideoURL(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="glass"
                    disabled={!!videoFile}
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a direct video URL if not uploading a file
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL (Optional)</Label>
                  <div className="flex gap-4">
                    <Input
                      id="thumbnail"
                      value={thumbnailURL}
                      onChange={(e) => setThumbnailURL(e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                      className="glass flex-1"
                    />
                    {thumbnailURL && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                        <img
                          src={thumbnailURL}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">📝 Quick Tips:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Use clear, descriptive titles for better discoverability</li>
                    <li>Include key topics and concepts in the description</li>
                    <li>Ensure video quality is suitable for online viewing</li>
                    <li>Consider adding timestamps in the description</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload size={20} className="mr-2" />
                        Upload Lecture
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-muted/30 rounded-lg"
        >
          <p className="text-sm text-muted-foreground">
            💡 <strong>Note:</strong> This feature currently uses browser storage.
            In production, videos will be stored on a CDN for faster streaming.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
