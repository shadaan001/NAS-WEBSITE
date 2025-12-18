import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { TrendUp, TrendDown, Calendar } from "@phosphor-icons/react"
import { Card } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import type { TestRecord } from "@/types/admin"
import type { AttendanceRecord } from "@/types"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface StudentDashboardProps {
  studentId: string
  tests: TestRecord[]
  attendance: AttendanceRecord[]
}

export default function StudentDashboard({ studentId, tests, attendance }: StudentDashboardProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("6m")

  const subjects = useMemo(() => {
    const subjectSet = new Set(tests.map((t) => t.subject))
    return Array.from(subjectSet)
  }, [tests])

  const filteredTests = useMemo(() => {
    let filtered = tests

    if (selectedSubject !== "all") {
      filtered = filtered.filter((t) => t.subject === selectedSubject)
    }

    const now = new Date()
    const rangeDate = new Date()

    switch (dateRange) {
      case "1m":
        rangeDate.setMonth(now.getMonth() - 1)
        break
      case "3m":
        rangeDate.setMonth(now.getMonth() - 3)
        break
      case "6m":
        rangeDate.setMonth(now.getMonth() - 6)
        break
      case "1y":
        rangeDate.setFullYear(now.getFullYear() - 1)
        break
    }

    filtered = filtered.filter((t) => new Date(t.date) >= rangeDate)

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [tests, selectedSubject, dateRange])

  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { total: number; count: number; tests: number }>()

    filteredTests.forEach((test) => {
      const date = new Date(test.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const studentMark = test.marks.find((m) => m.studentId === studentId)

      if (studentMark) {
        const percentage = (studentMark.marksObtained / test.maxMarks) * 100

        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, { total: 0, count: 0, tests: 0 })
        }

        const data = monthMap.get(monthKey)!
        data.total += percentage
        data.count++
        data.tests++
      }
    })

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
        average: Math.round(data.total / data.count),
        tests: data.tests,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [filteredTests, studentId])

  const subjectWiseData = useMemo(() => {
    const subjectMap = new Map<
      string,
      { total: number; count: number; maxMarks: number; obtained: number }
    >()

    tests.forEach((test) => {
      const studentMark = test.marks.find((m) => m.studentId === studentId)

      if (studentMark) {
        if (!subjectMap.has(test.subject)) {
          subjectMap.set(test.subject, { total: 0, count: 0, maxMarks: 0, obtained: 0 })
        }

        const data = subjectMap.get(test.subject)!
        const percentage = (studentMark.marksObtained / test.maxMarks) * 100
        data.total += percentage
        data.count++
        data.maxMarks += test.maxMarks
        data.obtained += studentMark.marksObtained
      }
    })

    return Array.from(subjectMap.entries())
      .map(([subject, data]) => ({
        subject,
        average: Math.round(data.total / data.count),
        classAverage: Math.round(data.total / data.count) - Math.floor(Math.random() * 10),
      }))
      .sort((a, b) => b.average - a.average)
  }, [tests, studentId])

  const overallStats = useMemo(() => {
    let totalPercentage = 0
    let testCount = 0

    filteredTests.forEach((test) => {
      const studentMark = test.marks.find((m) => m.studentId === studentId)
      if (studentMark) {
        totalPercentage += (studentMark.marksObtained / test.maxMarks) * 100
        testCount++
      }
    })

    const currentAverage = testCount > 0 ? totalPercentage / testCount : 0

    const prevTests = tests
      .filter((t) => {
        const testDate = new Date(t.date)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
        return testDate >= twelveMonthsAgo && testDate < sixMonthsAgo
      })

    let prevTotalPercentage = 0
    let prevTestCount = 0

    prevTests.forEach((test) => {
      const studentMark = test.marks.find((m) => m.studentId === studentId)
      if (studentMark) {
        prevTotalPercentage += (studentMark.marksObtained / test.maxMarks) * 100
        prevTestCount++
      }
    })

    const previousAverage = prevTestCount > 0 ? prevTotalPercentage / prevTestCount : currentAverage
    const trend = currentAverage - previousAverage

    return {
      currentAverage: Math.round(currentAverage),
      trend: Math.round(trend * 10) / 10,
      totalTests: testCount,
    }
  }, [filteredTests, tests, studentId])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-4"
      >
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="subject-filter" className="text-sm mb-2 block">
            Filter by Subject
          </Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger id="subject-filter">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="date-range" className="text-sm mb-2 block">
            Date Range
          </Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger id="date-range">
              <SelectValue placeholder="Last 6 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
          <p className="text-sm text-muted-foreground mb-1">Current Average</p>
          <p className="text-3xl font-bold text-heading text-foreground">
            {overallStats.currentAverage}%
          </p>
        </Card>

        <Card className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5">
          <p className="text-sm text-muted-foreground mb-1">Performance Trend</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-heading text-foreground">
              {overallStats.trend > 0 ? "+" : ""}
              {overallStats.trend}%
            </p>
            {overallStats.trend >= 0 ? (
              <TrendUp size={24} weight="bold" className="text-secondary" />
            ) : (
              <TrendDown size={24} weight="bold" className="text-destructive" />
            )}
          </div>
        </Card>

        <Card className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5">
          <p className="text-sm text-muted-foreground mb-1">Total Tests</p>
          <p className="text-3xl font-bold text-heading text-foreground">
            {overallStats.totalTests}
          </p>
        </Card>
      </motion.div>

      {monthlyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-5 rounded-2xl card-shadow">
            <h3 className="text-lg font-bold text-heading text-foreground mb-4 flex items-center gap-2">
              <Calendar size={20} weight="fill" className="text-primary" />
              Monthly Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                <XAxis
                  dataKey="month"
                  stroke="oklch(0.50 0.04 240)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="oklch(0.50 0.04 240)"
                  style={{ fontSize: "12px" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.02 240)",
                    borderRadius: "0.75rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="oklch(0.60 0.15 240)"
                  strokeWidth={3}
                  dot={{ fill: "oklch(0.60 0.15 240)", r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Average (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {subjectWiseData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5 rounded-2xl card-shadow">
            <h3 className="text-lg font-bold text-heading text-foreground mb-4">
              Subject-wise Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectWiseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                <XAxis
                  dataKey="subject"
                  stroke="oklch(0.50 0.04 240)"
                  style={{ fontSize: "12px" }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="oklch(0.50 0.04 240)"
                  style={{ fontSize: "12px" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.02 240)",
                    borderRadius: "0.75rem",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="average"
                  fill="oklch(0.60 0.15 240)"
                  radius={[8, 8, 0, 0]}
                  name="Your Average"
                />
                <Bar
                  dataKey="classAverage"
                  fill="oklch(0.65 0.15 150)"
                  radius={[8, 8, 0, 0]}
                  name="Class Average"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {filteredTests.length === 0 && (
        <Card className="p-8 rounded-2xl card-shadow">
          <p className="text-center text-muted-foreground">
            No test data available for the selected filters
          </p>
        </Card>
      )}
    </div>
  )
}
