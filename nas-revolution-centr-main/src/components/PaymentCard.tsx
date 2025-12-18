import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Trash, CreditCard, Clock, CalendarBlank } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface PaymentCardProps {
  payment: {
    id: string
    studentName: string
    studentId: string
    class: string
    amount: number
    method: string
    status: "Pending Verification" | "Confirmed"
    date: string
  }
  actions?: ("verify" | "delete")[]
  onVerify?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function PaymentCard({ payment, actions = [], onVerify, onDelete }: PaymentCardProps) {
  const isPending = payment.status === "Pending Verification"
  const isConfirmed = payment.status === "Confirmed"

  return (
    <div className="relative group">
      <div className={cn(
        "absolute inset-0 rounded-3xl blur-xl transition-all duration-300",
        isPending && "bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:blur-2xl",
        isConfirmed && "bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:blur-2xl"
      )} />
      <Card
        className={cn(
          "relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden",
          isPending && "hover:border-blue-400/50",
          isConfirmed && "hover:border-green-400/50"
        )}
      >
        <div className={cn(
          "h-1.5 w-full",
          isPending && "bg-gradient-to-r from-blue-500 to-purple-600",
          isConfirmed && "bg-gradient-to-r from-green-500 to-emerald-600"
        )} />
        
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard 
                  size={20} 
                  className={cn(
                    isPending && "text-blue-400",
                    isConfirmed && "text-green-400"
                  )}
                  weight="duotone"
                />
                <h3 className="font-bold text-lg text-white">
                  {payment.studentName}
                </h3>
              </div>
              <p className="text-sm text-gray-400 font-medium">
                {payment.class} • {payment.studentId}
              </p>
            </div>
            <Badge
              variant={isPending ? "secondary" : "default"}
              className={cn(
                "ml-2 font-semibold shadow-sm border",
                isPending && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                isConfirmed && "bg-green-500/20 text-green-400 border-green-500/30"
              )}
            >
              {isPending && <Clock size={14} className="mr-1" weight="bold" />}
              {isConfirmed && <CheckCircle size={14} className="mr-1" weight="fill" />}
              {isPending ? "Pending" : "Confirmed"}
            </Badge>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-sm text-gray-400 font-medium">Amount</span>
              <span className="font-bold text-2xl text-white">₹{payment.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 font-medium">Method</span>
              <span className="font-semibold text-white bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full text-sm">
                {payment.method}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 font-medium flex items-center gap-1">
                <CalendarBlank size={16} />
                Date
              </span>
              <span className="font-semibold text-white">
                {new Date(payment.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
          </div>

          {actions.length > 0 && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
              {actions.includes("verify") && isPending && (
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg shadow-green-500/30"
                  onClick={() => onVerify?.(payment.id)}
                >
                  <CheckCircle className="mr-2" weight="bold" />
                  Verify Payment
                </Button>
              )}
              {actions.includes("delete") && (
                <Button
                  size="sm"
                  variant="destructive"
                  className={cn("shadow-md bg-red-500 hover:bg-red-600 text-white border-0", actions.includes("verify") && isPending ? "flex-none" : "flex-1")}
                  onClick={() => onDelete?.(payment.id)}
                >
                  <Trash className="mr-2" />
                  {actions.includes("verify") && isPending ? "" : "Delete"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
