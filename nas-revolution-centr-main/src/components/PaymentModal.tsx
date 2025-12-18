import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CreditCard, Link as LinkIcon, CheckCircle } from "@phosphor-icons/react"
import { toast } from "sonner"
import { NotificationService } from "@/services/notification"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitPayment: (amount: number) => void
  studentName?: string
  studentId?: string
}

export default function PaymentModal({ open, onOpenChange, onSubmitPayment, studentName = "Student", studentId }: PaymentModalProps) {
  const [amount, setAmount] = useState("")
  const [linkRequested, setLinkRequested] = useState(false)
  
  const upiId = "9073040640@ybl"
  const suggestedAmounts = [1100, 1200, 1600]

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    toast.success("UPI ID copied to clipboard!", {
      description: "You can now paste it in your UPI app",
    })
  }

  const handleRequestPaymentLink = async () => {
    const amountNum = parseFloat(amount)
    if (!amountNum || amountNum <= 0) {
      toast.error("Please enter a valid amount first")
      return
    }

    setLinkRequested(true)
    
    await NotificationService.sendPaymentLinkRequest({
      studentName,
      studentId,
      amount: amountNum
    })
    
    toast.success("Payment link request sent!", {
      description: "We'll send you a secure UPI payment link shortly via WhatsApp or SMS.",
      duration: 5000,
    })

    setTimeout(() => {
      setLinkRequested(false)
      onSubmitPayment(amountNum)
      setAmount("")
      onOpenChange(false)
    }, 2000)
  }

  const handleSuggestedAmount = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toString())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#1a1f3a] border-white/10 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CreditCard className="text-white" size={24} />
            </div>
            Make Payment
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-gray-300">
            Choose your preferred payment method below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-semibold text-white">Payment Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="1"
              className="h-14 text-lg font-semibold text-center bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
            />
            <div className="flex gap-2">
              {suggestedAmounts.map((suggested) => (
                <Button
                  key={suggested}
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1a1f3a] px-3 text-gray-400 font-medium">Payment Methods</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <Copy className="text-white" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 text-white">Pay via UPI</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Copy the UPI ID below and pay directly through Google Pay, PhonePe, Paytm, or any UPI app
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">UPI ID</p>
                      <p className="font-mono font-semibold text-white truncate">{upiId}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleCopyUPI}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 flex-shrink-0 shadow-lg shadow-blue-500/30"
                    >
                      <Copy size={16} className="mr-1.5" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1a1f3a] px-3 text-gray-400">Or</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                  <LinkIcon className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 text-white">Request Payment Link</h3>
                  <p className="text-sm text-gray-300">
                    We'll send you a secure UPI payment link via WhatsApp or SMS
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 text-base font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
                onClick={handleRequestPaymentLink}
                disabled={!amount || parseFloat(amount) <= 0 || linkRequested}
              >
                {linkRequested ? (
                  <>
                    <CheckCircle className="mr-2" size={20} />
                    Request Sent Successfully
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2" size={20} />
                    Request Secure Payment Link
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              <strong className="text-white">Secure & Verified:</strong> All payments are verified by our admin team. You'll receive confirmation within 24 hours.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
