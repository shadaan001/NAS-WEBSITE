export const studentData = {
  id: "STU001",
  name: "Rahul Sharma",
  class: "Class 10-A",
  rollNumber: "15",
  admissionNumber: "2023/001",
  dateOfBirth: "2008-05-15",
  parentName: "Mr. Anil Sharma",
  parentContact: "+91 98765 43210",
  parentEmail: "anil.sharma@email.com",
  address: "123, Green Park, New Delhi - 110016",
  bloodGroup: "B+",
  avatarUrl: "",
  assignedTeachers: [
    { teacherId: "TCH001", teacherName: "Mr. Rajesh Kumar", subject: "Mathematics" },
    { teacherId: "TCH002", teacherName: "Ms. Priya Patel", subject: "Science" },
    { teacherId: "TCH003", teacherName: "Mrs. Anjali Singh", subject: "English" },
    { teacherId: "TCH004", teacherName: "Mr. Vikram Sharma", subject: "Hindi" },
    { teacherId: "TCH005", teacherName: "Ms. Deepa Verma", subject: "Social Studies" },
    { teacherId: "TCH006", teacherName: "Mr. Arun Rao", subject: "Physical Education" },
  ],
}

export const homeworkData = [
  {
    id: "hw1",
    subject: "Mathematics",
    title: "Chapter 5 Exercise Questions",
    description: "Complete all questions from Exercise 5.2 and 5.3",
    assignedDate: "2024-01-20",
    dueDate: "2024-01-25",
    status: "pending",
    priority: "high",
  },
  {
    id: "hw2",
    subject: "Science",
    title: "Lab Report - Chemical Reactions",
    description: "Write a detailed lab report on the chemical reactions experiment conducted in class",
    assignedDate: "2024-01-18",
    dueDate: "2024-01-24",
    status: "pending",
    priority: "medium",
  },
  {
    id: "hw3",
    subject: "English",
    title: "Essay Writing - Environmental Conservation",
    description: "Write a 500-word essay on the importance of environmental conservation",
    assignedDate: "2024-01-15",
    dueDate: "2024-01-22",
    status: "completed",
    priority: "medium",
  },
  {
    id: "hw4",
    subject: "Hindi",
    title: "पाठ 8 - प्रश्न उत्तर",
    description: "पाठ 8 के सभी प्रश्नों के उत्तर लिखें",
    assignedDate: "2024-01-19",
    dueDate: "2024-01-26",
    status: "pending",
    priority: "low",
  },
]

export const classworkData = [
  {
    id: "cw1",
    subject: "Mathematics",
    title: "Quadratic Equations Practice",
    description: "In-class worksheet on solving quadratic equations",
    date: "2024-01-22",
    status: "completed",
  },
  {
    id: "cw2",
    subject: "Science",
    title: "Photosynthesis Diagram",
    description: "Draw and label the process of photosynthesis",
    date: "2024-01-23",
    status: "completed",
  },
  {
    id: "cw3",
    subject: "Social Studies",
    title: "Map Work - Indian States",
    description: "Mark all Indian states on the political map",
    date: "2024-01-24",
    status: "pending",
  },
]

export const activitiesData = [
  {
    id: "act1",
    title: "Annual Sports Day",
    description: "Participate in track and field events",
    date: "2024-02-05",
    time: "9:00 AM",
    type: "sports",
    venue: "School Playground",
  },
  {
    id: "act2",
    title: "Science Exhibition",
    description: "Present your science project to judges and visitors",
    date: "2024-02-10",
    time: "10:00 AM",
    type: "academic",
    venue: "School Auditorium",
  },
  {
    id: "act3",
    title: "Cultural Program",
    description: "Annual day celebrations with performances",
    date: "2024-02-15",
    time: "5:00 PM",
    type: "cultural",
    venue: "Main Hall",
  },
]

