# Smart School Manager - Multi-Portal School Management Application

A modern, clean, premium school management system with separate portals for students and teachers to track attendance, homework, classwork, results, fees, and school activities.

**Experience Qualities**:
1. **Clean & Professional** - Soft colors, smooth gradients, and organized card layouts that feel polished and trustworthy
2. **Friendly & Approachable** - School-themed illustrations, bubble icons, and gentle animations that create a welcoming atmosphere
3. **Efficient & Clear** - Intuitive navigation, quick-view cards, and clear information hierarchy for effortless daily use

**Complexity Level**: Complex Application (advanced functionality with multiple portals and views)
  - Multi-portal system with student dashboard, teacher portal, and admin panel. Includes attendance tracking, homework management, results viewing, fee monitoring, and profile management. Advanced state management for user data, teacher-student assignments, and cross-portal attendance synchronization.

## Essential Features

### Login & Authentication
- **Functionality**: Secure login screen with student ID and password input, session persistence across page refreshes
- **Purpose**: Protect student data and ensure only authorized users can access the dashboard
- **Trigger**: App loads without authenticated session
- **Progression**: Login screen displays → user enters credentials → validation → success toast → dashboard loads
- **Success criteria**: Session persists using useKV storage, logout clears session, smooth transitions between login/dashboard

### Dashboard Home Screen
- **Functionality**: Centralized hub displaying student profile, attendance summary, upcoming tests, latest homework, fee status, and quick actions
- **Purpose**: Provides at-a-glance overview of all important student information
- **Trigger**: User opens app or taps Home tab
- **Progression**: Screen loads → welcome text appears → cards fade in with stagger → data populates → notification badge updates
- **Success criteria**: All cards load within 1 second, data is current, smooth animations on entry

### Attendance Tracking (Student View)
- **Functionality**: View attendance history, percentage, subject-wise breakdown, teacher-wise breakdown, 7-day and 30-day charts, and detailed daily records
- **Purpose**: Keep students and parents informed about attendance status across all subjects and teachers with comprehensive analytics
- **Trigger**: User taps Attendance tab or attendance card on home
- **Progression**: Tab selected → overall stats display → pie chart appears → tabs for overview/subjects/teachers → select tab → view charts or detailed breakdowns → tap date for daily details → see subject-wise status with teacher info
- **Success criteria**: Clear visual indicators for present/absent/late, accurate percentage calculation across subjects and teachers, animated charts showing trends, expandable daily records with teacher attribution

### Attendance Management (Teacher Portal)
- **Functionality**: Calendar-based attendance marking system with monthly view, per-student marking (Present/Absent/Late), session status (Held/Cancelled), quick KPIs, and CSV export
- **Purpose**: Enable teachers to efficiently mark and track attendance for their assigned students with visual calendar interface
- **Trigger**: Teacher navigates to Attendance section in teacher portal
- **Progression**: Page loads → monthly calendar displays with scheduled days highlighted → teacher clicks day → modal opens → sets session status (Held/Cancelled) → if Held, marks each student attendance → saves → calendar updates with visual indicators
- **Success criteria**: Scheduled days auto-populate based on teacher availability, prevents duplicate marking for same date, shows last 7-day student history in modal, validates teacher approval status, displays monthly stats (sessions scheduled/held/cancelled, overall present %), low attendance alert for students <75%, exports monthly report to CSV

### Attendance Administration (Admin Portal)
- **Functionality**: Multi-teacher attendance overview, edit capabilities, bulk holiday marking, cross-teacher reports, and student low-attendance tracking
- **Purpose**: Give admins oversight of all attendance activities with ability to edit, bulk operations, and comprehensive reporting
- **Trigger**: Admin navigates to Attendance Management section
- **Progression**: Dashboard loads → displays overall stats (total scheduled/held/cancelled) → admin selects teacher → views teacher's calendar → can click any day to edit → can bulk mark date ranges as cancelled (holidays) → views teacher performance table → views students with low attendance across all subjects → exports reports (per teacher or all teachers)
- **Success criteria**: Admin can view/edit any teacher's attendance, bulk holiday marking works across date range with warning about audit sensitivity, teacher performance shows completion rates, low attendance students aggregated across all teachers, exports to CSV with complete data, audit warning displayed for manual edits

