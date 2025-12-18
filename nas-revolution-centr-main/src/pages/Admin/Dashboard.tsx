import { useMemo } from "react"
import { motion } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import KPIWidget from "@/components/KPIWidget"
import QuickActionsPanel from "@/components/QuickActionsPanel"
import DataTable, { type DataTableColumn } from "@/components/DataTable"
import { LocalDB } from "@/lib/useLocalDB"
import type { StudentRecord, TeacherRecord, TestRecord } from "@/types/admin"
import type { AttendanceRecord } from "@/types"
import { Badge } from "@/components/ui/badge"

interface DashboardProps {
  adminId: string
  onNavigate: (page: "dashboard" | "students" | "teachers" | "attendance" | "reports" | "classes" | "tests" | "fees" | "profile" | "notices" | "payments") => void
}

interface PaymentRecord {
  id: string
  studentId: string
  studentName: string
  class: string
  amount: number
  dueDate: string
  status: "pending" | "paid" | "overdue"
  month: string
  paymentDate?: string
}

export default function Dashboard({ adminId, onNavigate }: DashboardProps) {
  const [students] = useKV<StudentRecord[]>("admin-students-records", [])
  const [teachers] = useKV<TeacherRecord[]>("admin-teachers-records", [])
  const [tests] = useKV<TestRecord[]>("admin-tests-records", [])
  const [payments] = useKV<PaymentRecord[]>("admin-payments-records", [])
  const [attendance] = useKV<AttendanceRecord[]>("admin-attendance-records", [])

  const kpiData = useMemo(() => {
    const totalStudents = students?.length || 0
    const totalTeachers = teachers?.length || 0
    
    const pendingPayments = payments?.filter(p => p.status === "pending" || p.status === "overdue").length || 0
    
    const today = new Date()
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const upcomingTests = tests?.filter(t => {
      const testDate = new Date(t.date)
      return testDate >= today && testDate <= next30Days
    }).length || 0
    
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const monthlyAttendance = attendance?.filter(a => {
      const attDate = new Date(a.date)
      return attDate.getMonth() === currentMonth && attDate.getFullYear() === currentYear
    }) || []
    
    const totalAttendanceRecords = monthlyAttendance.length
    const presentRecords = monthlyAttendance.filter(a => a.status === "present").length
    const avgAttendance = totalAttendanceRecords > 0 
      ? Math.round((presentRecords / totalAttendanceRecords) * 100) 
      : 0

    return {
      totalStudents,
      totalTeachers,
      pendingPayments,
      upcomingTests,
      avgAttendance,
    }
  }, [students, teachers, tests, payments, attendance])

  const studentColumns: DataTableColumn[] = [
    { key: "rollNumber", label: "Roll No", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { 
      key: "subjects", 
      label: "Subjects", 
      render: (subjects: string[]) => (
        <div className="flex flex-wrap gap-1">
          {subjects?.slice(0, 2).map((sub, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{sub}</Badge>
          ))}
          {subjects?.length > 2 && (
            <Badge variant="outline" className="text-xs">+{subjects.length - 2}</Badge>
          )}
        </div>
      )
    },
    { key: "phone", label: "Contact", sortable: false },
  ]

  const teacherColumns: DataTableColumn[] = [
    { key: "employeeId", label: "Employee ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { 
      key: "subjects", 
      label: "Subjects", 
      render: (subjects: string[]) => (
        <div className="flex flex-wrap gap-1">
          {subjects?.map((sub, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{sub}</Badge>
          ))}
        </div>
      )
    },
    { 
      key: "classesAssigned", 
      label: "Classes", 
      render: (classes: string[]) => classes?.length || 0
    },
    { key: "contactNumber", label: "Contact", sortable: false },
  ]

  const testColumns: DataTableColumn[] = [
    { key: "name", label: "Test Name", sortable: true },
    { key: "subject", label: "Subject", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { 
      key: "date", 
      label: "Date", 
      sortable: true,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    { key: "type", label: "Type", sortable: true },
    { key: "maxMarks", label: "Max Marks", sortable: true },
  ]

  const paymentColumns: DataTableColumn[] = [
    { key: "studentName", label: "Student", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { 
      key: "amount", 
      label: "Amount", 
      sortable: true,
      render: (amount: number) => `₹${amount.toLocaleString()}`
    },
    { key: "month", label: "Month", sortable: true },
    { 
      key: "dueDate", 
      label: "Due Date", 
      sortable: true,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    { 
      key: "status", 
      label: "Status", 
      sortable: true,
      render: (status: string) => (
        <Badge 
          variant={status === "paid" ? "default" : status === "overdue" ? "destructive" : "secondary"}
        >
          {status}
        </Badge>
      )
    },
  ]

  const attendanceColumns: DataTableColumn[] = [
    { key: "studentName", label: "Student", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { 
      key: "date", 
      label: "Date", 
      sortable: true,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    { 
      key: "status", 
      label: "Status", 
      sortable: true,
      render: (status: string) => (
        <Badge variant={status === "present" ? "default" : "destructive"}>
          {status}
        </Badge>
      )
    },
  ]

  return (
    <div className="min-h-screen p-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Admin Dashboard</h1>
        <p className="text-lg text-gray-300">Monitor and manage your school operations</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <KPIWidget
          title="Total Students"
          value={kpiData.totalStudents}
          icon="users"
          color="blue"
          tooltip="Total number of registered students"
          delay={0.1}
        />
        <KPIWidget
          title="Total Teachers"
          value={kpiData.totalTeachers}
          icon="teachers"
          color="green"
          tooltip="Total number of registered teachers"
          delay={0.2}
        />
        <KPIWidget
          title="Pending Payments"
          value={kpiData.pendingPayments}
          icon="payments"
          color="orange"
          tooltip="Number of pending and overdue payments"
          delay={0.3}
        />
        <KPIWidget
          title="Upcoming Tests"
          value={kpiData.upcomingTests}
          icon="tests"
          color="purple"
          tooltip="Tests scheduled in the next 30 days"
          delay={0.4}
        />
        <KPIWidget
          title="Avg Attendance"
          value={`${kpiData.avgAttendance}%`}
          icon="attendance"
          color="pink"
          trend={kpiData.avgAttendance > 75 ? "+5%" : "-2%"}
          trendDirection={kpiData.avgAttendance > 75 ? "up" : "down"}
          tooltip="Average attendance for current month"
          delay={0.5}
        />
      </div>

      <QuickActionsPanel
        onAddStudent={() => onNavigate("students")}
        onAddTeacher={() => onNavigate("teachers")}
        onAddTest={() => onNavigate("tests")}
        onUploadMarks={() => onNavigate("tests")}
        onVerifyPayments={() => onNavigate("payments")}
      />

      <DataTable
        title="Students Overview"
        columns={studentColumns}
        data={students || []}
        actions={["view", "edit", "delete"]}
        onView={(row) => console.log("View student:", row)}
        onEdit={(row) => onNavigate("students")}
        onDelete={(row) => {
          if (confirm(`Delete student ${row.name}?`)) {
            try {
              LocalDB.deleteStudent(row.id)
              window.location.reload()
            } catch (error) {
              console.error("Delete failed:", error)
            }
          }
        }}
        pageSize={5}
        delay={0.6}
      />

      <DataTable
        title="Teachers Overview"
        columns={teacherColumns}
        data={teachers || []}
        actions={["view", "edit"]}
        onView={(row) => console.log("View teacher:", row)}
        onEdit={(row) => onNavigate("teachers")}
        pageSize={5}
        delay={0.7}
      />

      <DataTable
        title="Upcoming Tests"
        columns={testColumns}
        data={tests?.filter(t => new Date(t.date) >= new Date()) || []}
        actions={["view", "edit"]}
        onView={(row) => console.log("View test:", row)}
        onEdit={(row) => onNavigate("tests")}
        pageSize={5}
        delay={0.8}
      />

      <DataTable
        title="Pending Payments"
        columns={paymentColumns}
        data={payments?.filter(p => p.status === "pending" || p.status === "overdue") || []}
        actions={["view"]}
        onView={(row) => onNavigate("payments")}
        pageSize={5}
        delay={0.9}
      />

      <DataTable
        title="Recent Attendance"
        columns={attendanceColumns}
        data={attendance?.slice(0, 20) || []}
        actions={["view"]}
        onView={(row) => onNavigate("attendance")}
        pageSize={5}
        delay={1.0}
      />
    </div>
  )
}
