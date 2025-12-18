// TODO: Replace demo OTP with real backend OTP service
// TODO: Enforce server-side admin verification
// TODO: Add multi-factor authentication for admin

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, LockKey, ArrowLeft, CheckCircle, Warning, Envelope } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { AuthHelper, OTPService } from "@/lib/useAuth"
import GradientBackground from "@/components/school/GradientBackground"

export default function AdminLogin({ onLogin, onBackToHome }) {
  const [step, setStep] = useState("credential")
  const [credential, setCredential] = useState("")
  const [otp, setOtp] = useState("")
  const [generatedOTP, setGeneratedOTP] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDevModal, setShowDevModal] = useState(false)
  const [credentialType, setCredentialType] = useState("")

  const detectCredentialType = (value) => {
    if (value.includes("@")) return "email"
    if (/^\d{10}$/.test(value)) return "mobile"
    return ""
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    
    const type = detectCredentialType(credential)
    
    if (!type) {
      toast.error("Please enter a valid email or mobile number")
      return
    }

    if (!OTPService.isAdminCredential(credential)) {
      toast.error("Access denied. This credential is not registered as admin.", {
        description: "Only registered admin accounts can access this portal.",
        duration: 5000,
      })
      return
    }

    setIsLoading(true)
    setCredentialType(type)

    try {
      const result = await OTPService.sendOTP(credential, "admin-login")
      
      setGeneratedOTP(result.otp)
      setShowDevModal(true)
      setStep("otp")
      
      toast.success(`OTP sent to ${credential}`)
      
      // QA: Verify only admin credentials can receive OTP
      if (!OTPService.isAdminCredential(credential)) {
        console.error("QA FAIL: Non-admin credential received OTP")
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.")
      console.error("Error sending OTP:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter 6-digit OTP")
      return
    }

    setIsLoading(true)

    try {
      const result = OTPService.verifyOTP(credential, otp)
      
      if (!result.success) {
        toast.error(result.message)
        setIsLoading(false)
        return
      }

      toast.success("Admin login successful!")
      
      const session = AuthHelper.createSession("admin", "ADMIN001", {
        credential,
        credentialType,
        loginMethod: "otp",
        loginTime: new Date().toISOString(),
        role: "admin",
      })
      
      // QA: Verify admin session was created
      if (!session || session.role !== "admin") {
        console.error("QA FAIL: Admin session not created correctly")
        toast.error("Session creation failed")
        setIsLoading(false)
        return
      }
      
      setTimeout(() => {
        onLogin("ADMIN001")
      }, 500)
    } catch (error) {
      toast.error("Error verifying OTP")
      console.error("Error:", error)
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setOtp("")
    
    try {
      const result = await OTPService.sendOTP(credential, "admin-login")
      setGeneratedOTP(result.otp)
      setShowDevModal(true)
      toast.success("New OTP sent!")
    } catch (error) {
      toast.error("Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GradientBackground />

      {onBackToHome && (
        <Button
          variant="ghost"
          onClick={onBackToHome}
          className="absolute top-6 left-6 z-10 gap-2"
        >
          <ArrowLeft size={20} />
          Back
        </Button>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent mb-6 shadow-2xl relative"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent opacity-50 blur-2xl animate-pulse" />
              <ShieldCheck size={48} weight="fill" className="text-white relative z-10" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-heading mb-2"
            >
              Admin Portal
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              {step === "credential" ? "Secure access for administrators" : "Enter OTP to verify your identity"}
            </motion.p>
          </div>

          <Card className="p-8 rounded-3xl card-shadow-lg border-2 border-primary/20 backdrop-blur-xl bg-card/90">
            <div className="absolute -top-1 -left-1 -right-1 h-1 bg-gradient-to-r from-primary via-secondary to-accent animate-shimmer" />
            
            <AnimatePresence mode="wait">
              {step === "credential" && (
                <motion.form
                  key="credential-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSendOTP}
                  className="space-y-6"
                >
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={20} weight="fill" className="text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-semibold text-foreground mb-1">Authorized Admin Only</p>
                        <p className="text-muted-foreground">
                          OTP will only be sent to registered admin email/mobile
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credential" className="text-sm font-semibold flex items-center gap-2">
                      <Envelope size={18} />
                      Email or Mobile Number
                    </Label>
                    <Input
                      id="credential"
                      type="text"
                      placeholder="shadaan001@gmail.com or 9073040640"
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                      className="h-14 rounded-xl text-base border-2"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter registered admin email or mobile number
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-xl text-base font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 hover:bg-pos-100 transition-all duration-500 shadow-lg"
                    disabled={isLoading || !credential}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LockKey size={20} weight="fill" />
                        Send OTP
                      </span>
                    )}
                  </Button>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      <span className="font-semibold">Registered Admin:</span><br />
                      Email: shadaan001@gmail.com<br />
                      Mobile: 9073040640
                    </p>
                  </div>
                </motion.form>
              )}

              {step === "otp" && (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-sm text-center">
                      OTP sent to <span className="font-semibold">{credential}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-semibold flex items-center gap-2">
                      <LockKey size={18} />
                      Enter OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="h-14 rounded-xl text-center text-2xl tracking-widest font-semibold border-2"
                      disabled={isLoading}
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                    <Warning size={20} weight="fill" className="text-destructive flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-destructive font-medium">
                      <p className="mb-1">Security Notice:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Do not share OTP with anyone</li>
                        <li>OTP expires in {OTPService.OTP_EXPIRY_MINUTES} minutes</li>
                        <li>Admin access grants full system control</li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-xl text-base font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 hover:bg-pos-100 transition-all duration-500 shadow-lg"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle size={20} weight="fill" />
                        Verify & Access Portal
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setStep("credential")
                        setOtp("")
                        setGeneratedOTP("")
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Change Credential
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary hover:text-primary/80 font-semibold"
                    >
                      Resend OTP
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-center text-muted-foreground mt-6"
          >
            Secure admin authentication with OTP verification
          </motion.p>
        </motion.div>
      </div>

      <Dialog open={showDevModal} onOpenChange={setShowDevModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle size={24} weight="fill" className="text-success" />
              Admin OTP (Demo Mode)
            </DialogTitle>
            <DialogDescription>
              In production, this would be sent via SMS/Email API
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 rounded-xl bg-success/10 border-2 border-success/30 text-center">
            <p className="text-sm text-muted-foreground mb-2">Admin OTP Code</p>
            <p className="text-4xl font-bold tracking-widest text-success">{generatedOTP}</p>
            <p className="text-xs text-muted-foreground mt-3">
              Expires in {OTPService.OTP_EXPIRY_MINUTES} minutes
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">TODO:</span> Replace with real OTP service, add audit logging, implement MFA
            </p>
          </div>

          <Button onClick={() => setShowDevModal(false)} className="w-full">
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// QA: Verify only registered admin email/mobile can receive OTP
// QA: Verify admin session grants access to admin dashboard
// QA: Verify unauthorized credentials are rejected
// QA: Verify OTP expires and cannot be reused