### Homework & Classwork Management
- **Functionality**: View assigned homework, classwork, and class activities with due dates, descriptions, and submission status
- **Purpose**: Help students track assignments and stay organized with their work
- **Trigger**: User taps Homework tab or homework card on home
- **Progression**: Tab opens → tabs for homework/classwork/activities → list displays → tap item for details → mark as complete
- **Success criteria**: Clear pending vs completed distinction, due date warnings, organized by subject

### Student Profile & Settings
- **Functionality**: Display student information, class details, parent contact, change preferences, view notifications, and logout
- **Purpose**: Manage personal information, app settings, and session control in one place
- **Trigger**: User taps Profile tab
- **Progression**: Profile opens → student info card → settings options → notifications list → tap logout → confirmation toast → return to login
- **Success criteria**: All information displayed clearly, settings are persistent, logout clears session and returns to login screen

### Bottom Navigation System
- **Functionality**: Fixed bottom tabs for Home, Attendance, Homework, Admin, and Profile with active state indicators
- **Purpose**: Provides consistent, thumb-friendly navigation on mobile devices
- **Trigger**: Always visible on all main screens
- **Progression**: App loads → nav bar mounts → icons with labels → tap switches screen → active state updates
- **Success criteria**: Smooth transitions between tabs, clear active indicators, works on all screen sizes

### Admin Panel (NEW)
- **Functionality**: Manage teacher-student assignments, add/remove teachers, view all student attendance stats, and edit attendance records
- **Purpose**: Provide administrative control over the attendance system including teacher assignments and data corrections
- **Trigger**: User taps Admin tab in bottom navigation
- **Progression**: Tab opens → three sections (Assignments/Teachers/Attendance) → assign teachers to subjects → add new teachers → view student stats → edit incorrect entries → changes persist
- **Success criteria**: Easy teacher assignment interface, clear list of all teachers with subjects, student attendance overview with edit capability, all changes saved to persistent storage

### Teacher Portal (NEW)
- **Functionality**: Dedicated teacher login and dashboard with attendance marking, student management, and profile settings
- **Purpose**: Enable teachers to efficiently mark attendance for their assigned subjects and monitor student progress
- **Trigger**: User clicks "Teacher Portal" on home page
- **Progression**: Home → teacher login → dashboard with stats → mark attendance by subject/class → view student list → manage profile → logout
- **Success criteria**: Seamless teacher authentication, subject-filtered attendance marking, real-time stats, student performance tracking, glassmorphic UI with neon accents

### Teacher Dashboard
- **Functionality**: Quick overview of assigned classes, students, today's attendance, and schedule with animated stat cards
- **Purpose**: Provide teachers with at-a-glance view of their teaching responsibilities and quick access to key functions
- **Trigger**: Teacher logs in or taps Home in teacher bottom nav
- **Progression**: Login → welcome screen → stat cards animate in → schedule displays → tap quick action → navigate to feature
- **Success criteria**: All stats load within 1 second, smooth animations, accurate class/student counts, quick actions work correctly

### Attendance Marking System
- **Functionality**: Teachers mark students as Present, Absent, or Late for specific subjects and classes with real-time validation
- **Purpose**: Streamline attendance tracking and prevent duplicate entries for the same day/subject combination
- **Trigger**: Teacher taps Attendance in bottom nav
- **Progression**: Select subject → select class → student list loads → mark status (P/A/L) → live counter updates → save attendance → confirmation popup → data persists
- **Success criteria**: Only assigned subject/class students visible, prevent duplicate marking for same day, auto-save with toast notification, animated confirmation feedback

