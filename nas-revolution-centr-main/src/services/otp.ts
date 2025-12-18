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

const ADMIN_CONTACTS = {
  phones: ["9073040640", "9903847541"],
  email: "shadaan001@gmail.com"
}

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
        message: "Failed to send OTP"
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
          message: `Invalid OTP. ${MAX_ATTEMPTS - otpData.attempts} attempts remaining.`
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

  static async sendAdminOTP(): Promise<{ success: boolean; message: string; otps?: { phone1: string; phone2: string; email: string } }> {
    try {
      const otp1Response = await this.sendOTP(ADMIN_CONTACTS.phones[0])
      const otp2Response = await this.sendOTP(ADMIN_CONTACTS.phones[1])
      const emailResponse = await this.sendOTP(ADMIN_CONTACTS.email)

      if (otp1Response.success && otp2Response.success && emailResponse.success) {
        return {
          success: true,
          message: "OTP sent to all registered contacts",
          otps: {
            phone1: otp1Response.otp!,
            phone2: otp2Response.otp!,
            email: emailResponse.otp!
          }
        }
      }

      return {
        success: false,
        message: "Failed to send OTP to some contacts"
      }
    } catch (error) {
      console.error("Error sending admin OTP:", error)
      return {
        success: false,
        message: "Failed to send OTP"
      }
    }
  }

  static isAdminContact(identifier: string): boolean {
    return (
      ADMIN_CONTACTS.phones.includes(identifier) ||
      identifier.toLowerCase() === ADMIN_CONTACTS.email.toLowerCase()
    )
  }

  static getAdminContacts() {
    return ADMIN_CONTACTS
  }
}
