import { useState, useEffect } from "react"
import { Play, MagnifyingGlass, X } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { LectureService } from "@/services/lectureService"
import { CourseService } from "@/services/courseService"
import { Lecture, Course } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface LecturesPageProps {
  studentId: string
  enrolledCourses?: string[]
}

export default function LecturesPage({ studentId, enrolledCourses = [] }: LecturesPageProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      loadLectures()
    }
  }, [selectedCourse])

  useEffect(() => {
    filterLectures()
  }, [lectures, selectedSubject, searchQuery, sortBy])

  const loadCourses = () => {
    try {
      const allCourses = CourseService.getAllCourses()
      setCourses(allCourses)
      
      if (allCourses.length > 0) {
        const defaultCourse = enrolledCourses.length > 0 
          ? allCourses.find(c => enrolledCourses.includes(c.id))?.id || allCourses[0].id
          : allCourses[0].id
        setSelectedCourse(defaultCourse)
      }
    } catch (error) {
      console.error("Error loading courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadLectures = () => {
    try {
      const courseLectures = LectureService.getLecturesByCourse(selectedCourse)
      setLectures(courseLectures)
    } catch (error) {
      console.error("Error loading lectures:", error)
    }
  }

  const filterLectures = () => {
    let filtered = [...lectures]

    if (selectedSubject !== "all") {
      filtered = filtered.filter((lecture) => lecture.subject === selectedSubject)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query) ||
          lecture.description.toLowerCase().includes(query)
      )
    }

    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
      } else {
        return a.title.localeCompare(b.title)
      }
    })

    setFilteredLectures(filtered)
  }

  const handlePlayLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture)
    setIsVideoModalOpen(true)
    LectureService.incrementViews(lecture.id)
  }

  const handleCloseVideo = () => {
    setIsVideoModalOpen(false)
    const video = document.querySelector("video")
    if (video) {
      video.pause()
    }
  }

  const getCurrentCourse = () => {
    return courses.find((c) => c.id === selectedCourse)
  }

  const getSubjects = () => {
    const course = getCurrentCourse()
    return course?.subjects || []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="glass p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No Courses Available</h2>
          <p className="text-muted-foreground">
            There are no courses available yet. Please contact your administrator.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto p-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-6 gradient-text"
          >
            📚 Lectures
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {getSubjects().map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {filteredLectures.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Card className="glass p-8">
              <h3 className="text-2xl font-bold mb-4">No Lectures Found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "No lectures have been uploaded for this course yet."}
              </p>
            </Card>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLectures.map((lecture, index) => (
                <motion.div
                  key={lecture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass glass-hover overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-video bg-muted">
                      {lecture.thumbnailURL ? (
                        <img
                          src={lecture.thumbnailURL}
                          alt={lecture.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <Play size={48} className="text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary/90 backdrop-blur-sm">
                          {lecture.subject}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="flex-1 flex flex-col p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {lecture.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                        {lecture.description}
                      </p>

                      <div className="space-y-2 text-xs text-muted-foreground mb-4">
                        <div>👨‍🏫 {lecture.teacherName}</div>
                        <div>📅 {new Date(lecture.uploadDate).toLocaleDateString()}</div>
                        {lecture.views !== undefined && <div>👁️ {lecture.views} views</div>}
                      </div>

                      <Button
                        onClick={() => handlePlayLecture(lecture)}
                        className="w-full"
                      >
                        <Play size={20} className="mr-2" />
                        Watch Lecture
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-primary/20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="relative">
              <Button
                onClick={handleCloseVideo}
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 z-50 bg-destructive hover:bg-destructive/90 text-white rounded-full"
              >
                <X size={20} />
              </Button>

              {selectedLecture && (
                <div className="space-y-4 p-6">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={selectedLecture.videoURL}
                      controls
                      autoPlay
                      className="w-full h-full"
                      controlsList="nodownload"
                    >
                      Your browser does not support video playback.
                    </video>
                  </div>

                  <div className="space-y-2 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-2xl font-bold flex-1">
                        {selectedLecture.title}
                      </h2>
                      <Badge className="bg-primary">{selectedLecture.subject}</Badge>
                    </div>

                    <p className="text-gray-300">{selectedLecture.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-400 pt-2">
                      <span>👨‍🏫 {selectedLecture.teacherName}</span>
                      <span>•</span>
                      <span>📅 {new Date(selectedLecture.uploadDate).toLocaleDateString()}</span>
                      {selectedLecture.views !== undefined && (
                        <>
                          <span>•</span>
                          <span>👁️ {selectedLecture.views} views</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
