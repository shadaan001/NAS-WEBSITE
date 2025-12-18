import type { TeacherRecord } from "@/types/admin"
import type { StudentWithRelations } from "@/lib/useLocalDB"

export const seedTeachers: TeacherRecord[] = [
  {
    id: "T001",
    name: "MD SHADAAN",
    email: "shadaan@nascentre.com",
    contactNumber: "9073040640",
    subjects: ["Maths", "Science"],
    classesAssigned: ["8A", "9A"],
    employeeId: "T001",
    joiningDate: "2020-01-15",
    qualification: "M.Sc. Mathematics",
    experience: "5 years",
    address: "Nascentre School, City",
    photoBase64: null,
    availability: [
      { day: "Mon", from: "09:00", to: "15:00" },
      { day: "Tue", from: "09:00", to: "15:00" },
      { day: "Wed", from: "09:00", to: "15:00" },
      { day: "Thu", from: "09:00", to: "15:00" },
      { day: "Fri", from: "09:00", to: "13:00" },
    ],
    assignedStudentIds: ["s-001", "s-002", "s-003", "s-008", "s-012"],
    approved: true,
  },
  {
    id: "t-001",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@school.com",
    contactNumber: "+91 98765 11111",
    subjects: ["Mathematics", "Physics"],
    classesAssigned: ["Class 10", "Class 11 Science", "Class 12 Science"],
    employeeId: "EMP001",
    joiningDate: "2019-06-15",
    qualification: "Ph.D. in Mathematics",
    experience: "12 years",
    address: "45, Model Town, New Delhi",
    photoBase64: null,
    availability: [
      { day: "Mon", from: "09:00", to: "15:00" },
      { day: "Tue", from: "09:00", to: "15:00" },
      { day: "Wed", from: "09:00", to: "15:00" },
      { day: "Thu", from: "09:00", to: "15:00" },
      { day: "Fri", from: "09:00", to: "13:00" },
    ],
    assignedStudentIds: [],
    approved: true,
  },
  {
    id: "t-002",
    name: "Ms. Priya Patel",
    email: "priya.patel@school.com",
    contactNumber: "+91 98765 22222",
    subjects: ["Chemistry", "Biology"],
    classesAssigned: ["Class 9", "Class 10", "Class 11 Science"],
    employeeId: "EMP002",
    joiningDate: "2020-07-01",
    qualification: "M.Sc. Chemistry",
    experience: "8 years",
    address: "12, Green Park, Mumbai",
    photoBase64: null,
    availability: [
      { day: "Mon", from: "10:00", to: "16:00" },
      { day: "Tue", from: "10:00", to: "16:00" },
      { day: "Wed", from: "10:00", to: "16:00" },
      { day: "Thu", from: "10:00", to: "16:00" },
      { day: "Fri", from: "10:00", to: "14:00" },
    ],
    assignedStudentIds: [],
    approved: true,
  },
  {
    id: "t-003",
    name: "Mrs. Anjali Singh",
    email: "anjali.singh@school.com",
    contactNumber: "+91 98765 33333",
    subjects: ["English", "Hindi"],
    classesAssigned: ["Class 6", "Class 7", "Class 8", "Class 9"],
    employeeId: "EMP003",
    joiningDate: "2018-04-10",
    qualification: "M.A. English Literature",
    experience: "15 years",
    address: "78, Sector 15, Bangalore",
    photoBase64: null,
    availability: [
      { day: "Mon", from: "08:00", to: "14:00" },
      { day: "Tue", from: "08:00", to: "14:00" },
      { day: "Wed", from: "08:00", to: "14:00" },
      { day: "Thu", from: "08:00", to: "14:00" },
      { day: "Fri", from: "08:00", to: "12:00" },
    ],
    assignedStudentIds: [],
    approved: true,
  },
  {
    id: "t-004",
    name: "Mr. Vikram Sharma",
    email: "vikram.sharma@school.com",
    contactNumber: "+91 98765 44444",
    subjects: ["Social Studies", "Economics"],
    classesAssigned: ["Class 9", "Class 10", "Class 11 Commerce", "Class 12 Commerce"],
    employeeId: "EMP004",
    joiningDate: "2021-01-20",
    qualification: "M.A. Economics",
    experience: "6 years",
    address: "34, Civil Lines, Pune",
    photoBase64: null,
    availability: [
      { day: "Mon", from: "11:00", to: "17:00" },
      { day: "Tue", from: "11:00", to: "17:00" },
      { day: "Wed", from: "11:00", to: "17:00" },
      { day: "Thu", from: "11:00", to: "17:00" },
      { day: "Fri", from: "11:00", to: "15:00" },
    ],
    assignedStudentIds: [],
    approved: true,
  },
  {
    id: "t-005",
    name: "Ms. Deepa Verma",
    email: "deepa.verma@school.com",
    contactNumber: "+91 98765 55555",
    subjects: ["Computer Science"],
    classesAssigned: ["Class 8", "Class 9", "Class 10", "Class 11 Science"],
    employeeId: "EMP005",
    joiningDate: "2022-08-01",
    qualification: "B.Tech Computer Science",
    experience: "4 years",
    address: "56, IT Park Road, Hyderabad",
    photoBase64: null,
    availability: [
      { day: "Mon", from: "09:30", to: "15:30" },
      { day: "Tue", from: "09:30", to: "15:30" },
      { day: "Wed", from: "09:30", to: "15:30" },
      { day: "Thu", from: "09:30", to: "15:30" },
      { day: "Fri", from: "09:30", to: "13:30" },
    ],
    assignedStudentIds: [],
    approved: true,
  },
  {
    id: "t-006",
    name: "Mr. Arun Rao",
    email: "arun.rao@school.com",
    contactNumber: "+91 98765 66666",
    subjects: ["Physical Education"],
    classesAssigned: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"],
    employeeId: "EMP006",
    joiningDate: "2017-09-01",
    qualification: "B.P.Ed",
    experience: "18 years",
    address: "23, Stadium Road, Chennai",
    photoBase64: null,
    availability: [
      { day: "Mon", from: "07:00", to: "13:00" },
      { day: "Tue", from: "07:00", to: "13:00" },
      { day: "Wed", from: "07:00", to: "13:00" },
      { day: "Thu", from: "07:00", to: "13:00" },
      { day: "Fri", from: "07:00", to: "11:00" },
    ],
    assignedStudentIds: [],
    approved: true,
  },
  {
    id: "t-007",
    name: "Dr. Meena Gupta",
    email: "meena.gupta@school.com",
    contactNumber: "+91 98765 77777",
    subjects: ["Accountancy", "Business Studies"],
    classesAssigned: ["Class 11 Commerce", "Class 12 Commerce"],
    employeeId: "EMP007",
    joiningDate: "2019-03-15",
    qualification: "Ph.D. Commerce",
    experience: "14 years",
    address: "89, Business District, Kolkata",
    photoBase64: null,
    availability: [
      { day: "Mon", from: "10:00", to: "16:00" },
      { day: "Wed", from: "10:00", to: "16:00" },
      { day: "Fri", from: "10:00", to: "14:00" },
    ],
    assignedStudentIds: [],
    approved: true,
  },
  {
    id: "t-008",
    name: "Mr. Suresh Nair",
    email: "suresh.nair@school.com",
    contactNumber: "+91 98765 88888",
    subjects: ["History", "Political Science"],
    classesAssigned: ["Class 10", "Class 11 Commerce", "Class 12 Commerce"],
    employeeId: "EMP008",
    joiningDate: "2020-11-10",
    qualification: "M.A. History",
    experience: "9 years",
    address: "67, Heritage Colony, Jaipur",
    photoBase64: null,
    availability: [
      { day: "Tue", from: "09:00", to: "15:00" },
      { day: "Wed", from: "09:00", to: "15:00" },
      { day: "Thu", from: "09:00", to: "15:00" },
      { day: "Fri", from: "09:00", to: "13:00" },
    ],
    assignedStudentIds: [],
    approved: false,
  },
  {
    id: "t-009",
    name: "Ms. Kavita Desai",
    email: "kavita.desai@school.com",
    contactNumber: "+91 98765 99999",
    subjects: ["Fine Arts", "Music"],
    classesAssigned: ["Class 6", "Class 7", "Class 8"],
    employeeId: "EMP009",
    joiningDate: "2021-06-01",
    qualification: "M.F.A.",
    experience: "7 years",
    address: "42, Arts Avenue, Ahmedabad",
    photoBase64: null,
    availability: [
      { day: "Mon", from: "14:00", to: "18:00" },
      { day: "Tue", from: "14:00", to: "18:00" },
      { day: "Thu", from: "14:00", to: "18:00" },
      { day: "Fri", from: "14:00", to: "17:00" },
    ],
    assignedStudentIds: [],
    approved: true,
  },
  {
    id: "t-010",
    name: "Mr. Ravi Menon",
    email: "ravi.menon@school.com",
    contactNumber: "+91 98765 00000",
    subjects: ["Geography", "Environmental Science"],
    classesAssigned: ["Class 7", "Class 8", "Class 9", "Class 10"],
    employeeId: "EMP010",
    joiningDate: "2023-01-10",
    qualification: "M.Sc. Geography",
    experience: "3 years",
    address: "91, Eco Park, Kochi",
    photoBase64: null,
    availability: [
      { day: "Mon", from: "08:30", to: "14:30" },
      { day: "Tue", from: "08:30", to: "14:30" },
      { day: "Wed", from: "08:30", to: "14:30" },
      { day: "Thu", from: "08:30", to: "14:30" },
      { day: "Fri", from: "08:30", to: "12:30" },
    ],
    assignedStudentIds: [],
    approved: false,
  },
]

