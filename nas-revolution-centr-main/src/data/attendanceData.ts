import type { Teacher, AttendanceRecord, TeacherAssignment, SubjectAttendance, TeacherAttendance, AttendanceSummary, DailyAttendance } from "@/types"

export const teachers: Teacher[] = [
  {
    id: "TCH001",
    name: "Mr. Rajesh Kumar",
    email: "rajesh.kumar@school.com",
    subjects: ["Mathematics", "Physics"],
    contactNumber: "+91 98765 11111",
    employeeId: "EMP001",
  },
  {
    id: "TCH002",
    name: "Ms. Priya Patel",
    email: "priya.patel@school.com",
    subjects: ["Science", "Chemistry"],
    contactNumber: "+91 98765 22222",
    employeeId: "EMP002",
  },
  {
    id: "TCH003",
    name: "Mrs. Anjali Singh",
    email: "anjali.singh@school.com",
    subjects: ["English", "Literature"],
    contactNumber: "+91 98765 33333",
    employeeId: "EMP003",
  },
  {
    id: "TCH004",
    name: "Mr. Vikram Sharma",
    email: "vikram.sharma@school.com",
    subjects: ["Hindi"],
    contactNumber: "+91 98765 44444",
    employeeId: "EMP004",
  },
  {
    id: "TCH005",
    name: "Ms. Deepa Verma",
    email: "deepa.verma@school.com",
    subjects: ["Social Studies", "History"],
    contactNumber: "+91 98765 55555",
    employeeId: "EMP005",
  },
  {
    id: "TCH006",
    name: "Mr. Arun Rao",
    email: "arun.rao@school.com",
    subjects: ["Physical Education"],
    contactNumber: "+91 98765 66666",
    employeeId: "EMP006",
  },
]

export const studentTeacherAssignments: TeacherAssignment[] = [
  { teacherId: "TCH001", teacherName: "Mr. Rajesh Kumar", subject: "Mathematics" },
  { teacherId: "TCH002", teacherName: "Ms. Priya Patel", subject: "Science" },
  { teacherId: "TCH003", teacherName: "Mrs. Anjali Singh", subject: "English" },
  { teacherId: "TCH004", teacherName: "Mr. Vikram Sharma", subject: "Hindi" },
  { teacherId: "TCH005", teacherName: "Ms. Deepa Verma", subject: "Social Studies" },
  { teacherId: "TCH006", teacherName: "Mr. Arun Rao", subject: "Physical Education" },
]

const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = []
  const studentId = "STU001"
  const today = new Date()
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    if (date.getDay() === 0) continue
    
    const dateStr = date.toISOString().split('T')[0]
    
    studentTeacherAssignments.forEach((assignment, idx) => {
      const randomVal = Math.random()
      let status: "present" | "absent" | "late"
      
      if (i === 3 && idx === 0) {
        status = "absent"
      } else if (i === 10 && idx < 4) {
        status = "absent"
      } else if (randomVal > 0.92) {
        status = "absent"
      } else if (randomVal > 0.88) {
        status = "late"
      } else {
        status = "present"
      }
      
      records.push({
        id: `ATT_${dateStr}_${assignment.teacherId}_${studentId}`,
        studentId,
        teacherId: assignment.teacherId,
        teacherName: assignment.teacherName,
        subject: assignment.subject,
        date: dateStr,
        status,
        timestamp: new Date(date.setHours(8 + idx, 0, 0)).toISOString(),
        remarks: status === "absent" && i === 10 ? "Sick leave" : undefined,
      })
    })
  }
  
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const attendanceRecords: AttendanceRecord[] = generateAttendanceRecords()

