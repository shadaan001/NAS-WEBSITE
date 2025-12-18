import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  MagnifyingGlass, 
  FunnelSimple, 
  DownloadSimple,
  List,
  SquaresFour,
  Pin
} from "@phosphor-icons/react"
import { LocalDB } from "@/lib/useLocalDB"
import NoticeCard from "@/components/NoticeCard"
import NoticeForm from "@/components/NoticeForm"
import { toast } from "sonner"
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

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([])
  const [filteredNotices, setFilteredNotices] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterClass, setFilterClass] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [showForm, setShowForm] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    loadNotices()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [notices, searchQuery, filterClass, filterStatus])

  const loadNotices = () => {
    const allNotices = LocalDB.getAllNotices()
    setNotices(allNotices)
  }

  const applyFilters = () => {
    let filtered = [...notices]
    const now = new Date().toISOString()

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(query) ||
        notice.content.toLowerCase().includes(query)
      )
    }

    if (filterClass !== "all") {
      if (filterClass === "general") {
        filtered = filtered.filter(notice => notice.class === null)
      } else {
        filtered = filtered.filter(notice => notice.class === filterClass)
      }
    }

    if (filterStatus === "pinned") {
      filtered = filtered.filter(notice => notice.pinned)
    } else if (filterStatus === "active") {
      filtered = filtered.filter(notice => !notice.expiryDate || notice.expiryDate > now)
    } else if (filterStatus === "expired") {
      filtered = filtered.filter(notice => notice.expiryDate && notice.expiryDate < now)
    }

    filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    setFilteredNotices(filtered)
  }

  const handleCreateNotice = (noticeData) => {
    try {
      LocalDB.addNotice(noticeData)
      loadNotices()
      toast.success("Notice created successfully")
    } catch (error) {
      toast.error("Failed to create notice")
      console.error(error)
    }
  }

  const handleUpdateNotice = (noticeData) => {
    try {
      LocalDB.updateNotice(editingNotice.id, noticeData)
      loadNotices()
      setEditingNotice(null)
      toast.success("Notice updated successfully")
    } catch (error) {
      toast.error("Failed to update notice")
      console.error(error)
    }
  }

  const handleDeleteNotice = () => {
    if (!deleteId) return

    try {
      LocalDB.deleteNotice(deleteId)
      loadNotices()
      toast.success("Notice deleted successfully")
    } catch (error) {
      toast.error("Failed to delete notice")
      console.error(error)
    } finally {
      setDeleteId(null)
    }
  }

  const handlePinToggle = (noticeId) => {
    try {
      const notice = notices.find(n => n.id === noticeId)
      if (notice) {
        LocalDB.updateNotice(noticeId, { pinned: !notice.pinned })
        loadNotices()
        toast.success(notice.pinned ? "Notice unpinned" : "Notice pinned")
      }
    } catch (error) {
      toast.error("Failed to update notice")
      console.error(error)
    }
  }

  const handleExportCSV = () => {
    try {
      const csv = LocalDB.exportNoticesToCSV(filteredNotices.map(n => n.id))
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `notices-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success("Notices exported successfully")
    } catch (error) {
      toast.error("Failed to export notices")
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">Notice Board</h1>
            <p className="text-gray-300">Manage school notices and announcements</p>
          </div>

          <Button onClick={() => {
            setEditingNotice(null)
            setShowForm(true)
          }} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30">
            <Plus size={18} className="mr-2" />
            Create Notice
          </Button>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-full md:w-48">
                <FunnelSimple size={16} className="mr-2" />
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="general">General</SelectItem>
                {CLASSES.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pinned">
                  <Pin size={14} className="mr-1" />
                  Pinned
                </TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredNotices.length} of {notices.length} notices
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={filteredNotices.length === 0}
              >
                <DownloadSimple size={16} className="mr-2" />
                Export CSV
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <SquaresFour size={16} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {filteredNotices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-lg border p-12 text-center"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Pin size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No notices found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterClass !== "all" || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Create your first notice to get started"}
            </p>
            {!searchQuery && filterClass === "all" && filterStatus === "all" && (
              <Button onClick={() => {
                setEditingNotice(null)
                setShowForm(true)
              }}>
                <Plus size={18} className="mr-2" />
                Create Notice
              </Button>
            )}
          </motion.div>
        ) : (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }>
            {filteredNotices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NoticeCard
                  notice={notice}
                  actions={["pin", "edit", "delete"]}
                  onEdit={(notice) => {
                    setEditingNotice(notice)
                    setShowForm(true)
                  }}
                  onDelete={(id) => setDeleteId(id)}
                  onPin={handlePinToggle}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <NoticeForm
        open={showForm}
        onOpenChange={setShowForm}
        notice={editingNotice}
        onSubmit={editingNotice ? handleUpdateNotice : handleCreateNotice}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNotice} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
