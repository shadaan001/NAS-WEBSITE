import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AttendanceReportCharts({ chartData }) {
  const { studentWise = [], subjectWise = [], teacherWise = [] } = chartData

  const pieData = studentWise.length > 0
    ? [
        { name: "Present", value: studentWise.reduce((sum, s) => sum + s.present, 0), color: "oklch(0.65 0.15 150)" },
        { name: "Absent", value: studentWise.reduce((sum, s) => sum + s.absent, 0), color: "oklch(0.58 0.22 25)" },
        { name: "Late", value: studentWise.reduce((sum, s) => sum + s.late, 0), color: "oklch(0.70 0.15 40)" }
      ]
    : []

  const COLORS = {
    primary: "oklch(0.60 0.15 240)",
    secondary: "oklch(0.65 0.15 150)",
    accent: "oklch(0.70 0.15 40)",
    destructive: "oklch(0.58 0.22 25)"
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name.includes("%") ? "" : entry.name === "percentage" ? "%" : ""}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (!studentWise.length && !subjectWise.length && !teacherWise.length) {
    return (
      <Card className="card-shadow">
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No data available for charts</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {studentWise.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-heading text-lg">Student-wise Attendance %</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentWise.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "oklch(0.50 0.04 240)", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fill: "oklch(0.50 0.04 240)", fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="percentage"
                    fill={COLORS.primary}
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                    animationBegin={0}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {subjectWise.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-heading text-lg">Subject-wise Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={subjectWise}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                  <XAxis
                    dataKey="subject"
                    tick={{ fill: "oklch(0.50 0.04 240)", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "oklch(0.50 0.04 240)", fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke={COLORS.secondary}
                    strokeWidth={3}
                    dot={{ fill: COLORS.secondary, r: 6 }}
                    activeDot={{ r: 8 }}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {pieData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-heading text-lg">Overall Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={800}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {teacherWise.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-heading text-lg">Teacher-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teacherWise}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "oklch(0.50 0.04 240)", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fill: "oklch(0.50 0.04 240)", fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="percentage"
                    fill={COLORS.accent}
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
