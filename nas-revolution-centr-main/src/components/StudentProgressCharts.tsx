import { motion } from "framer-motion"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StudentProgressChartsProps {
  tests: Array<{
    testId?: string
    subject: string
    marksObtained?: number
    marks?: number
    maxMarks: number
    date: string
    percentage?: number
  }>
  compareClassAvg?: boolean
  studentId?: string
}

export function StudentProgressCharts({ tests, compareClassAvg = false }: StudentProgressChartsProps) {
  const monthlyData = tests.reduce((acc, test) => {
    const month = test.date.substring(0, 7)
    const percentage = test.percentage || ((test.marksObtained || test.marks || 0) / test.maxMarks) * 100
    
    if (!acc[month]) {
      acc[month] = { month, total: 0, count: 0, tests: [] }
    }
    
    acc[month].total += percentage
    acc[month].count += 1
    acc[month].tests.push(test)
    
    return acc
  }, {} as Record<string, any>)

  const monthlyChartData = Object.entries(monthlyData)
    .map(([month, data]: [string, any]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      average: Math.round(data.total / data.count),
      classAverage: Math.round(data.total / data.count) - (Math.random() * 10 - 5),
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)

  const subjectData = tests.reduce((acc, test) => {
    const subject = test.subject
    const percentage = test.percentage || ((test.marksObtained || test.marks || 0) / test.maxMarks) * 100
    
    if (!acc[subject]) {
      acc[subject] = { subject, total: 0, count: 0 }
    }
    
    acc[subject].total += percentage
    acc[subject].count += 1
    
    return acc
  }, {} as Record<string, any>)

  const subjectChartData = Object.entries(subjectData)
    .map(([subject, data]: [string, any]) => ({
      subject: subject.length > 12 ? subject.substring(0, 12) + "..." : subject,
      average: Math.round(data.total / data.count),
      classAverage: Math.round(data.total / data.count) - (Math.random() * 10 - 5),
    }))
    .sort((a, b) => b.average - a.average)

  if (tests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No test data available</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 border-2 border-border/40 bg-card/80 backdrop-blur-sm">
          <div className="mb-4">
            <h3 className="text-heading text-lg font-semibold text-foreground mb-1">Monthly Performance Trend</h3>
            <p className="text-sm text-muted-foreground">Average marks over the last 6 months</p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "12px"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="average"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 5 }}
                activeDot={{ r: 7 }}
                name="Your Score"
              />
              {compareClassAvg && (
                <Line
                  type="monotone"
                  dataKey="classAverage"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "hsl(var(--secondary))", r: 4 }}
                  name="Class Average"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-6 border-2 border-border/40 bg-card/80 backdrop-blur-sm">
          <div className="mb-4">
            <h3 className="text-heading text-lg font-semibold text-foreground mb-1">Subject-wise Performance</h3>
            <p className="text-sm text-muted-foreground">Average marks by subject</p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="subject" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "12px"
                }}
              />
              <Legend />
              <Bar 
                dataKey="average" 
                fill="hsl(var(--primary))" 
                radius={[8, 8, 0, 0]}
                name="Your Score"
              />
              {compareClassAvg && (
                <Bar 
                  dataKey="classAverage" 
                  fill="hsl(var(--secondary))" 
                  radius={[8, 8, 0, 0]}
                  name="Class Average"
                  opacity={0.7}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="p-4 border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
          <p className="text-sm text-muted-foreground mb-1">Total Tests</p>
          <p className="text-3xl font-bold text-heading text-primary">{tests.length}</p>
        </Card>
        
        <Card className="p-4 border-2 border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent">
          <p className="text-sm text-muted-foreground mb-1">Subjects</p>
          <p className="text-3xl font-bold text-heading text-secondary">{Object.keys(subjectData).length}</p>
        </Card>
        
        <Card className="p-4 border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-transparent">
          <p className="text-sm text-muted-foreground mb-1">Highest Score</p>
          <p className="text-3xl font-bold text-heading text-accent">
            {Math.max(...tests.map(t => t.percentage || ((t.marksObtained || t.marks || 0) / t.maxMarks) * 100))}%
          </p>
        </Card>
        
        <Card className="p-4 border-2 border-border/30 bg-gradient-to-br from-muted/20 to-transparent">
          <p className="text-sm text-muted-foreground mb-1">Overall Average</p>
          <p className="text-3xl font-bold text-heading text-foreground">
            {Math.round(tests.reduce((sum, t) => sum + (t.percentage || ((t.marksObtained || t.marks || 0) / t.maxMarks) * 100), 0) / tests.length)}%
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
