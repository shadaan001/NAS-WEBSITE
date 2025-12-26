import { useState, useEffect } from "react"
import { Toaster } from "sonner"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorFallback } from "./ErrorFallback"
import OpeningAnimation from "./components/OpeningAnimation"
import { AnimatePresence } from "framer-motion"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import AttendancePage from "./pages/AttendancePage"
import HomeworkPage from "./pages/HomeworkPage"
import ProfilePage from "./pages/ProfilePage"
import AdminPage from "./pages/AdminPage"
import TeacherLoginPage from "./pages/TeacherLoginPage"
import TeacherDashboardPage from "./pages/TeacherDashboardPage"
import TeacherStudentsPage from "./pages/TeacherStudentsPage"
import TeacherProfilePage from "./pages/TeacherProfilePage"
import TeacherAttendance from "./pages/Teacher/Attendance"
import TeacherAssignments from "./pages/Teacher/Assignments"
import TeacherReports from "./pages/Teacher/Reports"
import UploadLecturePage from "./pages/Teacher/UploadLecturePage"
import AdminLoginPage from "./pages/AdminLoginPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import AdminCoursesPage from "./pages/AdminCoursesPage"
import AdminStudentManagement from "./pages/AdminStudentManagement"
import AdminTeacherManagement from "./pages/AdminTeacherManagement"
import AdminAttendanceOverview from "./pages/AdminAttendanceOverview"
import AdminTestsManagement from "./pages/AdminTestsManagement"
import AdminFeesManagement from "./pages/AdminFeesManagement"
import AdminProfilePage from "./pages/AdminProfilePage"
import ManageLecturesPage from "./pages/Admin/ManageLecturesPage"
import ManageIslamicVideosPage from "./pages/Admin/ManageIslamicVideosPage"
import AdminCredentialsManagement from "./pages/AdminCredentialsManagement"
import AddTeacherInfoPage from "./pages/Admin/AddTeacherInfoPage"
import ViewAllTeachersPage from "./pages/Admin/ViewAllTeachersPage"
import CoursesPage from "./pages/CoursesPage"
import ContactPage from "./pages/ContactPage"
import PublicPaymentsPage from "./pages/PublicPaymentsPage"
import Payments from "./pages/Payments"
import LecturesPage from "./pages/Student/LecturesPage"
import IslamicVideosPage from "./pages/IslamicVideosPage"
import CredentialsPage from "./pages/CredentialsPage"
import TeachersInfoPage from "./pages/TeachersInfoPage"
import { AuthHelper } from "./lib/useAuth"
import TeacherBottomNav from "./components/TeacherBottomNav"
import { seedDemoCredentials, ensureTeacherData, seedDemoCourses } from "./utils/seedDemoData"

type Page =
  | "home"
  | "login"
  | "dashboard"
  | "attendance"
  | "homework"
  | "lectures"
  | "profile"
  | "admin"
  | "teacher-login"
  | "teacher-dashboard"
  | "teacher-students"
  | "teacher-profile"
  | "teacher-attendance"
  | "teacher-assignments"
  | "teacher-reports"
  | "teacher-upload-lectures"
  | "admin-login"
  | "admin-dashboard"
  | "admin-courses"
  | "admin-students"
  | "admin-teachers"
  | "admin-attendance"
  | "admin-tests"
  | "admin-fees"
  | "admin-profile"
  | "admin-manage-lectures"
  | "admin-manage-islamic-videos"
  | "courses"
  | "contact"
  | "public-payments"
  | "payments"
  | "islamic-videos"
  | "credentials"
  | "teachers-info"

