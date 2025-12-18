import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import { ChartBar, CalendarBlank, Users, BookOpen, Download, TrendUp, TrendDown } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts"
import { toast } from "sonner"

interface TeacherReportsProps {
  teacherId: string
  onBack: () => void
}

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b"
]

export default function TeacherReports({ teacherId, onBack }: TeacherReportsProps) {
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState("10-A")
  const [selectedSubject, setSelectedSubject] = useState("Mathematics")
  const [reportType, setReportType] = useState<"attendance" | "performance" | "overview">("overview")

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const storedTeachers = await window.spark.kv.get<any[]>("admin-teachers-records") || []
        let teacherData = storedTeachers.find(t => t.id === teacherId)
        
        if (!teacherData) {
          const { teachers: fallbackTeachers } = await import("@/data/attendanceData")
          teacherData = fallbackTeachers.find(t => t.id === teacherId)
        }
        
        setTeacher(teacherData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading teacher data:", error)
        setTeacher(null)
        setLoading(false)
      }
    }
    
    loadTeacherData()
  }, [teacherId])

  const attendanceData = [
    { month: "Jan", present: 92, absent: 8 },
    { month: "Feb", present: 88, absent: 12 },
    { month: "Mar", present: 95, absent: 5 },
    { month: "Apr", present: 90, absent: 10 },
    { month: "May", present: 93, absent: 7 },
    { month: "Jun", present: 89, absent: 11 }
  ]

  const performanceData = [
    { test: "Test 1", average: 75, highest: 95, lowest: 45 },
    { test: "Test 2", average: 78, highest: 98, lowest: 52 },
    { test: "Test 3", average: 82, highest: 96, lowest: 58 },
    { test: "Test 4", average: 80, highest: 99, lowest: 55 },
    { test: "Test 5", average: 85, highest: 100, lowest: 62 }
  ]

  const gradeDistribution = [
    { grade: "A+", count: 8 },
    { grade: "A", count: 12 },
    { grade: "B", count: 15 },
    { grade: "C", count: 7 },
    { grade: "D", count: 3 }
  ]

  const stats = [
    {
      label: "Average Attendance",
      value: "91.5%",
      change: "+2.3%",
      trend: "up",
      icon: Users,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      label: "Class Average",
      value: "80.2",
      change: "+3.1",
      trend: "up",
      icon: ChartBar,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      label: "Total Students",
      value: "45",
      change: "No change",
      trend: "neutral",
      icon: BookOpen,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      label: "Tests Conducted",
      value: "5",
      change: "+1 this month",
      trend: "up",
      icon: CalendarBlank,
      gradient: "from-blue-500 to-purple-600"
    }
  ]

  const handleDownloadReport = () => {
    toast.success("Downloading report...")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-16">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <div className="text-muted-foreground">Loading reports...</div>
          </div>
        </div>
      ) : !teacher ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <Card className="p-8 bg-white/5 backdrop-blur-xl border-white/10">
              <p className="text-xl font-semibold text-destructive mb-2">Teacher not found</p>
              <p className="text-foreground/70 mb-4">Unable to load teacher data. Please try again.</p>
              <Button onClick={onBack} className="bg-primary text-primary-foreground">
                Go Back to Dashboard
              </Button>
            </Card>
          </div>
        </div>
      ) : (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-6"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </button>
        
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
            <p className="text-gray-300">Track student progress and performance</p>
          </div>
          <Button 
            onClick={handleDownloadReport}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
          >
            <Download size={20} />
            Export
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6-A">Class 6-A</SelectItem>
              <SelectItem value="7-A">Class 7-A</SelectItem>
              <SelectItem value="8-A">Class 8-A</SelectItem>
              <SelectItem value="9-A">Class 9-A</SelectItem>
              <SelectItem value="10-A">Class 10-A</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="History">History</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reportType} onValueChange={(v) => setReportType(v as any)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            const TrendIcon = stat.trend === "up" ? TrendUp : stat.trend === "down" ? TrendDown : null
            
            return (
              <Card key={idx} className="p-4 bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-400/50 card-shadow hover:card-shadow-lg transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg flex items-center justify-center`}>
                    <Icon size={20} weight="fill" className="text-white" />
                  </div>
                  {TrendIcon && (
                    <TrendIcon 
                      size={16} 
                      className={stat.trend === "up" ? "text-green-400" : "text-red-400"} 
                      weight="bold"
                    />
                  )}
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-300 mb-1">{stat.label}</p>
                <p className={`text-xs font-medium ${
                  stat.trend === "up" ? "text-green-400" : 
                  stat.trend === "down" ? "text-red-400" : 
                  "text-gray-400"
                }`}>
                  {stat.change}
                </p>
              </Card>
            )
          })}
        </motion.div>

        {(reportType === "overview" || reportType === "attendance") && (
          <motion.div variants={itemVariants}>
            <Card className="p-5 bg-white/5 backdrop-blur-xl border-white/10 card-shadow">
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Users size={20} weight="fill" className="text-blue-400" />
                Attendance Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px', fill: 'white' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px', fill: 'white' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(26, 31, 58, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#00E676" 
                    strokeWidth={3}
                    dot={{ fill: '#00E676', r: 4 }}
                    name="Present"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="absent" 
                    stroke="#FF3B30" 
                    strokeWidth={3}
                    dot={{ fill: '#FF3B30', r: 4 }}
                    name="Absent"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}

        {(reportType === "overview" || reportType === "performance") && (
          <motion.div variants={itemVariants}>
            <Card className="p-5 bg-white/5 backdrop-blur-xl border-white/10 card-shadow">
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <ChartBar size={20} weight="fill" className="text-blue-400" />
                Performance Analysis
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="test" 
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px', fill: 'white' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px', fill: 'white' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(26, 31, 58, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="average" fill="#3b82f6" name="Average" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="highest" fill="#00E676" name="Highest" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="lowest" fill="#f59e0b" name="Lowest" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}

        {reportType === "overview" && (
          <motion.div variants={itemVariants}>
            <Card className="p-5 bg-white/5 backdrop-blur-xl border-white/10 card-shadow">
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <BookOpen size={20} weight="fill" className="text-blue-400" />
                Grade Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ grade, percent }) => `${grade}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ 
                    background: 'rgba(26, 31, 58, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {gradeDistribution.map((item, idx) => (
                  <div key={item.grade} className="text-center">
                    <div 
                      className="w-4 h-4 rounded mx-auto mb-1"
                      style={{ background: COLORS[idx] }}
                    />
                    <p className="text-xs font-semibold text-white">{item.grade}</p>
                    <p className="text-xs text-gray-300">{item.count}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Card className="p-5 bg-white/5 backdrop-blur-xl border-white/10 card-shadow">
            <h3 className="font-semibold mb-3 text-white">Quick Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <TrendUp size={16} weight="bold" className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Performance Improving</p>
                  <p className="text-xs text-gray-300">Class average increased by 3.1 points this month</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Users size={16} weight="bold" className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Strong Attendance</p>
                  <p className="text-xs text-gray-300">91.5% average attendance rate across all classes</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <BookOpen size={16} weight="bold" className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Top Performers</p>
                  <p className="text-xs text-gray-300">8 students achieved A+ grade in recent tests</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
      )}
    </div>
  )
}
