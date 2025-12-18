export interface UserCredentials {
  userId: string
  username: string
  passwordHash: string
  salt: string
  role: "admin" | "teacher" | "student"
  createdAt: string
  createdBy: string
}

export class PasswordHasher {
  static async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return { hash, salt }
  }

  static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return computedHash === hash
  }
}

export class CredentialsService {
  static async createCredentials(
    userId: string,
    username: string,
    password: string,
    role: "admin" | "teacher" | "student",
    createdBy: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const existing = await window.spark.kv.get<UserCredentials>(`credentials:${username}`)
      
      if (existing) {
        return {
          success: false,
          message: "Username already exists"
        }
      }

      const { hash, salt } = await PasswordHasher.hashPassword(password)

      const credentials: UserCredentials = {
        userId,
        username,
        passwordHash: hash,
        salt,
        role,
        createdAt: new Date().toISOString(),
        createdBy
      }

      await window.spark.kv.set(`credentials:${username}`, credentials)
      await window.spark.kv.set(`userId:${userId}`, username)

      return {
        success: true,
        message: "Credentials created successfully"
      }
    } catch (error) {
      console.error("Error creating credentials:", error)
      return {
        success: false,
        message: "Failed to create credentials"
      }
    }
  }

  static async verifyCredentials(
    username: string,
    password: string
  ): Promise<{ success: boolean; userId?: string; role?: string; message: string }> {
    try {
      const credentials = await window.spark.kv.get<UserCredentials>(`credentials:${username}`)

      if (!credentials) {
        return {
          success: false,
          message: "Invalid username or password"
        }
      }

      const isValid = await PasswordHasher.verifyPassword(
        password,
        credentials.passwordHash,
        credentials.salt
      )

      if (!isValid) {
        return {
          success: false,
          message: "Invalid username or password"
        }
      }

      return {
        success: true,
        userId: credentials.userId,
        role: credentials.role,
        message: "Login successful"
      }
    } catch (error) {
      console.error("Error verifying credentials:", error)
      return {
        success: false,
        message: "Failed to verify credentials"
      }
    }
  }

  static async updatePassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const credentials = await window.spark.kv.get<UserCredentials>(`credentials:${username}`)

      if (!credentials) {
        return {
          success: false,
          message: "User not found"
        }
      }

      const isValid = await PasswordHasher.verifyPassword(
        oldPassword,
        credentials.passwordHash,
        credentials.salt
      )

      if (!isValid) {
        return {
          success: false,
          message: "Incorrect current password"
        }
      }

      const { hash, salt } = await PasswordHasher.hashPassword(newPassword)
      credentials.passwordHash = hash
      credentials.salt = salt
      
      await window.spark.kv.set(`credentials:${username}`, credentials)

      return {
        success: true,
        message: "Password updated successfully"
      }
    } catch (error) {
      console.error("Error updating password:", error)
      return {
        success: false,
        message: "Failed to update password"
      }
    }
  }

  static async deleteCredentials(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const username = await window.spark.kv.get<string>(`userId:${userId}`)
      
      if (username) {
        await window.spark.kv.delete(`credentials:${username}`)
        await window.spark.kv.delete(`userId:${userId}`)
      }

      return {
        success: true,
        message: "Credentials deleted successfully"
      }
    } catch (error) {
      console.error("Error deleting credentials:", error)
      return {
        success: false,
        message: "Failed to delete credentials"
      }
    }
  }

  static async getUsernameByUserId(userId: string): Promise<string | null> {
    try {
      return await window.spark.kv.get<string>(`userId:${userId}`) || null
    } catch (error) {
      console.error("Error getting username:", error)
      return null
    }
  }
}
