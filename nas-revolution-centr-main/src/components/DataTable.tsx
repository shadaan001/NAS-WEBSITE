import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { 
  CaretUp, 
  CaretDown, 
  MagnifyingGlass, 
  FileCsv, 
  FilePdf, 
  Eye,
  PencilSimple,
  Trash
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  title: string
  columns: DataTableColumn[]
  data: any[]
  actions?: ("view" | "edit" | "delete")[]
  onView?: (row: any) => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  searchable?: boolean
  searchPlaceholder?: string
  exportable?: boolean
  pageSize?: number
  delay?: number
}

export default function DataTable({
  title,
  columns,
  data,
  actions = [],
  onView,
  onEdit,
  onDelete,
  searchable = true,
  searchPlaceholder = "Search...",
  exportable = true,
  pageSize = 10,
  delay = 0,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(pageSize)

  const filteredData = useMemo(() => {
    if (!searchQuery) return data

    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(searchQuery.toLowerCase())
      })
    )
  }, [data, searchQuery, columns])

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      
      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })
  }, [filteredData, sortColumn, sortDirection])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, rowsPerPage])

  const totalPages = Math.ceil(sortedData.length / rowsPerPage)

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const exportToCSV = () => {
    const headers = columns.map(col => col.label).join(",")
    const rows = sortedData.map(row =>
      columns.map(col => {
        const value = row[col.key]
        const stringValue = value === null || value === undefined ? "" : String(value)
        return `"${stringValue.replace(/"/g, '""')}"`
      }).join(",")
    )
    
    const csv = [headers, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    console.log("PDF export not implemented - requires server-side rendering")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mb-8"
    >
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            
            <div className="flex flex-wrap items-center gap-3">
              {searchable && (
                <div className="relative flex-1 min-w-[200px]">
                  <MagnifyingGlass
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
              )}
              
              {exportable && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCSV}
                    className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                  >
                    <FileCsv size={16} />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToPDF}
                    className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                  >
                    <FilePdf size={16} />
                    PDF
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5 hover:bg-white/5">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`text-white ${col.sortable ? "cursor-pointer select-none" : ""}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.label}</span>
                      {col.sortable && (
                        <div className="flex flex-col">
                          <CaretUp
                            size={12}
                            weight={sortColumn === col.key && sortDirection === "asc" ? "fill" : "regular"}
                            className={sortColumn === col.key && sortDirection === "asc" ? "text-blue-400" : "text-gray-400"}
                          />
                          <CaretDown
                            size={12}
                            weight={sortColumn === col.key && sortDirection === "desc" ? "fill" : "regular"}
                            className={sortColumn === col.key && sortDirection === "desc" ? "text-blue-400" : "text-gray-400"}
                          />
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="text-right text-white">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-12 text-muted-foreground">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <motion.tr
                    key={row.id || rowIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                    className="group hover:bg-muted/30 transition-colors border-b border-border/30"
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key} className="py-3">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {actions.includes("view") && onView && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onView(row)}
                              className="h-8 w-8 p-0"
                              aria-label="View"
                            >
                              <Eye size={16} />
                            </Button>
                          )}
                          {actions.includes("edit") && onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(row)}
                              className="h-8 w-8 p-0"
                              aria-label="Edit"
                            >
                              <PencilSimple size={16} />
                            </Button>
                          )}
                          {actions.includes("delete") && onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(row)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              aria-label="Delete"
                            >
                              <Trash size={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page:</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={(value) => {
                  setRowsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 px-3"
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 px-3"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3"
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3"
                >
                  Last
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
