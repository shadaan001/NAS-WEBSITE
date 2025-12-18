import { useState, useEffect } from "react"
import { ArrowLeft, Trash, Video, Sparkle } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { toast } from "sonner"
import UploadVideoForm from "@/components/islamicVideos/UploadVideoForm"

interface IslamicVideo {
  id: string
  title: string
  description: string
  videoURL: string
  thumbnailURL: string
  uploadDate: string
}

interface ManageIslamicVideosPageProps {
  onBack: () => void
}

export default function ManageIslamicVideosPage({ onBack }: ManageIslamicVideosPageProps) {
  const [videos, setVideos] = useState<IslamicVideo[]>([])
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = () => {
    // TODO: Replace localStorage with real backend storage (Supabase/Firebase).
    const storedVideos = localStorage.getItem("islamicVideos")
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos))
    }
  }

  const handleDeleteVideo = (id: string) => {
    setVideoToDelete(id)
  }

  const confirmDelete = () => {
    if (!videoToDelete) return

    // TODO: Replace localStorage with real backend storage (Supabase/Firebase).
    const updatedVideos = videos.filter((video) => video.id !== videoToDelete)
    localStorage.setItem("islamicVideos", JSON.stringify(updatedVideos))
    setVideos(updatedVideos)
    setVideoToDelete(null)
    toast.success("Video deleted successfully")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-foreground hover:text-primary"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkle size={32} weight="fill" className="text-primary mr-3" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Manage Islamic Videos
              </h1>
              <Sparkle size={32} weight="fill" className="text-accent ml-3" />
            </div>
            <p className="text-muted-foreground text-lg">
              Upload and manage Islamic video content
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <UploadVideoForm onUploadSuccess={loadVideos} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Video size={28} className="mr-3 text-primary" />
              Uploaded Videos ({videos.length})
            </h2>

            {videos.length === 0 ? (
              <Card className="glass border-border/50">
                <CardContent className="py-12 text-center">
                  <Video size={64} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No videos uploaded yet. Upload your first Islamic video above.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="glass border-border/50 hover:border-primary/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted/20">
                            {video.thumbnailURL ? (
                              <img
                                src={video.thumbnailURL}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                                <Video size={48} weight="duotone" className="text-primary/40" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground mb-2">
                              {video.title}
                            </h3>
                            <p className="text-muted-foreground mb-3 line-clamp-2">
                              {video.description || "No description provided"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded: {formatDate(video.uploadDate)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteVideo(video.id)}
                              className="hover:scale-110 transition-transform"
                            >
                              <Trash size={20} weight="bold" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the video from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