### Teacher Student List
- **Functionality**: View and search all assigned students with attendance percentages, contact info, and filtering by class
- **Purpose**: Help teachers monitor individual student performance and contact parents when needed
- **Trigger**: Teacher taps Students in bottom nav
- **Progression**: Page loads → student cards display → search by name/roll → filter by class → view attendance % → animated progress bars
- **Success criteria**: Fast search, accurate attendance calculations from teacher's marked records, smooth animations, clear contact information

### Teacher Profile Management
- **Functionality**: View teacher details, edit contact information, see assigned classes/subjects, and logout
- **Purpose**: Allow teachers to manage their profile information and review their teaching assignments
- **Trigger**: Teacher taps Profile in bottom nav
- **Progression**: Profile loads → info displays → tap edit → modify phone/email → save changes → confirmation → or tap logout → return to home
- **Success criteria**: All information displayed clearly, editable fields save correctly, logout clears session properly

### Admin Portal (NEW)
- **Functionality**: Comprehensive management system for coaching center administration including student records, teacher management, attendance monitoring, class/subject organization, test management, fee tracking, and administrative settings
- **Purpose**: Provide centralized control and oversight of all coaching center operations with analytics and reporting
- **Trigger**: User clicks "Admin Portal" on home page
- **Progression**: Home → admin login → dashboard with stats/charts → manage students/teachers/attendance/classes/tests/fees → view analytics → manage profile → logout
- **Success criteria**: Secure authentication, complete CRUD operations on all entities, real-time statistics, comprehensive filtering and reporting, data persistence using useKV, smooth glassmorphic UI with animations

### Admin Dashboard
- **Functionality**: Overview of key metrics with animated cards showing total students, teachers, subjects, fee collection status, upcoming tests, and attendance trends with interactive charts
- **Purpose**: Provide at-a-glance insights into coaching center performance and quick navigation to detailed management pages
- **Trigger**: Admin logs in or taps Dashboard in admin nav
- **Progression**: Login → welcome screen → stat cards animate in → charts load → tap card → navigate to detailed page
- **Success criteria**: All metrics accurate and real-time, smooth Framer Motion animations, responsive Recharts visualizations, quick navigation to all sections

### Student Management
- **Functionality**: Add, edit, delete students; assign classes, subjects, and teachers; upload profile photos; view detailed attendance summaries; manage contact information and guardian details
- **Purpose**: Maintain complete student records with academic assignments and performance tracking
- **Trigger**: Admin taps Students in bottom nav
- **Progression**: Page loads → student list displays → search/filter → add new student → fill form (basic info/subjects/teachers) → assign teachers to subjects → save → view student details with attendance stats
- **Success criteria**: Fast search, tabbed forms for organization, subject-wise attendance display, complete student profiles with guardian info, all changes persist to useKV

### Teacher Management
- **Functionality**: Add, edit, delete teachers; assign subjects and classes; view teacher qualifications and experience; track assigned students
- **Purpose**: Organize teaching staff with subject and class assignments for effective resource allocation
- **Trigger**: Admin taps Teachers in bottom nav
- **Progression**: Page loads → teacher list → search by name/subject → add teacher → fill details (basic/subjects/classes) → assign to multiple subjects/classes → save
- **Success criteria**: Clean teacher profiles, multi-select for subjects/classes, badge display for assignments, persistent data

### Attendance Management (Admin)
- **Functionality**: View complete attendance logs with advanced filtering by student, teacher, subject, date range; edit incorrect entries; generate attendance reports; view subject-wise and time-series charts
- **Purpose**: Monitor attendance across all students and subjects with ability to correct errors and analyze trends
- **Trigger**: Admin taps Attendance in bottom nav
- **Progression**: Page opens → filter panel → select criteria → view stats cards → analyze pie chart → review 7-day trend → check subject-wise bar chart → view recent records → edit entry → save changes
- **Success criteria**: Powerful filtering, multiple chart types (pie, line, bar), edit capability with confirmation, date range selector, clear status indicators

