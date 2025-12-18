# 🚀 INTEGRATION GUIDE - NAS REVOLUTION CENTRE

This guide provides step-by-step instructions for integrating backend services, authentication, payments, and database with the NAS REVOLUTION CENTRE frontend.

---

## 📋 Table of Contents

1. [Backend API Setup](#1-backend-api-setup)
2. [Database Integration](#2-database-integration)
3. [SMS OTP Authentication](#3-sms-otp-authentication)
4. [Payment Gateway Integration](#4-payment-gateway-integration)
5. [Environment Variables](#5-environment-variables)
6. [Testing Checklist](#6-testing-checklist)

---

## 1. Backend API Setup

### Step 1: Create Backend Server

**Recommended Stack:** Node.js + Express + TypeScript

```bash
# Create backend folder
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors dotenv mongoose
npm install -D typescript @types/express @types/node @types/cors ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

### Step 2: Backend Structure

```
/backend
├── /src
│   ├── /controllers
│   │   ├── courseController.ts
│   │   ├── studentController.ts
│   │   ├── contactController.ts
│   │   ├── otpController.ts
│   │   └── paymentController.ts
│   ├── /models
│   │   ├── Course.ts
│   │   ├── Student.ts
│   │   ├── Enrollment.ts
│   │   └── Contact.ts
│   ├── /routes
│   │   ├── courseRoutes.ts
│   │   ├── studentRoutes.ts
│   │   ├── contactRoutes.ts
│   │   ├── otpRoutes.ts
│   │   └── paymentRoutes.ts
│   ├── /middleware
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── /services
│   │   ├── smsService.ts
│   │   └── paymentService.ts
│   ├── /config
│   │   └── database.ts
│   └── server.ts
├── .env
└── package.json
```

### Step 3: Basic Express Server

**File: `/backend/src/server.ts`**

```typescript
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/database"
import courseRoutes from "./routes/courseRoutes"
import studentRoutes from "./routes/studentRoutes"
import contactRoutes from "./routes/contactRoutes"
import otpRoutes from "./routes/otpRoutes"
import paymentRoutes from "./routes/paymentRoutes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))
app.use(express.json())

// Database connection
connectDB()

// Routes
app.use("/api/courses", courseRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/otp", otpRoutes)
app.use("/api/payment", paymentRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
```

### Step 4: Update Frontend API Service

The API service is already created at `/src/services/api.ts`. Simply ensure your backend matches the expected endpoints.

**Frontend calls:**
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/contact` - Submit contact form
- `POST /api/students/register` - Register new student
- `POST /api/enrollments` - Create enrollment

---

## 2. Database Integration

### MongoDB Setup (Recommended)

### Step 1: Install MongoDB

```bash
# Install MongoDB locally or use MongoDB Atlas (cloud)
# Atlas: https://www.mongodb.com/cloud/atlas
```

### Step 2: Database Configuration

**File: `/backend/src/config/database.ts`**

```typescript
import mongoose from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nas_revolution")
    console.log("✅ MongoDB connected successfully")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

export default connectDB
```

### Step 3: Create Mongoose Models

**File: `/backend/src/models/Course.ts`**

```typescript
import mongoose, { Schema, Document } from "mongoose"

export interface ICourse extends Document {
  title: string
  description: string
  duration: string
  batchSize: number
  fee: number
  features: string[]
  startDate: Date
  category: "JEE" | "NEET" | "Foundation" | "Board" | "Other"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  batchSize: { type: Number, required: true },
  fee: { type: Number, required: true },
  features: [{ type: String }],
  startDate: { type: Date, required: true },
  category: { 
    type: String, 
    enum: ["JEE", "NEET", "Foundation", "Board", "Other"],
    required: true 
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
})

export default mongoose.model<ICourse>("Course", CourseSchema)
```

**File: `/backend/src/models/Student.ts`**

```typescript
import mongoose, { Schema, Document } from "mongoose"

export interface IStudent extends Document {
  name: string
  email: string
  phone: string
  dateOfBirth?: Date
  gender?: "male" | "female" | "other"
  address?: string
  parentName?: string
  parentPhone?: string
  enrolledCourses: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  address: { type: String },
  parentName: { type: String },
  parentPhone: { type: String },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
}, {
  timestamps: true
})

export default mongoose.model<IStudent>("Student", StudentSchema)
```

**File: `/backend/src/models/Enrollment.ts`**

```typescript
import mongoose, { Schema, Document } from "mongoose"

export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  paymentStatus: "pending" | "completed" | "failed"
  paymentId?: string
  amount: number
  enrollmentDate: Date
  startDate: Date
  createdAt: Date
  updatedAt: Date
}

const EnrollmentSchema = new Schema<IEnrollment>({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  paymentId: { type: String },
  amount: { type: Number, required: true },
  enrollmentDate: { type: Date, default: Date.now },
  startDate: { type: Date, required: true }
}, {
  timestamps: true
})

export default mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema)
```

**File: `/backend/src/models/Contact.ts`**

```typescript
import mongoose, { Schema, Document } from "mongoose"

export interface IContact extends Document {
  name: string
  email: string
  phone: string
  message: string
  status: "new" | "read" | "responded"
  createdAt: Date
}

const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["new", "read", "responded"],
    default: "new"
  }
}, {
  timestamps: true
})

export default mongoose.model<IContact>("Contact", ContactSchema)
```

---

## 3. SMS OTP Authentication

### Step 1: Choose SMS Gateway Provider

**Options:**
- **Twilio** (International, reliable)
- **MSG91** (India-focused, cost-effective)
- **AWS SNS** (Scalable)
- **2Factor** (Indian provider)

**Recommended for India: MSG91**

### Step 2: Install MSG91 SDK

```bash
npm install msg91-sms
```

### Step 3: Create OTP Service

**File: `/backend/src/services/smsService.ts`**

```typescript
import axios from "axios"

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || ""
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || "NASREV"
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID || ""

interface OTPStore {
  [phoneNumber: string]: {
    otp: string
    sessionId: string
    expiresAt: number
  }
}

const otpStore: OTPStore = {}

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendOTP = async (phoneNumber: string): Promise<{ sessionId: string }> => {
  const otp = generateOTP()
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const expiresAt = Date.now() + 5 * 60 * 1000

  otpStore[phoneNumber] = { otp, sessionId, expiresAt }

  try {
    await axios.post(`https://api.msg91.com/api/v5/otp`, {
      template_id: MSG91_TEMPLATE_ID,
      mobile: `91${phoneNumber}`,
      authkey: MSG91_AUTH_KEY,
      otp: otp
    })

    console.log(`📱 OTP sent to ${phoneNumber}: ${otp}`)
    
    return { sessionId }
  } catch (error) {
    console.error("Error sending OTP:", error)
    throw new Error("Failed to send OTP")
  }
}

export const verifyOTP = (phoneNumber: string, otp: string, sessionId: string): boolean => {
  const record = otpStore[phoneNumber]
  
  if (!record) {
    return false
  }
  
  if (record.sessionId !== sessionId) {
    return false
  }
  
  if (Date.now() > record.expiresAt) {
    delete otpStore[phoneNumber]
    return false
  }
  
  if (record.otp !== otp) {
    return false
  }
  
  delete otpStore[phoneNumber]
  return true
}
```

### Step 4: Create OTP Controller

**File: `/backend/src/controllers/otpController.ts`**

```typescript
import { Request, Response } from "express"
import { sendOTP, verifyOTP } from "../services/smsService"

export const sendOTPHandler = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body
    
    if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid phone number" 
      })
    }

    const { sessionId } = await sendOTP(phoneNumber)
    
    res.json({ 
      success: true, 
      message: "OTP sent successfully",
      sessionId
    })
  } catch (error) {
    console.error("Error in sendOTP:", error)
    res.status(500).json({ 
      success: false, 
      message: "Failed to send OTP" 
    })
  }
}

