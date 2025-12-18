# ✨ Smart School Manager - Complete School Management System

You've just launched your Smart School Manager application — a comprehensive school management system with student, teacher, and admin portals.

## 🚀 What's Inside?

- **Student Portal**: View profile, attendance, test results, and teacher contacts
- **Teacher Portal**: Mark attendance, manage students, view schedules
- **Admin Portal**: Complete CRUD for students, teachers, classes, tests, and fees
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Modern Stack**: React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion

## 📚 Documentation

- **[Students Module](./STUDENTS_MODULE_README.md)** - Complete student CRUD, profile, and dashboard
- **[Teachers Module](./TEACHERS_MODULE_README.md)** - Teacher management and assignments
- **[Teacher Portal](./TEACHER_PORTAL_DOCS.md)** - Teacher features and functionality
- **[Integration Guide](./INTEGRATION.md)** - Backend API integration guidelines

## 🎯 Key Features

### Admin Portal
- ✅ Students CRUD with bulk operations
- ✅ Teachers CRUD with availability management
- ✅ Attendance tracking and reporting
- ✅ Test/exam management
- ✅ Fee management
- ✅ Class management
- ✅ Two-way relationship sync (students ↔ teachers)
- ✅ CSV export functionality

### Student Portal
- ✅ Profile with photo upload
- ✅ Attendance summary with charts
- ✅ Test results and performance dashboard
- ✅ Payment history
- ✅ Teacher contacts
- ✅ Subject-wise analytics

### Teacher Portal
- ✅ Mark attendance
- ✅ View assigned students
- ✅ Manage availability
- ✅ View student details

## 🔧 Technical Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Phosphor Icons
- **State**: useKV (persistent localStorage)
- **Build**: Vite

## 📦 Seeded Data

The application comes with pre-seeded data:
- **25 Students** across classes 6-12
- **10 Teachers** with varied subjects and availability
- Full relationships and assignments

## ⚠️ Important Notes

**This is a demo application using localStorage as a mock database.**

For production use, you must:
1. Replace `LocalDB` with backend API endpoints
2. Move photo storage from Base64 to cloud storage (S3/Firebase)
3. Implement server-side validation and transactions
4. Add proper authentication and authorization
5. Implement data backup and recovery

See [INTEGRATION.md](./INTEGRATION.md) for migration guidelines.

## 🚀 Getting Started

The application is already running in your Spark environment. Navigate to:

- **Landing Page** → Choose portal (Student/Teacher/Admin)
- **Student Login** → Use any seeded student ID
- **Teacher Login** → Use any seeded teacher ID  
- **Admin Login** → Use admin credentials

## 🎨 Design System

- **Color Palette**: Blue (primary), Green (secondary), Orange (accent)
- **Typography**: Nunito (headings), Inter (body)
- **Border Radius**: 1rem (rounded corners throughout)
- **Animations**: Smooth transitions, staggered reveals, hover effects

## ♿ Accessibility

- All forms have proper labels and ARIA attributes
- Keyboard navigation support
- Touch-friendly controls (min 44x44px)
- Screen reader compatible

## 📱 Responsive Design

- Mobile-first approach
- Adaptive layouts for tablet and desktop
- Touch-optimized controls
- Bottom navigation on mobile

## 🧹 Just Exploring?

No problem! If you were just checking things out and don't need to keep this code:
- Simply delete your Spark
- Everything will be cleaned up — no traces left behind

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
