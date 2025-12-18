import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, ArrowLeft, DeviceMobile, Envelope, Check, LockKey } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import GradientBackground from "@/components/school/GradientBackground"
import { OTPService } from "@/services/otp"
import { AuthHelper } from "@/lib/useAuth"

interface AdminLoginPageProps {
  onLogin: (adminId: string) => void
  onBackToHome: () => void
}

export default function AdminLoginPage({ onLogin, onBackToHome }: AdminLoginPageProps) {
  const [step, setStep] = useState<"request" | "verify">("request")
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [generatedOTPs, setGeneratedOTPs] = useState<{ phone1: string; phone2: string; email: string } | null>(null)
  const [timer, setTimer] = useState(300)
  const [canResend, setCanResend] = useState(false)

  const adminContacts = OTPService.getAdminContacts()

  useEffect(() => {
    if (step === "verify" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step, timer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleRequestOTP = async () => {
    setIsLoading(true)
    
    try {
      const response = await OTPService.sendAdminOTP()
      
      if (response.success && response.otps) {
        setGeneratedOTPs(response.otps)
        toast.success("OTP sent to all registered contacts!")
        setStep("verify")
        setTimer(300)
        setCanResend(false)
      } else {
        toast.error(response.message || "Failed to send OTP")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast.error("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setOtp(["", "", "", "", "", ""])
    await handleRequestOTP()
  }

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpString = otp.join("")
    
    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP")
      return
    }

    setIsLoading(true)

    try {
      let verified = false
      let verifiedContact = ""

      for (const phone of adminContacts.phones) {
        const result = await OTPService.verifyOTP(phone, otpString)
        if (result.success) {
          verified = true
          verifiedContact = phone
          break
        }
      }

      if (!verified) {
        const emailResult = await OTPService.verifyOTP(adminContacts.email, otpString)
        if (emailResult.success) {
          verified = true
          verifiedContact = adminContacts.email
        }
      }

      if (verified) {
        toast.success("Login successful!")
        AuthHelper.createSession("admin", "ADMIN001", {
          verifiedContact,
          loginTime: new Date().toISOString()
        })
        setTimeout(() => {
          onLogin("ADMIN001")
        }, 500)
      } else {
        toast.error("Invalid or expired OTP")
        setOtp(["", "", "", "", "", ""])
        const firstInput = document.getElementById("otp-0")
        firstInput?.focus()
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error("Failed to verify OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GradientBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <button
          onClick={onBackToHome}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-blue-400 transition-colors group bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.1 
              }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 relative"
            >
              <ShieldCheck size={40} weight="fill" className="text-white relative z-10" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2 gradient-text"
            >
              Admin Portal
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-300"
            >
              Secure OTP-based authentication
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {step === "request" ? (
              <motion.div
                key="request"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-1 -left-1 -right-1 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-shimmer" />
                  
                  <div className="space-y-5 relative z-10">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-white mb-2">Request OTP</h2>
                      <p className="text-sm text-gray-300">OTP will be sent to all registered contacts</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <DeviceMobile size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Phone 1</p>
                          <p className="text-sm font-semibold text-white">+91 {adminContacts.phones[0]}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <DeviceMobile size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Phone 2</p>
                          <p className="text-sm font-semibold text-white">+91 {adminContacts.phones[1]}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                          <Envelope size={20} className="text-pink-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-sm font-semibold text-white">{adminContacts.email}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleRequestOTP}
                      className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending OTP...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <LockKey size={20} />
                          Send OTP to All Contacts
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-1 -left-1 -right-1 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-shimmer" />
                  
                  <div className="space-y-5 relative z-10">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-white mb-2">Verify OTP</h2>
                      <p className="text-sm text-gray-300">Enter the 6-digit code sent to your contacts</p>
                    </div>

                    <div className="flex justify-center gap-2 mb-6">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOTPChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border-white/10 text-white focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                          disabled={isLoading}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-400">
                        Time remaining: <span className="font-semibold text-white">{formatTime(timer)}</span>
                      </span>
                      {canResend && (
                        <button
                          onClick={handleResendOTP}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                          disabled={isLoading}
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    <Button
                      onClick={handleVerifyOTP}
                      className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                      disabled={isLoading || otp.some(d => !d)}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Check size={20} />
                          Verify & Login
                        </span>
                      )}
                    </Button>

                    <button
                      onClick={() => {
                        setStep("request")
                        setOtp(["", "", "", "", "", ""])
                      }}
                      className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      ← Back to request OTP
                    </button>

                    {generatedOTPs && (
                      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                        <p className="text-xs text-yellow-300 font-semibold mb-2">🔐 DEMO MODE - Generated OTPs:</p>
                        <div className="space-y-1 text-xs text-gray-300">
                          <p>Phone 1: <span className="font-mono font-bold text-white">{generatedOTPs.phone1}</span></p>
                          <p>Phone 2: <span className="font-mono font-bold text-white">{generatedOTPs.phone2}</span></p>
                          <p>Email: <span className="font-mono font-bold text-white">{generatedOTPs.email}</span></p>
                        </div>
                        <p className="text-xs text-yellow-300 mt-2">In production, OTPs will be sent via SMS and email.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-center text-gray-400 mt-6"
          >
            Multi-factor authentication with OTP verification
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
