import { useState, useEffect } from "react"
import { MagnifyingGlass, ArrowLeft, Sparkle } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import VideoCard from "@/components/islamicVideos/VideoCard"
import VideoPlayerModal from "@/components/islamicVideos/VideoPlayerModal"

interface IslamicVideo {
  id: string
  title: string
  description: string
  videoURL: string
  thumbnailURL: string
  uploadDate: string
}

interface IslamicVideosPageProps {
  onBackToHome?: () => void
}

export default function IslamicVideosPage({ onBackToHome }: IslamicVideosPageProps) {
  const [videos, setVideos] = useState<IslamicVideo[]>([])
  const [filteredVideos, setFilteredVideos] = useState<IslamicVideo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<IslamicVideo | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)

  useEffect(() => {
    loadVideos()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVideos(videos)
    } else {
      const filtered = videos.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredVideos(filtered)
    }
  }, [searchQuery, videos])

  const loadVideos = () => {
    // TODO: Replace localStorage with real backend storage (Supabase/Firebase).
    const storedVideos = localStorage.getItem("islamicVideos")
    if (storedVideos) {
      const parsedVideos = JSON.parse(storedVideos)
      setVideos(parsedVideos)
      setFilteredVideos(parsedVideos)
    }
  }

  const handlePlayVideo = (video: IslamicVideo) => {
    setSelectedVideo(video)
    setIsPlayerOpen(true)
  }

  const handleClosePlayer = () => {
    setIsPlayerOpen(false)
    setTimeout(() => setSelectedVideo(null), 300)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {onBackToHome && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Button
                onClick={onBackToHome}
                variant="ghost"
                className="text-foreground hover:text-primary"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Home
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkle size={32} weight="fill" className="text-primary mr-3" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                ISLAMIC VIDEOS
              </h1>
              <Sparkle size={32} weight="fill" className="text-accent ml-3" />
            </div>
            <p className="text-muted-foreground text-lg">
              Explore enlightening Islamic content and lectures
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <MagnifyingGlass
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search videos by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
              />
            </div>
          </motion.div>

          {filteredVideos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center py-20"
            >
              <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                <Sparkle size={64} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {searchQuery ? "No videos found" : "No videos yet"}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Try searching with different keywords"
                    : "Islamic videos will appear here once uploaded"}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <VideoCard
                    {...video}
                    onClick={() => handlePlayVideo(video)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {selectedVideo && (
        <VideoPlayerModal
          isOpen={isPlayerOpen}
          onClose={handleClosePlayer}
          videoURL={selectedVideo.videoURL}
          title={selectedVideo.title}
        />
      )}
    </div>
  )
}
