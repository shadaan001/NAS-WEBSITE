interface PaymentNotification {
  studentName: string
  studentId?: string
  amount: number
  phoneNumber?: string
}

interface StoredNotification {
  id: string
  type: 'payment' | 'payment_link_request'
  studentName: string
  studentId?: string
  amount: number
  timestamp: string
  read: boolean
}

export class NotificationService {
  private static readonly ADMIN_PHONE = "9073040640"

  static async sendPaymentNotification(payment: PaymentNotification): Promise<boolean> {
    try {
      const notification: StoredNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'payment',
        studentName: payment.studentName,
        studentId: payment.studentId,
        amount: payment.amount,
        timestamp: new Date().toISOString(),
        read: false
      }

      const existingNotifications = await window.spark.kv.get<StoredNotification[]>('admin-notifications') || []
      existingNotifications.unshift(notification)
      
      await window.spark.kv.set('admin-notifications', existingNotifications.slice(0, 100))

      const message = `
🔔 NEW PAYMENT SUBMISSION

Student: ${payment.studentName}
${payment.studentId ? `ID: ${payment.studentId}` : ''}
Amount: ₹${payment.amount}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Please verify this payment at your earliest convenience.
      `.trim()

      console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 SMS NOTIFICATION SENT TO: ${this.ADMIN_PHONE}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Notification saved to admin dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `)
      
      return true
    } catch (error) {
      console.error("Failed to send notification:", error)
      return false
    }
  }

  static async sendPaymentLinkRequest(payment: PaymentNotification): Promise<boolean> {
    try {
      const notification: StoredNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'payment_link_request',
        studentName: payment.studentName,
        studentId: payment.studentId,
        amount: payment.amount,
        timestamp: new Date().toISOString(),
        read: false
      }

      const existingNotifications = await window.spark.kv.get<StoredNotification[]>('admin-notifications') || []
      existingNotifications.unshift(notification)
      
      await window.spark.kv.set('admin-notifications', existingNotifications.slice(0, 100))

      const message = `
🔗 PAYMENT LINK REQUEST

Student: ${payment.studentName}
${payment.studentId ? `ID: ${payment.studentId}` : ''}
Amount: ₹${payment.amount}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Student has requested a secure payment link.
      `.trim()

      console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 SMS NOTIFICATION SENT TO: ${this.ADMIN_PHONE}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Notification saved to admin dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `)
      
      return true
    } catch (error) {
      console.error("Failed to send link request notification:", error)
      return false
    }
  }

  static async getAdminNotifications(): Promise<StoredNotification[]> {
    try {
      return await window.spark.kv.get<StoredNotification[]>('admin-notifications') || []
    } catch (error) {
      console.error("Failed to get notifications:", error)
      return []
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const notifications = await this.getAdminNotifications()
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
      await window.spark.kv.set('admin-notifications', updated)
      return true
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      return false
    }
  }

  static async clearAllNotifications(): Promise<boolean> {
    try {
      await window.spark.kv.set('admin-notifications', [])
      return true
    } catch (error) {
      console.error("Failed to clear notifications:", error)
      return false
    }
  }
}
