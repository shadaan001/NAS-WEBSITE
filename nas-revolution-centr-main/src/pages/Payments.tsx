import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Receipt, Clock } from "@phosphor-icons/react"
import PaymentCard from "@/components/PaymentCard"
import PaymentModal from "@/components/PaymentModal"
import { LocalDB } from "@/lib/useLocalDB"
import { NotificationService } from "@/services/notification"
import { toast } from "sonner"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [student, setStudent] = useState<any>(null)
  const studentId = "s-001"

  useEffect(() => {
    loadPayments()
    const studentData = LocalDB.getStudent(studentId)
    setStudent(studentData)
  }, [])

  const loadPayments = () => {
    const studentPayments = LocalDB.getPaymentsByStudent(studentId)
    setPayments(studentPayments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }

  const handleSubmitPayment = async (amount: number) => {
    try {
      const student = LocalDB.getStudent(studentId)
      if (!student) {
        toast.error("Student not found")
        return
      }

      const newPayment = {
        studentName: student.name,
        studentId: student.id,
        class: student.class,
        amount,
        method: "UPI",
        status: "Pending Verification",
        date: new Date().toISOString().split("T")[0],
      }

      LocalDB.addPayment(newPayment)
      
      await NotificationService.sendPaymentNotification({
        studentName: student.name,
        studentId: student.id,
        amount
      })
      
      loadPayments()
      toast.success("Payment submitted successfully!", {
        description: `Amount: ₹${amount} - Admin will verify and you'll be notified.`,
        duration: 5000,
      })
    } catch (error) {
      toast.error("Failed to submit payment")
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Payments
            </h1>
            <p className="text-gray-300">
              View your payment history and make new payments
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
            onClick={() => setShowPaymentModal(true)}
          >
            <CreditCard className="mr-2" size={20} />
            Make Payment
          </Button>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
          <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/10 rounded-t-3xl">
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Receipt size={24} className="text-blue-400" />
                Payment Summary
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your payment overview
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-5 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Total Paid</p>
                  <p className="text-3xl font-bold text-green-400">
                    ₹{payments
                      .filter(p => p.status === "Confirmed")
                      .reduce((sum, p) => sum + p.amount, 0)}
                  </p>
                </div>
                <div className="text-center p-5 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock size={16} className="text-blue-400" />
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Pending</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">
                    ₹{payments
                      .filter(p => p.status === "Pending Verification")
                      .reduce((sum, p) => sum + p.amount, 0)}
                  </p>
                </div>
                <div className="text-center p-5 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Total Transactions</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {payments.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <Receipt size={24} className="text-blue-400" />
            Payment History
          </h2>
          {payments.length === 0 ? (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl transition-all duration-300" />
              <Card className="relative bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-12 text-center">
                  <Receipt size={64} className="mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold text-white mb-2">No payment history yet</h3>
                  <p className="text-gray-300 mb-6">
                    Make your first payment to get started
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30"
                  >
                    <CreditCard className="mr-2" />
                    Make Your First Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>
          )}
        </div>
      </div>

      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onSubmitPayment={handleSubmitPayment}
        studentName={student?.name}
        studentId={student?.id}
      />
    </div>
  )
}
