// TODO: Replace localStorage with backend API endpoints: /students, /teachers, /attendance, /tests, /payments
// This is a mock database layer using localStorage for demo purposes only

import type { StudentRecord, TeacherRecord, TestRecord, FeeRecord } from "@/types/admin"
import type { AttendanceRecord } from "@/types"

const STORAGE_KEYS = {
  STUDENTS: "admin-students-records",
  TEACHERS: "admin-teachers-records",
  ATTENDANCE: "admin-attendance-records",
  TESTS: "admin-tests-records",
  FEES: "admin-fees-records",
  NOTICES: "admin-notices-records",
  PAYMENTS: "admin-payments-records",
} as const

export interface StudentWithRelations extends StudentRecord {
  assignedSubjects: string[]
  attendanceSummary?: {
    totalDays: number
    presentDays: number
    absentDays: number
    percentage: number
  }
  tests?: string[]
  payments?: string[]
  photoBase64?: string | null
  createdAt: string
}

export class LocalDB {
  static get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return null
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
    }
  }

  static getAllStudents(): StudentWithRelations[] {
    const students = this.get<StudentWithRelations[]>(STORAGE_KEYS.STUDENTS) || []
    return students.map(student => ({
      ...student,
      assignedTeachers: Array.isArray(student.assignedTeachers) ? student.assignedTeachers : [],
      assignedTeacherIds: Array.isArray(student.assignedTeacherIds) ? student.assignedTeacherIds : [],
      assignedSubjects: Array.isArray(student.assignedSubjects) ? student.assignedSubjects : [],
      subjects: Array.isArray(student.subjects) ? student.subjects : []
    }))
  }

  static getStudent(id: string): StudentWithRelations | null {
    const students = this.getAllStudents()
    return students.find(s => s.id === id) || null
  }

  static addStudent(student: Omit<StudentWithRelations, "id" | "createdAt">): StudentWithRelations {
    // TODO: Add server-side validation and transactional APIs to keep relationships consistent
    const students = this.getAllStudents()
    
    // QA: Validate duplicate rollNo within same class
    const duplicateRollNo = students.find(
      s => s.class === student.class && s.rollNumber === student.rollNumber
    )
    if (duplicateRollNo) {
      throw new Error(`Roll number ${student.rollNumber} already exists in ${student.class}`)
    }

    const newStudent: StudentWithRelations = {
      ...student,
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      assignedTeachers: student.assignedTeachers || [],
      assignedTeacherIds: student.assignedTeacherIds || [],
      assignedSubjects: student.assignedSubjects || [],
      tests: [],
      payments: [],
    }

    students.push(newStudent)
    this.set(STORAGE_KEYS.STUDENTS, students)

    // Two-way sync: Update teacher records
    this.syncStudentToTeachers(newStudent.id, newStudent.assignedTeacherIds || [], [])

    // QA: Verify assignment was successful
    const teachers = this.getAllTeachers()
    const teacherIds = newStudent.assignedTeacherIds || []
    teacherIds.forEach(teacherId => {
      const teacher = teachers.find(t => t.id === teacherId)
      if (teacher && !teacher.assignedStudentIds?.includes(newStudent.id)) {
        console.error(`QA FAIL: Teacher ${teacherId} should include student ${newStudent.id}`)
      }
    })

    return newStudent
  }

  static updateStudent(id: string, updates: Partial<StudentWithRelations>): StudentWithRelations {
    // TODO: Move validation & integrity checks to server-side endpoints
    const students = this.getAllStudents()
    const index = students.findIndex(s => s.id === id)
    
    if (index === -1) {
      throw new Error(`Student ${id} not found`)
    }

    const oldStudent = students[index]
    const oldTeacherIds = oldStudent.assignedTeacherIds || []

    // QA: Validate duplicate rollNo if changing class or rollNumber
    if (updates.rollNumber || updates.class) {
      const targetClass = updates.class || oldStudent.class
      const targetRollNo = updates.rollNumber || oldStudent.rollNumber
      const duplicateRollNo = students.find(
        s => s.id !== id && s.class === targetClass && s.rollNumber === targetRollNo
      )
      if (duplicateRollNo) {
        throw new Error(`Roll number ${targetRollNo} already exists in ${targetClass}`)
      }
    }

    const updatedStudent: StudentWithRelations = {
      ...oldStudent,
      ...updates,
      id,
      createdAt: oldStudent.createdAt,
      assignedTeachers: updates.assignedTeachers ?? oldStudent.assignedTeachers ?? [],
      assignedTeacherIds: updates.assignedTeacherIds ?? oldStudent.assignedTeacherIds ?? [],
      assignedSubjects: updates.assignedSubjects ?? oldStudent.assignedSubjects ?? [],
    }

    students[index] = updatedStudent
    this.set(STORAGE_KEYS.STUDENTS, students)

    // Two-way sync: Update teacher assignments if changed
    const newTeacherIds = updatedStudent.assignedTeacherIds || []
    if (JSON.stringify(oldTeacherIds.sort()) !== JSON.stringify(newTeacherIds.sort())) {
      this.syncStudentToTeachers(id, newTeacherIds, oldTeacherIds)
    }

    return updatedStudent
  }

  static deleteStudent(id: string): void {
    // TODO: Add server-side cascade delete and integrity checks
    const students = this.getAllStudents()
    const student = students.find(s => s.id === id)
    
    if (!student) {
      throw new Error(`Student ${id} not found`)
    }

    // Remove from students list
    const filtered = students.filter(s => s.id !== id)
    this.set(STORAGE_KEYS.STUDENTS, filtered)

    // Two-way sync: Remove from all assigned teachers
    this.syncStudentToTeachers(id, [], student.assignedTeacherIds || [])

    // QA: Verify student removed from all teachers
    const teachers = this.getAllTeachers()
    teachers.forEach(teacher => {
      if (teacher.assignedStudentIds?.includes(id)) {
        console.error(`QA FAIL: Teacher ${teacher.id} still contains deleted student ${id}`)
      }
    })
  }

  static getAllTeachers(): TeacherRecord[] {
    const teachers = this.get<TeacherRecord[]>(STORAGE_KEYS.TEACHERS) || []
    return teachers.map(teacher => ({
      ...teacher,
      subjects: teacher.subjects || [],
      classesAssigned: teacher.classesAssigned || [],
      assignedStudentIds: teacher.assignedStudentIds || []
    }))
  }

  static getTeacher(id: string): TeacherRecord | null {
    const teachers = this.getAllTeachers()
    return teachers.find(t => t.id === id) || null
  }

  static updateTeacher(id: string, updates: Partial<TeacherRecord>): TeacherRecord {
    const teachers = this.getAllTeachers()
    const index = teachers.findIndex(t => t.id === id)
    
    if (index === -1) {
      throw new Error(`Teacher ${id} not found`)
    }

    const updatedTeacher: TeacherRecord = {
      ...teachers[index],
      ...updates,
      id,
    }

    teachers[index] = updatedTeacher
    this.set(STORAGE_KEYS.TEACHERS, teachers)

    return updatedTeacher
  }

  static deleteTeacher(id: string): { canDelete: boolean; assignedStudents: StudentWithRelations[] } {
    // TODO: Add server-side integrity checks and cascade options
    const teachers = this.getAllTeachers()
    const teacher = teachers.find(t => t.id === id)
    
    if (!teacher) {
      throw new Error(`Teacher ${id} not found`)
    }

    const students = this.getAllStudents()
    const assignedStudents = students.filter(s => 
      s.assignedTeacherIds?.includes(id)
    )

    if (assignedStudents.length > 0) {
      return {
        canDelete: false,
        assignedStudents,
      }
    }

    const filtered = teachers.filter(t => t.id !== id)
    this.set(STORAGE_KEYS.TEACHERS, filtered)

    return {
      canDelete: true,
      assignedStudents: [],
    }
  }

  private static syncStudentToTeachers(
    studentId: string,
    newTeacherIds: string[],
    oldTeacherIds: string[]
  ): void {
    // TODO: This should be a transactional operation on the backend
    const teachers = this.getAllTeachers()
    let modified = false

    teachers.forEach(teacher => {
      const hadStudent = oldTeacherIds.includes(teacher.id)
      const shouldHaveStudent = newTeacherIds.includes(teacher.id)

      if (!teacher.assignedStudentIds) {
        teacher.assignedStudentIds = []
      }

      if (shouldHaveStudent && !hadStudent) {
        // Add student to teacher
        if (!teacher.assignedStudentIds.includes(studentId)) {
          teacher.assignedStudentIds.push(studentId)
          modified = true
        }
      } else if (!shouldHaveStudent && hadStudent) {
        // Remove student from teacher
        const index = teacher.assignedStudentIds.indexOf(studentId)
        if (index > -1) {
          teacher.assignedStudentIds.splice(index, 1)
          modified = true
        }
      }
    })

    if (modified) {
      this.set(STORAGE_KEYS.TEACHERS, teachers)
    }

    // QA: after assignment, assert teacher.assignedStudentIds.includes(studentId)
    newTeacherIds.forEach(teacherId => {
      const teacher = teachers.find(t => t.id === teacherId)
      if (teacher && !teacher.assignedStudentIds?.includes(studentId)) {
        console.error(`QA FAIL: Teacher ${teacherId} should include student ${studentId}`)
      }
    })

    // QA: after removal, assert !teacher.assignedStudentIds.includes(studentId)
    const removedIds = oldTeacherIds.filter(id => !newTeacherIds.includes(id))
    removedIds.forEach(teacherId => {
      const teacher = teachers.find(t => t.id === teacherId)
      if (teacher && teacher.assignedStudentIds?.includes(studentId)) {
        console.error(`QA FAIL: Teacher ${teacherId} should NOT include student ${studentId}`)
      }
    })
  }

  static bulkAssignTeacherToStudents(teacherId: string, studentIds: string[]): void {
    // TODO: Add server-side bulk operations with transactions
    const teacher = this.getTeacher(teacherId)
    
    if (!teacher) {
      throw new Error(`Teacher ${teacherId} not found`)
    }

    // QA: Prevent assigning a teacher who is not approved
    if (!teacher.approved) {
      throw new Error(`Cannot assign unapproved teacher ${teacher.name}`)
    }

    const students = this.getAllStudents()
    
    studentIds.forEach(studentId => {
      const student = students.find(s => s.id === studentId)
      if (student) {
        if (!student.assignedTeacherIds) {
          student.assignedTeacherIds = []
        }
        if (!student.assignedTeacherIds.includes(teacherId)) {
          student.assignedTeacherIds.push(teacherId)
        }
      }
    })

    this.set(STORAGE_KEYS.STUDENTS, students)

    // Update teacher
    if (!teacher.assignedStudentIds) {
      teacher.assignedStudentIds = []
    }
    studentIds.forEach(studentId => {
      if (!teacher.assignedStudentIds!.includes(studentId)) {
        teacher.assignedStudentIds!.push(studentId)
      }
    })

    const teachers = this.getAllTeachers()
    const index = teachers.findIndex(t => t.id === teacherId)
    if (index > -1) {
      teachers[index] = teacher
      this.set(STORAGE_KEYS.TEACHERS, teachers)
    }
  }

  static getStudentAttendance(studentId: string): AttendanceRecord[] {
    const allAttendance = this.get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE) || []
    return allAttendance.filter(a => a.studentId === studentId)
  }

  static getStudentTests(studentId: string): TestRecord[] {
    const allTests = this.get<TestRecord[]>(STORAGE_KEYS.TESTS) || []
    return allTests.filter(test => 
      test.marks.some(m => m.studentId === studentId)
    )
  }

  static getStudentPayments(studentId: string): FeeRecord[] {
    const allFees = this.get<FeeRecord[]>(STORAGE_KEYS.FEES) || []
    return allFees.filter(fee => fee.studentId === studentId)
  }

  static exportStudentsToCSV(studentIds?: string[]): string {
    // TODO: Generate CSV export on backend for large datasets
    const students = this.getAllStudents()
    const filtered = studentIds 
      ? students.filter(s => studentIds.includes(s.id))
      : students

    const headers = [
      "ID",
      "Name",
      "Class",
      "Roll Number",
      "Email",
      "Phone",
      "Guardian Name",
      "Guardian Phone",
      "Assigned Teachers",
      "Subjects",
      "Admission Date",
    ]

    const rows = filtered.map(s => [
      s.id,
      s.name,
      s.class,
      s.rollNumber,
      s.email || "",
      s.phone || "",
      s.guardianName || "",
      s.guardianPhone || "",
      (s.assignedTeachers || []).map(at => at.teacherName).join("; "),
      (s.subjects || []).join("; "),
      s.admissionDate,
    ])

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    return csv
  }

  // TODO: Move attendance helpers to server endpoints and add authentication/audit logs
  // TODO: Integrate timezone-aware date handling on server
  // QA: After attendance changes, assert student summary percentages recomputed correctly
  
  static getAllAttendanceRecords(): any[] {
    return this.get<any[]>(STORAGE_KEYS.ATTENDANCE) || []
  }

  static getAttendanceByTeacherAndMonth(teacherId: string, year: number, month: number): any[] {
    // TODO: Replace with server endpoint /api/attendance?teacherId=X&year=Y&month=M
    const allRecords = this.getAllAttendanceRecords()
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`
    
    return allRecords.filter(record => 
      record.teacherId === teacherId &&
      record.date >= startDate &&
      record.date <= endDate
    )
  }

  static createOrUpdateAttendanceRecord(record: any): any {
    // TODO: Move to server with transactional writes and optimistic locking
    const allRecords = this.getAllAttendanceRecords()
    const existingIndex = allRecords.findIndex(
      r => r.teacherId === record.teacherId && r.date === record.date
    )
    
    const now = new Date().toISOString()
    
    if (existingIndex > -1) {
      // Merge existing data to prevent data loss
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
    
    this.set(STORAGE_KEYS.ATTENDANCE, allRecords)
    
    // QA: Verify record was saved correctly
    const saved = allRecords.find(r => r.teacherId === record.teacherId && r.date === record.date)
    if (!saved) {
      console.error(`QA FAIL: Attendance record not saved for teacher ${record.teacherId} on ${record.date}`)
    }
    
    return saved
  }
  
  static markStudentAttendance(teacherId: string, date: string, studentId: string, status: string): any {
    // TODO: Add server-side validation for authorized teacher-student relationships
    const allRecords = this.getAllAttendanceRecords()
    const record = allRecords.find(r => r.teacherId === teacherId && r.date === date)
    
    if (!record) {
      throw new Error(`No attendance record found for teacher ${teacherId} on ${date}`)
    }
    
    if (record.status !== "Held") {
      throw new Error(`Cannot mark attendance - session is ${record.status}`)
    }
    
    const studentIndex = record.students?.findIndex((s: any) => s.studentId === studentId) ?? -1
    const timestamp = new Date().toISOString()
    
    if (!record.students) {
      record.students = []
    }
    
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
    
    return this.createOrUpdateAttendanceRecord(record)
  }
  
  static getStudentAttendanceSummary(studentId: string, sinceDate: string, toDate: string): any {
    // TODO: Replace with server endpoint for aggregated student attendance
    const allRecords = this.getAllAttendanceRecords()
    
    const relevantRecords = allRecords.filter((record: any) => {
      if (record.date < sinceDate || record.date > toDate) return false
      if (record.status !== "Held") return false
      return record.students?.some((s: any) => s.studentId === studentId)
    })
    
    const subjectSummary: Record<string, any> = {}
    let totalPresent = 0
    let totalAbsent = 0
    let totalLate = 0
    let totalClasses = 0
    
    relevantRecords.forEach((record: any) => {
      const studentAttendance = record.students?.find((s: any) => s.studentId === studentId)
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
  }

  // TODO: Replace localStorage with backend API endpoints for tests, marks, and student progress
  // TODO: Replace file uploads with cloud storage and server-side grading
  
  static getAllTests(): any[] {
    return this.get<any[]>(STORAGE_KEYS.TESTS) || []
  }

  static getTest(id: string): any | null {
    const tests = this.getAllTests()
    return tests.find(t => t.id === id) || null
  }

  static addTest(test: any): any {
    const tests = this.getAllTests()
    
    const student = this.getStudent(test.class)
    if (!student) {
      const duplicateTest = tests.find(
        t => t.class === test.class && t.subject === test.subject && t.date === test.date
      )
      if (duplicateTest) {
        throw new Error(`Test already exists for ${test.class} - ${test.subject} on ${test.date}`)
      }
    }

    const newTest = {
      ...test,
      id: test.id || `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tests.push(newTest)
    this.set(STORAGE_KEYS.TESTS, tests)

    return newTest
  }

  static updateTest(id: string, updates: any): any {
    const tests = this.getAllTests()
    const index = tests.findIndex(t => t.id === id)
    
    if (index === -1) {
      throw new Error(`Test ${id} not found`)
    }

    const updatedTest = {
      ...tests[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    }

    tests[index] = updatedTest
    this.set(STORAGE_KEYS.TESTS, tests)

    // QA: After updating marks, verify getStudentProgress returns correct averages
    return updatedTest
  }

  static deleteTest(id: string): void {
    const tests = this.getAllTests()
    const filtered = tests.filter(t => t.id !== id)
    this.set(STORAGE_KEYS.TESTS, filtered)
  }

  static getTestsByClass(className: string): any[] {
    const tests = this.getAllTests()
    return tests.filter(t => t.class === className)
  }

  static getTestsByTeacher(teacherId: string): any[] {
    const tests = this.getAllTests()
    return tests.filter(t => t.teacherId === teacherId)
  }

  static getStudentTestResults(studentId: string): any[] {
    const tests = this.getAllTests()
    const student = this.getStudent(studentId)
    
    if (!student) return []

    return tests
      .filter(test => test.class === student.class)
      .map(test => {
        const mark = test.marks?.find((m: any) => m.studentId === studentId)
        return mark ? {
          testId: test.id,
          title: test.title,
          subject: test.subject,
          date: test.date,
          maxMarks: test.maxMarks,
          marksObtained: mark.marks,
          grade: mark.grade,
          percentage: Math.round((mark.marks / test.maxMarks) * 100),
          comments: mark.comments,
          teacherId: test.teacherId,
        } : null
      })
      .filter(Boolean)
  }

  static getStudentProgress(studentId: string): any {
    // TODO: Replace with backend API that efficiently aggregates student performance data
    const testResults = this.getStudentTestResults(studentId)
    
    if (testResults.length === 0) {
      return {
        studentId,
        overall: { average: 0, totalTests: 0 },
        bySubject: [],
        byMonth: [],
        recentTests: []
      }
    }

    const subjectMap: Record<string, { total: number; count: number; tests: any[] }> = {}
    const monthMap: Record<string, { total: number; count: number }> = {}

    testResults.forEach((result: any) => {
      const subject = result.subject
      const month = result.date.substring(0, 7)

      if (!subjectMap[subject]) {
        subjectMap[subject] = { total: 0, count: 0, tests: [] }
      }
      subjectMap[subject].total += result.percentage
      subjectMap[subject].count += 1
      subjectMap[subject].tests.push(result)

      if (!monthMap[month]) {
        monthMap[month] = { total: 0, count: 0 }
      }
      monthMap[month].total += result.percentage
      monthMap[month].count += 1
    })

    const bySubject = Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      average: Math.round(data.total / data.count),
      totalTests: data.count,
      tests: data.tests
    }))

    const byMonth = Object.entries(monthMap)
      .map(([month, data]) => ({
        month,
        average: Math.round(data.total / data.count),
        totalTests: data.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)

    const overallAverage = Math.round(
      testResults.reduce((sum: number, r: any) => sum + r.percentage, 0) / testResults.length
    )

    const recentTests = testResults
      .sort((a: any, b: any) => b.date.localeCompare(a.date))
      .slice(0, 5)

    // QA: After updating marks, verify getStudentProgress returns correct averages
    return {
      studentId,
      overall: {
        average: overallAverage,
        totalTests: testResults.length
      },
      bySubject,
      byMonth,
      recentTests
    }
  }

  static getClassAverageForTest(testId: string): number {
    const test = this.getTest(testId)
    if (!test || !test.marks || test.marks.length === 0) return 0

    const total = test.marks.reduce((sum: number, m: any) => sum + m.marks, 0)
    return Math.round((total / test.marks.length / test.maxMarks) * 100)
  }

  static exportTestMarksToCSV(testId: string): string {
    // TODO: Generate CSV export on backend for large datasets
    const test = this.getTest(testId)
    if (!test) throw new Error(`Test ${testId} not found`)

    const headers = [
      "Student ID",
      "Student Name",
      "Roll Number",
      "Marks Obtained",
      "Max Marks",
      "Percentage",
      "Grade",
      "Comments"
    ]

    const rows = (test.marks || []).map((m: any) => {
      const student = this.getStudent(m.studentId)
      const percentage = Math.round((m.marks / test.maxMarks) * 100)
      
      return [
        m.studentId,
        student?.name || "Unknown",
        student?.rollNumber || "",
        m.marks,
        test.maxMarks,
        `${percentage}%`,
        m.grade || "",
        m.comments || ""
      ]
    })

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    return csv
  }

  // TODO: Replace localStorage with backend API and implement scheduled expiry
  // TODO: Attachments to use cloud storage instead of local paths
  // QA: Verify students see only general + their class notices and pinned always on top

  static getAllNotices(): any[] {
    return this.get<any[]>(STORAGE_KEYS.NOTICES) || []
  }

  static getNotice(id: string): any | null {
    const notices = this.getAllNotices()
    return notices.find(n => n.id === id) || null
  }

  static addNotice(notice: any): any {
    const notices = this.getAllNotices()
    
    const newNotice = {
      ...notice,
      id: notice.id || `n-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    notices.push(newNotice)
    this.set(STORAGE_KEYS.NOTICES, notices)

    return newNotice
  }

  static updateNotice(id: string, updates: any): any {
    const notices = this.getAllNotices()
    const index = notices.findIndex(n => n.id === id)
    
    if (index === -1) {
      throw new Error(`Notice ${id} not found`)
    }

    const updatedNotice = {
      ...notices[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    }

    notices[index] = updatedNotice
    this.set(STORAGE_KEYS.NOTICES, notices)

    return updatedNotice
  }

  static deleteNotice(id: string): void {
    const notices = this.getAllNotices()
    const filtered = notices.filter(n => n.id !== id)
    this.set(STORAGE_KEYS.NOTICES, filtered)
  }

  static getActiveNoticesForClass(className: string | null): any[] {
    const notices = this.getAllNotices()
    const now = new Date().toISOString()
    
    return notices
      .filter((notice: any) => {
        if (notice.expiryDate && notice.expiryDate < now) {
          return false
        }
        
        if (notice.class === null || notice.class === className) {
          return true
        }
        
        return false
      })
      .sort((a: any, b: any) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }

  static exportNoticesToCSV(noticeIds?: string[]): string {
    // TODO: Generate CSV export on backend for large datasets
    const notices = this.getAllNotices()
    const filtered = noticeIds 
      ? notices.filter(n => noticeIds.includes(n.id))
      : notices

    const headers = [
      "ID",
      "Title",
      "Content Preview",
      "Pinned",
      "Class",
      "Created At",
      "Expiry Date",
      "Author",
      "Attachments Count"
    ]

    const rows = filtered.map(n => [
      n.id,
      n.title,
      n.content.replace(/<[^>]*>/g, '').substring(0, 100),
      n.pinned ? "Yes" : "No",
      n.class || "General",
      n.createdAt,
      n.expiryDate || "No expiry",
      n.author || "Admin",
      (n.attachments || []).length
    ])

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    return csv
  }

  // ============================================================================
  // PAYMENT MANAGEMENT METHODS
  // ============================================================================
  // TODO: Replace localStorage with backend API and integrate with real payment gateway
  // TODO: Integrate Razorpay / PhonePe Business APIs for auto-verification
  // TODO: Add auto-verification using payment gateway webhooks
  // TODO: Replace localStorage with database (MongoDB / PostgreSQL)
  // TODO: Implement server-side payment verification workflow with notifications
  // TODO: Add payment receipt generation (PDF) with school letterhead
  // TODO: Implement payment reminders and due date tracking
  // TODO: Add refund and cancellation workflows
  // QA: After marking payment Verified, ensure student view reflects status immediately

  static getAllPayments(): any[] {
    return this.get<any[]>(STORAGE_KEYS.PAYMENTS) || []
  }

  static getPayment(id: string): any | null {
    const payments = this.getAllPayments()
    return payments.find(p => p.id === id) || null
  }

  static getPaymentsByStudent(studentId: string): any[] {
    const payments = this.getAllPayments()
    return payments.filter(p => p.studentId === studentId)
  }

  static addPayment(payment: any): any {
    // TODO: Server-side validation for payment amount, student existence
    // TODO: Send payment notification to admin via email/SMS
    // TODO: Generate unique transaction reference number
    const payments = this.getAllPayments()
    
    const newPayment = {
      ...payment,
      id: payment.id || `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    payments.push(newPayment)
    this.set(STORAGE_KEYS.PAYMENTS, payments)

    return newPayment
  }

  static updatePaymentStatus(id: string, status: string): any {
    // TODO: Add payment status change notifications (email/SMS to student/guardian)
    // TODO: Generate payment receipt when status changes to "Confirmed"
    // TODO: Update student fee balance and payment history
    const payments = this.getAllPayments()
    const index = payments.findIndex(p => p.id === id)
    
    if (index === -1) {
      throw new Error(`Payment ${id} not found`)
    }

    const updatedPayment = {
      ...payments[index],
      status,
      verifiedAt: status === "Confirmed" ? new Date().toISOString() : payments[index].verifiedAt,
      updatedAt: new Date().toISOString(),
    }

    payments[index] = updatedPayment
    this.set(STORAGE_KEYS.PAYMENTS, payments)

    // QA: After marking payment Verified, ensure student view reflects status
    return updatedPayment
  }

  static updatePayment(id: string, updates: any): any {
    const payments = this.getAllPayments()
    const index = payments.findIndex(p => p.id === id)
    
    if (index === -1) {
      throw new Error(`Payment ${id} not found`)
    }

    const updatedPayment = {
      ...payments[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    }

    payments[index] = updatedPayment
    this.set(STORAGE_KEYS.PAYMENTS, payments)

    return updatedPayment
  }

  static deletePayment(id: string): void {
    // TODO: Add soft delete instead of hard delete for audit trails
    // TODO: Require admin approval for payment deletion
    const payments = this.getAllPayments()
    const filtered = payments.filter(p => p.id !== id)
    this.set(STORAGE_KEYS.PAYMENTS, filtered)
  }

  static exportPaymentsToCSV(paymentIds?: string[]): string {
    // TODO: Generate CSV export on backend for large datasets
    // TODO: Add payment gateway transaction IDs to export
    const payments = this.getAllPayments()
    const filtered = paymentIds 
      ? payments.filter(p => paymentIds.includes(p.id))
      : payments

    const headers = [
      "ID",
      "Student Name",
      "Student ID",
      "Class",
      "Amount (₹)",
      "Method",
      "Status",
      "Date",
      "Created At",
      "Updated At"
    ]

    const rows = filtered.map(p => [
      p.id,
      p.studentName,
      p.studentId,
      p.class,
      p.amount,
      p.method,
      p.status,
      p.date,
      p.createdAt,
      p.updatedAt
    ])

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    return csv
  }

  // TODO: Replace localStorage KPIs with server-side aggregation for large datasets
  // Dashboard KPI helper methods for Admin Dashboard
  // QA: Verify KPIs auto-update when data changes

  static getDashboardKPIs(): {
    totalStudents: number
    totalTeachers: number
    pendingPayments: number
    upcomingTests: number
    avgAttendanceThisMonth: number
  } {
    // TODO: Replace with server-side API endpoint /api/dashboard/kpis for scalability
    const students = this.getAllStudents()
    const teachers = this.getAllTeachers()
    const payments = this.getAllPayments()
    const tests = this.getAllTests()
    const attendance = this.getAllAttendanceRecords()

    const totalStudents = students.length
    const totalTeachers = teachers.length

    const pendingPayments = payments.filter(
      (p: any) => p.status === "pending" || p.status === "overdue"
    ).length

    const today = new Date()
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const upcomingTests = tests.filter((t: any) => {
      const testDate = new Date(t.date)
      return testDate >= today && testDate <= next30Days
    }).length

    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const monthlyAttendance = attendance.filter((a: any) => {
      const attDate = new Date(a.date)
      return attDate.getMonth() === currentMonth && attDate.getFullYear() === currentYear
    })

    const totalAttendanceRecords = monthlyAttendance.reduce((sum: number, record: any) => {
      return sum + (record.students?.length || 0)
    }, 0)

    const presentRecords = monthlyAttendance.reduce((sum: number, record: any) => {
      return sum + (record.students?.filter((s: any) => s.status === "Present").length || 0)
    }, 0)

    const avgAttendanceThisMonth = totalAttendanceRecords > 0
      ? Math.round((presentRecords / totalAttendanceRecords) * 100)
      : 0

    // QA: Verify KPIs reflect correct numbers based on seeded data
    return {
      totalStudents,
      totalTeachers,
      pendingPayments,
      upcomingTests,
      avgAttendanceThisMonth,
    }
  }

  static getStudentsForDashboard(limit?: number): StudentWithRelations[] {
    // TODO: Replace with server-side pagination endpoint
    const students = this.getAllStudents()
    return limit ? students.slice(0, limit) : students
  }

  static getTeachersForDashboard(limit?: number): any[] {
    // TODO: Replace with server-side pagination endpoint
    const teachers = this.getAllTeachers()
    return limit ? teachers.slice(0, limit) : teachers
  }

  static getUpcomingTestsForDashboard(days: number = 30): any[] {
    // TODO: Replace with server-side query
    const tests = this.getAllTests()
    const today = new Date()
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)

    return tests
      .filter((t: any) => {
        const testDate = new Date(t.date)
        return testDate >= today && testDate <= futureDate
      })
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  static getPendingPaymentsForDashboard(): any[] {
    // TODO: Replace with server-side query
    const payments = this.getAllPayments()
    return payments
      .filter((p: any) => p.status === "pending" || p.status === "overdue")
      .sort((a: any, b: any) => new Date(a.dueDate || a.date).getTime() - new Date(b.dueDate || b.date).getTime())
  }

  static getRecentAttendanceForDashboard(limit: number = 20): any[] {
    // TODO: Replace with server-side query
    const attendance = this.getAllAttendanceRecords()
    return attendance
      .sort((a: any, b: any) => b.date.localeCompare(a.date))
      .slice(0, limit)
  }

  static getMonthlyAttendanceTrend(months: number = 6): { month: string; percentage: number }[] {
    // TODO: Replace with server-side aggregation
    const attendance = this.getAllAttendanceRecords()
    const today = new Date()
    const monthsData: Record<string, { present: number; total: number }> = {}

    for (let i = 0; i < months; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthsData[monthKey] = { present: 0, total: 0 }
    }

    attendance.forEach((record: any) => {
      const recordDate = new Date(record.date)
      const monthKey = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`
      
      if (monthsData[monthKey]) {
        const students = record.students || []
        monthsData[monthKey].total += students.length
        monthsData[monthKey].present += students.filter((s: any) => s.status === "Present").length
      }
    })

    return Object.entries(monthsData)
      .map(([month, data]) => ({
        month,
        percentage: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }

  // TODO: Replace with server-side role and permission management
  // Role-based access control helpers
  // QA: Verify role permissions are enforced correctly

  static grantTeacherAccess(teacherId: string): { success: boolean; message: string } {
    // TODO: Add server-side role assignment with audit logging
    const teacher = this.getTeacher(teacherId)
    
    if (!teacher) {
      return {
        success: false,
        message: "Teacher not found",
      }
    }

    if (teacher.approved) {
      return {
        success: true,
        message: "Teacher already has access",
      }
    }

    this.updateTeacher(teacherId, { approved: true })

    // QA: Verify teacher can now log in
    const updated = this.getTeacher(teacherId)
    if (!updated?.approved) {
      console.error("QA FAIL: Teacher access grant failed")
      return {
        success: false,
        message: "Failed to grant access",
      }
    }

    return {
      success: true,
      message: `Access granted to ${teacher.name}`,
    }
  }

  static revokeTeacherAccess(teacherId: string): { success: boolean; message: string } {
    // TODO: Add server-side role revocation with session invalidation
    const teacher = this.getTeacher(teacherId)
    
    if (!teacher) {
      return {
        success: false,
        message: "Teacher not found",
      }
    }

    this.updateTeacher(teacherId, { approved: false })

    // QA: Verify teacher can no longer log in
    const updated = this.getTeacher(teacherId)
    if (updated?.approved) {
      console.error("QA FAIL: Teacher access revocation failed")
      return {
        success: false,
        message: "Failed to revoke access",
      }
    }

    return {
      success: true,
      message: `Access revoked for ${teacher.name}`,
    }
  }

  static checkTeacherAccess(teacherId: string): { hasAccess: boolean; reason?: string; teacher?: TeacherRecord } {
    // TODO: Replace with backend permission check
    const teacher = this.getTeacher(teacherId)
    
    if (!teacher) {
      return {
        hasAccess: false,
        reason: "Teacher not found",
      }
    }

    if (!teacher.approved) {
      return {
        hasAccess: false,
        reason: "Contact Admin for access approval",
      }
    }

    return {
      hasAccess: true,
      teacher,
    }
  }

  static validateStudentDataAccess(requestingStudentId: string, targetStudentId: string): { canAccess: boolean; reason?: string } {
    // TODO: Add server-side data access validation
    // Students can only access their own data
    
    if (requestingStudentId !== targetStudentId) {
      return {
        canAccess: false,
        reason: "You can only access your own data",
      }
    }

    const student = this.getStudent(targetStudentId)
    
    if (!student) {
      return {
        canAccess: false,
        reason: "Student not found",
      }
    }

    return {
      canAccess: true,
    }
  }

  static getAllTeachersWithAccessStatus(): (TeacherRecord & { accessStatus: string })[] {
    // TODO: Move to backend with proper role management
    const teachers = this.getAllTeachers()
    
    return teachers.map(teacher => ({
      ...teacher,
      accessStatus: teacher.approved ? "Active" : "Pending Approval",
    }))
  }

  static bulkGrantTeacherAccess(teacherIds: string[]): { success: number; failed: number; errors: string[] } {
    // TODO: Add server-side bulk operations with transactions
    let success = 0
    let failed = 0
    const errors: string[] = []

    teacherIds.forEach(teacherId => {
      const result = this.grantTeacherAccess(teacherId)
      if (result.success) {
        success++
      } else {
        failed++
        errors.push(`${teacherId}: ${result.message}`)
      }
    })

    return { success, failed, errors }
  }
}

export const useLocalDB = LocalDB