export const verifyOTPHandler = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp, sessionId } = req.body
    
    const isValid = verifyOTP(phoneNumber, otp, sessionId)
    
    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      })
    }

    res.json({ 
      success: true, 
      message: "OTP verified successfully",
      token: "JWT_TOKEN_HERE"
    })
  } catch (error) {
    console.error("Error in verifyOTP:", error)
    res.status(500).json({ 
      success: false, 
      message: "Failed to verify OTP" 
    })
  }
}
```

### Step 5: Create OTP Routes

**File: `/backend/src/routes/otpRoutes.ts`**

```typescript
import express from "express"
import { sendOTPHandler, verifyOTPHandler } from "../controllers/otpController"

const router = express.Router()

router.post("/send", sendOTPHandler)
router.post("/verify", verifyOTPHandler)
router.post("/resend", sendOTPHandler)

export default router
```

### Step 6: Frontend Integration

Use the OTP service already created at `/src/services/otp.ts`:

```typescript
import { otpService } from "@/services/otp"

// Send OTP
const response = await otpService.sendOTP(phoneNumber)

// Verify OTP
const verification = await otpService.verifyOTP(phoneNumber, otp, response.sessionId)
```

---

## 4. Payment Gateway Integration

### Razorpay Setup (Recommended for India)

### Step 1: Create Razorpay Account

1. Visit https://razorpay.com/
2. Sign up for an account
3. Get your API Key ID and Secret from Dashboard

### Step 2: Install Razorpay SDK (Backend)

```bash
npm install razorpay
npm install -D @types/razorpay
```

### Step 3: Create Payment Service

**File: `/backend/src/services/paymentService.ts`**

```typescript
import Razorpay from "razorpay"
import crypto from "crypto"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || ""
})

