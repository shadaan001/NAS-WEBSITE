export interface AdminUser {
  id: string
  name: string
  email: string
  coachingName: string
  coachingLogo?: string
  address: string
  contactNumber: string
}

export interface StudentRecord {
  id: string
  name: string
  class: string
  rollNumber: string
  subjects: string[]
  assignedTeachers: { teacherId: string; teacherName: string; subject: string }[]
  assignedTeacherIds: string[]
  phone: string
  address: string
  email: string
  profilePhoto?: string
  dateOfBirth?: string
  guardianName?: string
  guardianPhone?: string
  admissionDate: string
  bloodGroup?: string
  username?: string
  hasCredentials?: boolean
}

export interface WeeklyAvailability {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
  from: string
  to: string
}

export interface TeacherRecord {
  id: string
  name: string
  subjects: string[]
  classesAssigned: string[]
  email: string
  contactNumber: string
  address?: string
  employeeId: string
  joiningDate: string
  qualification?: string
  experience?: string
  profilePhoto?: string
  photoBase64?: string | null
  availability?: WeeklyAvailability[]
  assignedStudentIds?: string[]
  approved?: boolean
}

export interface ClassRecord {
  id: string
  name: string
  section?: string
  subjects: string[]
  assignedTeachers: { teacherId: string; subject: string }[]
  studentCount: number
  timetable?: ClassTimetable[]
}

export interface SubjectRecord {
  id: string
  name: string
  code: string
  classes: string[]
  assignedTeachers: string[]
  totalLectures?: number
  description?: string
}

export interface TestRecord {
  id: string
  name: string
  subject: string
  class: string
  date: string
  maxMarks: number
  duration: number
  type: "Unit Test" | "Mid Term" | "Final" | "Weekly Test" | "Mock Test"
  marks: TestMark[]
}

export interface TestMark {
  studentId: string
  studentName: string
  marksObtained: number
  remarks?: string
}

export interface FeeRecord {
  id: string
  studentId: string
  studentName: string
  class: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "paid" | "unpaid" | "overdue" | "partial"
  paymentMode?: "cash" | "online" | "cheque" | "card"
  receiptNumber?: string
  remarks?: string
}

export interface FeeStructure {
  id: string
  class: string
  tuitionFee: number
  examFee: number
  labFee: number
  libraryFee: number
  otherFees: number
  totalFee: number
  frequency: "monthly" | "quarterly" | "yearly"
}

export interface ClassTimetable {
  day: string
  periods: {
    time: string
    subject: string
    teacherId: string
  }[]
}

export interface AttendanceFilter {
  studentId?: string
  teacherId?: string
  subject?: string
  startDate?: string
  endDate?: string
  status?: "present" | "absent" | "late"
}
