import { motion } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import { 
  Users, 
  ChalkboardTeacher, 
  BookOpen, 
  CurrencyDollar, 
  ClipboardText, 
  CalendarCheck,
  TrendUp,
  Warning,
  House,
  VideoCamera,
  LockKey,
  UserPlus,
  UserList
} from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import type { StudentRecord, TeacherRecord, FeeRecord, TestRecord } from "@/types/admin"
import type { AttendanceRecord } from "@/types"

interface AdminDashboardPageProps {
  adminId: string
  onNavigate: (page: "dashboard" | "students" | "teachers" | "attendance" | "reports" | "classes" | "tests" | "fees" | "profile" | "manage-lectures" | "manage-islamic-videos" | "credentials" | "add-teacher-info" | "view-all-teachers") => void
  onGoHome?: () => void
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function AdminDashboardPage({ adminId, onNavigate, onGoHome }: AdminDashboardPageProps) {
  const [students] = useKV<StudentRecord[]>("admin-students-records", [])
  const [teachers] = useKV<TeacherRecord[]>("admin-teachers-records", [])
  const [fees] = useKV<FeeRecord[]>("admin-fee-records", [])
  const [tests] = useKV<TestRecord[]>("admin-test-records", [])
  const [attendance] = useKV<AttendanceRecord[]>("admin-attendance-records", [])

  const totalStudents = students?.length || 0
  const totalTeachers = teachers?.length || 0
  const totalSubjects = new Set(teachers?.flatMap(t => t.subjects) || []).size
  
  const paidFees = fees?.filter(f => f.status === "paid").length || 0
  const unpaidFees = fees?.filter(f => f.status === "unpaid" || f.status === "overdue").length || 0
  const feeCollectionRate = fees?.length ? Math.round((paidFees / fees.length) * 100) : 0

  const upcomingTests = tests?.filter(t => new Date(t.date) > new Date()).length || 0

  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = attendance?.filter(a => a.date === today) || []
  const presentToday = todayAttendance.filter(a => a.status === "present").length
  const totalToday = todayAttendance.length
  const attendanceRate = totalToday ? Math.round((presentToday / totalToday) * 100) : 0

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const dayAttendance = attendance?.filter(a => a.date === dateStr) || []
    const present = dayAttendance.filter(a => a.status === "present").length
    const total = dayAttendance.length
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      attendance: total ? Math.round((present / total) * 100) : 0,
      students: Math.floor(total / 6)
    }
  })

  const feeData = [
    { name: "Paid", value: paidFees, color: "#10b981" },
    { name: "Unpaid", value: unpaidFees, color: "#ef4444" },
  ]

  return (
    <div className="pb-24 px-4 pt-16 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3 mb-2"
      >
        <div className="flex items-center gap-3">
          <BubbleIcon size="md" variant="purple">
            <ChalkboardTeacher size={28} weight="fill" />
          </BubbleIcon>
          <div>
            <h1 className="text-2xl font-bold text-heading text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Coaching Center Management</p>
          </div>
        </div>
        {onGoHome && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onGoHome}
            className="flex items-center gap-2"
          >
            <House size={18} weight="fill" />
            Home
          </Button>
        )}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        <motion.div variants={item}>
          <Card 
            className="p-4 rounded-2xl card-shadow cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("students")}
          >
            <div className="flex items-start gap-3">
              <BubbleIcon size="sm" variant="blue">
                <Users size={20} weight="fill" />
              </BubbleIcon>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-heading text-foreground mt-1">{totalStudents}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendUp size={12} className="text-secondary" weight="bold" />
                  <span className="text-xs text-secondary font-semibold">Active</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className="p-4 rounded-2xl card-shadow cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("teachers")}
          >
            <div className="flex items-start gap-3">
              <BubbleIcon size="sm" variant="green">
                <ChalkboardTeacher size={20} weight="fill" />
              </BubbleIcon>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold text-heading text-foreground mt-1">{totalTeachers}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendUp size={12} className="text-secondary" weight="bold" />
                  <span className="text-xs text-secondary font-semibold">Active</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className="p-4 rounded-2xl card-shadow cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("classes")}
          >
            <div className="flex items-start gap-3">
              <BubbleIcon size="sm" variant="orange">
                <BookOpen size={20} weight="fill" />
              </BubbleIcon>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Subjects</p>
                <p className="text-2xl font-bold text-heading text-foreground mt-1">{totalSubjects}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-muted-foreground font-medium">Active courses</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className="p-4 rounded-2xl card-shadow cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("tests")}
          >
            <div className="flex items-start gap-3">
              <BubbleIcon size="sm" variant="purple">
                <ClipboardText size={20} weight="fill" />
              </BubbleIcon>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Upcoming Tests</p>
                <p className="text-2xl font-bold text-heading text-foreground mt-1">{upcomingTests}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-muted-foreground font-medium">Scheduled</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className="p-4 rounded-2xl card-shadow cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("manage-lectures")}
          >
            <div className="flex items-start gap-3">
              <BubbleIcon size="sm" variant="blue">
                <VideoCamera size={20} weight="fill" />
              </BubbleIcon>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Manage Lectures</p>
                <p className="text-2xl font-bold text-heading text-foreground mt-1">📚</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-muted-foreground font-medium">Video content</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className="p-4 rounded-2xl card-shadow cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("manage-islamic-videos")}
          >
            <div className="flex items-start gap-3">
              <BubbleIcon size="sm" variant="green">
                <VideoCamera size={20} weight="fill" />
              </BubbleIcon>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Islamic Videos</p>
                <p className="text-2xl font-bold text-heading text-foreground mt-1">🕌</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-muted-foreground font-medium">Manage content</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className="p-4 rounded-2xl card-shadow cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("credentials")}
          >
            <div className="flex items-start gap-3">
              <BubbleIcon size="sm" variant="purple">
                <LockKey size={20} weight="fill" />
              </BubbleIcon>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Credentials</p>
                <p className="text-2xl font-bold text-heading text-foreground mt-1">🔐</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-muted-foreground font-medium">Login management</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className="p-4 rounded-2xl card-shadow cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("add-teacher-info")}
          >
            <div className="flex items-start gap-3">
              <BubbleIcon size="sm" variant="green">
                <UserPlus size={20} weight="fill" />
              </BubbleIcon>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Add Teacher Info</p>
                <p className="text-2xl font-bold text-heading text-foreground mt-1">👨‍🏫</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-muted-foreground font-medium">Public display</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className="p-4 rounded-2xl card-shadow cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("view-all-teachers")}
          >
            <div className="flex items-start gap-3">
              <BubbleIcon size="sm" variant="blue">
                <UserList size={20} weight="fill" />
              </BubbleIcon>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">View All Teachers</p>
                <p className="text-2xl font-bold text-heading text-foreground mt-1">📋</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-muted-foreground font-medium">Manage info</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-5 rounded-2xl card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BubbleIcon size="sm" variant="blue">
                <CurrencyDollar size={18} weight="fill" />
              </BubbleIcon>
              <h2 className="text-base font-bold text-heading text-foreground">Fee Collection</h2>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onNavigate("fees")}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Collection Rate</span>
              <span className="text-lg font-bold text-heading text-foreground">{feeCollectionRate}%</span>
            </div>
            <Progress value={feeCollectionRate} className="h-2" />
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-secondary/10">
                <p className="text-xs text-muted-foreground">Paid</p>
                <p className="text-xl font-bold text-heading text-secondary">{paidFees}</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-heading text-destructive">{unpaidFees}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-5 rounded-2xl card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BubbleIcon size="sm" variant="green">
                <CalendarCheck size={18} weight="fill" />
              </BubbleIcon>
              <h2 className="text-base font-bold text-heading text-foreground">Attendance Overview</h2>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onNavigate("attendance")}
            >
              Details
            </Button>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Today's Attendance</span>
              <span className="text-lg font-bold text-heading text-foreground">{attendanceRate}%</span>
            </div>
            <Progress value={attendanceRate} className="h-2" />
          </div>

          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: 'oklch(0.50 0.04 240)', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: 'oklch(0.50 0.04 240)', fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'oklch(1 0 0)', 
                    border: '1px solid oklch(0.88 0.02 240)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="oklch(0.60 0.15 240)" 
                  strokeWidth={2}
                  dot={{ fill: 'oklch(0.60 0.15 240)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {unpaidFees > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4 rounded-2xl card-shadow bg-destructive/5 border-destructive/20">
            <div className="flex items-start gap-3">
              <BubbleIcon size="sm" variant="orange">
                <Warning size={20} weight="fill" />
              </BubbleIcon>
              <div>
                <h3 className="text-sm font-bold text-heading text-foreground">Pending Payments</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {unpaidFees} student{unpaidFees !== 1 ? 's have' : ' has'} pending fee payments
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-3"
                  onClick={() => onNavigate("fees")}
                >
                  Review Payments
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
