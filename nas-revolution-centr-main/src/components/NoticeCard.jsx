import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pin, Trash2, Pencil, FileText, ChevronDown, ChevronUp, Download } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export default function NoticeCard({ notice, actions = [], onEdit, onDelete, onPin }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const isExpired = notice.expiryDate && new Date(notice.expiryDate) < new Date()
  const contentPreview = notice.content.replace(/<[^>]*>/g, '').substring(0, 150)
  const hasMoreContent = notice.content.replace(/<[^>]*>/g, '').length > 150

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
          notice.pinned && "border-2 border-primary shadow-md bg-gradient-to-br from-primary/5 to-transparent",
          isExpired && "opacity-60"
        )}
      >
        {notice.pinned && (
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
            <div className="absolute transform rotate-45 bg-primary text-primary-foreground text-xs font-bold py-1 right-[-35px] top-[15px] w-[120px] text-center shadow-sm">
              PINNED
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {notice.pinned && <Pin size={18} weight="fill" className="text-primary flex-shrink-0" />}
                <CardTitle className="text-lg leading-tight">{notice.title}</CardTitle>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {notice.class ? (
                  <Badge variant="secondary" className="text-xs">
                    {notice.class}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    General
                  </Badge>
                )}
                
                {isExpired && (
                  <Badge variant="destructive" className="text-xs">
                    Expired
                  </Badge>
                )}
                
                <span className="text-xs text-muted-foreground">
                  {formatDate(notice.createdAt)}
                </span>
              </div>
            </div>

            {actions.length > 0 && (
              <div className="flex gap-1 flex-shrink-0">
                {actions.includes("pin") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPin?.(notice.id)}
                    className="h-8 w-8 p-0"
                    aria-label={notice.pinned ? "Unpin notice" : "Pin notice"}
                  >
                    <Pin size={16} weight={notice.pinned ? "fill" : "regular"} />
                  </Button>
                )}
                
                {actions.includes("edit") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(notice)}
                    className="h-8 w-8 p-0"
                    aria-label="Edit notice"
                  >
                    <Pencil size={16} />
                  </Button>
                )}
                
                {actions.includes("delete") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(notice.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    aria-label="Delete notice"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="text-sm text-foreground/90">
            {isExpanded ? (
              <div dangerouslySetInnerHTML={{ __html: notice.content }} />
            ) : (
              <p>{contentPreview}{hasMoreContent && !isExpanded && "..."}</p>
            )}
          </div>

          {hasMoreContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-auto p-0 text-xs font-medium text-primary hover:text-primary/80"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={14} className="mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={14} className="mr-1" />
                  Read More
                </>
              )}
            </Button>
          )}

          {notice.attachments && notice.attachments.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">Attachments:</p>
              <div className="flex flex-wrap gap-2">
                {notice.attachments.map((attachment, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // TODO: Implement actual file download from cloud storage
                      console.log("Download:", attachment.name)
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs transition-colors"
                  >
                    <FileText size={14} />
                    <span className="max-w-[120px] truncate">{attachment.name}</span>
                    <Download size={12} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            {notice.author && (
              <span>By: {notice.author}</span>
            )}
            {notice.expiryDate && !isExpired && (
              <span className="text-orange-600 dark:text-orange-400">
                Expires: {formatDate(notice.expiryDate)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
