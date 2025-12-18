import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MagnifyingGlass, Pin, Bell } from "@phosphor-icons/react"
import { LocalDB } from "@/lib/useLocalDB"
import NoticeCard from "@/components/NoticeCard"
import { useKV } from "@github/spark/hooks"

export default function StudentNoticesPage() {
  const [studentClass] = useKV("student-class", "Class 10")
  const [notices, setNotices] = useState([])
  const [filteredNotices, setFilteredNotices] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    loadNotices()
  }, [studentClass])

  useEffect(() => {
    applyFilters()
  }, [notices, searchQuery, filterType])

  const loadNotices = () => {
    const activeNotices = LocalDB.getActiveNoticesForClass(studentClass)
    setNotices(activeNotices)
  }

  const applyFilters = () => {
    let filtered = [...notices]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(query) ||
        notice.content.toLowerCase().includes(query)
      )
    }

    if (filterType === "pinned") {
      filtered = filtered.filter(notice => notice.pinned)
    } else if (filterType === "general") {
      filtered = filtered.filter(notice => notice.class === null)
    } else if (filterType === "class") {
      filtered = filtered.filter(notice => notice.class === studentClass)
    }

    filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    setFilteredNotices(filtered)
  }

  const pinnedNotices = filteredNotices.filter(n => n.pinned)
  const regularNotices = filteredNotices.filter(n => !n.pinned)

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Bell size={24} weight="fill" className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-heading mb-1">Notice Board</h1>
            <p className="text-muted-foreground">
              Showing notices for <Badge variant="secondary" className="ml-1">{studentClass}</Badge>
            </p>
          </div>
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
                aria-label="Search notices"
              />
            </div>

            <Tabs value={filterType} onValueChange={setFilterType} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pinned">
                  <Pin size={14} className="mr-1" />
                  Pinned
                </TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="class">My Class</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredNotices.length} {filteredNotices.length === 1 ? 'notice' : 'notices'} available
            </p>
            {pinnedNotices.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Pin size={12} className="mr-1" />
                {pinnedNotices.length} pinned
              </Badge>
            )}
          </div>
        </div>

        {filteredNotices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-lg border p-12 text-center"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No notices found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "There are no active notices at this time"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {pinnedNotices.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Pin size={20} weight="fill" className="text-primary" />
                  <h2 className="text-xl font-semibold text-heading">Pinned Notices</h2>
                  <Badge variant="secondary">{pinnedNotices.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinnedNotices.map((notice, index) => (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NoticeCard notice={notice} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {regularNotices.length > 0 && (
              <div>
                {pinnedNotices.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Bell size={20} className="text-muted-foreground" />
                    <h2 className="text-xl font-semibold text-heading">Recent Notices</h2>
                    <Badge variant="outline">{regularNotices.length}</Badge>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {regularNotices.map((notice, index) => (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (pinnedNotices.length + index) * 0.05 }}
                    >
                      <NoticeCard notice={notice} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-muted/50 rounded-lg border border-border/50"
        >
          <h3 className="text-sm font-semibold mb-2">Information</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Pinned notices appear at the top and are important announcements</li>
            <li>• General notices are visible to all classes</li>
            <li>• Class-specific notices are only for your class</li>
            <li>• Download attachments by clicking on them</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