### Class & Subject Management
- **Functionality**: Add classes and subjects; assign teachers to subjects; organize class sections; view student counts per class
- **Purpose**: Structure the academic organization with proper teacher-subject-class mapping
- **Trigger**: Admin taps Classes in bottom nav
- **Progression**: Classes/Subjects tabs → add class with section → add subjects with codes → assign teachers to subjects → view assignments → delete if needed
- **Success criteria**: Simple class/subject creation, teacher assignment interface, student count display, organized with tabs

### Test & Exam Management
- **Functionality**: Add tests with details (name, subject, class, date, type, max marks); upload student marks; view performance statistics (average, highest, lowest); display bar charts of student performance
- **Purpose**: Track student assessments and academic performance with visual analytics
- **Trigger**: Admin taps Tests in bottom nav
- **Progression**: Test list → add test → enter details → save → view test → upload marks for students → view performance chart → see statistics
- **Success criteria**: Test types (Unit/Mid/Final/Mock), marks entry with validation, auto-calculated statistics, performance bar charts, upcoming vs past indicators

### Fee Management
- **Functionality**: Add fee records for students; mark fees as paid with payment mode; auto-generate receipt numbers; track paid/unpaid/overdue status; filter by status; mock payment processing
- **Purpose**: Monitor fee collection and payment status across all students with receipt generation
- **Trigger**: Admin taps Fees in bottom nav
- **Progression**: Fee overview with stats → add fee record → select student/amount/due date → view fee list → filter by status → mark as paid → select payment mode → receipt generated → confirmation
- **Success criteria**: Status tracking (paid/unpaid/overdue), payment mode selection (cash/online/cheque/card), auto-receipt generation, color-coded cards, collection statistics, TODO marker for real payment gateway

### Admin Profile Management
- **Functionality**: View and edit admin details; manage coaching center name, logo, address, contact information
- **Purpose**: Maintain administrative profile and coaching center branding information
- **Trigger**: Admin taps Profile in bottom nav
- **Progression**: Profile loads → view details → tap edit → modify information → upload logo (TODO) → save changes → or logout
- **Success criteria**: Complete profile display, editable fields with glassmorphic modal, secure logout, TODO marker for logo upload implementation

## Edge Case Handling
- **Empty states**: Friendly illustrations and helpful text when no homework, activities, or notifications exist
- **Network errors**: Graceful offline mode with cached data and retry options
- **Long lists**: Pagination or infinite scroll for homework and attendance history
- **Missing data**: Placeholder content and clear indicators when information is unavailable
- **Portrait orientation only**: Layout optimized for mobile portrait, adjusts for different screen heights
- **Accessibility**: High contrast ratios, readable fonts, proper touch targets (44x44px minimum)

## Design Direction

The design should evoke feelings of trust, cleanliness, and approachability - like a well-organized modern school environment. Users should feel comfortable, focused, and confident that their academic information is presented clearly and professionally. The aesthetic is soft, friendly, and premium without being overwhelming.

## Color Selection

A clean, soft color palette with school-friendly blue and green tones combined with smooth gradients for a premium feel.

- **Primary Color**: Soft Blue (oklch(0.60 0.15 240)) - Main brand color representing trust and intelligence, used for primary actions and key highlights
- **Secondary Colors**: 
  - Fresh Green (oklch(0.65 0.15 150)) - Supporting color for positive indicators like attendance present, homework completed
  - Light Sky (oklch(0.92 0.04 240)) - Gentle background tone
  - Pure White (oklch(1 0 0)) - Clean card backgrounds
- **Accent Color**: Warm Orange (oklch(0.70 0.15 40)) - Attention-grabbing color for notifications, due dates, and important alerts
- **Foreground/Background Pairings**: 
  - White Background (oklch(1 0 0)): Dark Text (oklch(0.20 0.02 240)) - Ratio 16.1:1 ✓
  - Light Sky (oklch(0.92 0.04 240)): Dark Text (oklch(0.20 0.02 240)) - Ratio 13.8:1 ✓
  - Soft Blue (oklch(0.60 0.15 240)): White Text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Fresh Green (oklch(0.65 0.15 150)): White Text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Warm Orange (oklch(0.70 0.15 40)): White Text (oklch(1 0 0)) - Ratio 4.9:1 ✓

