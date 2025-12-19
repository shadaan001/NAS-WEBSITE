const AUTH_KEYS = {
  SESSION: "smart-school-session",
  USER_DATA: "smart-school-user-data",
  SESSION_EXPIRY: "smart-school-session-expiry",
}

const SESSION_TIMEOUT_HOURS = 24
const ADMIN_EMAIL = "nasrevolutioncentre@gmail.com"

export const AuthHelper = {
  createSession(role, userId, userData = {}) {
    const session = {
      role,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_TIMEOUT_HOURS * 60 * 60 * 1000).toISOString(),
    }
    
    localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session))
    localStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData))
    
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

  isAdminAuthenticated() {
    const session = this.getSession()
    if (!session) return false
    if (session.role !== "admin") return false
    
    const userData = this.getUserData()
    if (!userData || userData.verifiedContact?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return false
    }
    
    return true
  },
}

export const PermissionService = {
  checkTeacherPermission(teacherId) {
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
    const isAdmin = AuthHelper.isAdminAuthenticated()
    
    if (!isAdmin) {
      return {
        hasAccess: false,
        reason: "Unauthorized email. Admin access only.",
      }
    }
    
    return {
      hasAccess: true,
    }
  },
}
