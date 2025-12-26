import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, ArrowLeft, Copy, Link as LinkIcon, CheckCircle, Sparkle } from "@phosphor-icons/react"
import { toast } from "sonner"
import GradientBackground from "@/components/school/GradientBackground"
import { NotificationService } from "@/services/notification"
import axios from "axios"
import qrCodeImage from "@/assets/images/shaddanQR.jpeg"

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4d25hbHByc3d0eW5neHBzYmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNTUyMTMsImV4cCI6MjA4MTczMTIxM30.cBblq6oVFM63n_jljw6xw1RU0SHudrT96h8jiumqdi8"

export default function PublicPaymentsPage() {
  const [studentId, setStudentId] = useState("")
  const [amount, setAmount] = useState("")
  const [name, setName] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [email, setEmail] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [linkRequested, setLinkRequested] = useState(false)
  const upiId = "9073040640@ybl"
  const suggestedAmounts = [1100, 1200, 1600]

  const handleBackToHome = () => {
    window.location.reload()
  }

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    toast.success("UPI ID copied to clipboard!", {
      description: "You can now paste it in your UPI app",
    })
  }

  const handleSuggestedAmount = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toString())
  }

  const handleRequestPaymentLink = async () => {
    if (!name || !amount) {
      toast.error("Please enter student name and amount")
      return
    }

    setLinkRequested(true)
    
    await NotificationService.sendPaymentLinkRequest({
      studentName: name,
      studentId: studentId || undefined,
      amount: parseFloat(amount)
    })
    
    setTimeout(() => {
      toast.success("Payment link request sent!", {
        description: "We'll send you a secure UPI payment link shortly via WhatsApp or SMS.",
        duration: 5000,
      })
      setLinkRequested(false)
    }, 1500)
  }

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!studentId && !name) {
      toast.error("Please enter either student ID or name")
      return
    }

    if (!amount) {
      toast.error("Please enter the payment amount")
      return
    }

    if (!email || !transactionId) {
      toast.error("Please enter email and transaction ID")
      return
    }

    setIsProcessing(true)

    try {
      await axios.post("https://uxwnalprswtyngxpsbez.supabase.co/functions/v1/resend-email", {
        to: email,
        subject: `Payment Confirmation for ${name}`,
        text: `Dear ${name},\n\nThank you for your payment.\n\nDetails:\nName: ${name}\nRoll Number: ${rollNumber}\nEmail: ${email}\nAmount: ₹${amount}\nTransaction ID: ${transactionId}\n\nWe will verify your payment and notify you shortly.\n\nBest regards,\nNAS Revolution Centre`,
      }, {
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
      })

      toast.success("Payment Submitted Successfully!", {
        description: `₹${amount} payment for ${name || studentId} has been submitted. Admin will verify shortly and you'll be notified.`,
        duration: 6000,
      })

      setStudentId("")
      setAmount("")
      setName("")
      setRollNumber("")
      setEmail("")
      setTransactionId("")
    } catch (error) {
      toast.error("Failed to send confirmation email. Please try again later.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen relative bg-background overflow-hidden">
      <GradientBackground />
      <button
        onClick={handleBackToHome}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-blue-400 transition-colors group bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="relative z-10 container mx-auto px-4 py-24 max-w-5xl">
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Make a Payment
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Submit your tuition fees securely using UPI or request a payment link
          </p>
        </div>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Important Notice</p>
          <p>Before paying the admission fee, please reach out to our offline counselors for guidance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/10 rounded-t-3xl">
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <CreditCard size={20} className="text-white" />
                  </div>
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmitPayment} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="student-name" className="text-sm font-semibold text-white">Student Name *</Label>
                    <Input
                      id="student-name"
                      type="text"
                      placeholder="Enter student name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roll-number" className="text-sm font-semibold text-white">Roll Number *</Label>
                    <Input
                      id="roll-number"
                      type="text"
                      placeholder="Enter roll number"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transaction-id" className="text-sm font-semibold text-white">Transaction ID *</Label>
                    <Input
                      id="transaction-id"
                      type="text"
                      placeholder="Enter transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="amount" className="text-sm font-semibold text-white">Amount (₹) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-12 text-center text-lg font-semibold bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
                      min="1"
                      required
                    />
                    <div className="flex gap-2">
                      {suggestedAmounts.map((suggested) => (
                        <Button
                          key={suggested}
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuggestedAmount(suggested)}
                          className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white transition-all"
                        >
                          ₹{suggested}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-4 text-center">
                      After making the payment, submit this form so we can verify your transaction
                    </p>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        <>
                          <CheckCircle className="mr-2" size={20} />
                          I Have Paid - Submit
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Copy size={20} className="text-white" />
                    </div>
                    Pay via UPI
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center space-y-2 pb-4">
                    <p className="text-sm text-gray-300">
                      Scan the QR code below or copy our UPI ID to pay directly:
                    </p>
                    <img
                      src={qrCodeImage}
                      alt="QR Code for Payment"
                      className="mx-auto w-50 h-50 shadow-lg"
                    />
                    <div className="flex flex-wrap gap-2 justify-center text-xs font-semibold">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Google Pay</span>
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">PhonePe</span>
                      <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">Paytm</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-400 uppercase tracking-wide block mb-1">UPI ID:</span>
                      <span className="font-mono font-bold text-base block truncate text-white">{upiId}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleCopyUPI}
                      className="ml-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 flex-shrink-0 shadow-lg shadow-blue-500/30"
                    >
                      <Copy size={16} className="mr-1.5" />
                      Copy
                    </Button>
                  </div>

                  <div className="pt-2 text-center">
                    <p className="text-xs text-gray-400">
                      Click "Copy" → Open any UPI app → Paste & Pay
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl transition-all duration-300" />
              <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-base mb-3 flex items-center gap-2 text-white">
                    <Sparkle className="text-blue-400" size={18} weight="fill" />
                    How It Works
                  </h3>
                  <ol className="space-y-2.5 text-sm text-gray-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-500/30">1</span>
                      <span>Copy the UPI ID or request a payment link</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-500/30">2</span>
                      <span>Complete the payment via any UPI app</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-500/30">3</span>
                      <span>Fill the form with your details & submit</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-500/30">4</span>
                      <span>Admin will verify & confirm within 24 hours</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <CheckCircle className="text-green-400" size={20} weight="fill" />
            <p className="text-sm text-gray-300">
              <strong className="text-white">Secure & Verified:</strong> All payments are verified by our admin team
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
