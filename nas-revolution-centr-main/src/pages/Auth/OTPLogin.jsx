// TODO: Replace demo OTP with SMS API (Twilio/MSG91)
// TODO: Add rate limiting for OTP requests
// TODO: Implement backend OTP generation and validation

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DeviceMobile, LockKey, ArrowLeft, CheckCircle, Warning, User } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { AuthHelper, OTPService } from "@/lib/useAuth"

export default function OTPLogin({ onLogin, onBackToHome }) {
  const [step, setStep] = useState("mobile")
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [generatedOTP, setGeneratedOTP] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDevModal, setShowDevModal] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(null)
  const [showFallback, setShowFallback] = useState(false)
  const [fallbackName, setFallbackName] = useState("")

  const handleSendOTP = async (e) => {
    e.preventDefault()
    
    if (!mobile || mobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number")
      return
    }

    setIsLoading(true)

    try {
      const result = await OTPService.sendOTP(mobile, "student-login")
      
      setGeneratedOTP(result.otp)
      setOtpExpiry(Date.now() + result.expiresIn * 60 * 1000)
      setShowDevModal(true)
      setStep("otp")
      
      toast.success(`OTP sent to ${mobile}`)
      
      // QA: Verify OTP was generated and is 6 digits
      if (result.otp.length !== 6) {
        console.error("QA FAIL: OTP should be 6 digits")
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
      const result = OTPService.verifyOTP(mobile, otp)
      
      if (!result.success) {
        toast.error(result.message)
        setIsLoading(false)
        return
      }

      toast.success("Login successful!")
      
      const session = AuthHelper.createSession("student", mobile, {
        mobile,
        loginMethod: "otp",
        loginTime: new Date().toISOString(),
      })
      
      // QA: Verify session was created
      if (!session) {
        console.error("QA FAIL: Session not created after OTP verification")
        toast.error("Session creation failed")
        setIsLoading(false)
        return
      }
      
      setTimeout(() => {
        onLogin()
      }, 500)
    } catch (error) {
      toast.error("Error verifying OTP")
      console.error("Error:", error)
      setIsLoading(false)
    }
  }

  const handleFallbackLogin = (e) => {
    e.preventDefault()
    
    if (!fallbackName || !mobile) {
      toast.error("Please enter your name and mobile number")
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      toast.success(`Welcome, ${fallbackName}!`)
      
      AuthHelper.createSession("student", mobile, {
        name: fallbackName,
        mobile,
        loginMethod: "fallback",
        loginTime: new Date().toISOString(),
      })
      
      onLogin()
      setIsLoading(false)
    }, 800)
  }

  const handleResendOTP = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setOtp("")
    
    try {
      const result = await OTPService.sendOTP(mobile, "student-login")
      setGeneratedOTP(result.otp)
      setOtpExpiry(Date.now() + result.expiresIn * 60 * 1000)
      setShowDevModal(true)
      toast.success("New OTP sent!")
    } catch (error) {
      toast.error("Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-secondary/5 to-primary/5">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

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
              <DeviceMobile size={48} weight="fill" className="text-white relative z-10" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-heading mb-2"
            >
              Student Login
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              {step === "mobile" ? "Enter your mobile number to receive OTP" : "Enter the OTP sent to your mobile"}
            </motion.p>
          </div>

          <Card className="p-8 rounded-3xl card-shadow-lg border-2 border-primary/10 backdrop-blur-xl bg-card/80">
            <AnimatePresence mode="wait">
              {step === "mobile" && (
                <motion.form
                  key="mobile-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSendOTP}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-sm font-semibold flex items-center gap-2">
                      <DeviceMobile size={18} />
                      Mobile Number
                    </Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="h-14 rounded-xl text-lg border-2"
                      disabled={isLoading}
                      maxLength={10}
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll receive a 6-digit OTP on this number
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-xl text-base font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 hover:bg-pos-100 transition-all duration-500"
                    disabled={isLoading || mobile.length < 10}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending OTP...
                      </span>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">OR</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFallback(true)}
                    className="w-full h-12 rounded-xl border-2"
                  >
                    Login with Name (Fallback)
                  </Button>
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
                      OTP sent to <span className="font-semibold">+91 {mobile}</span>
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
                    <p className="text-xs text-destructive font-medium">
                      Do not share OTP with anyone. OTP expires in {OTPService.OTP_EXPIRY_MINUTES} minutes.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-xl text-base font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 hover:bg-pos-100 transition-all duration-500"
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
                        Verify & Login
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setStep("mobile")
                        setOtp("")
                        setGeneratedOTP("")
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Change Number
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
            Secure login with OTP verification
          </motion.p>
        </motion.div>
      </div>

      <Dialog open={showDevModal} onOpenChange={setShowDevModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle size={24} weight="fill" className="text-success" />
              OTP Sent (Demo Mode)
            </DialogTitle>
            <DialogDescription>
              In production, this OTP would be sent via SMS. For demo purposes, use the code below:
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 rounded-xl bg-success/10 border-2 border-success/30 text-center">
            <p className="text-sm text-muted-foreground mb-2">Your OTP Code</p>
            <p className="text-4xl font-bold tracking-widest text-success">{generatedOTP}</p>
            <p className="text-xs text-muted-foreground mt-3">
              Expires in {OTPService.OTP_EXPIRY_MINUTES} minutes
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            <p className="font-semibold mb-1">TODO:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Replace with SMS API (Twilio/MSG91)</li>
              <li>Add rate limiting for OTP requests</li>
              <li>Implement backend OTP validation</li>
            </ul>
          </div>

          <Button onClick={() => setShowDevModal(false)} className="w-full">
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showFallback} onOpenChange={setShowFallback}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User size={24} weight="fill" className="text-primary" />
              Fallback Login
            </DialogTitle>
            <DialogDescription>
              For offline/demo mode: Login with name and mobile number
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFallbackLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fallback-name">Full Name</Label>
              <Input
                id="fallback-name"
                type="text"
                placeholder="Enter your name"
                value={fallbackName}
                onChange={(e) => setFallbackName(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallback-mobile">Mobile Number</Label>
              <Input
                id="fallback-mobile"
                type="tel"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="h-12 rounded-xl"
                maxLength={10}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl"
              disabled={isLoading || !fallbackName || mobile.length < 10}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// QA: Verify OTP login works end-to-end
// QA: Verify fallback login creates valid session
// QA: Verify OTP expires after timeout
// QA: Verify session persists after page refresh
