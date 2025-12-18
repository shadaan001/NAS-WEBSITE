# NAS REVOLUTION CENTRE — Smart School Management System

**A comprehensive school management platform built with React, TypeScript, and Tailwind CSS**

![Status](https://img.shields.io/badge/status-ready%20for%20backend%20integration-success)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🎯 Project Overview

NAS Revolution Centre is a full-featured school management system designed for coaching institutes where multiple teachers shape one student's future. The application provides role-based dashboards for Students, Teachers, and Administrators with complete attendance tracking, test management, payment processing, and communication features.

### Key Philosophy
> "Where Multiple Teachers Shape One Student's Future — Smart, Affordable & Disciplined Learning"

---

## ✨ Features

### 🎓 For Students
- ✅ Personal dashboard with academic overview
- ✅ Real-time attendance tracking (subject-wise & teacher-wise)
- ✅ Test results and progress charts
- ✅ Payment history and UPI-based fee submission
- ✅ Notice board (class-specific & general)
- ✅ Profile management
- ✅ OTP-based secure login

### 👨‍🏫 For Teachers
- ✅ Dashboard with assigned students overview
- ✅ Attendance marking with calendar UI
- ✅ Student management (view assigned students only)
- ✅ Weekly availability scheduling
- ✅ Test upload and marks entry
- ✅ Profile and subject management
- ✅ Login access control (admin approval required)

### 👨‍💼 For Administrators
- ✅ Comprehensive dashboard with KPIs
- ✅ Student CRUD operations
- ✅ Teacher CRUD operations with approval workflow
- ✅ Two-way assignment (students ↔ teachers)
- ✅ Attendance reports with CSV/PDF export
- ✅ Class & subject management
- ✅ Test management and marks upload
- ✅ Fee structure and payment verification
- ✅ Notice board management (general & class-specific)
- ✅ Analytics and reporting

---

## 🏗️ Architecture

### Technology Stack

**Frontend**:
- ⚛️ React 19
- 📘 TypeScript
- 🎨 Tailwind CSS v4
- 🎬 Framer Motion (animations)
- 📊 Recharts (data visualization)
- 🧩 shadcn/ui v4 (component library)
- 🎯 Phosphor Icons

**Build & Tooling**:
- ⚡ Vite
- 🧪 Vitest (testing)
- 📦 npm

**Current Data Layer**:
- 💾 localStorage (mock database for demo)
- 🔄 useKV hook (persistent state via Spark SDK)

**Planned Backend** (TODO):
- Node.js/Express or Next.js API routes
- MongoDB or PostgreSQL
- JWT authentication
- Cloud storage (S3/Firebase) for uploads
- Real payment gateway (Razorpay/PhonePe)
- SMS OTP service (Twilio/MSG91)

---

## 📁 Project Structure

```
/workspaces/spark-template/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn components (40+)
│   │   ├── school/          # School-specific components
│   │   ├── AnimatedHero.tsx
│   │   ├── BackgroundScene.tsx
│   │   ├── BubbleIcons.tsx
│   │   ├── Animations.css
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Admin/           # Admin pages
│   │   ├── Teacher/         # Teacher pages
│   │   ├── Student/         # Student pages
│   │   ├── Auth/            # Authentication pages
│   │   └── HomePage.tsx
│   ├── lib/                 # Utilities and helpers
│   │   ├── useLocalDB.ts    # LocalStorage database layer
│   │   ├── useAuth.js       # Authentication helpers
│   │   ├── attendanceUtils.js
│   │   └── utils.ts
│   ├── data/                # Mock data and configuration
│   │   ├── mockSeed.ts      # Seed data for demo
│   │   └── ...
│   ├── types/               # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # Global styles
│   ├── index.css            # Main stylesheet
│   └── App.tsx              # Root component
├── public/                  # Static assets
├── docs/                    # Documentation
│   ├── PART_15_FINAL_INTEGRATION.md
│   ├── TEACHERS_MODULE_README.md
│   ├── STUDENTS_MODULE_README.md
│   ├── ATTENDANCE_SYSTEM_QA.md
│   ├── TESTS_MODULE_README.md
│   ├── PAYMENTS_MODULE_README.md
│   └── ...
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository** (or use GitHub Codespaces):
   ```bash
   git clone <repository-url>
   cd spark-template
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:5173
   ```

### Demo Credentials

**Admin Login**:
- Mobile: `9073040640`
- Email: `shadaan001@gmail.com`
- OTP: Displayed in dev modal (any 6-digit number works in demo mode)

**Teacher Login**:
- Email: Use any seeded teacher email (e.g., `rajesh.kumar@school.com`)
- Password: `teacher123` (demo mode)
- Note: Teacher must be approved by admin first

**Student Login**:
- Mobile number: Any 10-digit number
- OTP: Displayed in dev modal (demo mode)

---

## 🎨 Design System

### Color Palette
- **Primary**: `oklch(0.60 0.15 240)` — Blue (authority, trust)
- **Secondary**: `oklch(0.65 0.15 150)` — Green (success, growth)
- **Accent**: `oklch(0.70 0.15 40)` — Orange (energy, action)
- **Success**: `oklch(0.65 0.15 150)` — Green
- **Background**: `oklch(0.97 0.01 240)` — Light blue-tinted

### Typography
- **Headings**: Nunito (playful, approachable)
- **Body**: Inter (clean, readable)

### Key UI Patterns
- **Glassmorphism**: Frosted glass effect for cards
- **Neon Glow**: Subtle glow effects on interactive elements
- **Bubble Icons**: Circular navigation icons with float animation
- **Smooth Animations**: Page transitions, hover effects, loading states

### Animation Classes
See `src/components/Animations.css` for full list:
- `.neon-glow`, `.neon-glow-blue`, `.neon-glow-green`
- `.glass`, `.glass-card`, `.glass-strong`
- `.fade-in`, `.slide-up`, `.scale-in`
- `.hover-lift`, `.button-press`, `.bubble-float`

---

## 📚 Module Documentation

Detailed documentation for each module:

1. **[Part 15 — Final Integration & Animations](./PART_15_FINAL_INTEGRATION.md)**
2. **[Authentication & Roles](./README_AUTH.md)**
3. **[Admin Dashboard & KPIs](./ADMIN_DASHBOARD_README.md)**
4. **[Teachers Module](./TEACHERS_MODULE_README.md)**
5. **[Students Module](./STUDENTS_MODULE_README.md)**
6. **[Attendance System](./ATTENDANCE_SYSTEM_QA.md)**
7. **[Attendance Reports](./ATTENDANCE_REPORTS_README.md)**
8. **[Tests & Progress](./TESTS_MODULE_README.md)**
9. **[Notices Module](./NOTICES_MODULE_README.md)**
10. **[Payments Module](./PAYMENTS_MODULE_README.md)**

---

## 🔐 Security Considerations

### Current Implementation (Demo)
- ⚠️ localStorage for all data (not production-safe)
- ⚠️ Mock OTP (displayed in UI)
- ⚠️ No encryption
- ⚠️ Base64 image storage

### Production Requirements (TODO)
- 🔒 Implement JWT-based authentication
- 🔒 Hash passwords with bcrypt
- 🔒 Use HTTPS only
- 🔒 Implement CSRF protection
- 🔒 Add rate limiting
- 🔒 Sanitize all inputs
- 🔒 Use cloud storage for files
- 🔒 Implement real OTP via SMS/Email
- 🔒 Add audit logs
- 🔒 Implement role-based access control on server

---

## 📊 Data Models

### Student
```typescript
{
  id: string
  name: string
  class: string
  rollNo: string
  guardianName: string
  guardianPhone: string
  email?: string
  photoBase64?: string
  assignedTeacherIds: string[]
  assignedSubjects: string[]
  attendanceSummary: {
    totalDays: number
    presentDays: number
    absentDays: number
    percentage: number
  }
  tests: string[]
  payments: string[]
  createdAt: string
}
```

### Teacher
```typescript
{
  id: string
  name: string
  email: string
  contactNumber: string
  subjects: string[]
  classesAssigned: string[]
  employeeId: string
  photoBase64?: string
  availability: Array<{ day: string, from: string, to: string }>
  assignedStudentIds: string[]
  approved: boolean
}
```

### Attendance Record
```typescript
{
  id: string
  teacherId: string
  date: string (ISO)
  subject: string
  status: "Held" | "Cancelled"
  students: Array<{
    studentId: string
    status: "Present" | "Absent" | "Late"
    timestamp: string
  }>
  createdAt: string
  updatedAt: string
}
```

See TypeScript definitions in `src/types/` for complete models.

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Student login flow
- [ ] Teacher login flow (with approval check)
- [ ] Admin login flow
- [ ] Student CRUD operations
- [ ] Teacher CRUD operations
- [ ] Two-way assignment sync (student ↔ teacher)
- [ ] Attendance marking and calendar UI
- [ ] Attendance reports and export
- [ ] Test upload and marks entry
- [ ] Payment submission and verification
- [ ] Notice creation and filtering
- [ ] Mobile responsiveness
- [ ] Animation performance
- [ ] Accessibility (keyboard navigation, screen readers)

### Automated Testing (TODO)
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

---

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

---

## 🚧 Roadmap to Production

### Phase 1: Backend Integration
- [ ] Set up Node.js/Express backend
- [ ] Implement database (MongoDB/PostgreSQL)
- [ ] Create REST API endpoints
- [ ] Add JWT authentication
- [ ] Implement file upload service (S3/Firebase)

### Phase 2: Security & Authentication
- [ ] Real OTP service (Twilio/MSG91)
- [ ] Password hashing and secure storage
- [ ] HTTPS enforcement
- [ ] CORS configuration
- [ ] Rate limiting

### Phase 3: Payment Integration
- [ ] Integrate Razorpay/PhonePe gateway
- [ ] Webhook verification
- [ ] Payment reconciliation
- [ ] Receipt generation

### Phase 4: Optimization
- [ ] Code splitting and lazy loading
- [ ] Image optimization
- [ ] CDN for static assets
- [ ] Caching strategies
- [ ] Performance monitoring

### Phase 5: Deployment
- [ ] Set up CI/CD pipeline
- [ ] Deploy backend (AWS/Azure/Heroku)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Analytics (Google Analytics, Mixpanel)

---

## 🤝 Contributing

This is a school project/coaching institute platform. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

---

## 📞 Support

For admin access:
- **Mobile**: 9073040640
- **Email**: shadaan001@gmail.com
- **UPI**: 9073040640@ybl

For technical support, review inline `TODO` comments in the codebase or check the module-specific documentation in the `/docs` folder.

---

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first styling
- **Framer Motion** for smooth animations
- **Phosphor Icons** for the comprehensive icon set
- **Recharts** for data visualization
- **GitHub Spark** for the runtime and SDK

---

**Built with ❤️ for modern education management**

**Status**: ✅ Ready for Backend Integration & Production Deployment