type StudentTab = "home" | "attendance" | "homework" | "lectures" | "admin" | "profile"
type TeacherTab = "home" | "students" | "profile" | "attendance" | "assignments" | "reports" | "upload-lectures"
type AdminTab =
  | "dashboard"
  | "students"
  | "teachers"
  | "attendance"
  | "tests"
  | "fees"
  | "profile"
  | "manage-lectures"
  | "manage-islamic-videos"
  | "credentials"
  | "add-teacher-info"
  | "view-all-teachers"

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [currentStudentTab, setCurrentStudentTab] = useState<StudentTab>("home")
  const [currentTeacherTab, setCurrentTeacherTab] = useState<TeacherTab>("home")
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>("dashboard")
  const [userId, setUserId] = useState<string>("")
  const [showOpening, setShowOpening] = useState<boolean>(true)
  const [isOpeningComplete, setIsOpeningComplete] = useState<boolean>(false)

  useEffect(() => {
    const hasSeenOpening = sessionStorage.getItem("hasSeenOpening")
    if (hasSeenOpening === "true") {
      setShowOpening(false)
      setIsOpeningComplete(true)
    }

    const initialize = async () => {
      await seedDemoCredentials()
      await ensureTeacherData()
      await seedDemoCourses()
      
      const session = AuthHelper.getSession()
      if (session) {
        setUserId(session.userId)
        if (session.role === "student") {
          setCurrentPage("dashboard")
        } else if (session.role === "teacher") {
          setCurrentPage("teacher-dashboard")
        } else if (session.role === "admin") {
          setCurrentPage("admin-dashboard")
        }
      }
    }
    
    initialize()
  }, [])

  const handleNavigateToPage = (page: Page) => {
    setCurrentPage(page)
  }

  const handleOpeningComplete = () => {
    sessionStorage.setItem("hasSeenOpening", "true")
    setShowOpening(false)
    setIsOpeningComplete(true)
  }

  const handleStudentTabChange = (tab: StudentTab) => {
    setCurrentStudentTab(tab)
  }

  const handleTeacherTabChange = (tab: TeacherTab) => {
    setCurrentTeacherTab(tab)
  }

  const handleAdminTabChange = (tab: AdminTab) => {
    setCurrentAdminTab(tab)
  }

  const handleLogout = () => {
    AuthHelper.clearSession()
    setCurrentPage("home")
  }

  const renderStudentDashboard = () => {
    return (
      <>
        {currentStudentTab === "home" && (
          <DashboardPage onNavigate={handleStudentTabChange} />
        )}
        {currentStudentTab === "attendance" && <AttendancePage />}
        {currentStudentTab === "homework" && <HomeworkPage />}
        {currentStudentTab === "lectures" && (
          <LecturesPage studentId={userId} enrolledCourses={[]} />
        )}
        {currentStudentTab === "admin" && <AdminPage />}
        {currentStudentTab === "profile" && (
          <ProfilePage onLogout={handleLogout} />
        )}
      </>
    )
  }

  const handleTeacherLogout = () => {
    AuthHelper.clearSession()
    setCurrentPage("home")
    setCurrentTeacherTab("home")
  }

  const handleBackToHome = () => {
    setCurrentPage("home")
    setCurrentTeacherTab("home")
  }

  const handleBackToTeacherDashboard = () => {
    setCurrentTeacherTab("home")
  }

  const renderTeacherDashboard = () => {
    return (
      <>
        {currentTeacherTab === "home" && (
          <TeacherDashboardPage 
            teacherId={userId} 
            onNavigate={(page) => {
              if (page === "students") handleTeacherTabChange("students")
              else if (page === "profile") handleTeacherTabChange("profile")
              else if (page === "attendance") handleTeacherTabChange("attendance")
              else if (page === "assignments") handleTeacherTabChange("assignments")
              else if (page === "reports") handleTeacherTabChange("reports")
              else if (page === "upload-lectures") handleTeacherTabChange("upload-lectures")
              else handleTeacherTabChange("home")
            }} 
          />
        )}
        {currentTeacherTab === "students" && (
          <TeacherStudentsPage 
            teacherId={userId} 
            onBack={handleBackToTeacherDashboard}
          />
        )}
        {currentTeacherTab === "attendance" && (
          <TeacherAttendance 
            teacherId={userId} 
            onBack={handleBackToTeacherDashboard}
          />
        )}
        {currentTeacherTab === "assignments" && (
          <TeacherAssignments 
            teacherId={userId} 
            onBack={handleBackToTeacherDashboard}
          />
        )}
        {currentTeacherTab === "reports" && (
          <TeacherReports 
            teacherId={userId} 
            onBack={handleBackToTeacherDashboard}
          />
        )}
        {currentTeacherTab === "upload-lectures" && (
          <UploadLecturePage 
            teacherId={userId} 
            onBack={handleBackToTeacherDashboard}
          />
        )}
        {currentTeacherTab === "profile" && (
          <TeacherProfilePage teacherId={userId} onLogout={handleTeacherLogout} />
        )}
        <TeacherBottomNav 
          currentTab={currentTeacherTab === "upload-lectures" ? "home" : currentTeacherTab}
          onNavigate={handleTeacherTabChange}
          onBackToHome={handleBackToHome}
        />
      </>
    )
  }

  const renderAdminDashboard = () => {
    return (
      <>
        {currentAdminTab === "dashboard" && (
            <AdminDashboardPage 
            adminId={userId}
            onNavigate={(page) => {
              if (page === "students") handleAdminTabChange("students")
              else if (page === "teachers") handleAdminTabChange("teachers")
              else if (page === "attendance") handleAdminTabChange("attendance")
              else if (page === "tests") handleAdminTabChange("tests")
              else if (page === "fees") handleAdminTabChange("fees")
              else if (page === "profile") handleAdminTabChange("profile")
              else if (page === "manage-lectures") handleAdminTabChange("manage-lectures")
              else if (page === "manage-islamic-videos") handleAdminTabChange("manage-islamic-videos")
              else if (page === "credentials") handleAdminTabChange("credentials")
              else if (page === "add-teacher-info") handleAdminTabChange("add-teacher-info")
              else if (page === "view-all-teachers") handleAdminTabChange("view-all-teachers")
              else if (page === "admin-courses") handleNavigateToPage("admin-courses")
              else handleAdminTabChange("dashboard")
            }}
            onGoHome={() => handleNavigateToPage("home")}
          />
        )}
        {currentAdminTab === "students" && (
          <AdminStudentManagement 
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
        {currentAdminTab === "teachers" && (
          <AdminTeacherManagement 
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
        {currentAdminTab === "attendance" && (
          <AdminAttendanceOverview 
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
        {currentAdminTab === "tests" && (
          <AdminTestsManagement 
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
        {currentAdminTab === "fees" && (
          <AdminFeesManagement 
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
        {currentAdminTab === "manage-lectures" && (
          <ManageLecturesPage 
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
        {currentAdminTab === "manage-islamic-videos" && (
          <ManageIslamicVideosPage 
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
        {currentAdminTab === "credentials" && (
          <AdminCredentialsManagement 
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
        {currentAdminTab === "add-teacher-info" && (
          <AddTeacherInfoPage 
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
        {currentAdminTab === "view-all-teachers" && (
          <ViewAllTeachersPage 
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
        {currentAdminTab === "profile" && (
          <AdminProfilePage 
            adminId={userId} 
            onLogout={handleLogout}
            onBack={() => handleAdminTabChange("dashboard")}
          />
        )}
      </>
    )
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-background text-foreground">
        <Toaster position="top-center" richColors />

        <AnimatePresence mode="wait">
          {showOpening && !isOpeningComplete && (
            <OpeningAnimation onComplete={handleOpeningComplete} />
          )}
        </AnimatePresence>

        {isOpeningComplete && (
          <>
            {currentPage === "home" && (
              <HomePage
                onGoToLogin={() => handleNavigateToPage("login")}
                onGoToTeacherPortal={() => handleNavigateToPage("teacher-login")}
                onGoToAdminPortal={() => handleNavigateToPage("admin-login")}
                onGoToPayments={() => handleNavigateToPage("public-payments")}
                onGoToCourses={() => handleNavigateToPage("courses")}
                onGoToContact={() => handleNavigateToPage("contact")}
                onGoToIslamicVideos={() => handleNavigateToPage("islamic-videos")}
                onGoToCredentials={() => handleNavigateToPage("credentials")}
                onGoToTeachersInfo={() => handleNavigateToPage("teachers-info")}
              />
            )}

            {currentPage === "login" && (
              <LoginPage
                onLogin={() => handleNavigateToPage("dashboard")}
                onBackToHome={() => handleNavigateToPage("home")}
              />
            )}

            {currentPage === "dashboard" && renderStudentDashboard()}

            {currentPage === "teacher-login" && (
              <TeacherLoginPage
                onLogin={(teacherId: string) => {
                  setUserId(teacherId)
                  handleNavigateToPage("teacher-dashboard")
                }}
                onBackToHome={() => handleNavigateToPage("home")}
              />
            )}

            {currentPage === "teacher-dashboard" && renderTeacherDashboard()}

            {currentPage === "admin-login" && (
              <AdminLoginPage
                onLogin={(adminId: string) => {
                  setUserId(adminId)
                  handleNavigateToPage("admin-dashboard")
                }}
                onBackToHome={() => handleNavigateToPage("home")}
              />
            )}

            {currentPage === "admin-dashboard" && renderAdminDashboard()}

            {currentPage === "courses" && <CoursesPage onGoToContact={() => handleNavigateToPage("contact")} onBack={() => handleNavigateToPage("home")} />}

            {currentPage === "admin-courses" && <AdminCoursesPage onBack={() => handleNavigateToPage("admin-dashboard")} onContact={() => handleNavigateToPage("contact")} />}

            {currentPage === "contact" && <ContactPage />}

            {currentPage === "public-payments" && <PublicPaymentsPage />}

            {currentPage === "payments" && <Payments />}

            {currentPage === "islamic-videos" && (
              <IslamicVideosPage onBackToHome={() => handleNavigateToPage("home")} />
            )}

            {currentPage === "credentials" && (
              <CredentialsPage onBack={() => handleNavigateToPage("home")} />
            )}

            {currentPage === "teachers-info" && (
              <TeachersInfoPage onBack={() => handleNavigateToPage("home")} />
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}
