import { useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, ArrowLeft, Envelope, LockKey, Eye, EyeSlash } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import GradientBackground from "@/components/school/GradientBackground"
import { AuthHelper } from "@/lib/useAuth"

interface AdminLoginPageProps {
  onLogin: (adminId: string) => void
  onBackToHome: () => void
}

const ADMIN_EMAIL = "nasrevolutioncentre@gmail.com"
const ADMIN_PASSWORD = "AnUe123@#4567"

export default function AdminLoginPage({ onLogin, onBackToHome }: AdminLoginPageProps) {
  const [credential, setCredential] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (credential !== ADMIN_EMAIL) {
      toast.error("Unauthorized admin email")
      return
    }

    if (password !== ADMIN_PASSWORD) {
      toast.error("Incorrect password")
      return
    }

    setIsLoading(true)

    try {
      toast.success("Admin login successful")
      AuthHelper.createSession("admin", "ADMIN001", {
        verifiedContact: ADMIN_EMAIL,
        loginTime: new Date().toISOString()
      })
      
      setTimeout(() => {
        onLogin("ADMIN001")
      }, 500)
    } catch (error) {
      console.error("Error during login:", error)
      toast.error("Login failed. Please try again.")
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
              Secure Authentication
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleAdminLogin}>
              <div className="glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-1 -left-1 -right-1 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-shimmer" />
                
                <div className="space-y-5 relative z-10">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white mb-2">Admin Login</h2>
                    <p className="text-sm text-gray-300">Enter your credentials to continue</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300 font-medium">Email</label>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-400/30">
                          <Envelope size={20} className="text-blue-400" />
                        </div>
                        <Input
                          type="email"
                          value={credential}
                          onChange={(e) => setCredential(e.target.value)}
                          readOnly
                          className="bg-transparent border-0 text-white text-sm font-semibold cursor-not-allowed focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300 font-medium">Password</label>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-400/30">
                          <LockKey size={20} className="text-blue-400" />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter admin password"
                          className="bg-transparent border-0 text-white text-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-gray-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <LockKey size={16} className="text-blue-400" />
                      <p className="text-xs text-blue-300">
                        This admin portal is restricted to authorized personnel only.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Logging in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={20} />
                        Login
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-center text-gray-400 mt-6"
          >
            Secure authentication for admin access
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
