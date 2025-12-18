import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Check, X, Clock } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  getMonthCalendarDays,
  formatDateISO,
  getAttendanceByTeacherAndMonth,
  isScheduledDay
} from "@/lib/attendanceUtils"

export default function AttendanceCalendar({ teacherId, year, month, teacher, onDayClick }) {
  const [calendarDays, setCalendarDays] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [currentYear, setCurrentYear] = useState(year)
  const [currentMonth, setCurrentMonth] = useState(month)
  const [focusedDayIndex, setFocusedDayIndex] = useState(-1)
  const calendarRef = useRef(null)

  useEffect(() => {
    setCurrentYear(year)
    setCurrentMonth(month)
  }, [year, month])

  useEffect(() => {
    const days = getMonthCalendarDays(currentYear, currentMonth)
    setCalendarDays(days)
    
    const data = getAttendanceByTeacherAndMonth(teacherId, currentYear, currentMonth)
    setAttendanceData(data)
  }, [teacherId, currentYear, currentMonth])

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const getDayStatus = (day) => {
    if (!day) return null
    
    const dateStr = formatDateISO(currentYear, currentMonth, day)
    const record = attendanceData.find(r => r.date === dateStr)
    const scheduled = isScheduledDay(teacher, dateStr)
    
    return {
      scheduled,
      record,
      dateStr
    }
  }

  const getDayStats = (record) => {
    if (!record || record.status !== "Held" || !record.students) {
      return null
    }
    
    const present = record.students.filter(s => s.status === "Present").length
    const absent = record.students.filter(s => s.status === "Absent").length
    const late = record.students.filter(s => s.status === "Late").length
    
    return { present, absent, late }
  }

  const handleKeyDown = (e, day) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const status = getDayStatus(day)
      if (status?.scheduled) {
        onDayClick?.(status.dateStr, status.record)
      }
    }
  }

  const handleCalendarKeyDown = (e) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      return
    }
    
    e.preventDefault()
    
    let newIndex = focusedDayIndex
    const daysPerWeek = 7
    
    switch (e.key) {
      case "ArrowLeft":
        newIndex = Math.max(0, focusedDayIndex - 1)
        break
      case "ArrowRight":
        newIndex = Math.min(calendarDays.length - 1, focusedDayIndex + 1)
        break
      case "ArrowUp":
        newIndex = Math.max(0, focusedDayIndex - daysPerWeek)
        break
      case "ArrowDown":
        newIndex = Math.min(calendarDays.length - 1, focusedDayIndex + daysPerWeek)
        break
    }
    
    setFocusedDayIndex(newIndex)
    
    const buttons = calendarRef.current?.querySelectorAll('button[data-day]')
    if (buttons && buttons[newIndex]) {
      buttons[newIndex].focus()
    }
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">
          {monthNames[currentMonth - 1]} {currentYear}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevMonth}
            className="h-8 w-8 p-0"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="h-8 w-8 p-0"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div 
        ref={calendarRef}
        className="grid grid-cols-7 gap-2"
        onKeyDown={handleCalendarKeyDown}
      >
        {calendarDays.map((day, index) => {
          const status = getDayStatus(day)
          const stats = status?.record ? getDayStats(status.record) : null
          
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const isScheduled = status?.scheduled
          const record = status?.record
          const isHeld = record?.status === "Held"
          const isCancelled = record?.status === "Cancelled"
          const isToday = 
            day === new Date().getDate() &&
            currentMonth === new Date().getMonth() + 1 &&
            currentYear === new Date().getFullYear()

          return (
            <button
              key={day}
              data-day={day}
              onClick={() => {
                if (isScheduled) {
                  onDayClick?.(status.dateStr, record)
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, day)}
              onFocus={() => setFocusedDayIndex(index)}
              disabled={!isScheduled}
              className={cn(
                "aspect-square rounded-lg p-2 transition-all duration-200",
                "flex flex-col items-center justify-start relative",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isScheduled && !isCancelled && "bg-secondary/20 hover:bg-secondary/30 cursor-pointer",
                isScheduled && !isCancelled && "hover:scale-105 hover:shadow-lg",
                isHeld && "border-2 border-success ring-1 ring-success/20",
                isCancelled && "border-2 border-destructive/50 bg-destructive/5",
                !isScheduled && "bg-muted/20 cursor-not-allowed",
                isToday && "ring-2 ring-primary"
              )}
              tabIndex={isScheduled ? 0 : -1}
              aria-label={`${monthNames[currentMonth - 1]} ${day}, ${isHeld ? 'Held' : isCancelled ? 'Cancelled' : isScheduled ? 'Scheduled' : 'No class'}`}
            >
              <span className={cn(
                "text-sm font-medium mb-1",
                isHeld && "text-success",
                isCancelled && "text-destructive",
                !isScheduled && "text-muted-foreground"
              )}>
                {day}
              </span>
              
              {isHeld && stats && (
                <div className="flex gap-1 items-center justify-center flex-wrap">
                  {stats.present > 0 && (
                    <div className="flex items-center gap-0.5 text-xs text-success">
                      <Check className="h-3 w-3" weight="bold" />
                      <span>{stats.present}</span>
                    </div>
                  )}
                  {stats.absent > 0 && (
                    <div className="flex items-center gap-0.5 text-xs text-destructive">
                      <X className="h-3 w-3" weight="bold" />
                      <span>{stats.absent}</span>
                    </div>
                  )}
                  {stats.late > 0 && (
                    <div className="flex items-center gap-0.5 text-xs text-accent">
                      <Clock className="h-3 w-3" weight="bold" />
                      <span>{stats.late}</span>
                    </div>
                  )}
                </div>
              )}
              
              {isCancelled && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <X className="h-6 w-6 text-destructive/50" weight="bold" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary/20 border border-border" />
          <span className="text-muted-foreground">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-success" />
          <span className="text-muted-foreground">Held</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-destructive" />
          <span className="text-muted-foreground">Cancelled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted/20" />
          <span className="text-muted-foreground">No Class</span>
        </div>
      </div>
    </Card>
  )
}
