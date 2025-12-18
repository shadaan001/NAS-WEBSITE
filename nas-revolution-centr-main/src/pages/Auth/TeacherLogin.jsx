// TODO: Replace with secure backend authentication
// TODO: Add password hashing and secure storage
// TODO: Implement server-side role permission checks

import { useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, ArrowLeft, Eye, EyeSlash, CheckCircle, Warning } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { AuthHelper, PermissionService } from "@/lib/useAuth"
import GradientBackground from "@/components/school/GradientBackground"

export default function TeacherLogin({ onLogin, onBackToHome }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please enter both email and password")
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const teacherId = email.split("@")[0].toUpperCase()
      
      const permissionCheck = PermissionService.checkTeacherPermission(teacherId)
      
      if (!permissionCheck.hasPermission) {
        toast.error("Access Denied", {
          description: permissionCheck.reason,
          duration: 5000,
        })
        setIsLoading(false)
        return
      }
      
      const teacher = permissionCheck.teacher
      
      // QA: Verify teacher can only log in if approved by admin
      if (!teacher.approved) {
        console.error("QA FAIL: Unapproved teacher should not be able to login")
        toast.error("Contact Admin for access")
        setIsLoading(false)
        return
      }
      
      toast.success(`Welcome back, ${teacher.name}!`)
      
      const session = AuthHelper.createSession("teacher", teacher.id, {
        name: teacher.name,
        email: teacher.email,
        employeeId: teacher.employeeId,
        subjects: teacher.subjects,
        loginTime: new Date().toISOString(),
      })
      
      // QA: Verify teacher session was created
      if (!session || session.role !== "teacher") {
        console.error("QA FAIL: Teacher session not created correctly")
        toast.error("Session creation failed")
        setIsLoading(false)
        return
      }
      
      onLogin(teacher.id)
      setIsLoading(false)
    }, 1000)
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
              <GraduationCap size={48} weight="fill" className="text-white relative z-10" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-heading mb-2"
            >
              Teacher Portal
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              Sign in to manage your classes and students
            </motion.p>
          </div>

          <Card className="p-8 rounded-3xl card-shadow-lg border-2 border-primary/10 backdrop-blur-xl bg-card/90">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} weight="fill" className="text-primary flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground mb-1">Admin Approval Required</p>
                  <p className="text-muted-foreground">
                    Teachers can only log in if granted access by admin
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-2"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-2 pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-xl text-base font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 hover:bg-pos-100 transition-all duration-500 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground text-center">
                Demo: Use any teacher email (e.g., tch001@school.com)
                <br />
                Teacher must be approved by admin to access
              </p>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
              <Warning size={18} weight="fill" className="text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">
                If you see "Contact Admin for access", please ask the administrator to grant you teacher permissions.
              </p>
            </div>
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-center text-muted-foreground mt-6"
          >
            Secure login with admin-controlled access
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

// QA: Verify teacher can log in only if admin has approved
// QA: Verify unapproved teacher gets "Contact Admin" message
// QA: Verify inactive teacher cannot access system
// QA: Verify teacher session includes correct role and permissions
