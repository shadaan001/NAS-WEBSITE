export interface Teacher {
  id: string
  name: string
  email: string
  subjects: string[]
  contactNumber: string
  employeeId: string
}

export interface Student {
  id: string
  name: string
  class: string
  rollNumber: string
  email?: string
  phone?: string
  assignedTeachers: TeacherAssignment[]
  enrolledCourses?: string[]
  createdAt?: string
}

export interface TeacherAssignment {
  teacherId: string
  teacherName: string
  subject: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  teacherId: string
  teacherName: string
  subject: string
  date: string
  status: "present" | "absent" | "late"
  timestamp: string
  remarks?: string
}

export interface SubjectAttendance {
  subject: string
  teacherName: string
  totalClasses: number
  present: number
  absent: number
  late: number
  percentage: number
}

export interface TeacherAttendance {
  teacherId: string
  teacherName: string
  subjects: string[]
  totalClasses: number
  present: number
  absent: number
  late: number
  percentage: number
}

export interface AttendanceSummary {
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  percentage: number
  bySubject: SubjectAttendance[]
  byTeacher: TeacherAttendance[]
  last7Days: DailyAttendance[]
  last30Days: DailyAttendance[]
}

export interface DailyAttendance {
  date: string
  present: number
  absent: number
  late: number
  totalClasses: number
}

export interface Course {
  id: string
  title: string
  description: string
  duration: string
  batchSize: number
  fee: number
  features: string[]
  startDate: string
  category: "JEE" | "NEET" | "Foundation" | "Board" | "Other"
  isActive: boolean
  subjects?: string[]
  grade?: string
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
}

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  paymentStatus: "pending" | "completed" | "failed"
  paymentId?: string
  enrollmentDate: string
  startDate: string
}

export interface PaymentDetails {
  courseId: string
  studentId: string
  amount: number
  currency: string
  orderId?: string
}

export interface Lecture {
  id: string
  courseId: string
  courseName: string
  subject: string
  title: string
  description: string
  videoURL: string
  thumbnailURL?: string
  teacherId: string
  teacherName: string
  uploadDate: string
  duration?: string
  views?: number
  tags?: string[]
}

export interface LectureFilter {
  courseId?: string
  subject?: string
  teacherId?: string
  searchQuery?: string
}
