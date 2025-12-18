import { Play } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface VideoCardProps {
  id: string
  title: string
  description: string
  thumbnailURL: string
  uploadDate: string
  onClick: () => void
}

export default function VideoCard({
  title,
  description,
  thumbnailURL,
  uploadDate,
  onClick,
}: VideoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
    >
      <Card className="glass overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 group cursor-pointer">
        <div className="relative aspect-video overflow-hidden bg-muted/20">
          {thumbnailURL ? (
            <img
              src={thumbnailURL}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <Play size={64} weight="fill" className="text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/50">
                <Play size={28} weight="fill" className="text-white ml-1" />
              </div>
            </motion.div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDate(uploadDate)}
            </span>
            <Button
              size="sm"
              onClick={onClick}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Play size={16} weight="fill" className="mr-1" />
              Play Video
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
