import { supabase } from "./supabase"

const ADMIN_EMAIL = "nasrevolutioncentre@gmail.com"

export const OTPService = {
  OTP_EXPIRY_MINUTES: 5,

  isAdminCredential(email: string) {
    return email === ADMIN_EMAIL
  },

  async sendOTP(email: string) {
    if (email !== ADMIN_EMAIL) {
      throw new Error("Unauthorized admin email")
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    })

    if (error) throw error
    return { success: true }
  },

  async verifyOTP(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, session: data.session }
  },
}

export const AuthHelper = {
  createSession(role: "admin", userId: string, meta: any) {
    const session = {
      role,
      userId,
      meta,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("admin_session", JSON.stringify(session))
    return session
  },

  getSession() {
    const raw = localStorage.getItem("admin_session")
    return raw ? JSON.parse(raw) : null
  },

  logout() {
    localStorage.removeItem("admin_session")
    supabase.auth.signOut()
  },
}
