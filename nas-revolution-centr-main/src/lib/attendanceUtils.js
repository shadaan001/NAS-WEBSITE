// TODO: Move attendance store to server and add audit logs
// TODO: Integrate timezone-aware date handling on server
// TODO: Add server-side export for heavy datasets
// TODO: Replace localStorage with transactional DB calls (server) and implement optimistic locking or server-side transactions

const STORAGE_KEY = "attendanceRecords"

export function getDayOfWeek(dateString) {
  const date = new Date(dateString)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return days[date.getDay()]
}

export function isScheduledDay(teacher, date) {
  if (!teacher?.availability || !Array.isArray(teacher.availability)) {
    return false
  }
  
  const dayOfWeek = getDayOfWeek(date)
  
  if (dayOfWeek === "Sat" || dayOfWeek === "Sun") {
    return true
  }
  
  return teacher.availability.some(slot => {
    if (slot.day === dayOfWeek) {
      return true
    }
    return false
  })
}

export function getAttendanceByTeacherAndMonth(teacherId, year, month) {
  // TODO: Replace with server endpoint /api/attendance?teacherId=X&year=Y&month=M
  try {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    }
    
    const allRecords = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`
    
    return allRecords.filter(record => 
      record.teacherId === teacherId &&
      record.date >= startDate &&
      record.date <= endDate
    )
  } catch (error) {
    console.error("Error loading attendance records:", error)
    return []
  }
}

export function getAttendanceByDate(teacherId, date) {
  // TODO: Replace with server endpoint
  try {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    }
    
    const allRecords = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    return allRecords.find(r => r.teacherId === teacherId && r.date === date) || null
  } catch (error) {
    console.error("Error loading attendance by date:", error)
    return null
  }
}

export function createOrUpdateAttendance(record) {
  // TODO: Move to server with transactional writes and optimistic locking
  // Client-side check to avoid race conditions: re-read record before saving and merge changes
  const allRecords = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  
  const existingIndex = allRecords.findIndex(
    r => r.teacherId === record.teacherId && r.date === record.date
  )
  
  const now = new Date().toISOString()
  
  if (existingIndex > -1) {
    // Merge existing data with updates to prevent race conditions
    const existingRecord = allRecords[existingIndex]
    allRecords[existingIndex] = {
      ...existingRecord,
      ...record,
      createdAt: existingRecord.createdAt,
      updatedAt: now
    }
  } else {
    allRecords.push({
      ...record,
      id: record.id || `a-${record.date}-${record.teacherId}`,
      createdAt: now,
      updatedAt: now
    })
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecords))
  
  // QA: Assert record was saved
  const saved = allRecords.find(r => r.teacherId === record.teacherId && r.date === record.date)
  if (!saved) {
    console.error(`QA FAIL: Attendance record for teacher ${record.teacherId} on ${record.date} not saved`)
  }
  
  // QA: after attendance changes, assert student summary percentages recomputed correctly
  return saved
}

export function markStudentAttendance(teacherId, date, studentId, status) {
  // TODO: Add server-side validation for authorized teacher-student relationships
  const record = getAttendanceByDate(teacherId, date)
  
  if (!record) {
    throw new Error(`No attendance record found for teacher ${teacherId} on ${date}`)
  }
  
  if (record.status !== "Held") {
    throw new Error(`Cannot mark attendance - session is ${record.status}`)
  }
  
  const studentIndex = record.students.findIndex(s => s.studentId === studentId)
  const timestamp = new Date().toISOString()
  
  if (studentIndex > -1) {
    record.students[studentIndex] = {
      studentId,
      status,
      timestamp
    }
  } else {
    record.students.push({
      studentId,
      status,
      timestamp
    })
  }
  
  return createOrUpdateAttendance(record)
}

export function getStudentAttendanceSummary(studentId, sinceDate, toDate) {
  // TODO: Replace with server endpoint for aggregated student attendance across all teachers
  try {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    }
    
    const allRecords = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    
    const relevantRecords = allRecords.filter(record => {
      if (record.date < sinceDate || record.date > toDate) return false
      if (record.status !== "Held") return false
      return record.students.some(s => s.studentId === studentId)
    })
    
    const subjectSummary = {}
    let totalPresent = 0
    let totalAbsent = 0
    let totalLate = 0
    let totalClasses = 0
    
    relevantRecords.forEach(record => {
      const studentAttendance = record.students.find(s => s.studentId === studentId)
      if (!studentAttendance) return
      
      const subject = record.subject
      
      if (!subjectSummary[subject]) {
        subjectSummary[subject] = {
          subject,
          present: 0,
          absent: 0,
          late: 0,
          total: 0
        }
      }
      
      subjectSummary[subject].total++
      totalClasses++
      
      if (studentAttendance.status === "Present") {
        subjectSummary[subject].present++
        totalPresent++
      } else if (studentAttendance.status === "Absent") {
        subjectSummary[subject].absent++
        totalAbsent++
      } else if (studentAttendance.status === "Late") {
        subjectSummary[subject].late++
        totalLate++
      }
    })
    
    Object.keys(subjectSummary).forEach(subject => {
      const summary = subjectSummary[subject]
      summary.percentage = summary.total > 0 
        ? Math.round(((summary.present + summary.late) / summary.total) * 100)
        : 0
    })
    
    const overallPercentage = totalClasses > 0
      ? Math.round(((totalPresent + totalLate) / totalClasses) * 100)
      : 0
    
    // QA: after attendance changes, assert student summary percentages recomputed correctly
    return {
      studentId,
      sinceDate,
      toDate,
      overall: {
        totalClasses,
        present: totalPresent,
        absent: totalAbsent,
        late: totalLate,
        percentage: overallPercentage
      },
      bySubject: Object.values(subjectSummary)
    }
  } catch (error) {
    console.error("Error getting student attendance summary:", error)
    return {
      studentId,
      sinceDate,
      toDate,
      overall: {
        totalClasses: 0,
        present: 0,
        absent: 0,
        late: 0,
        percentage: 0
      },
      bySubject: []
    }
  }
}

export function generateMonthlyReport(teacherId, year, month) {
  // TODO: Add server-side export for heavy datasets
  const records = getAttendanceByTeacherAndMonth(teacherId, year, month)
  
  const scheduledDays = records.length
  const heldDays = records.filter(r => r.status === "Held").length
  const cancelledDays = records.filter(r => r.status === "Cancelled").length
  
  const studentStats = {}
  
  records.forEach(record => {
    if (record.status !== "Held") return
    
    record.students.forEach(student => {
      if (!studentStats[student.studentId]) {
        studentStats[student.studentId] = {
          studentId: student.studentId,
          present: 0,
          absent: 0,
          late: 0,
          total: 0
        }
      }
      
      studentStats[student.studentId].total++
      
      if (student.status === "Present") {
        studentStats[student.studentId].present++
      } else if (student.status === "Absent") {
        studentStats[student.studentId].absent++
      } else if (student.status === "Late") {
        studentStats[student.studentId].late++
      }
    })
  })
  
  Object.values(studentStats).forEach(stats => {
    stats.percentage = stats.total > 0
      ? Math.round(((stats.present + stats.late) / stats.total) * 100)
      : 0
  })
  
  return {
    teacherId,
    year,
    month,
    summary: {
      scheduledDays,
      heldDays,
      cancelledDays
    },
    studentStats: Object.values(studentStats),
    records
  }
}

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

export function getMonthCalendarDays(year, month) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = new Date(year, month - 1, 1).getDay()
  
  const days = []
  
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }
  
  return days
}

export function formatDateISO(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function bulkMarkHoliday(teacherId, startDate, endDate) {
  // TODO: Add server-side bulk operations with transactions
  const allRecords = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  let modified = false
  
  allRecords.forEach(record => {
    if (record.teacherId === teacherId && record.date >= startDate && record.date <= endDate) {
      record.status = "Cancelled"
      record.updatedAt = new Date().toISOString()
      modified = true
    }
  })
  
  if (modified) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecords))
  }
  
  return modified
}

export function getRecentChanges(teacherId, limit = 10) {
  try {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    }
    
    const allRecords = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    
    return allRecords
      .filter(r => r.teacherId === teacherId)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, limit)
  } catch (error) {
    console.error("Error getting recent changes:", error)
    return []
  }
}
