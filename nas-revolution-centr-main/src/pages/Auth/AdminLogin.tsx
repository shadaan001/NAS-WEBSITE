import { useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, LockKey, ArrowLeft, CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { AuthHelper, OTPService } from "@/lib/useAuthold"
import GradientBackground from "@/components/school/GradientBackground"

const ADMIN_EMAIL = "nasrevolutioncentre@gmail.com"

export default function AdminLogin({ onLogin, onBackToHome }) {
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (email !== ADMIN_EMAIL) {
      toast.error("Unauthorized admin email")
      return
    }

    try {
      setLoading(true)
      await OTPService.sendOTP(email)
      toast.success("OTP sent to admin email")
      setStep("otp")
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const result = await OTPService.verifyOTP(email, otp)

      if (!result.success) {
        toast.error("Invalid OTP")
        return
      }

      AuthHelper.createSession("admin", "ADMIN001", {
        email,
        role: "admin",
        loginMethod: "email-otp",
      })

      toast.success("Admin login successful")
      onLogin("ADMIN001")
    } catch {
      toast.error("OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <GradientBackground />

      {onBackToHome && (
        <Button variant="ghost" onClick={onBackToHome} className="absolute top-6 left-6">
          <ArrowLeft size={18} /> Back
        </Button>
      )}

      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <ShieldCheck size={48} className="mx-auto text-primary" />
            <h1 className="text-3xl font-bold mt-4">Admin Login</h1>
            <p className="text-muted-foreground text-sm">
              Authorized admin access only
            </p>
          </div>

          {step === "email" && (
            <form onSubmit={sendOTP} className="space-y-4">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                placeholder={ADMIN_EMAIL}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="w-full" disabled={loading}>
                <LockKey size={18} /> Send OTP
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={verifyOTP} className="space-y-4">
              <Label>Enter OTP</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit OTP"
              />
              <Button className="w-full" disabled={loading}>
                <CheckCircle size={18} /> Verify OTP
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
