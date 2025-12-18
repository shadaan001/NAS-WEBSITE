import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CredentialsService } from "@/services/credentials"
import { LockKey, Eye, EyeSlash, Copy, CheckCircle } from "@phosphor-icons/react"

interface CredentialModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
  role: "teacher" | "student"
  adminId: string
}

export default function CredentialModal({
  isOpen,
  onClose,
  userId,
  userName,
  role,
  adminId
}: CredentialModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [credentialsCreated, setCredentialsCreated] = useState(false)

  const generateUsername = () => {
    const namePart = userName.toLowerCase().replace(/\s+/g, "")
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${namePart}${randomNum}`
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%"
    let pass = ""
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return pass
  }

  const handleGenerateCredentials = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setUsername(generateUsername())
      setPassword(generatePassword())
      setIsGenerating(false)
      toast.success("Credentials generated!")
    }, 500)
  }

  const handleCreateCredentials = async () => {
    if (!username || !password) {
      toast.error("Please generate or enter credentials")
      return
    }

    if (username.length < 4) {
      toast.error("Username must be at least 4 characters")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsCreating(true)

    try {
      const result = await CredentialsService.createCredentials(
        userId,
        username,
        password,
        role,
        adminId
      )

      if (result.success) {
        toast.success(`Credentials created for ${userName}`)
        setCredentialsCreated(true)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Error creating credentials:", error)
      toast.error("Failed to create credentials")
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const handleClose = () => {
    setUsername("")
    setPassword("")
    setCredentialsCreated(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a1f3a] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <LockKey size={24} className="text-blue-400" />
            Create Login Credentials
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Generate secure login credentials for <span className="font-semibold text-white">{userName}</span> ({role})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-white">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
                disabled={credentialsCreated}
              />
              {username && (
                <button
                  onClick={() => copyToClipboard(username, "Username")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  <Copy size={16} className="text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-20"
                disabled={credentialsCreated}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                {password && (
                  <button
                    onClick={() => copyToClipboard(password, "Password")}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  >
                    <Copy size={16} className="text-gray-400 hover:text-white" />
                  </button>
                )}
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeSlash size={16} className="text-gray-400 hover:text-white" />
                  ) : (
                    <Eye size={16} className="text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {!credentialsCreated && (
            <Button
              onClick={handleGenerateCredentials}
              variant="outline"
              className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
              disabled={isGenerating || credentialsCreated}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                "Auto-Generate Credentials"
              )}
            </Button>
          )}

          {credentialsCreated && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle size={20} className="text-green-400" weight="fill" />
              <p className="text-sm text-green-300">
                Credentials created successfully!
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-xs text-yellow-300">
              ⚠️ Save these credentials securely. Share them with the {role} via a secure channel.
            </p>
          </div>
        </div>

        <DialogFooter>
          {!credentialsCreated ? (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCredentials}
                disabled={isCreating || !username || !password}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Credentials"
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
