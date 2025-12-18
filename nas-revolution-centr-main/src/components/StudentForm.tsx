// TODO: Replace Base64 uploads with cloud storage (S3/Firebase) and return URLs

import { useState } from "react"
import { Plus, Trash, ChalkboardTeacher, Upload, X, Key, Eye, EyeSlash, CheckCircle, Warning } from "@phosphor-icons/react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import BubbleIcon from "./school/BubbleIcon"
import type { StudentWithRelations } from "@/lib/useLocalDB"
import type { TeacherRecord } from "@/types/admin"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { CredentialsService } from "@/services/credentials"
import { Alert, AlertDescription } from "./ui/alert"

const CLASSES = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11 Science",
  "Class 11 Commerce",
  "Class 12 Science",
  "Class 12 Commerce",
]

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Social Studies",
  "Computer Science",
  "Accountancy",
  "Business Studies",
  "Economics",
  "History",
  "Geography",
  "Political Science",
]

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

interface StudentFormProps {
  data: Partial<StudentWithRelations>
  onChange: (data: Partial<StudentWithRelations>) => void
  teachers: TeacherRecord[]
  onAddSubject: (subject: string) => void
  onRemoveSubject: (subject: string) => void
  onAssignTeacher: (teacherId: string, subject: string) => void
  onRemoveTeacher: (teacherId: string, subject: string) => void
}

