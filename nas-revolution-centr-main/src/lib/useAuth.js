// TODO: Replace localStorage sessions with backend JWT or session management
// TODO: Integrate server-side session validation and token refresh
// This is a demo authentication helper using localStorage only

const AUTH_KEYS = {
  SESSION: "smart-school-session",
  USER_DATA: "smart-school-user-data",
  SESSION_EXPIRY: "smart-school-session-expiry",
}

const SESSION_TIMEOUT_HOURS = 24

export const AuthHelper = {
  createSession(role, userId, userData = {}) {
    // TODO: Replace with backend session/JWT token creation
    const session = {
      role,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_TIMEOUT_HOURS * 60 * 60 * 1000).toISOString(),
    }
    
    localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session))
    localStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData))
    
    // QA: Verify session was created correctly
    const verified = this.getSession()
    if (!verified) {
      console.error("QA FAIL: Session creation failed")
    }
    
    return session
  },

  getSession() {
    try {
      const sessionStr = localStorage.getItem(AUTH_KEYS.SESSION)
      if (!sessionStr) return null
      
      const session = JSON.parse(sessionStr)
      
      // TODO: Add server-side session timeout validation
      const now = new Date()
      const expiresAt = new Date(session.expiresAt)
      
      if (now > expiresAt) {
        this.clearSession()
        return null
      }
      
      return session
    } catch (error) {
      console.error("Error reading session:", error)
      return null
    }
  },

  getUserData() {
    try {
      const dataStr = localStorage.getItem(AUTH_KEYS.USER_DATA)
      return dataStr ? JSON.parse(dataStr) : null
    } catch (error) {
      console.error("Error reading user data:", error)
      return null
    }
  },

  clearSession() {
    localStorage.removeItem(AUTH_KEYS.SESSION)
    localStorage.removeItem(AUTH_KEYS.USER_DATA)
    
    // QA: Verify session was cleared
    const session = this.getSession()
    if (session) {
      console.error("QA FAIL: Session should be cleared but still exists")
    }
  },

  isAuthenticated() {
    const session = this.getSession()
    return session !== null
  },

  getUserRole() {
    const session = this.getSession()
    return session ? session.role : null
  },

  hasRole(requiredRoles) {
    // TODO: Add server-side role verification
    const userRole = this.getUserRole()
    if (!userRole) return false
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole)
    }
    
    return userRole === requiredRoles
  },

  updateUserData(updates) {
    const current = this.getUserData() || {}
    const updated = { ...current, ...updates }
    localStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(updated))
  },
}

export const OTPService = {
  ADMIN_MOBILE: "9073040640",
  ADMIN_EMAIL: "shadaan001@gmail.com",
  OTP_EXPIRY_MINUTES: 5,

  generateOTP() {
    // TODO: Replace with real OTP service (Twilio/MSG91)
    // Generate 6-digit OTP for demo
    return Math.floor(100000 + Math.random() * 900000).toString()
  },

  async sendOTP(mobileOrEmail, otpType = "login") {
    // TODO: Integrate real SMS/Email API for OTP delivery
    // For now, generate and store in localStorage for demo
    const otp = this.generateOTP()
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000).toISOString()
    
    const otpData = {
      otp,
      recipient: mobileOrEmail,
      type: otpType,
      expiresAt,
      createdAt: new Date().toISOString(),
    }
    
    // Store OTP temporarily (demo only)
    localStorage.setItem(`otp-${mobileOrEmail}`, JSON.stringify(otpData))
    
    // QA: Verify OTP was stored
    const stored = localStorage.getItem(`otp-${mobileOrEmail}`)
    if (!stored) {
      console.error("QA FAIL: OTP not stored correctly")
      throw new Error("Failed to generate OTP")
    }
    
    return {
      success: true,
      message: `OTP sent to ${mobileOrEmail}`,
      otp,
      expiresIn: this.OTP_EXPIRY_MINUTES,
    }
  },

  verifyOTP(mobileOrEmail, inputOTP) {
    // TODO: Replace with backend OTP verification
    try {
      const otpDataStr = localStorage.getItem(`otp-${mobileOrEmail}`)
      if (!otpDataStr) {
        return {
          success: false,
          message: "No OTP found. Please request a new one.",
        }
      }
      
      const otpData = JSON.parse(otpDataStr)
      const now = new Date()
      const expiresAt = new Date(otpData.expiresAt)
      
      if (now > expiresAt) {
        localStorage.removeItem(`otp-${mobileOrEmail}`)
        return {
          success: false,
          message: "OTP expired. Please request a new one.",
        }
      }
      
      if (otpData.otp !== inputOTP) {
        return {
          success: false,
          message: "Invalid OTP. Please try again.",
        }
      }
      
      localStorage.removeItem(`otp-${mobileOrEmail}`)
      
      return {
        success: true,
        message: "OTP verified successfully",
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      return {
        success: false,
        message: "Error verifying OTP",
      }
    }
  },

  isAdminCredential(mobileOrEmail) {
    // TODO: Move admin credential validation to backend
    return (
      mobileOrEmail === this.ADMIN_MOBILE ||
      mobileOrEmail.toLowerCase() === this.ADMIN_EMAIL.toLowerCase()
    )
  },
}

export const PermissionService = {
  checkTeacherPermission(teacherId) {
    // TODO: Replace with backend API endpoint /api/teachers/:id/permissions
    try {
      const teachersStr = localStorage.getItem("admin-teachers-records")
      if (!teachersStr) return { hasPermission: false, reason: "No teachers found" }
      
      const teachers = JSON.parse(teachersStr)
      const teacher = teachers.find(t => t.id === teacherId || t.employeeId === teacherId)
      
      if (!teacher) {
        return {
          hasPermission: false,
          reason: "Teacher not found",
        }
      }
      
      if (!teacher.approved) {
        return {
          hasPermission: false,
          reason: "Contact Admin for access approval",
        }
      }
      
      return {
        hasPermission: true,
        teacher,
      }
    } catch (error) {
      console.error("Error checking teacher permission:", error)
      return {
        hasPermission: false,
        reason: "Error checking permissions",
      }
    }
  },

  checkStudentAccess(studentId, requestedStudentId) {
    // TODO: Add backend verification for student data access
    // Students can only access their own data
    if (studentId !== requestedStudentId) {
      return {
        hasAccess: false,
        reason: "You can only access your own data",
      }
    }
    
    return {
      hasAccess: true,
    }
  },

  checkAdminAccess() {
    // TODO: Add multi-level admin roles (super admin, admin, etc.)
    const session = AuthHelper.getSession()
    
    if (!session || session.role !== "admin") {
      return {
        hasAccess: false,
        reason: "Admin access required",
      }
    }
    
    return {
      hasAccess: true,
    }
  },
}

// QA: After implementing authentication, verify:
// 1. Sessions expire correctly after timeout
// 2. Role-based access prevents unauthorized routes
// 3. OTP expires and cannot be reused
// 4. Teacher login blocked if admin hasn't granted permission
// 5. Students can only access their own data
// 6. Logging out clears all session data
