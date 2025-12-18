# 🔐 Authentication & Role-Based Access Control

## Overview

The Smart School Manager implements a comprehensive authentication system with role-based access control for three user types:

1. **Students** - OTP-based authentication
2. **Teachers** - Email/Password authentication (requires admin approval)
3. **Admins** - OTP-based authentication (restricted credentials)

## Authentication Methods

### Student Login (OTP-based)
- **File**: `src/pages/Auth/OTPLogin.jsx`
- **Method**: Mobile number + 6-digit OTP
- **Fallback**: Name + Mobile number (for offline/demo mode)
- **Features**:
  - OTP expires in 5 minutes
  - Demo modal shows OTP for testing
  - Warning about OTP security
  - Resend OTP functionality

**Usage:**
```javascript
import OTPLogin from '@/pages/Auth/OTPLogin'

<OTPLogin 
  onLogin={() => handleStudentLogin()} 
  onBackToHome={() => handleBack()} 
/>
```

### Admin Login (OTP-based)
- **File**: `src/pages/Auth/AdminLogin.jsx`
- **Method**: Email or Mobile + OTP
- **Restricted to**:
  - Mobile: `9073040640`
  - Email: `shadaan001@gmail.com`
- **Security**: Only registered admin credentials can receive OTP

**Usage:**
```javascript
import AdminLogin from '@/pages/Auth/AdminLogin'

<AdminLogin 
  onLogin={(adminId) => handleAdminLogin(adminId)} 
  onBackToHome={() => handleBack()} 
/>
```

### Teacher Login (Email/Password)
- **File**: `src/pages/Auth/TeacherLogin.jsx`
- **Method**: Email + Password
- **Requirements**:
  - Teacher must be approved by admin
  - Teacher must have active status
- **Access Denied**: Shows "Contact Admin for access" if not approved

**Usage:**
```javascript
import TeacherLogin from '@/pages/Auth/TeacherLogin'

<TeacherLogin 
  onLogin={(teacherId) => handleTeacherLogin(teacherId)} 
  onBackToHome={() => handleBack()} 
/>
```

## Session Management

### Authentication Helper (`src/lib/useAuth.js`)

**Create Session:**
```javascript
import { AuthHelper } from '@/lib/useAuth'

AuthHelper.createSession("student", userId, {
  name: "John Doe",
  mobile: "9876543210",
  loginMethod: "otp"
})
```

**Check Authentication:**
```javascript
const isAuth = AuthHelper.isAuthenticated()
const role = AuthHelper.getUserRole()
const hasAccess = AuthHelper.hasRole(["admin", "teacher"])
```

**Clear Session:**
```javascript
AuthHelper.clearSession()
```

### OTP Service

**Send OTP:**
```javascript
import { OTPService } from '@/lib/useAuth'

const result = await OTPService.sendOTP("9876543210", "student-login")
// Returns: { success: true, otp: "123456", expiresIn: 5 }
```

**Verify OTP:**
```javascript
const result = OTPService.verifyOTP("9876543210", "123456")
// Returns: { success: true/false, message: "..." }
```

## Role-Based Access Control

### Protected Routes

Use the `ProtectedRoute` component to restrict access based on user roles:

```javascript
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminDashboard from '@/pages/Admin/Dashboard'

<ProtectedRoute 
  component={AdminDashboard} 
  allowedRoles={["admin"]}
  onUnauthorized={() => redirectToHome()}
/>
```

**Examples:**
```javascript
// Admin only
<ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />

// Teacher and Admin
<ProtectedRoute component={TeacherDashboard} allowedRoles={["teacher", "admin"]} />

// Student only
<ProtectedRoute component={StudentDashboard} allowedRoles={["student"]} />

// Any authenticated user
<ProtectedRoute component={ProfilePage} allowedRoles={[]} />
```

## Permission Management

### Teacher Access Control

**Grant Access:**
```javascript
import { LocalDB } from '@/lib/useLocalDB'

const result = LocalDB.grantTeacherAccess(teacherId)
// Teacher can now log in
```

**Revoke Access:**
```javascript
const result = LocalDB.revokeTeacherAccess(teacherId)
// Teacher login blocked
```

**Check Access:**
```javascript
const { hasAccess, reason, teacher } = LocalDB.checkTeacherAccess(teacherId)
```

**Bulk Grant:**
```javascript
const result = LocalDB.bulkGrantTeacherAccess([teacherId1, teacherId2])
// Returns: { success: 2, failed: 0, errors: [] }
```

### Student Data Access Validation

```javascript
const { canAccess, reason } = LocalDB.validateStudentDataAccess(
  requestingStudentId,
  targetStudentId
)
// Students can only access their own data
```

## Security Features

1. **Session Timeout**: 24 hours (configurable)
2. **OTP Expiry**: 5 minutes
3. **Role Verification**: Every protected route checks session role
4. **Admin Credential Restriction**: OTP only sent to registered admin
5. **Teacher Approval**: Admin must explicitly grant access
6. **Student Data Isolation**: Students can only access their own data

## Demo Credentials

### Student Login
- Any 10-digit mobile number
- OTP shown in demo modal (6 digits)
- Fallback: Any name + mobile