## Font Selection

Typography should feel friendly, readable, and professional - perfect for a school environment where clarity is essential.

- **Primary Font**: Nunito - Rounded, friendly sans-serif that's highly readable and approachable for all ages
- **Secondary Font**: Inter - Clean, modern fallback for UI elements and smaller text

- **Typographic Hierarchy**:
  - H1 (Welcome/Page Titles): Nunito Bold/28px/tight leading/1.2
  - H2 (Card Headings): Nunito Bold/20px/normal leading/1.3
  - H3 (Subsections): Nunito SemiBold/16px/normal leading/1.4
  - Body (Content): Inter Regular/14px/relaxed leading/1.6
  - Buttons/Tabs: Nunito SemiBold/14px/normal tracking/0
  - Labels: Inter Medium/12px/normal leading/1.4
  - Captions: Inter Regular/12px/normal leading/1.5

## Animations

Animations should feel smooth, subtle, and professional - similar to modern mobile apps but never flashy or distracting. Focus on enhancing usability with gentle fade-ins, slide-ups for cards, scale effects on button press, and smooth page transitions. All animations respect prefers-reduced-motion for accessibility and run at 200-400ms for optimal feel.

## Component Selection

- **Components**:
  - Card - Base for all dashboard cards with soft shadows and rounded corners
  - Button - Primary, secondary, and icon button variants with press animations
  - Tabs - For homework/classwork/activities navigation
  - Badge - For notification counts and status indicators
  - Avatar - Student profile pictures
  - Progress - Attendance percentage indicators
  - Calendar - For attendance date viewing (react-day-picker)
  - Separator - Subtle dividers between sections
  
- **Customizations**:
  - BubbleIcon: Circular icon containers with soft gradients and shadows
  - QuickCard: Dashboard summary cards with icons, numbers, and subtle hover effects
  - StatusBadge: Color-coded badges for present/absent, complete/pending
  - GradientBackground: Soft multi-layered gradients (blue→white, green→blue)
  - BottomNav: Fixed navigation bar with icons, labels, and active indicators
  
- **States**:
  - Buttons: Default (soft shadow) → Pressed (scale 0.95 + deeper shadow) → Focus (ring) → Disabled (opacity 0.5)
  - Cards: Default (subtle shadow) → Hover (lifted shadow) → Pressed (slight scale)
  - Tabs: Inactive (muted) → Active (colored indicator + bold text)
  - Nav Items: Inactive (gray icon) → Active (colored icon + label)
  
- **Icon Selection** (Phosphor Icons - all rounded/bubble style):
  - Home: House
  - Attendance: Calendar, CheckCircle, XCircle
  - Homework: BookOpen, Notebook, PencilSimple
  - Classwork: Books, Article
  - Activities: Users, Trophy, Star
  - Results: ChartBar, Medal
  - Fees: CurrencyDollar, Wallet
  - Notifications: Bell, BellRinging
  - Profile: User, GearSix
  - Timetable: Clock, CalendarBlank
  
- **Spacing**:
  - Screen padding: px-4 (mobile consistent)
  - Section spacing: py-4 md:py-6
  - Card padding: p-4 md:p-5
  - Grid gaps: gap-3 md:gap-4
  - Icon sizes: 24px (nav), 32px (cards), 48px (headers)
  - Bottom nav height: 64px with safe-area-inset
  
- **Mobile**:
  - Portrait only orientation
  - Bottom navigation always visible (fixed)
  - Cards stack vertically with full width
  - Typography scales appropriately (no huge text jumps)
  - Touch targets minimum 44x44px
  - Pull-to-refresh on lists (future enhancement)
  - Swipe gestures for tab navigation (future enhancement)
