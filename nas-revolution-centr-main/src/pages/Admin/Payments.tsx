import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Download, 
  MagnifyingGlass, 
  Funnel,
  CheckCircle,
  Receipt,
  FilePdf,
  FileCsv,
  Clock
} from "@phosphor-icons/react"
import PaymentCard from "@/components/PaymentCard"
import { LocalDB } from "@/lib/useLocalDB"
import { toast } from "sonner"

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [filteredPayments, setFilteredPayments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [classFilter, setClassFilter] = useState<string>("all")
  const [selectedPayments, setSelectedPayments] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadPayments()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [payments, searchQuery, statusFilter, classFilter])

  const loadPayments = () => {
    const allPayments = LocalDB.getAllPayments()
    setPayments(allPayments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }

  const applyFilters = () => {
    let filtered = [...payments]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        p =>
          p.studentName.toLowerCase().includes(query) ||
          p.studentId.toLowerCase().includes(query) ||
          p.class.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    if (classFilter !== "all") {
      filtered = filtered.filter(p => p.class === classFilter)
    }

    setFilteredPayments(filtered)
  }

  const handleVerifyPayment = (id: string) => {
    try {
      LocalDB.updatePaymentStatus(id, "Confirmed")
      loadPayments()
      toast.success("Payment verified successfully!")
    } catch (error) {
      toast.error("Failed to verify payment")
      console.error(error)
    }
  }

  const handleDeletePayment = (id: string) => {
    if (!confirm("Are you sure you want to delete this payment record?")) {
      return
    }

    try {
      LocalDB.deletePayment(id)
      loadPayments()
      toast.success("Payment deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete payment")
      console.error(error)
    }
  }

  const handleBatchVerify = () => {
    if (selectedPayments.size === 0) {
      toast.error("No payments selected")
      return
    }

    try {
      selectedPayments.forEach(id => {
        const payment = payments.find(p => p.id === id)
        if (payment?.status === "Pending Verification") {
          LocalDB.updatePaymentStatus(id, "Confirmed")
        }
      })
      setSelectedPayments(new Set())
      loadPayments()
      toast.success(`${selectedPayments.size} payment(s) verified!`)
    } catch (error) {
      toast.error("Failed to verify payments")
      console.error(error)
    }
  }

  const handleExportCSV = () => {
    try {
      const csv = LocalDB.exportPaymentsToCSV(
        filteredPayments.length === payments.length 
          ? undefined 
          : filteredPayments.map(p => p.id)
      )
      
      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `payments-export-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success("Payments exported to CSV successfully!")
    } catch (error) {
      toast.error("Failed to export payments")
      console.error(error)
    }
  }

  const handleExportPDF = () => {
    toast.info("PDF Export functionality", {
      description: "TODO: Integrate PDF generation library (jsPDF or similar)",
      duration: 5000,
    })
  }

  const uniqueClasses = Array.from(new Set(payments.map(p => p.class))).sort()

  const stats = {
    total: payments.length,
    confirmed: payments.filter(p => p.status === "Confirmed").length,
    pending: payments.filter(p => p.status === "Pending Verification").length,
    totalAmount: payments
      .filter(p => p.status === "Confirmed")
      .reduce((sum, p) => sum + p.amount, 0),
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Payment Management
            </h1>
            <p className="text-gray-300">
              Verify and manage student payments
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
            >
              <Funnel className="mr-2" size={18} />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Total Payments</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                  </div>
                  <Receipt size={40} className="text-blue-400/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Confirmed</p>
                    <p className="text-3xl font-bold text-green-400">{stats.confirmed}</p>
                  </div>
                  <CheckCircle size={40} className="text-green-400/20" weight="fill" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Pending</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.pending}</p>
                  </div>
                  <Clock size={40} className="text-blue-400/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
              <CardContent className="p-6">
                <div>
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Total Collected</p>
                  <p className="text-3xl font-bold text-purple-400">₹{stats.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showFilters && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl transition-all duration-300" />
            <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/10 rounded-t-3xl">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Funnel size={20} className="text-blue-400" />
                  Filters
                </CardTitle>
                <CardDescription className="text-gray-300">Filter payments by various criteria</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search" className="font-semibold text-white">Search</Label>
                    <div className="relative">
                      <MagnifyingGlass
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="search"
                        placeholder="Student name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="font-semibold text-white">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger id="status" className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f3a] border-white/10 text-white">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class" className="font-semibold text-white">Class</Label>
                    <Select value={classFilter} onValueChange={setClassFilter}>
                      <SelectTrigger id="class" className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="All classes" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f3a] border-white/10 text-white">
                        <SelectItem value="all">All Classes</SelectItem>
                        {uniqueClasses.map((className) => (
                          <SelectItem key={className} value={className}>
                            {className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setClassFilter("all")
                    }}
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                  >
                    Clear Filters
                  </Button>
                  {selectedPayments.size > 0 && (
                    <Button
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg shadow-green-500/30"
                      onClick={handleBatchVerify}
                    >
                      <CheckCircle className="mr-2" />
                      Verify Selected ({selectedPayments.size})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Receipt size={24} className="text-blue-400" />
              Payment Records
              <Badge variant="secondary" className="ml-2 text-base bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {filteredPayments.length}
              </Badge>
            </h2>
            {filteredPayments.length !== payments.length && (
              <Badge variant="outline" className="border-2 border-blue-400 text-blue-400">
                Showing {filteredPayments.length} of {payments.length}
              </Badge>
            )}
          </div>

          {filteredPayments.length === 0 ? (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl transition-all duration-300" />
              <Card className="relative bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-16 text-center">
                  <CreditCard size={80} className="mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {payments.length === 0
                      ? "No payment records yet"
                      : "No payments match your filters"}
                  </h3>
                  <p className="text-gray-300">
                    {payments.length === 0
                      ? "Payment records will appear here once students make payments"
                      : "Try adjusting your filter criteria"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPayments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  actions={["verify", "delete"]}
                  onVerify={handleVerifyPayment}
                  onDelete={handleDeletePayment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
