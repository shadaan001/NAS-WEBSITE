export interface OTPData {
  otp: string
  createdAt: number
  expiresAt: number
  attempts: number
}

export interface OTPResponse {
  success: boolean
  message: string
  otp?: string
  expiresIn?: number
}

export interface VerifyOTPResponse {
  success: boolean
  message: string
}

const ADMIN_EMAIL = "nasrevolutioncentre@gmail.com"

const OTP_EXPIRY_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 3

export class OTPService {
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  static async sendOTP(identifier: string): Promise<OTPResponse> {
    try {
      const otp = this.generateOTP()
      const now = Date.now()
      
      const otpData: OTPData = {
        otp,
        createdAt: now,
        expiresAt: now + OTP_EXPIRY_MS,
        attempts: 0
      }

      await window.spark.kv.set(`otp:${identifier}`, otpData)

      return {
        success: true,
        message: `OTP sent successfully`,
        otp: otp,
        expiresIn: 5
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      return {
        success: false,
        message: "Failed to send OTP. Please try again."
      }
    }
  }

  static async verifyOTP(identifier: string, inputOTP: string): Promise<VerifyOTPResponse> {
    try {
      const otpData = await window.spark.kv.get<OTPData>(`otp:${identifier}`)

      if (!otpData) {
        return {
          success: false,
          message: "No OTP found. Please request a new one."
        }
      }

      const now = Date.now()

      if (now > otpData.expiresAt) {
        await window.spark.kv.delete(`otp:${identifier}`)
        return {
          success: false,
          message: "OTP expired. Please request a new one."
        }
      }

      if (otpData.attempts >= MAX_ATTEMPTS) {
        await window.spark.kv.delete(`otp:${identifier}`)
        return {
          success: false,
          message: "Maximum attempts exceeded. Please request a new OTP."
        }
      }

      if (otpData.otp !== inputOTP) {
        otpData.attempts++
        await window.spark.kv.set(`otp:${identifier}`, otpData)
        
        return {
          success: false,
          message: "Invalid OTP. Access denied."
        }
      }

      await window.spark.kv.delete(`otp:${identifier}`)

      return {
        success: true,
        message: "OTP verified successfully"
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      return {
        success: false,
        message: "Error verifying OTP"
      }
    }
  }

  static async sendAdminEmailOTP(): Promise<{ success: boolean; message: string; otp?: string }> {
    try {
      const emailResponse = await this.sendOTP(ADMIN_EMAIL)

      if (emailResponse.success) {
        return {
          success: true,
          message: "OTP sent to admin email",
          otp: emailResponse.otp
        }
      }

      return {
        success: false,
        message: "Failed to send OTP. Please try again."
      }
    } catch (error) {
      console.error("Error sending admin OTP:", error)
      return {
        success: false,
        message: "Failed to send OTP. Please try again."
      }
    }
  }

  static isAuthorizedAdminEmail(email: string): boolean {
    return email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  }

  static getAdminEmail(): string {
    return ADMIN_EMAIL
  }
}