export const seedStudents: StudentWithRelations[] = [
  {
    id: "s-001",
    name: "Aarav Sharma",
    class: "Class 10",
    rollNumber: "10A-01",
    email: "aarav.sharma@student.com",
    phone: "+91 98765 12001",
    address: "12, Green Valley, Delhi",
    dateOfBirth: "2009-05-15",
    bloodGroup: "O+",
    guardianName: "Mr. Rakesh Sharma",
    guardianPhone: "+91 98765 54001",
    subjects: ["Mathematics", "Physics", "Chemistry", "English"],
    assignedTeachers: [
      { teacherId: "T001", teacherName: "MD SHADAAN", subject: "Mathematics" },
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Physics" },
      { teacherId: "t-002", teacherName: "Ms. Priya Patel", subject: "Chemistry" },
    ],
    assignedTeacherIds: ["T001", "t-001", "t-002"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry", "English"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-002",
    name: "Diya Patel",
    class: "Class 10",
    rollNumber: "10A-02",
    email: "diya.patel@student.com",
    phone: "+91 98765 12002",
    address: "45, Lotus Park, Mumbai",
    dateOfBirth: "2009-08-22",
    bloodGroup: "A+",
    guardianName: "Mrs. Meena Patel",
    guardianPhone: "+91 98765 54002",
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
    assignedTeachers: [
      { teacherId: "T001", teacherName: "MD SHADAAN", subject: "Mathematics" },
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-002", teacherName: "Ms. Priya Patel", subject: "Chemistry" },
      { teacherId: "t-005", teacherName: "Ms. Deepa Verma", subject: "Computer Science" },
    ],
    assignedTeacherIds: ["T001", "t-001", "t-002", "t-005"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-003",
    name: "Arjun Singh",
    class: "Class 11 Science",
    rollNumber: "11S-01",
    email: "arjun.singh@student.com",
    phone: "+91 98765 12003",
    address: "78, Rose Avenue, Bangalore",
    dateOfBirth: "2008-03-10",
    bloodGroup: "B+",
    guardianName: "Mr. Vikram Singh",
    guardianPhone: "+91 98765 54003",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    assignedTeachers: [
      { teacherId: "T001", teacherName: "MD SHADAAN", subject: "Mathematics" },
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Physics" },
      { teacherId: "t-002", teacherName: "Ms. Priya Patel", subject: "Chemistry" },
      { teacherId: "t-002", teacherName: "Ms. Priya Patel", subject: "Biology" },
    ],
    assignedTeacherIds: ["T001", "t-001", "t-002"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-004",
    name: "Sanya Gupta",
    class: "Class 11 Commerce",
    rollNumber: "11C-01",
    email: "sanya.gupta@student.com",
    phone: "+91 98765 12004",
    address: "23, Business District, Pune",
    dateOfBirth: "2008-07-18",
    bloodGroup: "AB+",
    guardianName: "Mr. Amit Gupta",
    guardianPhone: "+91 98765 54004",
    subjects: ["Accountancy", "Business Studies", "Economics"],
    assignedTeachers: [
      { teacherId: "t-007", teacherName: "Dr. Meena Gupta", subject: "Accountancy" },
      { teacherId: "t-007", teacherName: "Dr. Meena Gupta", subject: "Business Studies" },
      { teacherId: "t-004", teacherName: "Mr. Vikram Sharma", subject: "Economics" },
    ],
    assignedTeacherIds: ["t-007", "t-004"],
    assignedSubjects: ["Accountancy", "Business Studies", "Economics"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-005",
    name: "Rohan Mehta",
    class: "Class 12 Science",
    rollNumber: "12S-01",
    email: "rohan.mehta@student.com",
    phone: "+91 98765 12005",
    address: "56, Tech Park, Hyderabad",
    dateOfBirth: "2007-11-25",
    bloodGroup: "O-",
    guardianName: "Mrs. Priya Mehta",
    guardianPhone: "+91 98765 54005",
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
    assignedTeachers: [
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Physics" },
    ],
    assignedTeacherIds: ["t-001"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
    admissionDate: "2022-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2022-04-01T10:00:00.000Z",
  },
  {
    id: "s-006",
    name: "Ananya Reddy",
    class: "Class 9",
    rollNumber: "9A-01",
    email: "ananya.reddy@student.com",
    phone: "+91 98765 12006",
    address: "34, Lake View, Chennai",
    dateOfBirth: "2010-02-14",
    bloodGroup: "A-",
    guardianName: "Mr. Kiran Reddy",
    guardianPhone: "+91 98765 54006",
    subjects: ["Mathematics", "English", "Social Studies", "Computer Science"],
    assignedTeachers: [
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "English" },
      { teacherId: "t-004", teacherName: "Mr. Vikram Sharma", subject: "Social Studies" },
      { teacherId: "t-005", teacherName: "Ms. Deepa Verma", subject: "Computer Science" },
    ],
    assignedTeacherIds: ["t-003", "t-004", "t-005"],
    assignedSubjects: ["Mathematics", "English", "Social Studies", "Computer Science"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-007",
    name: "Kabir Khanna",
    class: "Class 8",
    rollNumber: "8A-01",
    email: "kabir.khanna@student.com",
    phone: "+91 98765 12007",
    address: "67, School Road, Kolkata",
    dateOfBirth: "2011-06-30",
    bloodGroup: "B-",
    guardianName: "Mrs. Anjali Khanna",
    guardianPhone: "+91 98765 54007",
    subjects: ["English", "Hindi", "Computer Science", "Geography"],
    assignedTeachers: [
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "English" },
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "Hindi" },
      { teacherId: "t-005", teacherName: "Ms. Deepa Verma", subject: "Computer Science" },
      { teacherId: "t-010", teacherName: "Mr. Ravi Menon", subject: "Geography" },
    ],
    assignedTeacherIds: ["t-003", "t-005", "t-010"],
    assignedSubjects: ["English", "Hindi", "Computer Science", "Geography"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-008",
    name: "Ishaan Verma",
    class: "Class 10",
    rollNumber: "10B-01",
    email: "ishaan.verma@student.com",
    phone: "+91 98765 12008",
    address: "89, Park Street, Jaipur",
    dateOfBirth: "2009-09-05",
    bloodGroup: "O+",
    guardianName: "Mr. Rajesh Verma",
    guardianPhone: "+91 98765 54008",
    subjects: ["Mathematics", "Physics", "Chemistry", "English"],
    assignedTeachers: [
      { teacherId: "T001", teacherName: "MD SHADAAN", subject: "Mathematics" },
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-002", teacherName: "Ms. Priya Patel", subject: "Chemistry" },
    ],
    assignedTeacherIds: ["T001", "t-001", "t-002"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry", "English"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-009",
    name: "Myra Shah",
    class: "Class 12 Commerce",
    rollNumber: "12C-01",
    email: "myra.shah@student.com",
    phone: "+91 98765 12009",
    address: "42, Commerce Hub, Ahmedabad",
    dateOfBirth: "2007-04-20",
    bloodGroup: "A+",
    guardianName: "Mr. Nikhil Shah",
    guardianPhone: "+91 98765 54009",
    subjects: ["Accountancy", "Business Studies", "Economics"],
    assignedTeachers: [
      { teacherId: "t-007", teacherName: "Dr. Meena Gupta", subject: "Accountancy" },
      { teacherId: "t-007", teacherName: "Dr. Meena Gupta", subject: "Business Studies" },
      { teacherId: "t-004", teacherName: "Mr. Vikram Sharma", subject: "Economics" },
    ],
    assignedTeacherIds: ["t-007", "t-004"],
    assignedSubjects: ["Accountancy", "Business Studies", "Economics"],
    admissionDate: "2022-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2022-04-01T10:00:00.000Z",
  },
  {
    id: "s-010",
    name: "Vihaan Kumar",
    class: "Class 9",
    rollNumber: "9B-01",
    email: "vihaan.kumar@student.com",
    phone: "+91 98765 12010",
    address: "91, Eco Park, Kochi",
    dateOfBirth: "2010-12-08",
    bloodGroup: "B+",
    guardianName: "Mrs. Kavita Kumar",
    guardianPhone: "+91 98765 54010",
    subjects: ["Mathematics", "English", "Social Studies", "Geography"],
    assignedTeachers: [
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "English" },
      { teacherId: "t-004", teacherName: "Mr. Vikram Sharma", subject: "Social Studies" },
      { teacherId: "t-010", teacherName: "Mr. Ravi Menon", subject: "Geography" },
    ],
    assignedTeacherIds: ["t-003", "t-004", "t-010"],
    assignedSubjects: ["Mathematics", "English", "Social Studies", "Geography"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-011",
    name: "Aisha Khan",
    class: "Class 11 Science",
    rollNumber: "11S-02",
    email: "aisha.khan@student.com",
    phone: "+91 98765 12011",
    address: "15, Crescent Road, Lucknow",
    dateOfBirth: "2008-01-12",
    bloodGroup: "AB-",
    guardianName: "Dr. Farhan Khan",
    guardianPhone: "+91 98765 54011",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    assignedTeachers: [
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-002", teacherName: "Ms. Priya Patel", subject: "Chemistry" },
      { teacherId: "t-002", teacherName: "Ms. Priya Patel", subject: "Biology" },
    ],
    assignedTeacherIds: ["t-001", "t-002"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-012",
    name: "Advait Joshi",
    class: "Class 10",
    rollNumber: "10A-03",
    email: "advait.joshi@student.com",
    phone: "+91 98765 12012",
    address: "28, Heritage Colony, Nagpur",
    dateOfBirth: "2009-10-17",
    bloodGroup: "O+",
    guardianName: "Mr. Suresh Joshi",
    guardianPhone: "+91 98765 54012",
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
    assignedTeachers: [
      { teacherId: "T001", teacherName: "MD SHADAAN", subject: "Mathematics" },
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-005", teacherName: "Ms. Deepa Verma", subject: "Computer Science" },
    ],
    assignedTeacherIds: ["T001", "t-001", "t-005"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-013",
    name: "Saanvi Iyer",
    class: "Class 8",
    rollNumber: "8B-01",
    email: "saanvi.iyer@student.com",
    phone: "+91 98765 12013",
    address: "53, Temple Road, Thiruvananthapuram",
    dateOfBirth: "2011-05-23",
    bloodGroup: "A+",
    guardianName: "Mrs. Lakshmi Iyer",
    guardianPhone: "+91 98765 54013",
    subjects: ["English", "Hindi", "Geography", "Computer Science"],
    assignedTeachers: [
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "English" },
      { teacherId: "t-010", teacherName: "Mr. Ravi Menon", subject: "Geography" },
      { teacherId: "t-005", teacherName: "Ms. Deepa Verma", subject: "Computer Science" },
    ],
    assignedTeacherIds: ["t-003", "t-010", "t-005"],
    assignedSubjects: ["English", "Hindi", "Geography", "Computer Science"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-014",
    name: "Reyansh Desai",
    class: "Class 12 Science",
    rollNumber: "12S-02",
    email: "reyansh.desai@student.com",
    phone: "+91 98765 12014",
    address: "76, Science City, Surat",
    dateOfBirth: "2007-08-09",
    bloodGroup: "B+",
    guardianName: "Mr. Karan Desai",
    guardianPhone: "+91 98765 54014",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    assignedTeachers: [
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Physics" },
    ],
    assignedTeacherIds: ["t-001"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry"],
    admissionDate: "2022-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2022-04-01T10:00:00.000Z",
  },
  {
    id: "s-015",
    name: "Kiara Malhotra",
    class: "Class 7",
    rollNumber: "7A-01",
    email: "kiara.malhotra@student.com",
    phone: "+91 98765 12015",
    address: "39, Hill View, Shimla",
    dateOfBirth: "2012-03-28",
    bloodGroup: "O-",
    guardianName: "Mrs. Neha Malhotra",
    guardianPhone: "+91 98765 54015",
    subjects: ["English", "Hindi", "Geography"],
    assignedTeachers: [
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "English" },
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "Hindi" },
      { teacherId: "t-010", teacherName: "Mr. Ravi Menon", subject: "Geography" },
    ],
    assignedTeacherIds: ["t-003", "t-010"],
    assignedSubjects: ["English", "Hindi", "Geography"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-016",
    name: "Atharv Nair",
    class: "Class 11 Commerce",
    rollNumber: "11C-02",
    email: "atharv.nair@student.com",
    phone: "+91 98765 12016",
    address: "61, Marina Street, Visakhapatnam",
    dateOfBirth: "2008-11-03",
    bloodGroup: "A-",
    guardianName: "Mr. Anil Nair",
    guardianPhone: "+91 98765 54016",
    subjects: ["Accountancy", "Business Studies", "Economics"],
    assignedTeachers: [
      { teacherId: "t-007", teacherName: "Dr. Meena Gupta", subject: "Accountancy" },
      { teacherId: "t-004", teacherName: "Mr. Vikram Sharma", subject: "Economics" },
    ],
    assignedTeacherIds: ["t-007", "t-004"],
    assignedSubjects: ["Accountancy", "Business Studies", "Economics"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-017",
    name: "Navya Pillai",
    class: "Class 9",
    rollNumber: "9A-02",
    email: "navya.pillai@student.com",
    phone: "+91 98765 12017",
    address: "84, Beach Road, Goa",
    dateOfBirth: "2010-07-19",
    bloodGroup: "AB+",
    guardianName: "Dr. Ravi Pillai",
    guardianPhone: "+91 98765 54017",
    subjects: ["English", "Social Studies", "Computer Science"],
    assignedTeachers: [
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "English" },
      { teacherId: "t-004", teacherName: "Mr. Vikram Sharma", subject: "Social Studies" },
      { teacherId: "t-005", teacherName: "Ms. Deepa Verma", subject: "Computer Science" },
    ],
    assignedTeacherIds: ["t-003", "t-004", "t-005"],
    assignedSubjects: ["English", "Social Studies", "Computer Science"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-018",
    name: "Dhruv Agarwal",
    class: "Class 10",
    rollNumber: "10B-02",
    email: "dhruv.agarwal@student.com",
    phone: "+91 98765 12018",
    address: "47, Market Street, Indore",
    dateOfBirth: "2009-04-11",
    bloodGroup: "B-",
    guardianName: "Mr. Sanjay Agarwal",
    guardianPhone: "+91 98765 54018",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    assignedTeachers: [
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-002", teacherName: "Ms. Priya Patel", subject: "Chemistry" },
    ],
    assignedTeacherIds: ["t-001", "t-002"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-019",
    name: "Pari Chopra",
    class: "Class 6",
    rollNumber: "6A-01",
    email: "pari.chopra@student.com",
    phone: "+91 98765 12019",
    address: "22, Garden Lane, Chandigarh",
    dateOfBirth: "2013-09-16",
    bloodGroup: "O+",
    guardianName: "Mrs. Priya Chopra",
    guardianPhone: "+91 98765 54019",
    subjects: ["English", "Hindi"],
    assignedTeachers: [
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "English" },
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "Hindi" },
    ],
    assignedTeacherIds: ["t-003"],
    assignedSubjects: ["English", "Hindi"],
    admissionDate: "2024-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2024-04-01T10:00:00.000Z",
  },
  {
    id: "s-020",
    name: "Arnav Bajaj",
    class: "Class 12 Commerce",
    rollNumber: "12C-02",
    email: "arnav.bajaj@student.com",
    phone: "+91 98765 12020",
    address: "95, Corporate Avenue, Noida",
    dateOfBirth: "2007-06-27",
    bloodGroup: "A+",
    guardianName: "Mr. Vinod Bajaj",
    guardianPhone: "+91 98765 54020",
    subjects: ["Accountancy", "Business Studies", "Economics"],
    assignedTeachers: [
      { teacherId: "t-007", teacherName: "Dr. Meena Gupta", subject: "Accountancy" },
      { teacherId: "t-007", teacherName: "Dr. Meena Gupta", subject: "Business Studies" },
    ],
    assignedTeacherIds: ["t-007"],
    assignedSubjects: ["Accountancy", "Business Studies", "Economics"],
    admissionDate: "2022-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2022-04-01T10:00:00.000Z",
  },
  {
    id: "s-021",
    name: "Zara Hussain",
    class: "Class 11 Science",
    rollNumber: "11S-03",
    email: "zara.hussain@student.com",
    phone: "+91 98765 12021",
    address: "31, University Road, Aligarh",
    dateOfBirth: "2008-02-05",
    bloodGroup: "B+",
    guardianName: "Dr. Salim Hussain",
    guardianPhone: "+91 98765 54021",
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
    assignedTeachers: [
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-002", teacherName: "Ms. Priya Patel", subject: "Chemistry" },
      { teacherId: "t-005", teacherName: "Ms. Deepa Verma", subject: "Computer Science" },
    ],
    assignedTeacherIds: ["t-001", "t-002", "t-005"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-022",
    name: "Yash Bhatt",
    class: "Class 8",
    rollNumber: "8A-02",
    email: "yash.bhatt@student.com",
    phone: "+91 98765 12022",
    address: "68, Valley View, Dehradun",
    dateOfBirth: "2011-11-21",
    bloodGroup: "O-",
    guardianName: "Mr. Manoj Bhatt",
    guardianPhone: "+91 98765 54022",
    subjects: ["English", "Geography", "Computer Science"],
    assignedTeachers: [
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "English" },
      { teacherId: "t-010", teacherName: "Mr. Ravi Menon", subject: "Geography" },
      { teacherId: "t-005", teacherName: "Ms. Deepa Verma", subject: "Computer Science" },
    ],
    assignedTeacherIds: ["t-003", "t-010", "t-005"],
    assignedSubjects: ["English", "Geography", "Computer Science"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-023",
    name: "Mira Rao",
    class: "Class 9",
    rollNumber: "9B-02",
    email: "mira.rao@student.com",
    phone: "+91 98765 12023",
    address: "44, Lake Side, Udaipur",
    dateOfBirth: "2010-01-30",
    bloodGroup: "AB-",
    guardianName: "Mrs. Sunita Rao",
    guardianPhone: "+91 98765 54023",
    subjects: ["English", "Social Studies", "Geography"],
    assignedTeachers: [
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "English" },
      { teacherId: "t-004", teacherName: "Mr. Vikram Sharma", subject: "Social Studies" },
      { teacherId: "t-010", teacherName: "Mr. Ravi Menon", subject: "Geography" },
    ],
    assignedTeacherIds: ["t-003", "t-004", "t-010"],
    assignedSubjects: ["English", "Social Studies", "Geography"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-024",
    name: "Aditya Saxena",
    class: "Class 10",
    rollNumber: "10A-04",
    email: "aditya.saxena@student.com",
    phone: "+91 98765 12024",
    address: "17, Star Colony, Bhopal",
    dateOfBirth: "2009-12-13",
    bloodGroup: "A+",
    guardianName: "Mr. Deepak Saxena",
    guardianPhone: "+91 98765 54024",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    assignedTeachers: [
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Mathematics" },
      { teacherId: "t-001", teacherName: "Dr. Rajesh Kumar", subject: "Physics" },
      { teacherId: "t-002", teacherName: "Ms. Priya Patel", subject: "Chemistry" },
    ],
    assignedTeacherIds: ["t-001", "t-002"],
    assignedSubjects: ["Mathematics", "Physics", "Chemistry"],
    admissionDate: "2023-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2023-04-01T10:00:00.000Z",
  },
  {
    id: "s-025",
    name: "Tara Bose",
    class: "Class 7",
    rollNumber: "7B-01",
    email: "tara.bose@student.com",
    phone: "+91 98765 12025",
    address: "83, Cultural Lane, Kolkata",
    dateOfBirth: "2012-08-07",
    bloodGroup: "B+",
    guardianName: "Dr. Amit Bose",
    guardianPhone: "+91 98765 54025",
    subjects: ["English", "Hindi", "Geography"],
    assignedTeachers: [
      { teacherId: "t-003", teacherName: "Mrs. Anjali Singh", subject: "English" },
      { teacherId: "t-010", teacherName: "Mr. Ravi Menon", subject: "Geography" },
    ],
    assignedTeacherIds: ["t-003", "t-010"],
    assignedSubjects: ["English", "Hindi", "Geography"],
    admissionDate: "2024-04-01",
    photoBase64: null,
    tests: [],
    payments: [],
    createdAt: "2024-04-01T10:00:00.000Z",
  },
]

export const seedTests = [
  {
    id: "test-001",
    title: "Midterm Exam - Mathematics",
    class: "Class 10",
    subject: "Mathematics",
    date: "2024-11-15",
    maxMarks: 100,
    teacherId: "t-001",
    questionPaperURL: null,
    marks: [
      { studentId: "s-001", marks: 85, grade: "A", comments: "Excellent work!" },
      { studentId: "s-002", marks: 92, grade: "A+", comments: "Outstanding performance" },
      { studentId: "s-008", marks: 78, grade: "B+", comments: "Good effort" },
      { studentId: "s-012", marks: 88, grade: "A", comments: "Very good" },
      { studentId: "s-018", marks: 72, grade: "B", comments: "Needs improvement in algebra" },
      { studentId: "s-024", marks: 95, grade: "A+", comments: "Perfect!" },
    ],
    createdAt: "2024-11-01T10:00:00.000Z",
    updatedAt: "2024-11-16T10:00:00.000Z",
  },
  {
    id: "test-002",
    title: "Unit Test - Chemistry",
    class: "Class 10",
    subject: "Chemistry",
    date: "2024-11-20",
    maxMarks: 50,
    teacherId: "t-002",
    questionPaperURL: null,
    marks: [
      { studentId: "s-001", marks: 42, grade: "A", comments: "Good grasp of concepts" },
      { studentId: "s-002", marks: 48, grade: "A+", comments: "Excellent lab work" },
      { studentId: "s-008", marks: 38, grade: "B+", comments: "Good" },
      { studentId: "s-018", marks: 35, grade: "B", comments: "Review organic chemistry" },
      { studentId: "s-024", marks: 45, grade: "A", comments: "Very good" },
    ],
    createdAt: "2024-11-10T10:00:00.000Z",
    updatedAt: "2024-11-21T10:00:00.000Z",
  },
  {
    id: "test-003",
    title: "Final Exam - Physics",
    class: "Class 11 Science",
    subject: "Physics",
    date: "2024-12-01",
    maxMarks: 100,
    teacherId: "t-001",
    questionPaperURL: null,
    marks: [
      { studentId: "s-003", marks: 88, grade: "A", comments: "Strong understanding" },
      { studentId: "s-011", marks: 82, grade: "A", comments: "Good work" },
      { studentId: "s-021", marks: 90, grade: "A+", comments: "Excellent problem solving" },
    ],
    createdAt: "2024-11-20T10:00:00.000Z",
    updatedAt: "2024-12-02T10:00:00.000Z",
  },
  {
    id: "test-004",
    title: "Monthly Test - Computer Science",
    class: "Class 10",
    subject: "Computer Science",
    date: "2024-10-25",
    maxMarks: 75,
    teacherId: "t-005",
    questionPaperURL: null,
    marks: [
      { studentId: "s-002", marks: 70, grade: "A+", comments: "Excellent coding skills" },
      { studentId: "s-012", marks: 65, grade: "A", comments: "Good understanding" },
    ],
    createdAt: "2024-10-15T10:00:00.000Z",
    updatedAt: "2024-10-26T10:00:00.000Z",
  },
  {
    id: "test-005",
    title: "Quarterly Exam - Accountancy",
    class: "Class 11 Commerce",
    subject: "Accountancy",
    date: "2024-11-28",
    maxMarks: 100,
    teacherId: "t-007",
    questionPaperURL: null,
    marks: [
      { studentId: "s-004", marks: 92, grade: "A+", comments: "Perfect balance sheets" },
      { studentId: "s-016", marks: 85, grade: "A", comments: "Very good work" },
    ],
    createdAt: "2024-11-15T10:00:00.000Z",
    updatedAt: "2024-11-29T10:00:00.000Z",
  },
  {
    id: "test-006",
    title: "Semester Exam - English Literature",
    class: "Class 9",
    subject: "English",
    date: "2024-12-05",
    maxMarks: 80,
    teacherId: "t-003",
    questionPaperURL: null,
    marks: [
      { studentId: "s-006", marks: 72, grade: "A", comments: "Excellent essay writing" },
      { studentId: "s-010", marks: 68, grade: "B+", comments: "Good comprehension" },
      { studentId: "s-017", marks: 75, grade: "A", comments: "Creative and thoughtful" },
      { studentId: "s-023", marks: 70, grade: "A", comments: "Well done" },
    ],
    createdAt: "2024-11-25T10:00:00.000Z",
    updatedAt: "2024-12-06T10:00:00.000Z",
  },
]

export const seedNotices = [
  {
    id: "n-001",
    title: "🎉 Winter Break Holiday Notice",
    content: "<p>School will be closed from December 25th to January 2nd for winter break. Classes will resume on January 3rd. Happy Holidays!</p>",
    pinned: true,
    class: null,
    attachments: [],
    createdAt: "2024-12-01T10:00:00.000Z",
    expiryDate: "2025-01-05T00:00:00.000Z",
    author: "Principal",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: "n-002",
    title: "📚 Class 10 Board Exam Schedule Released",
    content: "<p>The board examination schedule for Class 10 has been released. Mathematics exam will be on February 15th, Science on February 18th, and English on February 21st. Please prepare accordingly.</p>",
    pinned: true,
    class: "Class 10",
    attachments: [
      { name: "exam-schedule.pdf", url: "/uploads/exam-schedule.pdf" }
    ],
    createdAt: "2024-11-28T09:00:00.000Z",
    expiryDate: "2025-02-28T00:00:00.000Z",
    author: "Exam Controller",
    updatedAt: "2024-11-28T09:00:00.000Z"
  },
  {
    id: "n-003",
    title: "🏆 Sports Day Event - All Classes",
    content: "<p>Annual Sports Day will be held on January 15th, 2025. All students are required to participate. Practice sessions will start from January 5th. Parents are invited to attend.</p>",
    pinned: false,
    class: null,
    attachments: [
      { name: "sports-day-schedule.pdf", url: "/uploads/sports-day.pdf" }
    ],
    createdAt: "2024-11-25T14:00:00.000Z",
    expiryDate: "2025-01-16T00:00:00.000Z",
    author: "Sports Department",
    updatedAt: "2024-11-25T14:00:00.000Z"
  },
  {
    id: "n-004",
    title: "🔬 Science Lab Maintenance Notice",
    content: "<p>Science laboratories will undergo maintenance from December 20-22. Class 11 and 12 Science students please adjust your practicals accordingly.</p>",
    pinned: false,
    class: "Class 11 Science",
    attachments: [],
    createdAt: "2024-12-10T11:00:00.000Z",
    expiryDate: "2024-12-23T00:00:00.000Z",
    author: "Lab Coordinator",
    updatedAt: "2024-12-10T11:00:00.000Z"
  },
  {
    id: "n-005",
    title: "💼 Class 12 Commerce - Guest Lecture on Taxation",
    content: "<p>A special guest lecture on 'Modern Taxation Systems' will be conducted by CA Ramesh Kumar on December 18th at 10 AM in the auditorium. All Class 12 Commerce students must attend.</p>",
    pinned: true,
    class: "Class 12 Commerce",
    attachments: [
      { name: "guest-speaker-bio.pdf", url: "/uploads/speaker.pdf" }
    ],
    createdAt: "2024-12-05T08:30:00.000Z",
    expiryDate: "2024-12-19T00:00:00.000Z",
    author: "Commerce Department",
    updatedAt: "2024-12-05T08:30:00.000Z"
  },
  {
    id: "n-006",
    title: "📖 Library Book Return Reminder",
    content: "<p>All borrowed library books must be returned before December 23rd. Late returns will incur a fine of ₹5 per day. Please ensure timely return to avoid penalties.</p>",
    pinned: false,
    class: null,
    attachments: [],
    createdAt: "2024-12-08T10:00:00.000Z",
    expiryDate: "2024-12-24T00:00:00.000Z",
    author: "Librarian",
    updatedAt: "2024-12-08T10:00:00.000Z"
  },
  {
    id: "n-007",
    title: "🎭 Annual Day Celebration - Auditions Open",
    content: "<p>Auditions for the Annual Day cultural program are now open for all classes. Interested students can register at the main office by December 15th. Event date: February 10th, 2025.</p>",
    pinned: false,
    class: null,
    attachments: [],
    createdAt: "2024-12-03T15:00:00.000Z",
    expiryDate: "2024-12-16T00:00:00.000Z",
    author: "Cultural Committee",
    updatedAt: "2024-12-03T15:00:00.000Z"
  },
  {
    id: "n-008",
    title: "🚌 Bus Route Changes - Class 9 Students",
    content: "<p>Due to road construction, Bus Route 3 will have a temporary change from December 12th. Pick-up point moved from Green Park to Blue Avenue. Please note the change.</p>",
    pinned: false,
    class: "Class 9",
    attachments: [
      { name: "new-route-map.jpg", url: "/uploads/route-map.jpg" }
    ],
    createdAt: "2024-12-09T07:00:00.000Z",
    expiryDate: "2025-01-10T00:00:00.000Z",
    author: "Transport Department",
    updatedAt: "2024-12-09T07:00:00.000Z"
  },
  {
    id: "n-009",
    title: "⚠️ Parent-Teacher Meeting Scheduled",
    content: "<p>Parent-Teacher meetings are scheduled for December 16th and 17th. Please check your class schedule for specific timing. Attendance is mandatory for discussing student progress.</p>",
    pinned: true,
    class: null,
    attachments: [],
    createdAt: "2024-12-01T12:00:00.000Z",
    expiryDate: "2024-12-18T00:00:00.000Z",
    author: "Principal",
    updatedAt: "2024-12-01T12:00:00.000Z"
  },
  {
    id: "n-010",
    title: "🏅 Class 8 Field Trip to Science Museum",
    content: "<p>Class 8 students will visit the National Science Museum on December 14th. Fee: ₹500 per student. Permission slips must be submitted by December 11th. Departure at 8:30 AM.</p>",
    pinned: false,
    class: "Class 8",
    attachments: [
      { name: "permission-slip.pdf", url: "/uploads/permission.pdf" },
      { name: "trip-itinerary.pdf", url: "/uploads/itinerary.pdf" }
    ],
    createdAt: "2024-12-02T09:00:00.000Z",
    expiryDate: "2024-12-15T00:00:00.000Z",
    author: "Class Teacher",
    updatedAt: "2024-12-02T09:00:00.000Z"
  },
]

export const seedPayments = [
  {
    id: "pay-001",
    studentName: "Aarav Sharma",
    studentId: "s-001",
    class: "Class 10",
    amount: 1200,
    method: "UPI",
    status: "Confirmed",
    date: "2024-12-02",
    createdAt: "2024-12-02T09:15:00.000Z",
    updatedAt: "2024-12-02T10:30:00.000Z"
  },
  {
    id: "pay-002",
    studentName: "Diya Patel",
    studentId: "s-002",
    class: "Class 10",
    amount: 1500,
    method: "UPI",
    status: "Confirmed",
    date: "2024-12-03",
    createdAt: "2024-12-03T11:20:00.000Z",
    updatedAt: "2024-12-03T14:45:00.000Z"
  },
  {
    id: "pay-003",
    studentName: "Arjun Singh",
    studentId: "s-003",
    class: "Class 11 Science",
    amount: 1800,
    method: "UPI",
    status: "Pending Verification",
    date: "2024-12-10",
    createdAt: "2024-12-10T08:45:00.000Z",
    updatedAt: "2024-12-10T08:45:00.000Z"
  },
  {
    id: "pay-004",
    studentName: "Sanya Gupta",
    studentId: "s-004",
    class: "Class 11 Commerce",
    amount: 1600,
    method: "UPI",
    status: "Confirmed",
    date: "2024-12-05",
    createdAt: "2024-12-05T15:30:00.000Z",
    updatedAt: "2024-12-05T16:00:00.000Z"
  },
  {
    id: "pay-005",
    studentName: "Rohan Mehta",
    studentId: "s-005",
    class: "Class 12 Science",
    amount: 2000,
    method: "UPI",
    status: "Confirmed",
    date: "2024-12-01",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T12:30:00.000Z"
  },
  {
    id: "pay-006",
    studentName: "Ananya Reddy",
    studentId: "s-006",
    class: "Class 9",
    amount: 1000,
    method: "UPI",
    status: "Pending Verification",
    date: "2024-12-11",
    createdAt: "2024-12-11T09:00:00.000Z",
    updatedAt: "2024-12-11T09:00:00.000Z"
  },
  {
    id: "pay-007",
    studentName: "Kabir Khanna",
    studentId: "s-007",
    class: "Class 8",
    amount: 900,
    method: "UPI",
    status: "Confirmed",
    date: "2024-12-04",
    createdAt: "2024-12-04T13:15:00.000Z",
    updatedAt: "2024-12-04T15:20:00.000Z"
  },
  {
    id: "pay-008",
    studentName: "Ishaan Verma",
    studentId: "s-008",
    class: "Class 10",
    amount: 1200,
    method: "UPI",
    status: "Pending Verification",
    date: "2024-12-12",
    createdAt: "2024-12-12T07:30:00.000Z",
    updatedAt: "2024-12-12T07:30:00.000Z"
  },
  {
    id: "pay-009",
    studentName: "Myra Shah",
    studentId: "s-009",
    class: "Class 12 Commerce",
    amount: 2000,
    method: "UPI",
    status: "Confirmed",
    date: "2024-12-06",
    createdAt: "2024-12-06T10:45:00.000Z",
    updatedAt: "2024-12-06T11:15:00.000Z"
  },
  {
    id: "pay-010",
    studentName: "Vihaan Kumar",
    studentId: "s-010",
    class: "Class 9",
    amount: 1000,
    method: "UPI",
    status: "Confirmed",
    date: "2024-12-07",
    createdAt: "2024-12-07T14:00:00.000Z",
    updatedAt: "2024-12-07T16:30:00.000Z"
  },
]

export function initializePaymentsData() {
  // TODO: Replace localStorage with backend API endpoints for payments
  const existingPayments = localStorage.getItem("admin-payments-records")
  if (existingPayments) {
    return
  }
  
  localStorage.setItem("admin-payments-records", JSON.stringify(seedPayments))
  console.log(`✅ Seeded ${seedPayments.length} payment records`)
  
  // QA: Verify seeded data integrity
  const savedPayments = JSON.parse(localStorage.getItem("admin-payments-records") || "[]")
  if (savedPayments.length !== seedPayments.length) {
    console.error("QA FAIL: Seeded payment records count mismatch")
  }
}

export function initializeNoticesData() {
  // TODO: Replace localStorage with backend API endpoints for notices
  const existingNotices = localStorage.getItem("admin-notices-records")
  if (existingNotices) {
    return
  }
  
  localStorage.setItem("admin-notices-records", JSON.stringify(seedNotices))
  console.log(`✅ Seeded ${seedNotices.length} notice records`)
  
  // QA: Verify seeded data integrity
  const savedNotices = JSON.parse(localStorage.getItem("admin-notices-records") || "[]")
  if (savedNotices.length !== seedNotices.length) {
    console.error("QA FAIL: Seeded notice records count mismatch")
  }
}

export function initializeTestData() {
  // TODO: Replace localStorage with backend API endpoints for tests
  const existingTests = localStorage.getItem("admin-tests-records")
  if (existingTests) {
    return
  }
  
  localStorage.setItem("admin-tests-records", JSON.stringify(seedTests))
  console.log(`✅ Seeded ${seedTests.length} test records`)
  
  // QA: Verify seeded data integrity
  const savedTests = JSON.parse(localStorage.getItem("admin-tests-records") || "[]")
  if (savedTests.length !== seedTests.length) {
    console.error("QA FAIL: Seeded test records count mismatch")
  }
}

export function initializeStudentsAndTeachers() {
  const existingStudents = localStorage.getItem("admin-students-records")
  const existingTeachers = localStorage.getItem("admin-teachers-records")
  
  if (!existingTeachers) {
    localStorage.setItem("admin-teachers-records", JSON.stringify(seedTeachers))
    console.log(`✅ Seeded ${seedTeachers.length} teacher records`)
  } else {
    const teachers = JSON.parse(existingTeachers)
    const t001Exists = teachers.some((t: any) => t.id === "T001")
    
    if (!t001Exists) {
      const t001 = seedTeachers.find(t => t.id === "T001")
      if (t001) {
        teachers.unshift(t001)
        localStorage.setItem("admin-teachers-records", JSON.stringify(teachers))
        console.log(`✅ Added teacher T001 (MD SHADAAN) to existing records`)
      }
    }
  }
  
  if (!existingStudents) {
    localStorage.setItem("admin-students-records", JSON.stringify(seedStudents))
    console.log(`✅ Seeded ${seedStudents.length} student records`)
  } else {
    try {
      const students = JSON.parse(existingStudents)
      let needsMigration = false
      
      const migratedStudents = students.map((student: any) => {
        if (!student) {
          needsMigration = true
          return null
        }
        
        const hasAssignedTeachers = Array.isArray(student.assignedTeachers)
        const hasAssignedTeacherIds = Array.isArray(student.assignedTeacherIds)
        const hasSubjects = Array.isArray(student.subjects)
        
        if (!hasAssignedTeachers || !hasAssignedTeacherIds || !hasSubjects) {
          needsMigration = true
        }
        
        return {
          ...student,
          assignedTeachers: hasAssignedTeachers ? student.assignedTeachers : [],
          assignedTeacherIds: hasAssignedTeacherIds ? student.assignedTeacherIds : [],
          subjects: hasSubjects ? student.subjects : [],
          tests: Array.isArray(student.tests) ? student.tests : [],
          payments: Array.isArray(student.payments) ? student.payments : []
        }
      }).filter(Boolean)
      
      localStorage.setItem("admin-students-records", JSON.stringify(migratedStudents))
      
      if (needsMigration) {
        console.log(`✅ Migrated ${migratedStudents.length} existing student records with safety defaults`)
      } else {
        console.log(`✅ Validated ${migratedStudents.length} existing student records`)
      }
    } catch (error) {
      console.error("Error migrating student records:", error)
      localStorage.setItem("admin-students-records", JSON.stringify(seedStudents))
      console.log(`⚠️ Migration failed, using seed data instead`)
    }
  }
}

export function initializeAttendanceData() {
  // Initialize attendance data for the current month with proper seeding
  // QA: Seeded teacher weekly schedule causes scheduled days to be highlighted in the calendar
  // TODO: Replace localStorage with server-side endpoints
  // TODO: Implement server-side filtering and export for performance
  const existingRecords = localStorage.getItem("attendanceRecords")
  if (existingRecords) {
    return
  }
  
  const records: any[] = []
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  // Map teachers to their primary subjects for attendance tracking
  const teacherSubjects: Record<string, string> = {
    "T001": "Mathematics",
    "t-001": "Mathematics",
    "t-002": "Chemistry",
    "t-003": "English",
    "t-004": "Social Studies",
    "t-005": "Computer Science",
    "t-006": "Physical Education",
    "t-007": "Accountancy",
    "t-010": "Geography"
  }
  
  // Map teachers to their assigned students based on seeded data
  const teacherStudents: Record<string, string[]> = {
    "T001": ["s-001", "s-002", "s-003", "s-005", "s-008", "s-011", "s-012", "s-014", "s-018", "s-021", "s-024"],
    "t-001": ["s-001", "s-002", "s-003", "s-005", "s-008", "s-011", "s-012", "s-014", "s-018", "s-021", "s-024"],
    "t-002": ["s-001", "s-002", "s-003", "s-008", "s-011", "s-018", "s-021", "s-024"],
    "t-003": ["s-006", "s-007", "s-010", "s-013", "s-015", "s-017", "s-019", "s-022", "s-023", "s-025"],
    "t-004": ["s-004", "s-006", "s-009", "s-010", "s-016", "s-017", "s-023"],
    "t-005": ["s-002", "s-006", "s-007", "s-012", "s-013", "s-017", "s-021", "s-022"],
    "t-006": ["s-001", "s-002", "s-006", "s-007", "s-008", "s-019"],
    "t-007": ["s-004", "s-009", "s-016", "s-020"],
    "t-010": ["s-007", "s-010", "s-013", "s-015", "s-022", "s-023", "s-025"]
  }
  
  // Generate attendance records for each day of the current month
  for (let day = 1; day <= today.getDate(); day++) {
    const date = new Date(currentYear, currentMonth, day)
    const dayOfWeek = date.getDay()
    
    // Skip Sundays (day 0)
    if (dayOfWeek === 0) continue
    
    const dateStr = date.toISOString().split('T')[0]
    
    // Generate attendance for each teacher based on their availability
    Object.keys(teacherSubjects).forEach(teacherId => {
      const teacher = seedTeachers.find(t => t.id === teacherId)
      if (!teacher?.availability) return
      
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const dayName = dayNames[dayOfWeek]
      
      // Check if teacher has a class scheduled on this day
      const hasSchedule = teacher.availability.some(slot => slot.day === dayName)
      
      if (hasSchedule) {
        // 5% chance of cancelled session
        const isCancelled = Math.random() < 0.05
        
        // Generate student attendance records
        const students = (teacherStudents[teacherId] || []).map(studentId => {
          let status
          if (isCancelled) {
            status = "Absent"
          } else {
            const rand = Math.random()
            // 10% absent, 5% late, 85% present
            if (rand > 0.90) {
              status = "Absent"
            } else if (rand > 0.85) {
              status = "Late"
            } else {
              status = "Present"
            }
          }
          
          return {
            studentId,
            status,
            timestamp: new Date(date.setHours(9 + Math.floor(Math.random() * 6), 0, 0)).toISOString()
          }
        })
        
        // Create attendance record
        records.push({
          id: `a-${dateStr}-${teacherId}`,
          teacherId,
          date: dateStr,
          subject: teacherSubjects[teacherId],
          status: isCancelled ? "Cancelled" : "Held",
          students,
          createdAt: new Date(date).toISOString(),
          updatedAt: new Date(date).toISOString()
        })
      }
    })
  }
  
  localStorage.setItem("attendanceRecords", JSON.stringify(records))
  console.log(`✅ Seeded ${records.length} attendance records for current month`)
  
  // QA: Verify seeded data integrity
  const savedRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]")
  if (savedRecords.length !== records.length) {
    console.error("QA FAIL: Seeded attendance records count mismatch")
  }
  
  // QA: Verify each teacher has scheduled days based on availability
  Object.keys(teacherSubjects).forEach(teacherId => {
    const teacherRecords = savedRecords.filter((r: any) => r.teacherId === teacherId)
    if (teacherRecords.length === 0) {
      const teacher = seedTeachers.find(t => t.id === teacherId)
      if (teacher?.availability && teacher.availability.length > 0) {
        console.warn(`QA WARNING: Teacher ${teacherId} has availability but no seeded attendance records`)
      }
    }
  })
}
