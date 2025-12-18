import type { PaymentDetails } from "@/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: {
    color?: string
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export const paymentService = {
  createOrder: async (paymentDetails: PaymentDetails): Promise<{ orderId: string; amount: number }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDetails)
      })
      
      if (!response.ok) throw new Error("Failed to create payment order")
      return await response.json()
    } catch (error) {
      console.error("Error creating payment order:", error)
      throw error
    }
  },

  verifyPayment: async (
    orderId: string, 
    paymentId: string, 
    signature: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentId, signature })
      })
      
      if (!response.ok) throw new Error("Failed to verify payment")
      return await response.json()
    } catch (error) {
      console.error("Error verifying payment:", error)
      throw error
    }
  },

  initiateRazorpay: async (
    paymentDetails: PaymentDetails,
    userDetails: { name: string; email: string; phone: string }
  ): Promise<void> => {
    try {
      const { orderId, amount } = await paymentService.createOrder(paymentDetails)

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
        amount: amount * 100,
        currency: paymentDetails.currency,
        name: "NAS REVOLUTION CENTRE",
        description: "Course Enrollment Fee",
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          const verification = await paymentService.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          )
          
          if (verification.success) {
            console.log("Payment successful!")
          } else {
            console.error("Payment verification failed")
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone
        },
        theme: {
          color: "#6B9FFF"
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Error initiating Razorpay:", error)
      throw error
    }
  }
}
