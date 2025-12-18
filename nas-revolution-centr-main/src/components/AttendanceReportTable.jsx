import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, ArrowDown, FileDown } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AttendanceReportTable({ data, showFilters = true }) {
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 15

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return []

    return [...data].sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === "date") {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }, [data, sortField, sortDirection])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage])

  const totalPages = Math.ceil(sortedData.length / rowsPerPage)

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ArrowUp size={16} className="inline ml-1" />
    ) : (
      <ArrowDown size={16} className="inline ml-1" />
    )
  }

  const getAttendanceBadgeVariant = (status) => {
    switch (status) {
      case "Present":
        return "default"
      case "Absent":
        return "destructive"
      case "Late":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusBadgeVariant = (status) => {
    return status === "Held" ? "default" : "outline"
  }

  if (!data || data.length === 0) {
    return (
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-heading">Attendance Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No attendance data found for the selected filters.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your date range or filter criteria.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-shadow overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-heading">Attendance Report Data</CardTitle>
          <div className="text-sm text-muted-foreground">
            Showing {sortedData.length} record{sortedData.length !== 1 ? "s" : ""}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("teacher")}
                >
                  Teacher <SortIcon field="teacher" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("student")}
                >
                  Student <SortIcon field="student" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("class")}
                >
                  Class <SortIcon field="class" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("subject")}
                >
                  Subject <SortIcon field="subject" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("date")}
                >
                  Date <SortIcon field="date" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  Status <SortIcon field="status" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("attendanceStatus")}
                >
                  Attendance <SortIcon field="attendanceStatus" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row, index) => (
                  <motion.tr
                    key={`${row.teacherId}-${row.studentId}-${row.date}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="border-b hover:bg-accent/10 transition-all duration-200 group"
                    style={{
                      boxShadow: "0 0 0 0 rgba(var(--primary) / 0)",
                      transition: "box-shadow 0.3s ease, transform 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 0 20px 2px rgba(var(--primary) / 0.3)"
                      e.currentTarget.style.transform = "translateY(-2px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 0 0 0 rgba(var(--primary) / 0)"
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    <TableCell className="font-medium">{row.teacher}</TableCell>
                    <TableCell>{row.student}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.class}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1">
                        {row.subject}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(row.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(row.status)}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getAttendanceBadgeVariant(row.attendanceStatus)}>
                        {row.attendanceStatus}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
