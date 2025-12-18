import { Bell, CalendarCheck, BookOpen, ChartBar, CurrencyDollar, Clock, VideoCamera } from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import QuickCard from "@/components/school/QuickCard"
import StatusBadge from "@/components/school/StatusBadge"
import CircularProgress from "@/components/school/CircularProgress"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { studentData, upcomingTests, homeworkData, feesData, notificationsData } from "@/data/mockData"
import { attendanceSummary } from "@/data/attendanceData"

interface DashboardPageProps {
  onNavigate: (tab: "attendance" | "homework" | "lectures" | "admin") => void
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const unreadNotifications = notificationsData.filter((n) => !n.read).length
  const pendingHomework = homeworkData.filter((h) => h.status === "pending").length

  return (
    <div className="pb-20 px-4 pt-16 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-heading">
              {studentData.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-heading text-foreground">Welcome, {studentData.name.split(" ")[0]}!</h1>
            <p className="text-sm text-muted-foreground">{studentData.class} • Roll No. {studentData.rollNumber}</p>
          </div>
        </div>
        <div className="relative">
          <button className="p-2 rounded-full bg-card border border-border active:scale-95 transition-transform">
            <Bell size={24} className="text-foreground" />
          </button>
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
              {unreadNotifications}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <QuickCard
          icon={<BubbleIcon size="sm" variant="blue"><CalendarCheck size={20} weight="fill" /></BubbleIcon>}
          title="Attendance"
          value={`${attendanceSummary.percentage}%`}
          subtitle={`${attendanceSummary.presentDays}/${attendanceSummary.totalDays} days`}
          variant="blue"
          onClick={() => onNavigate("attendance")}
        />
        <QuickCard
          icon={<BubbleIcon size="sm" variant="orange"><BookOpen size={20} weight="fill" /></BubbleIcon>}
          title="Pending Work"
          value={pendingHomework}
          subtitle="Homework due"
          variant="orange"
          onClick={() => onNavigate("homework")}
        />
        <QuickCard
          icon={<BubbleIcon size="sm" variant="purple"><VideoCamera size={20} weight="fill" /></BubbleIcon>}
          title="Lectures"
          value="📚"
          subtitle="Video lessons"
          variant="purple"
          onClick={() => onNavigate("lectures")}
        />
        <QuickCard
          icon={<BubbleIcon size="sm" variant="green"><ChartBar size={20} weight="fill" /></BubbleIcon>}
          title="Last Result"
          value="85%"
          subtitle="Mid-Term Exam"
          variant="green"
        />
      </div>

      <Card className="p-4 rounded-2xl card-shadow animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-heading text-foreground">Upcoming Tests</h2>
          <Clock size={20} className="text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {upcomingTests.map((test) => (
            <div key={test.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
              <BubbleIcon size="sm" variant="blue">
                <BookOpen size={18} weight="fill" />
              </BubbleIcon>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground text-heading">{test.subject}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{test.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(test.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {test.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 rounded-2xl card-shadow animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-heading text-foreground">Attendance Overview</h2>
        </div>
        <div className="flex flex-col items-center gap-4">
          <CircularProgress percentage={attendanceSummary.percentage} size={140} strokeWidth={10} />
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="text-center p-3 rounded-xl bg-secondary/10">
              <p className="text-2xl font-bold text-secondary text-heading">{attendanceSummary.presentDays}</p>
              <p className="text-xs text-muted-foreground mt-1">Present</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-destructive/10">
              <p className="text-2xl font-bold text-destructive text-heading">{attendanceSummary.absentDays}</p>
              <p className="text-xs text-muted-foreground mt-1">Absent</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-accent/10">
              <p className="text-2xl font-bold text-accent text-heading">{attendanceSummary.lateDays}</p>
              <p className="text-xs text-muted-foreground mt-1">Late</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 rounded-2xl card-shadow animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-heading text-foreground">Latest Homework</h2>
          <button
            onClick={() => onNavigate("homework")}
            className="text-xs font-semibold text-primary"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {homeworkData.slice(0, 3).map((hw) => (
            <div key={hw.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
              <BubbleIcon size="sm" variant={hw.status === "completed" ? "green" : "orange"}>
                <BookOpen size={18} weight="fill" />
              </BubbleIcon>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground text-heading">{hw.subject}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{hw.title}</p>
                  </div>
                  <StatusBadge status={hw.status as "pending" | "completed"} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Due: {new Date(hw.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