export const createOrder = async (amount: number, currency: string = "INR") => {
  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`
    }

    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

export const verifyPayment = (
  orderId: string, 
  paymentId: string, 
  signature: string
): boolean => {
  try {
    const text = `${orderId}|${paymentId}`
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex")

    return generatedSignature === signature
  } catch (error) {
    console.error("Error verifying payment:", error)
    return false
  }
}
```

### Step 4: Create Payment Controller

**File: `/backend/src/controllers/paymentController.ts`**

```typescript
import { Request, Response } from "express"
import { createOrder, verifyPayment } from "../services/paymentService"
import Enrollment from "../models/Enrollment"

export const createOrderHandler = async (req: Request, res: Response) => {
  try {
    const { courseId, studentId, amount } = req.body

    const order = await createOrder(amount, "INR")

    res.json({ 
      orderId: order.id, 
      amount: order.amount / 100,
      currency: order.currency
    })
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ error: "Failed to create order" })
  }
}

export const verifyPaymentHandler = async (req: Request, res: Response) => {
  try {
    const { orderId, paymentId, signature } = req.body

    const isValid = verifyPayment(orderId, paymentId, signature)

    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment verification failed" 
      })
    }

    res.json({ 
      success: true, 
      message: "Payment verified successfully" 
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    res.status(500).json({ 
      success: false, 
      message: "Failed to verify payment" 
    })
  }
}
```

### Step 5: Frontend Razorpay Integration

Add Razorpay script to `index.html`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

Use the payment service at `/src/services/payment.ts`:

```typescript
import { paymentService } from "@/services/payment"

const paymentDetails = {
  courseId: "course_123",
  studentId: "student_456",
  amount: 15000,
  currency: "INR"
}

const userDetails = {
  name: "John Doe",
  email: "john@example.com",
  phone: "9876543210"
}

await paymentService.initiateRazorpay(paymentDetails, userDetails)
```

---

## 5. Environment Variables

### Backend `.env` File

**File: `/backend/.env`**

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/nas_revolution

# SMS (MSG91)
MSG91_AUTH_KEY=your_msg91_auth_key
MSG91_SENDER_ID=NASREV
MSG91_TEMPLATE_ID=your_template_id

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### Frontend `.env` File

**File: `/.env`**

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 6. Testing Checklist

### API Endpoints

- [ ] `GET /api/courses` - Fetch all courses
- [ ] `GET /api/courses/:id` - Fetch single course
- [ ] `POST /api/contact` - Submit contact form
- [ ] `POST /api/students/register` - Register student
- [ ] `POST /api/otp/send` - Send OTP
- [ ] `POST /api/otp/verify` - Verify OTP
- [ ] `POST /api/payment/create-order` - Create payment order
- [ ] `POST /api/payment/verify` - Verify payment
- [ ] `POST /api/enrollments` - Create enrollment

### Frontend Integration

- [ ] Contact form submits to backend
- [ ] Course data loads from API
- [ ] OTP modal sends and verifies OTP
- [ ] Payment gateway opens on enrollment
- [ ] Success/error toast notifications work
- [ ] Form validation works correctly
- [ ] Mobile responsive design tested

### Security

- [ ] API endpoints have proper validation
- [ ] Sensitive data not exposed in frontend
- [ ] CORS configured correctly
- [ ] Rate limiting on OTP endpoints
- [ ] Payment signature verification working
- [ ] JWT tokens expire correctly

---

## 📚 Additional Resources

- [Razorpay Docs](https://razorpay.com/docs/)
- [MSG91 Docs](https://docs.msg91.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Status:** ✅ Frontend ready for integration
**Next Step:** Set up backend server and connect APIs