export default function StudentForm({
  data,
  onChange,
  teachers,
  onAddSubject,
  onRemoveSubject,
  onAssignTeacher,
  onRemoveTeacher,
}: StudentFormProps) {
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [teacherSubject, setTeacherSubject] = useState("")
  const [username, setUsername] = useState(data.username || "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCreatingCredentials, setIsCreatingCredentials] = useState(false)

  const approvedTeachers = teachers.filter(t => t.approved !== false)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo size should be less than 2MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      onChange({ ...data, photoBase64: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    onChange({ ...data, photoBase64: null })
  }

  const handleCreateCredentials = async () => {
    if (!data.id) {
      toast.error("Please save student details first")
      return
    }

    if (!username.trim()) {
      toast.error("Please enter a username")
      return
    }

    if (username.length < 4) {
      toast.error("Username must be at least 4 characters")
      return
    }

    if (!password) {
      toast.error("Please enter a password")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsCreatingCredentials(true)

    try {
      const result = await CredentialsService.createCredentials(
        data.id,
        username.trim(),
        password,
        "student",
        "admin"
      )

      if (result.success) {
        onChange({ ...data, username: username.trim(), hasCredentials: true })
        toast.success("Login credentials created successfully!")
        toast.success(`Username: ${username.trim()} | Password: ${password}`, {
          duration: 15000,
        })
        setPassword("")
        setConfirmPassword("")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Error creating credentials:", error)
      toast.error("Failed to create credentials")
    } finally {
      setIsCreatingCredentials(false)
    }
  }

  const initials = (data.name || "")
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="credentials">
          Login
          {data.hasCredentials && (
            <CheckCircle size={14} weight="fill" className="ml-1 text-success" />
          )}
        </TabsTrigger>
        <TabsTrigger value="subjects">Subjects</TabsTrigger>
        <TabsTrigger value="teachers">Teachers</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="flex flex-col items-center gap-3 mb-4">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            {data.photoBase64 ? (
              <AvatarImage src={data.photoBase64} alt={data.name || "Student"} />
            ) : null}
            <AvatarFallback className="bg-gradient-blue-white text-primary font-bold text-2xl">
              {initials || "ST"}
            </AvatarFallback>
          </Avatar>

          <div className="flex gap-2">
            <Label
              htmlFor="photo-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Upload size={16} weight="bold" />
              Upload Photo
            </Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              aria-label="Upload student photo"
            />
            {data.photoBase64 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemovePhoto}
                className="gap-2"
              >
                <X size={16} />
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={data.name || ""}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              placeholder="Enter student's full name"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">
              Class <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.class || ""}
              onValueChange={(value) => onChange({ ...data, class: value })}
            >
              <SelectTrigger id="class" aria-label="Select class">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {CLASSES.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber">
              Roll Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rollNumber"
              value={data.rollNumber || ""}
              onChange={(e) => onChange({ ...data, rollNumber: e.target.value })}
              placeholder="e.g., 10A-15"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              placeholder="student@example.com"
              aria-label="Student email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9+\s-]/g, "")
                onChange({ ...data, phone: value })
              }}
              placeholder="+91 98765 43210"
              aria-label="Student phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={data.dateOfBirth || ""}
              onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
              aria-label="Date of birth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Select
              value={data.bloodGroup || ""}
              onValueChange={(value) => onChange({ ...data, bloodGroup: value })}
            >
              <SelectTrigger id="bloodGroup" aria-label="Select blood group">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map((bg) => (
                  <SelectItem key={bg} value={bg}>
                    {bg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={data.address || ""}
              onChange={(e) => onChange({ ...data, address: e.target.value })}
              placeholder="Full residential address"
              aria-label="Student address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianName">
              Guardian Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="guardianName"
              value={data.guardianName || ""}
              onChange={(e) => onChange({ ...data, guardianName: e.target.value })}
              placeholder="Parent/Guardian name"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianPhone">
              Guardian Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="guardianPhone"
              type="tel"
              value={data.guardianPhone || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9+\s-]/g, "")
                onChange({ ...data, guardianPhone: value })
              }}
              placeholder="+91 98765 43210"
              required
              aria-required="true"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="credentials" className="space-y-4 mt-4">
        <div className="space-y-4">
          {!data.id && (
            <Alert className="bg-primary/10 border-primary/20">
              <Warning size={18} weight="fill" className="text-primary" />
              <AlertDescription className="ml-2">
                <p className="font-semibold mb-1">Save Student First</p>
                <p className="text-xs text-muted-foreground">
                  Please save the student's basic information first, then return to edit and create login credentials.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {data.hasCredentials ? (
            <Alert className="bg-success/10 border-success/20">
              <CheckCircle size={18} weight="fill" className="text-success" />
              <AlertDescription className="ml-2">
                <p className="font-semibold mb-2">Login Credentials Active</p>
                <div className="mt-2 p-3 rounded-lg bg-card/50 border border-border">
                  <p className="text-sm font-semibold">Username: {data.username}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Share these credentials with the student to access their account
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          ) : data.id ? (
            <Alert className="bg-accent/10 border-accent/20">
              <Warning size={18} weight="fill" className="text-accent" />
              <AlertDescription className="ml-2">
                <p className="font-semibold mb-1">No Login Credentials</p>
                <p className="text-xs text-muted-foreground">
                  Create username and password below to allow this student to login to the system.
                </p>
              </AlertDescription>
            </Alert>
          ) : null}

          {data.id && (
            <div className="p-6 rounded-xl bg-muted/30 border border-input space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <BubbleIcon size="md" variant="blue">
                  <Key size={24} weight="fill" />
                </BubbleIcon>
                <div>
                  <h3 className="font-semibold text-foreground">Create Login Credentials</h3>
                  <p className="text-xs text-muted-foreground">
                    Set username and password for student account access
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Create a unique username"
                  disabled={data.hasCredentials}
                  aria-label="Student username"
                />
                <p className="text-xs text-muted-foreground">
                  At least 4 characters. Use letters and numbers only.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    disabled={data.hasCredentials}
                    className="pr-12"
                    aria-label="Student password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={data.hasCredentials}
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  At least 6 characters. Mix letters, numbers, and symbols.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter the password"
                    disabled={data.hasCredentials}
                    className="pr-12"
                    aria-label="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={data.hasCredentials}
                  >
                    {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleCreateCredentials}
                disabled={data.hasCredentials || isCreatingCredentials}
                className="w-full gap-2"
              >
                {isCreatingCredentials ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Credentials...
                  </>
                ) : (
                  <>
                    <Key size={18} weight="bold" />
                    {data.hasCredentials ? "Credentials Already Created" : "Create Login Credentials"}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="subjects" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="subject-select">Add Subject</Label>
          <div className="flex gap-2">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger id="subject-select" aria-label="Select subject to add">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.filter((s) => !data.subjects?.includes(s)).map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={() => {
                if (selectedSubject) {
                  onAddSubject(selectedSubject)
                  setSelectedSubject("")
                }
              }}
              disabled={!selectedSubject}
              aria-label="Add selected subject"
            >
              <Plus size={18} weight="bold" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Assigned Subjects</Label>
          <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-lg border border-input bg-muted/30">
            {data.subjects && data.subjects.length > 0 ? (
              data.subjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="secondary"
                  className="gap-2 px-3 py-1.5 text-sm"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => onRemoveSubject(subject)}
                    className="hover:text-destructive transition-colors"
                    aria-label={`Remove ${subject}`}
                  >
                    <X size={14} weight="bold" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground w-full text-center py-2">
                No subjects assigned yet
              </p>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="teachers" className="space-y-4 mt-4">
        <div className="space-y-3">
          <Label>Assign Teacher to Subject</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger aria-label="Select teacher">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {approvedTeachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={teacherSubject} onValueChange={setTeacherSubject}>
              <SelectTrigger aria-label="Select subject for teacher">
                <SelectValue placeholder="For subject" />
              </SelectTrigger>
              <SelectContent>
                {data.subjects && data.subjects.length > 0 ? (
                  data.subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Add subjects first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={() => {
              if (selectedTeacher && teacherSubject) {
                onAssignTeacher(selectedTeacher, teacherSubject)
                setSelectedTeacher("")
                setTeacherSubject("")
                toast.success("Teacher assigned successfully")
              }
            }}
            disabled={!selectedTeacher || !teacherSubject}
            className="w-full"
          >
            <Plus size={18} weight="bold" className="mr-2" />
            Assign Teacher
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Assigned Teachers</Label>
          <div className="space-y-2 min-h-[120px] p-3 rounded-lg border border-input bg-muted/30">
            {data.assignedTeachers && data.assignedTeachers.length > 0 ? (
              data.assignedTeachers.map((assignment, idx) => (
                <div
                  key={`${assignment.teacherId}-${assignment.subject}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <BubbleIcon size="sm" variant="green">
                      <ChalkboardTeacher size={20} weight="fill" />
                    </BubbleIcon>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {assignment.teacherName}
                      </p>
                      <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveTeacher(assignment.teacherId, assignment.subject)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remove ${assignment.teacherName} from ${assignment.subject}`}
                  >
                    <Trash size={16} weight="bold" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground w-full text-center py-8">
                No teachers assigned yet
              </p>
            )}
          </div>
        </div>

        {approvedTeachers.length === 0 && (
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground text-center">
              No approved teachers available. Please add and approve teachers first.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