### Admin Login
- Email: `shadaan001@gmail.com`
- Mobile: `9073040640`
- OTP shown in demo modal

### Teacher Login
- Any email (e.g., `teacher@school.com`)
- Any password
- **Must be approved by admin first**

## TODO: Production Implementation

### Required Changes for Production:

1. **Replace localStorage with Backend Sessions**
   ```
   // TODO: Implement JWT or session-based authentication
   // Files: src/lib/useAuth.js
   ```

2. **Integrate Real OTP Service**
   ```
   // TODO: Replace demo OTP with Twilio/MSG91/AWS SNS
   // Files: src/lib/useAuth.js, src/pages/Auth/OTPLogin.jsx, src/pages/Auth/AdminLogin.jsx
   ```

3. **Add Server-Side Validation**
   ```
   // TODO: Enforce role permissions on backend
   // Files: All protected routes and data access points
   ```

4. **Implement Password Hashing**
   ```
   // TODO: Use bcrypt or similar for teacher password storage
   // Files: src/pages/Auth/TeacherLogin.jsx
   ```

5. **Add Rate Limiting**
   ```
   // TODO: Prevent OTP spam and brute force attempts
   ```

6. **Implement Session Invalidation**
   ```
   // TODO: Add logout across all devices
   // TODO: Implement session refresh tokens
   ```

7. **Add Multi-Factor Authentication (MFA)**
   ```
   // TODO: Additional security layer for admin accounts
   ```

## QA Checklist

- [ ] Student login via OTP works correctly
- [ ] Fallback login creates valid session
- [ ] Admin login only works for registered credentials
- [ ] Teacher login denied if not approved by admin
- [ ] Protected routes block unauthorized access
- [ ] Logging out clears all session data
- [ ] Sessions expire after timeout
- [ ] OTP expires after 5 minutes
- [ ] OTP cannot be reused
- [ ] Students can only access their own data
- [ ] Changing role updates accessible pages immediately
- [ ] Session persists after page refresh

## File Structure

```
src/
├── pages/
│   └── Auth/
│       ├── OTPLogin.jsx          # Student OTP login
│       ├── AdminLogin.jsx        # Admin OTP login
│       ├── TeacherLogin.jsx      # Teacher email/password login
│       └── StudentLogin.jsx      # Wrapper for OTPLogin
├── components/
│   └── ProtectedRoute.jsx        # Role-based route protection
└── lib/
    ├── useAuth.js                # Authentication helpers
    └── useLocalDB.ts             # Role permission helpers (extended)
```

## Support & Troubleshooting

**Teacher Can't Login:**
- Ensure admin has approved the teacher via Admin Dashboard
- Check teacher status is "Active"

**OTP Not Received:**
- In demo mode, OTP is shown in modal
- Check browser console for errors
- Verify mobile number is 10 digits

**Session Lost After Refresh:**
- Check browser localStorage is enabled
- Verify session hasn't expired (24 hours)

**Access Denied on Protected Route:**
- Verify user is logged in
- Check user role matches allowed roles
- Clear session and login again

## Integration Example

Here's how to integrate the authentication system into your app routing:

```javascript
import { useState, useEffect } from "react"
import { AuthHelper } from "@/lib/useAuth"
import ProtectedRoute from "@/components/ProtectedRoute"
import OTPLogin from "@/pages/Auth/OTPLogin"
import AdminLogin from "@/pages/Auth/AdminLogin"
import TeacherLogin from "@/pages/Auth/TeacherLogin"
import StudentDashboard from "@/pages/StudentDashboard"
import TeacherDashboard from "@/pages/TeacherDashboard"
import AdminDashboard from "@/pages/AdminDashboard"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  
  useEffect(() => {
    const session = AuthHelper.getSession()
    if (session) {
      setIsAuthenticated(true)
      setUserRole(session.role)
    }
  }, [])
  
  const handleLogin = (role) => {
    setIsAuthenticated(true)
    setUserRole(role)
  }
  
  const handleLogout = () => {
    AuthHelper.clearSession()
    setIsAuthenticated(false)
    setUserRole(null)
  }
  
  if (!isAuthenticated) {
    // Show appropriate login based on route
    if (userRole === "admin") {
      return <AdminLogin onLogin={() => handleLogin("admin")} />
    } else if (userRole === "teacher") {
      return <TeacherLogin onLogin={() => handleLogin("teacher")} />
    }
    return <OTPLogin onLogin={() => handleLogin("student")} />
  }
  
  return (
    <div>
      {userRole === "student" && (
        <ProtectedRoute 
          component={StudentDashboard} 
          allowedRoles={["student"]}
          onUnauthorized={handleLogout}
        />
      )}
      
      {userRole === "teacher" && (
        <ProtectedRoute 
          component={TeacherDashboard} 
          allowedRoles={["teacher"]}
          onUnauthorized={handleLogout}
        />
      )}
      
      {userRole === "admin" && (
        <ProtectedRoute 
          component={AdminDashboard} 
          allowedRoles={["admin"]}
          onUnauthorized={handleLogout}
        />
      )}
    </div>
  )
}
```

---

**Last Updated:** Part 14 - Authentication & Role-Based Access Control
**Status:** Demo-ready with TODO markers for production implementation
