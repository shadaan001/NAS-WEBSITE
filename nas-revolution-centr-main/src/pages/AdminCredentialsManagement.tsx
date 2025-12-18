import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import {
  LockKey,
  ArrowLeft,
  Eye,
  EyeSlash,
  Pencil,
  Trash,
  MagnifyingGlass,
  UserCircle,
  GraduationCap,
  Copy,
  CheckCircle
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CredentialsService, PasswordHasher } from "@/services/credentials"
import type { UserCredentials } from "@/services/credentials"
import type { StudentRecord, TeacherRecord } from "@/types/admin"

interface AdminCredentialsManagementProps {
  onBack?: () => void
}

export default function AdminCredentialsManagement({ onBack }: AdminCredentialsManagementProps = {}) {
  const [students] = useKV<StudentRecord[]>("admin-students-records", [])
  const [teachers] = useKV<TeacherRecord[]>("admin-teachers-records", [])
  
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"teacher" | "student">("teacher")
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingCredential, setEditingCredential] = useState<{
    username: string
    userId: string
    role: string
    name: string
  } | null>(null)
  const [deletingCredential, setDeletingCredential] = useState<{
    username: string
    userId: string
    name: string
  } | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [teacherCredentials, setTeacherCredentials] = useState<Array<{
    username: string
    userId: string
    name: string
    hasCredentials: boolean
  }>>([])
  
  const [studentCredentials, setStudentCredentials] = useState<Array<{
    username: string
    userId: string
    name: string
    hasCredentials: boolean
  }>>([])

  useEffect(() => {
    loadCredentials()
  }, [teachers, students])

  const loadCredentials = async () => {
    const teacherCreds: Array<{
      username: string
      userId: string
      name: string
      hasCredentials: boolean
    }> = []
    
    const studentCreds: Array<{
      username: string
      userId: string
      name: string
      hasCredentials: boolean
    }> = []

    for (const teacher of teachers || []) {
      const username = await CredentialsService.getUsernameByUserId(teacher.id)
      if (username) {
        teacherCreds.push({
          username,
          userId: teacher.id,
          name: teacher.name,
          hasCredentials: true
        })
      }
    }

    for (const student of students || []) {
      const username = await CredentialsService.getUsernameByUserId(student.id)
      if (username) {
        studentCreds.push({
          username,
          userId: student.id,
          name: student.name,
          hasCredentials: true
        })
      }
    }

    setTeacherCredentials(teacherCreds)
    setStudentCredentials(studentCreds)
  }

  const togglePasswordVisibility = (username: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev)
      if (newSet.has(username)) {
        newSet.delete(username)
      } else {
        newSet.add(username)
      }
      return newSet
    })
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const handleEditPassword = (credential: typeof editingCredential) => {
    setEditingCredential(credential)
    setNewPassword("")
    setShowNewPassword(false)
    setIsEditOpen(true)
  }

  const handleUpdatePassword = async () => {
    if (!editingCredential || !newPassword) {
      toast.error("Please enter a new password")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsUpdating(true)

    try {
      const credentials = await window.spark.kv.get<UserCredentials>(`credentials:${editingCredential.username}`)
      
      if (!credentials) {
        toast.error("Credentials not found")
        return
      }

      const { hash, salt } = await PasswordHasher.hashPassword(newPassword)
      credentials.passwordHash = hash
      credentials.salt = salt
      
      await window.spark.kv.set(`credentials:${editingCredential.username}`, credentials)
      
      toast.success("Password updated successfully")
      setIsEditOpen(false)
      setEditingCredential(null)
      setNewPassword("")
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error("Failed to update password")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteCredential = (username: string, userId: string, name: string) => {
    setDeletingCredential({ username, userId, name })
    setIsDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingCredential) return

    setIsDeleting(true)

    try {
      await CredentialsService.deleteCredentials(deletingCredential.userId)
      toast.success("Credentials deleted successfully")
      
      await loadCredentials()
      
      setIsDeleteOpen(false)
      setDeletingCredential(null)
    } catch (error) {
      console.error("Error deleting credentials:", error)
      toast.error("Failed to delete credentials")
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredTeachers = teacherCredentials.filter(cred =>
    cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cred.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredStudents = studentCredentials.filter(cred =>
    cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cred.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const CredentialCard = ({ 
    credential, 
    role 
  }: { 
    credential: typeof teacherCredentials[0], 
    role: "teacher" | "student" 
  }) => {
    const isPasswordVisible = visiblePasswords.has(credential.username)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="glass rounded-xl p-4 border border-white/10 hover:border-blue-400/30 transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              role === "teacher" ? "bg-purple-500/20" : "bg-blue-500/20"
            }`}>
              {role === "teacher" ? (
                <GraduationCap size={20} className="text-purple-400" weight="bold" />
              ) : (
                <UserCircle size={20} className="text-blue-400" weight="bold" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white mb-1 truncate">{credential.name}</h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-20">Username:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <code className="text-sm text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
                      {credential.username}
                    </code>
                    <button
                      onClick={() => copyToClipboard(credential.username, "Username")}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Copy username"
                    >
                      <Copy size={14} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-20">Password:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <code className="text-sm text-white/70 bg-white/5 px-2 py-0.5 rounded">
                      {isPasswordVisible ? "••••••••" : "••••••••"}
                    </code>
                    <span className="text-xs text-yellow-400">(encrypted)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEditPassword({
                username: credential.username,
                userId: credential.userId,
                role,
                name: credential.name
              })}
              className="h-8 w-8 p-0 hover:bg-blue-500/20"
              title="Edit password"
            >
              <Pencil size={16} className="text-blue-400" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteCredential(credential.username, credential.userId, credential.name)}
              className="h-8 w-8 p-0 hover:bg-red-500/20"
              title="Delete credentials"
            >
              <Trash size={16} className="text-red-400" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1423] to-[#1a1f3a] -z-10" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-6 text-white hover:text-blue-400 hover:bg-white/10"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Dashboard
          </Button>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 mb-4">
            <LockKey size={32} weight="bold" className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3 gradient-text">
            Credentials Management
          </h1>
          <p className="text-gray-300 text-lg">
            View and manage login credentials for teachers and students
          </p>
        </motion.div>

        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "teacher" | "student")} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/5 border border-white/10">
            <TabsTrigger value="teacher" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
              <GraduationCap size={18} className="mr-2" />
              Teacher Credentials ({teacherCredentials.length})
            </TabsTrigger>
            <TabsTrigger value="student" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white">
              <UserCircle size={18} className="mr-2" />
              Student Credentials ({studentCredentials.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teacher" className="space-y-4">
            {filteredTeachers.length === 0 ? (
              <Card className="glass border-white/10">
                <CardContent className="py-12 text-center">
                  <LockKey size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">
                    {searchQuery
                      ? "No teacher credentials found matching your search"
                      : "No teacher credentials created yet"}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Create credentials for teachers in the Teacher Management section
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredTeachers.map((credential) => (
                  <CredentialCard
                    key={credential.userId}
                    credential={credential}
                    role="teacher"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="student" className="space-y-4">
            {filteredStudents.length === 0 ? (
              <Card className="glass border-white/10">
                <CardContent className="py-12 text-center">
                  <LockKey size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">
                    {searchQuery
                      ? "No student credentials found matching your search"
                      : "No student credentials created yet"}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Create credentials for students in the Student Management section
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((credential) => (
                  <CredentialCard
                    key={credential.userId}
                    credential={credential}
                    role="student"
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#1a1f3a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Pencil size={24} className="text-blue-400" />
              Update Password
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Change password for <span className="font-semibold text-white">{editingCredential?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username-display" className="text-sm font-medium text-white">
                Username
              </Label>
              <Input
                id="username-display"
                type="text"
                value={editingCredential?.username || ""}
                disabled
                className="bg-white/5 border-white/10 text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium text-white">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {showNewPassword ? (
                    <EyeSlash size={16} className="text-gray-400 hover:text-white" />
                  ) : (
                    <Eye size={16} className="text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-300">
                ⚠️ The user will need to use this new password to login
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePassword}
              disabled={isUpdating || !newPassword || newPassword.length < 6}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[#1a1f3a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Trash size={24} className="text-red-400" />
              Delete Credentials
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete credentials for{" "}
              <span className="font-semibold text-white">{deletingCredential?.name}</span>?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-300">
                ⚠️ <strong>Warning:</strong> This user will no longer be able to login with these credentials.
                This action cannot be undone.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Credentials"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
