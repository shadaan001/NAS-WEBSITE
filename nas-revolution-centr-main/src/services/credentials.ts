export interface UserCredentials {
  userId: string
  username: string
  // Support plain-text password for simple setups. Keep hash/salt optional for backward compatibility.
  password?: string
  passwordHash?: string
  salt?: string
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

import { supabase } from "@/lib/supabase"

export class CredentialsService {
  // Simple in-memory flag to avoid repeated KV attempts when KV returns unauthorized/fails.
  static kvAvailable: boolean = true

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

      // Store plain-text password as requested (simple mode). Keep hash path available if needed.
      const credentials: UserCredentials = {
        userId,
        username,
        password: password,
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
      // First try credentials stored in KV (existing flow)
      // Try exact key, then lowercase key to be more forgiving about casing
      let credentials: UserCredentials | undefined = undefined
      try {
        credentials = await window.spark.kv.get<UserCredentials>(`credentials:${username}`)
      } catch (kvErr) {
        // KV fetch may fail if the KV service requires auth (e.g., running outside platform).
        // Don't abort login on KV errors — fall back to Supabase instead. Disable further KV attempts to avoid noisy 401s.
        console.warn('KV lookup failed (will fallback to Supabase):', kvErr)
        CredentialsService.kvAvailable = false
        credentials = undefined
      }

      if (!credentials && username && username.toLowerCase() !== username) {
        try {
          if (CredentialsService.kvAvailable) {
            credentials = await window.spark.kv.get<UserCredentials>(`credentials:${username.toLowerCase()}`)
            if (credentials) console.debug(`Found KV credentials for lowercased username: ${username.toLowerCase()}`)
          }
        } catch (e) {
          console.debug('Error trying lowercase KV lookup', e)
          CredentialsService.kvAvailable = false
        }
      }

      if (credentials) {
        console.debug(`KV credentials found for ${username}`)
        // Prefer plain-text password check when available (simple mode)
        if (typeof credentials.password === 'string') {
          if (credentials.password === password) {
            return {
              success: true,
              userId: credentials.userId,
              role: credentials.role,
              message: "Login successful"
            }
          }
          // mismatch - try supabase fallback below
          console.warn(`KV credentials found for ${username} but plain-text password mismatch; attempting Supabase fallback.`)
        } else if (typeof credentials.passwordHash === 'string' && typeof credentials.salt === 'string') {
          // Backward-compatible: verify hashed password if both fields are present
          const isValid = await PasswordHasher.verifyPassword(
            password,
            credentials.passwordHash,
            credentials.salt
          )

          if (isValid) {
            return {
              success: true,
              userId: credentials.userId,
              role: credentials.role,
              message: "Login successful"
            }
          }

          console.warn(`KV credentials found for ${username} but hashed password mismatch; attempting Supabase fallback.`)
        } else {
          // No password info in KV - continue to Supabase fallback
          console.warn(`KV credentials found for ${username} but no password field present; attempting Supabase fallback.`)
        }
      }

      // If not found in KV, fall back to Supabase teachers table for simple username/password check
      try {
        const { data, error } = await supabase.from('teachers').select('*').ilike('email', username).limit(1)

        if (error) {
          console.error('Supabase lookup error for teacher login:', error)
        }

        const teacher = Array.isArray(data) && data.length > 0 ? data[0] : null
        if (!teacher) {
          console.debug('Supabase: no teacher row found for', username)
          return {
            success: false,
            message: 'Invalid username or password'
          }
        }

        // Expect plain-text password field on teachers table named 'password' (per simple requirement)
        // Compare trimmed values to avoid accidental whitespace mismatch
        const teacherPassword = typeof teacher.password === 'string' ? teacher.password.trim() : null
        if (teacherPassword && teacherPassword === password.trim()) {
          // Sync this Supabase-based teacher into KV credentials so future logins hit KV path
          try {
            if (CredentialsService.kvAvailable) {
              const kvCreds: UserCredentials = {
                userId: teacher.id?.toString ? teacher.id.toString() : String(teacher.id),
                username,
                password: teacherPassword,
                role: 'teacher',
                createdAt: new Date().toISOString(),
                createdBy: 'supabase-sync'
              }

              await window.spark.kv.set(`credentials:${username}`, kvCreds)
              await window.spark.kv.set(`userId:${kvCreds.userId}`, username)
              console.debug('Synced Supabase teacher into KV credentials for', username)
            }
          } catch (kvSyncErr) {
            console.warn('Failed to sync Supabase teacher into KV credentials:', kvSyncErr)
            CredentialsService.kvAvailable = false
          }

          return {
            success: true,
            userId: teacher.id?.toString ? teacher.id.toString() : String(teacher.id),
            role: 'teacher',
            message: 'Login successful'
          }
        }

        console.debug('Supabase: password mismatch for', username, { provided: password ? '<provided>' : '<empty>', storedExists: !!teacher.password })

        return {
          success: false,
          message: 'Invalid username or password'
        }
      } catch (supErr) {
        console.error('Error during fallback supabase teacher auth:', supErr)
        return {
          success: false,
          message: 'Failed to verify credentials'
        }
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

      // Support both simple plain-text credentials and legacy hashed credentials.
      // 1) If a plain-text password exists, verify directly and update plain-text (simple mode).
      if (typeof credentials.password === 'string') {
        if (credentials.password !== oldPassword) {
          return {
            success: false,
            message: "Incorrect current password"
          }
        }

        // Update plain-text password (keep simple behavior as requested)
        credentials.password = newPassword
        await window.spark.kv.set(`credentials:${username}`, credentials)

        return {
          success: true,
          message: "Password updated successfully"
        }
      }

      // 2) Backward-compatibility: if hashed fields are present, verify using the hasher
      //    Only call the hasher when both fields are defined and of type string.
      if (typeof credentials.passwordHash === 'string' && typeof credentials.salt === 'string') {
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
      }

      // No password information available on the record
      return {
        success: false,
        message: "No password set for user"
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
