import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number (10 digits starting with 6-9)"),
  message: z.string().min(10, "Message must be at least 10 characters")
})

export const studentRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], { errorMap: () => ({ message: "Please select a gender" }) }),
  address: z.string().min(10, "Address must be at least 10 characters"),
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  parentPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
})

export const otpSchema = z.object({
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only digits")
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type StudentRegistrationData = z.infer<typeof studentRegistrationSchema>
export type OTPData = z.infer<typeof otpSchema>
