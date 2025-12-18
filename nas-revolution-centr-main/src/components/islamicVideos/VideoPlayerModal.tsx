import { useEffect, useRef } from "react"
import { X } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  videoURL: string
  title: string
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  videoURL,
  title,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause()
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="relative w-full max-w-5xl"
          >
            <Button
              onClick={onClose}
              size="icon"
              variant="ghost"
              className="absolute -top-12 right-0 text-white hover:text-primary hover:bg-white/10 z-10"
            >
              <X size={24} weight="bold" />
            </Button>
            <div className="bg-background/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-6 py-4 border-b border-border/50">
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
              </div>
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  src={videoURL}
                  controls
                  autoPlay
                  className="w-full h-full"
                  controlsList="nodownload"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
