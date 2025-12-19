import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, ArrowLeft, Eye, EyeSlash } from "@phosphor-icons/react"
import { toast } from "sonner"
import { CredentialsService } from "@/services/credentials"
import { AuthHelper } from "@/lib/useAuthold"

interface LoginPageProps {
  onLogin: () => void
  onBackToHome?: () => void
}

export default function LoginPage({ onLogin, onBackToHome }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error("Please enter both username and password")
      return
    }

    setIsLoading(true)

    try {
      const result = await CredentialsService.verifyCredentials(username.trim(), password)
      
      if (result.success && result.role === "student") {
        const students = await spark.kv.get<any[]>("admin-students-records") || []
        const student = students.find((s: any) => s.id === result.userId)
        
        if (!student) {
          toast.error("Student account not found. Contact administrator.")
          setIsLoading(false)
          return
        }

        AuthHelper.createSession("student", result.userId!, {
          name: student.name,
          loginTime: new Date().toISOString()
        })
        
        toast.success(`Welcome back, ${student.name}!`)
        setTimeout(() => {
          setIsLoading(false)
          onLogin()
        }, 500)
      } else {
        toast.error(result.message)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Failed to login. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1423] to-[#1a1f3a] -z-10" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-blue-400 transition-colors group bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>
      )}
      <div className="w-full max-w-md p-8 rounded-3xl glass glass-hover shadow-2xl animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 mb-4">
            <BookOpen size={40} weight="fill" className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 gradient-text">Student Portal</h1>
          <p className="text-gray-300">Sign in to your student account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold text-white">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-white">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl text-base font-semibold gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-gray-300 text-sm text-center">
            Contact admin for your login credentials
          </p>
        </div>
      </div>
    </div>
  )
}