export const resultsData = [
  {
    examName: "Mid-Term Examination",
    date: "2023-12-15",
    subjects: [
      { name: "Mathematics", marksObtained: 85, totalMarks: 100, grade: "A" },
      { name: "Science", marksObtained: 92, totalMarks: 100, grade: "A+" },
      { name: "English", marksObtained: 78, totalMarks: 100, grade: "B+" },
      { name: "Hindi", marksObtained: 88, totalMarks: 100, grade: "A" },
      { name: "Social Studies", marksObtained: 82, totalMarks: 100, grade: "A" },
    ],
    totalObtained: 425,
    totalMarks: 500,
    percentage: 85,
    rank: 5,
  },
]

export const upcomingTests = [
  {
    id: "test1",
    subject: "Mathematics",
    title: "Unit Test - Algebra",
    date: "2024-01-28",
    time: "10:00 AM",
    duration: "1 hour",
    syllabus: "Chapters 4, 5",
  },
  {
    id: "test2",
    subject: "Science",
    title: "Practical Exam - Physics",
    date: "2024-01-30",
    time: "11:00 AM",
    duration: "2 hours",
    syllabus: "Electricity & Magnetism",
  },
]

export const feesData = {
  totalFees: 45000,
  paidAmount: 30000,
  pendingAmount: 15000,
  dueDate: "2024-02-15",
  installments: [
    { installmentNumber: 1, amount: 15000, dueDate: "2023-07-15", status: "paid", paidDate: "2023-07-10" },
    { installmentNumber: 2, amount: 15000, dueDate: "2023-10-15", status: "paid", paidDate: "2023-10-12" },
    { installmentNumber: 3, amount: 15000, dueDate: "2024-02-15", status: "pending" },
  ],
}

export const notificationsData = [
  {
    id: "notif1",
    title: "Parent-Teacher Meeting",
    message: "Parent-teacher meeting scheduled for 2nd February 2024 at 3:00 PM",
    date: "2024-01-20",
    read: false,
    type: "important",
  },
  {
    id: "notif2",
    title: "Fee Reminder",
    message: "Third installment of fees due on 15th February 2024",
    date: "2024-01-19",
    read: false,
    type: "fee",
  },
  {
    id: "notif3",
    title: "New Homework Assigned",
    message: "Mathematics homework assigned - Due on 25th January 2024",
    date: "2024-01-20",
    read: true,
    type: "homework",
  },
  {
    id: "notif4",
    title: "Sports Day Registration",
    message: "Register for Annual Sports Day events by 25th January 2024",
    date: "2024-01-18",
    read: true,
    type: "activity",
  },
]

export const timetableData = [
  {
    day: "Monday",
    periods: [
      { subject: "Mathematics", time: "8:00 - 8:45", teacher: "Mr. Kumar" },
      { subject: "Science", time: "8:45 - 9:30", teacher: "Ms. Patel" },
      { subject: "English", time: "9:30 - 10:15", teacher: "Mrs. Singh" },
      { subject: "Break", time: "10:15 - 10:30", teacher: "" },
      { subject: "Hindi", time: "10:30 - 11:15", teacher: "Mr. Sharma" },
      { subject: "Social Studies", time: "11:15 - 12:00", teacher: "Ms. Verma" },
      { subject: "Physical Education", time: "12:00 - 12:45", teacher: "Mr. Rao" },
    ],
  },
  {
    day: "Tuesday",
    periods: [
      { subject: "Science", time: "8:00 - 8:45", teacher: "Ms. Patel" },
      { subject: "Mathematics", time: "8:45 - 9:30", teacher: "Mr. Kumar" },
      { subject: "Hindi", time: "9:30 - 10:15", teacher: "Mr. Sharma" },
      { subject: "Break", time: "10:15 - 10:30", teacher: "" },
      { subject: "English", time: "10:30 - 11:15", teacher: "Mrs. Singh" },
      { subject: "Computer Science", time: "11:15 - 12:00", teacher: "Mr. Gupta" },
      { subject: "Art", time: "12:00 - 12:45", teacher: "Ms. Nair" },
    ],
  },
]
