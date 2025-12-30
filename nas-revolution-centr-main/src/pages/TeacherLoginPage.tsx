import { useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, ArrowLeft, Eye, EyeSlash } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CredentialsService } from "@/services/credentials"
import { supabase } from "@/lib/supabase"
import { AuthHelper } from "@/lib/useAuth"

interface TeacherLoginPageProps {
  onLogin: (teacherId: string) => void
  onBackToHome: () => void
}

export default function TeacherLoginPage({ onLogin, onBackToHome }: TeacherLoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password")
      return
    }

    setIsLoading(true)

    try {
      const result = await CredentialsService.verifyCredentials(username.trim(), password)
      
      if (result.success && result.role === "teacher") {
        // Try KV first (local admin cache). Wrap in try/catch because local KV may be unavailable in dev.
        let teachers: any[] = []
        try {
          teachers = await window.spark.kv.get<any[]>("admin-teachers-records") || []
        } catch (kvErr) {
          console.warn('Failed to read admin-teachers-records KV (falling back to Supabase):', kvErr)
          teachers = []
        }
        let teacher = teachers.find((t: any) => (t?.id?.toString ? t.id.toString() : String(t.id)) === result.userId)

        // If not present in KV, fetch the teacher from Supabase directly (handles Supabase-only accounts)
        if (!teacher) {
          try {
            const { data: supData, error: supError } = await supabase.from('teachers').select('*').eq('id', result.userId).limit(1)
            if (supError) {
              console.error('Supabase fetch error for teacher:', supError)
            }

            const supTeacher = Array.isArray(supData) && supData.length > 0 ? supData[0] : null
            if (supTeacher) {
              // Normalize field names expected by the app
              // Treat explicit false as not approved; treat null/undefined as approved by default
              const approved = (typeof supTeacher.is_active === 'boolean')
                ? supTeacher.is_active
                : (typeof supTeacher.approved === 'boolean' ? supTeacher.approved : true)

              teacher = {
                ...supTeacher,
                id: supTeacher.id,
                name: supTeacher.name,
                subjects: supTeacher.subjects || [],
                approved
              }

              // Merge into KV cache so future logins don't need Supabase lookup
              try {
                const newTeachers = Array.isArray(teachers) ? [...teachers, teacher] : [teacher]
                await window.spark.kv.set('admin-teachers-records', newTeachers)
              } catch (kvErr) {
                console.warn('Failed to update admin-teachers-records KV:', kvErr)
              }
            }
          } catch (fetchErr) {
            console.error('Error fetching teacher from Supabase:', fetchErr)
          }
        }

        if (!teacher) {
          toast.error("Teacher account not found. Contact administrator.")
          setIsLoading(false)
          return
        }

        if (!teacher.approved) {
          toast.error("Your account is pending approval. Please contact the administrator.")
          setIsLoading(false)
          return
        }

        AuthHelper.createSession("teacher", result.userId!, {
          name: teacher.name,
          loginTime: new Date().toISOString()
        })
        
        toast.success(`Welcome back, ${teacher.name}!`)
        setTimeout(() => {
          setIsLoading(false)
          onLogin(result.userId!)
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a0e1a] via-[#0f1423] to-[#1a1f3a]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-blue-400 transition-colors group bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </button>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <GraduationCap size={40} weight="fill" className="text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-white mb-2 gradient-text"
            >
              Teacher Portal
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-gray-300 mb-8"
            >
              Sign in to manage your classes
            </motion.p>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 pr-10"
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
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 border-0"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-300 text-sm">
                Contact admin for your login credentials
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