export const calculateSubjectAttendance = (records: AttendanceRecord[]): SubjectAttendance[] => {
  const subjectMap = new Map<string, SubjectAttendance>()
  
  records.forEach((record) => {
    if (!subjectMap.has(record.subject)) {
      subjectMap.set(record.subject, {
        subject: record.subject,
        teacherName: record.teacherName,
        totalClasses: 0,
        present: 0,
        absent: 0,
        late: 0,
        percentage: 0,
      })
    }
    
    const subjectData = subjectMap.get(record.subject)!
    subjectData.totalClasses++
    
    if (record.status === "present") subjectData.present++
    else if (record.status === "absent") subjectData.absent++
    else if (record.status === "late") subjectData.late++
  })
  
  return Array.from(subjectMap.values()).map((subject) => ({
    ...subject,
    percentage: Math.round(((subject.present + subject.late) / subject.totalClasses) * 100),
  }))
}

export const calculateTeacherAttendance = (records: AttendanceRecord[]): TeacherAttendance[] => {
  const teacherMap = new Map<string, TeacherAttendance>()
  
  records.forEach((record) => {
    if (!teacherMap.has(record.teacherId)) {
      teacherMap.set(record.teacherId, {
        teacherId: record.teacherId,
        teacherName: record.teacherName,
        subjects: [],
        totalClasses: 0,
        present: 0,
        absent: 0,
        late: 0,
        percentage: 0,
      })
    }
    
    const teacherData = teacherMap.get(record.teacherId)!
    
    if (!teacherData.subjects.includes(record.subject)) {
      teacherData.subjects.push(record.subject)
    }
    
    teacherData.totalClasses++
    
    if (record.status === "present") teacherData.present++
    else if (record.status === "absent") teacherData.absent++
    else if (record.status === "late") teacherData.late++
  })
  
  return Array.from(teacherMap.values()).map((teacher) => ({
    ...teacher,
    percentage: Math.round(((teacher.present + teacher.late) / teacher.totalClasses) * 100),
  }))
}

export const calculateDailyAttendance = (records: AttendanceRecord[], days: number): DailyAttendance[] => {
  const dailyMap = new Map<string, DailyAttendance>()
  const today = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    dailyMap.set(dateStr, {
      date: dateStr,
      present: 0,
      absent: 0,
      late: 0,
      totalClasses: 0,
    })
  }
  
  records.forEach((record) => {
    if (dailyMap.has(record.date)) {
      const daily = dailyMap.get(record.date)!
      daily.totalClasses++
      
      if (record.status === "present") daily.present++
      else if (record.status === "absent") daily.absent++
      else if (record.status === "late") daily.late++
    }
  })
  
  return Array.from(dailyMap.values()).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

export const calculateAttendanceSummary = (records: AttendanceRecord[]): AttendanceSummary => {
  let totalDays = 0
  let presentDays = 0
  let absentDays = 0
  let lateDays = 0
  
  const dailyStatusMap = new Map<string, { present: number; absent: number; late: number; total: number }>()
  
  records.forEach((record) => {
    if (!dailyStatusMap.has(record.date)) {
      dailyStatusMap.set(record.date, { present: 0, absent: 0, late: 0, total: 0 })
    }
    
    const dayStatus = dailyStatusMap.get(record.date)!
    dayStatus.total++
    
    if (record.status === "present") dayStatus.present++
    else if (record.status === "absent") dayStatus.absent++
    else if (record.status === "late") dayStatus.late++
  })
  
  dailyStatusMap.forEach((dayStatus) => {
    totalDays++
    
    if (dayStatus.absent > dayStatus.total / 2) {
      absentDays++
    } else if (dayStatus.late > 0 && dayStatus.present + dayStatus.late >= dayStatus.total / 2) {
      lateDays++
    } else {
      presentDays++
    }
  })
  
  const percentage = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 0
  
  return {
    totalDays,
    presentDays,
    absentDays,
    lateDays,
    percentage,
    bySubject: calculateSubjectAttendance(records),
    byTeacher: calculateTeacherAttendance(records),
    last7Days: calculateDailyAttendance(records, 7),
    last30Days: calculateDailyAttendance(records, 30),
  }
}

export const attendanceSummary = calculateAttendanceSummary(attendanceRecords)
