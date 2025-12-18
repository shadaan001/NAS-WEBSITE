import { useState } from "react"
import { CheckCircle, XCircle, Clock, CalendarBlank, ChalkboardTeacher, Books, TrendUp } from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import StatusBadge from "@/components/school/StatusBadge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { attendanceRecords, attendanceSummary, teachers } from "@/data/attendanceData"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { AttendanceRecord } from "@/types"

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const last7DaysData = attendanceSummary.last7Days.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    present: day.present,
    absent: day.absent,
    late: day.late,
    attendance: day.totalClasses > 0 ? Math.round(((day.present + day.late) / day.totalClasses) * 100) : 0,
  }))

  const last30DaysData = attendanceSummary.last30Days.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-IN", { day: "numeric" }),
    attendance: day.totalClasses > 0 ? Math.round(((day.present + day.late) / day.totalClasses) * 100) : 0,
  }))

  const pieData = [
    { name: "Present", value: attendanceSummary.presentDays, color: "oklch(0.65 0.15 150)" },
    { name: "Absent", value: attendanceSummary.absentDays, color: "oklch(0.58 0.22 25)" },
    { name: "Late", value: attendanceSummary.lateDays, color: "oklch(0.70 0.15 40)" },
  ]

  const dateRecords = attendanceRecords.filter((r) => r.date === selectedDate)
  
  const groupedByDate = attendanceRecords.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = []
    }
    acc[record.date].push(record)
    return acc
  }, {} as Record<string, AttendanceRecord[]>)

  const uniqueDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  const getDayStatus = (records: AttendanceRecord[]) => {
    const total = records.length
    const absent = records.filter((r) => r.status === "absent").length
    const late = records.filter((r) => r.status === "late").length
    const present = records.filter((r) => r.status === "present").length
    
    if (absent > total / 2) return "absent"
    if (late > 0 && present + late >= total / 2) return "late"
    return "present"
  }

  return (
    <div className="pb-20 px-4 pt-4 space-y-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <BubbleIcon size="md" variant="blue">
          <CalendarBlank size={28} weight="fill" />
        </BubbleIcon>
        <div>
          <h1 className="text-2xl font-bold text-heading text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground">Track your attendance record</p>
        </div>
      </div>

      <Card className="p-5 rounded-2xl card-shadow animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-heading text-foreground">Overall Attendance</h2>
          <span className="text-2xl font-bold text-primary text-heading">{attendanceSummary.percentage}%</span>
        </div>
        <Progress value={attendanceSummary.percentage} className="h-3 mb-4" />
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-heading text-foreground">{attendanceSummary.totalDays}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Present</p>
            <p className="text-lg font-bold text-secondary text-heading">{attendanceSummary.presentDays}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Absent</p>
            <p className="text-lg font-bold text-destructive text-heading">{attendanceSummary.absentDays}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Late</p>
            <p className="text-lg font-bold text-accent text-heading">{attendanceSummary.lateDays}</p>
          </div>
        </div>
      </Card>

      <Card className="p-5 rounded-2xl card-shadow animate-slide-up overflow-hidden" style={{ animationDelay: "0.15s" }}>
        <h2 className="text-base font-bold text-heading text-foreground mb-4">Attendance Distribution</h2>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-0">
          <Card className="p-4 rounded-2xl card-shadow overflow-hidden">
            <h3 className="text-sm font-bold text-heading text-foreground mb-3 flex items-center gap-2">
              <TrendUp size={18} className="text-primary" />
              Last 7 Days Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: "oklch(0.50 0.04 240)" }}
                  stroke="oklch(0.88 0.02 240)"
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: "oklch(0.50 0.04 240)" }}
                  stroke="oklch(0.88 0.02 240)"
                />
                <Tooltip />
                <Bar dataKey="present" stackId="a" fill="oklch(0.65 0.15 150)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="late" stackId="a" fill="oklch(0.70 0.15 40)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="absent" stackId="a" fill="oklch(0.58 0.22 25)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4 rounded-2xl card-shadow overflow-hidden">
            <h3 className="text-sm font-bold text-heading text-foreground mb-3 flex items-center gap-2">
              <CalendarBlank size={18} className="text-primary" />
              Last 30 Days Performance
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={last30DaysData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: "oklch(0.50 0.04 240)" }}
                  stroke="oklch(0.88 0.02 240)"
                  interval={4}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: "oklch(0.50 0.04 240)" }}
                  stroke="oklch(0.88 0.02 240)"
                  domain={[0, 100]}
                />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="oklch(0.60 0.15 240)" 
                  fill="oklch(0.60 0.15 240 / 0.2)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-3 mt-0">
          {attendanceSummary.bySubject.map((subject) => (
            <Card key={subject.subject} className="p-4 rounded-xl card-shadow">
              <div className="flex items-start gap-3">
                <BubbleIcon size="sm" variant="blue">
                  <Books size={20} weight="fill" />
                </BubbleIcon>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground text-heading">{subject.subject}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{subject.teacherName}</p>
                    </div>
                    <span className="text-lg font-bold text-primary text-heading">{subject.percentage}%</span>
                  </div>
                  <Progress value={subject.percentage} className="h-2 mb-2" />
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-sm font-bold text-heading">{subject.totalClasses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Present</p>
                      <p className="text-sm font-bold text-secondary text-heading">{subject.present}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Absent</p>
                      <p className="text-sm font-bold text-destructive text-heading">{subject.absent}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Late</p>
                      <p className="text-sm font-bold text-accent text-heading">{subject.late}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="teachers" className="space-y-3 mt-0">
          {attendanceSummary.byTeacher.map((teacher) => (
            <Card key={teacher.teacherId} className="p-4 rounded-xl card-shadow">
              <div className="flex items-start gap-3">
                <BubbleIcon size="sm" variant="green">
                  <ChalkboardTeacher size={20} weight="fill" />
                </BubbleIcon>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground text-heading">{teacher.teacherName}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {teacher.subjects.join(", ")}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-secondary text-heading">{teacher.percentage}%</span>
                  </div>
                  <Progress value={teacher.percentage} className="h-2 mb-2" />
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-sm font-bold text-heading">{teacher.totalClasses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Present</p>
                      <p className="text-sm font-bold text-secondary text-heading">{teacher.present}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Absent</p>
                      <p className="text-sm font-bold text-destructive text-heading">{teacher.absent}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Late</p>
                      <p className="text-sm font-bold text-accent text-heading">{teacher.late}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-base font-bold text-heading text-foreground mb-3">Attendance History</h2>
        <div className="space-y-2">
          {uniqueDates.slice(0, 30).map((date) => {
            const records = groupedByDate[date]
            const dayStatus = getDayStatus(records)
            const isSelected = selectedDate === date
            const dateObj = new Date(date)

            return (
              <Card
                key={date}
                className={`p-4 rounded-xl card-shadow transition-all cursor-pointer active:scale-98 ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedDate(isSelected ? null : date)}
              >
                <div className="flex items-center gap-3">
                  <BubbleIcon
                    size="sm"
                    variant={
                      dayStatus === "present"
                        ? "green"
                        : dayStatus === "absent"
                        ? "orange"
                        : "purple"
                    }
                  >
                    {dayStatus === "present" ? (
                      <CheckCircle size={20} weight="fill" />
                    ) : dayStatus === "absent" ? (
                      <XCircle size={20} weight="fill" />
                    ) : (
                      <Clock size={20} weight="fill" />
                    )}
                  </BubbleIcon>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground text-heading">
                      {dateObj.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {records.length} classes • {records.filter(r => r.status === "present").length} present
                    </p>
                  </div>
                  <StatusBadge
                    status={dayStatus as "present" | "absent" | "late"}
                  />
                </div>

                {isSelected && records.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    {records.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-foreground">{record.subject}</p>
                          <p className="text-xs text-muted-foreground">{record.teacherName}</p>
                        </div>
                        <StatusBadge status={record.status} />
                      </div>
                    ))}
                    {records.some(r => r.remarks) && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Remarks:</p>
                        <p className="text-sm text-foreground">{records.find(r => r.remarks)?.remarks}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
