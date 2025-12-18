import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import { CurrencyDollar, Plus, MagnifyingGlass, CheckCircle, Warning, Receipt, ArrowLeft } from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import GradientBackground from "@/components/school/GradientBackground"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { FeeRecord, StudentRecord } from "@/types/admin"

interface AdminFeesManagementProps {
  onBack?: () => void
}

export default function AdminFeesManagement({ onBack }: AdminFeesManagementProps = {}) {
  const [fees, setFees] = useKV<FeeRecord[]>("admin-fee-records", [])
  const [students] = useKV<StudentRecord[]>("admin-students-records", [])
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "unpaid" | "overdue">("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null)
  
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    dueDate: ""
  })

  const feesList = fees || []
  const studentsList = students || []

  const filteredFees = useMemo(() => {
    return feesList.filter(fee => {
      const student = studentsList.find(s => s.id === fee.studentId)
      const matchesSearch = 
        fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student?.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fee.id.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = filterStatus === "all" || fee.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
  }, [feesList, studentsList, searchQuery, filterStatus])

  const stats = useMemo(() => {
    const paid = feesList.filter(f => f.status === "paid")
    const unpaid = feesList.filter(f => f.status === "unpaid" || f.status === "overdue")
    const totalCollected = paid.reduce((sum, f) => sum + f.amount, 0)
    const totalPending = unpaid.reduce((sum, f) => sum + f.amount, 0)
    
    return { paid: paid.length, unpaid: unpaid.length, totalCollected, totalPending }
  }, [feesList])

  const handleAdd = () => {
    if (!formData.studentId || !formData.amount || !formData.dueDate) {
      toast.error("Please fill all fields")
      return
    }

    const student = studentsList.find(s => s.id === formData.studentId)
    if (!student) {
      toast.error("Student not found")
      return
    }

    const dueDate = new Date(formData.dueDate)
    const today = new Date()
    const status: FeeRecord["status"] = dueDate < today ? "overdue" : "unpaid"

    const newFee: FeeRecord = {
      id: `FEE${String(feesList.length + 1).padStart(4, '0')}`,
      studentId: student.id,
      studentName: student.name,
      class: student.class,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      status
    }

    setFees((current) => [...(current || []), newFee])
    setFormData({ studentId: "", amount: "", dueDate: "" })
    setIsAddOpen(false)
    toast.success("Fee record added")
  }

  const handleMarkPaid = (paymentMode: string) => {
    if (!selectedFee) return

    const receiptNumber = `RCP${Date.now()}`
    
    setFees((current) => 
      (current || []).map(f => 
        f.id === selectedFee.id 
          ? { 
              ...f, 
              status: "paid", 
              paidDate: new Date().toISOString().split('T')[0],
              paymentMode: paymentMode as any,
              receiptNumber
            }
          : f
      )
    )
    
    setIsPaymentOpen(false)
    setSelectedFee(null)
    toast.success(`Payment recorded. Receipt: ${receiptNumber}`)
  }

  return (
    <div className="pb-24 px-4 pt-16 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-2"
      >
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-white/10 p-2"
          >
            <ArrowLeft size={24} weight="bold" className="text-white" />
          </Button>
        )}
        <BubbleIcon size="md" variant="orange">
          <CurrencyDollar size={28} weight="fill" />
        </BubbleIcon>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Fee Management</h1>
          <p className="text-sm text-gray-300">Track student payments</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30">
              <Plus size={18} weight="bold" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1f3a] border-white/10 text-white backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Add Fee Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student">Student *</Label>
                <Select value={formData.studentId} onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}>
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentsList.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} - {student.class}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="e.g., 5000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>

              <div className="p-3 rounded-xl bg-muted/30 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Note:</p>
                <p>This is a front-end only implementation. For production, integrate with a payment gateway like Razorpay or Stripe.</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">Add Fee Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-2"
      >
        <Card className="p-3 rounded-xl text-center bg-secondary/10">
          <p className="text-xs text-muted-foreground mb-1">Paid</p>
          <p className="text-xl font-bold text-heading text-secondary">{stats.paid}</p>
        </Card>
        <Card className="p-3 rounded-xl text-center bg-destructive/10">
          <p className="text-xs text-muted-foreground mb-1">Unpaid</p>
          <p className="text-xl font-bold text-heading text-destructive">{stats.unpaid}</p>
        </Card>
        <Card className="p-3 rounded-xl text-center bg-primary/10">
          <p className="text-xs text-muted-foreground mb-1">Collected</p>
          <p className="text-base font-bold text-heading text-primary">₹{stats.totalCollected.toLocaleString()}</p>
        </Card>
        <Card className="p-3 rounded-xl text-center bg-accent/10">
          <p className="text-xs text-muted-foreground mb-1">Pending</p>
          <p className="text-base font-bold text-heading text-accent">₹{stats.totalPending.toLocaleString()}</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="relative">
          <MagnifyingGlass 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder="Search by student name, class, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filterStatus === "paid" ? "default" : "outline"}
            onClick={() => setFilterStatus("paid")}
          >
            Paid
          </Button>
          <Button
            size="sm"
            variant={filterStatus === "unpaid" ? "default" : "outline"}
            onClick={() => setFilterStatus("unpaid")}
          >
            Unpaid
          </Button>
          <Button
            size="sm"
            variant={filterStatus === "overdue" ? "default" : "outline"}
            onClick={() => setFilterStatus("overdue")}
          >
            Overdue
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {filteredFees.map((fee, idx) => (
          <motion.div
            key={fee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.05 }}
          >
            <Card className="p-4 rounded-2xl card-shadow">
              <div className="flex items-start gap-3">
                <BubbleIcon 
                  size="md" 
                  variant={fee.status === "paid" ? "green" : fee.status === "overdue" ? "orange" : "blue"}
                >
                  {fee.status === "paid" ? (
                    <CheckCircle size={24} weight="fill" />
                  ) : (
                    <CurrencyDollar size={24} weight="fill" />
                  )}
                </BubbleIcon>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-foreground">{fee.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{fee.class}</p>
                    </div>
                    <p className="text-lg font-bold text-heading">₹{fee.amount.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {fee.status === "paid" ? (
                      <>
                        <Badge variant="default" className="bg-secondary text-secondary-foreground">
                          Paid
                        </Badge>
                        {fee.paidDate && (
                          <Badge variant="outline" className="text-xs">
                            Paid on {new Date(fee.paidDate).toLocaleDateString('en-IN')}
                          </Badge>
                        )}
                        {fee.receiptNumber && (
                          <Badge variant="outline" className="text-xs">
                            {fee.receiptNumber}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <>
                        <Badge variant={fee.status === "overdue" ? "destructive" : "secondary"}>
                          {fee.status === "overdue" ? "Overdue" : "Unpaid"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Due: {new Date(fee.dueDate).toLocaleDateString('en-IN')}
                        </Badge>
                      </>
                    )}
                  </div>

                  {fee.status !== "paid" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedFee(fee)
                        setIsPaymentOpen(true)
                      }}
                      className="w-full"
                    >
                      Mark as Paid
                    </Button>
                  )}

                  {fee.status === "paid" && fee.receiptNumber && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => toast.success(`Receipt: ${fee.receiptNumber}`)}
                    >
                      <Receipt size={16} />
                      View Receipt
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredFees.length === 0 && (
          <Card className="p-8 rounded-2xl card-shadow">
            <div className="text-center">
              <BubbleIcon size="lg" variant="orange" className="mx-auto mb-3">
                <CurrencyDollar size={32} weight="fill" />
              </BubbleIcon>
              <p className="text-sm text-muted-foreground">
                {searchQuery || filterStatus !== "all" ? "No records found" : "No fee records yet"}
              </p>
            </div>
          </Card>
        )}
      </motion.div>

      {selectedFee && (
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Card className="p-4 rounded-xl bg-muted/30">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student:</span>
                    <span className="font-semibold">{selectedFee.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-lg">₹{selectedFee.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span>{new Date(selectedFee.dueDate).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </Card>

              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleMarkPaid("cash")}
                    className="h-auto py-3"
                  >
                    Cash
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleMarkPaid("online")}
                    className="h-auto py-3"
                  >
                    Online
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleMarkPaid("cheque")}
                    className="h-auto py-3"
                  >
                    Cheque
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleMarkPaid("card")}
                    className="h-auto py-3"
                  >
                    Card
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex gap-2">
                  <Warning size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <p className="font-semibold mb-1">TODO: Payment Gateway Integration</p>
                    <p>For production, integrate Razorpay, Stripe, or PayU to process real payments securely.</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
