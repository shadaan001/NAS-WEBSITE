// TODO: Replace with JWT/token-based session validation
// TODO: Add server-side route protection
// TODO: Implement role hierarchy and granular permissions

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ShieldWarning, ArrowLeft } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AuthHelper } from "@/lib/useAuth"

export default function ProtectedRoute({ 
  component: Component, 
  allowedRoles = [], 
  onUnauthorized,
  ...props 
}) {
  const [isAuthorized, setIsAuthorized] = useState(null)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    checkAuthorization()
  }, [allowedRoles])

  const checkAuthorization = () => {
    const session = AuthHelper.getSession()
    
    if (!session) {
      setIsAuthorized(false)
      setUserRole(null)
      return
    }

    setUserRole(session.role)

    if (allowedRoles.length === 0) {
      setIsAuthorized(true)
      return
    }

    const hasAccess = AuthHelper.hasRole(allowedRoles)
    
    // QA: Verify role-based access control is working
    if (!hasAccess) {
      console.warn(`Access denied: User role "${session.role}" not in allowed roles [${allowedRoles.join(", ")}]`)
    }
    
    setIsAuthorized(hasAccess)
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-background via-destructive/5 to-background">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-destructive/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-destructive/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="p-8 rounded-3xl card-shadow-lg border-2 border-destructive/20 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6"
            >
              <ShieldWarning size={40} weight="fill" className="text-destructive" />
            </motion.div>

            <h2 className="text-2xl font-bold text-heading mb-3">Access Denied</h2>
            
            <p className="text-muted-foreground mb-6">
              {!AuthHelper.isAuthenticated() 
                ? "You need to log in to access this page."
                : `This page requires ${allowedRoles.join(" or ")} access. Your current role (${userRole}) does not have permission.`
              }
            </p>

            <div className="p-4 rounded-xl bg-muted/30 border border-border mb-6">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Required Role:</span>{" "}
                {allowedRoles.length > 0 ? allowedRoles.join(", ") : "Any authenticated user"}
              </p>
              {userRole && (
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-semibold">Your Role:</span> {userRole}
                </p>
              )}
            </div>

            {onUnauthorized ? (
              <Button 
                onClick={onUnauthorized}
                className="w-full h-12 rounded-xl gap-2"
              >
                <ArrowLeft size={20} />
                Go Back
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  AuthHelper.clearSession()
                  window.location.reload()
                }}
                className="w-full h-12 rounded-xl gap-2"
              >
                <ArrowLeft size={20} />
                Back to Login
              </Button>
            )}
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-center text-muted-foreground mt-6"
          >
            If you believe this is an error, contact your administrator
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return <Component {...props} />
}

// Usage examples:
// <ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />
// <ProtectedRoute component={TeacherDashboard} allowedRoles={["teacher", "admin"]} />
// <ProtectedRoute component={StudentDashboard} allowedRoles={["student"]} />

// QA: Verify unauthorized users are blocked from protected routes
// QA: Verify correct error message shows for each scenario
// QA: Verify session check happens on every route change
// QA: Verify role changes update accessible routes immediately
