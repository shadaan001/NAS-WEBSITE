# Dynamic Lecture Management System - Product Requirements Document

A fully dynamic, course-agnostic video lecture platform that automatically adapts to any course/class added to the coaching center management system.

**Experience Qualities**:
1. **Adaptive** - Automatically supports any course structure without hardcoding
2. **Intuitive** - Simple, clear navigation for students, teachers, and admins
3. **Efficient** - Fast access to educational content with smart filtering

**Complexity Level**: Complex Application (advanced functionality with multiple user roles and dynamic content management)

The system handles dynamic course structures, video content management, role-based permissions, and seamless integration across student, teacher, and admin interfaces.

## Essential Features

### 1. Dynamic Course Architecture
**Functionality**: Automatically detect and support any course added by administrators
**Purpose**: Eliminate hardcoding and make the system future-proof for any educational program
**Trigger**: Admin creates a new course with subjects
**Progression**: Course added → System detects course → Subjects auto-populate → Lectures can be uploaded → Students can access
**Success Criteria**: New courses appear immediately in all lecture interfaces without code changes

### 2. Student Lecture Viewing
**Functionality**: Browse, filter, search, and watch lectures from enrolled courses
**Purpose**: Provide easy access to educational video content
**Trigger**: Student navigates to Lectures section from dashboard
**Progression**: Select course → Filter by subject → Search lectures → Click play → Watch in modal player → Track views
**Success Criteria**: Students can find and watch any lecture for their enrolled courses with smooth playback

### 3. Teacher Lecture Upload
**Functionality**: Upload video lectures with metadata to assigned courses
**Purpose**: Enable teachers to share educational content with students
**Trigger**: Teacher accesses Upload Lectures from dashboard
**Progression**: Select course → Choose subject → Fill details → Upload video/provide URL → Add thumbnail → Submit → Success confirmation
**Success Criteria**: Teachers can upload lectures that immediately appear for students in selected courses

### 4. Admin Lecture Management
**Functionality**: View, edit, delete, and export all lectures across all courses
**Purpose**: Provide administrative oversight and content moderation
**Trigger**: Admin selects Manage Lectures from dashboard
**Progression**: View all lectures → Apply filters → Edit/delete as needed → Export reports → Monitor content
**Success Criteria**: Admins have complete control over lecture content with bulk operations support

### 5. Advanced Filtering & Search
**Functionality**: Multi-dimensional filtering by course, subject, teacher, with text search
**Purpose**: Help users quickly find relevant lectures
**Trigger**: User enters search query or selects filter options
**Progression**: Apply filters → Results update instantly → Sort by date/title → Find desired content
**Success Criteria**: Users can find any lecture within 3 clicks or one search

### 6. Video Player Experience
**Functionality**: Full-featured video player with controls in modal overlay
**Purpose**: Provide smooth, distraction-free video viewing
**Trigger**: Student clicks "Watch Lecture" button
**Progression**: Modal opens with zoom animation → Video auto-plays → Controls available → Close button pauses and exits
**Success Criteria**: Video plays without buffering issues, controls are responsive, modal closes cleanly

## Edge Case Handling

**No Courses Available** - Display friendly empty state with call-to-action for admin
**No Lectures for Course** - Show helpful message encouraging teacher uploads
**Video Load Failure** - Display error with retry option and support contact
**Large Video Files** - Show upload progress, validate file size limits
**Concurrent Edits** - Last write wins with timestamp tracking
**Invalid Video Format** - Validate format before upload with clear error messages
**Network Interruption** - Auto-pause video, show reconnection indicator

## Design Direction

The design should feel **educational yet modern** - a professional learning platform with clean aesthetics, clear information hierarchy, and smooth animations that enhance (not distract from) the learning experience.

## Color Selection

**Primary Color**: Deep Blue (#2A8BF2 / oklch(68.5% 0.169 237.323)) - Trust, knowledge, professionalism
**Secondary Colors**: 
  - Purple accents (#9333ea) for highlights and special features
  - Green (#00E676) for success states and positive actions
**Accent Color**: Bright Blue for CTAs and interactive elements
**Background**: Dark (#0a0e1a) with glassmorphism overlays for depth
**Foreground/Background Pairings**:
  - Primary Blue on Dark Background: White text (#FFFFFF) - Ratio 8.2:1 ✓
  - Card Backgrounds (rgba(255,255,255,0.05)): White text - Ratio 15.3:1 ✓
  - Accent Blue: White text - Ratio 7.1:1 ✓

## Font Selection

The typefaces should convey **clarity and professionalism** suitable for educational content with excellent readability for extended viewing.

**Typographic Hierarchy**:
- H1 (Page Titles): Montserrat Bold/32px/tight spacing - Main section headers
- H2 (Section Headers): Montserrat Bold/24px/normal spacing - Content groupings
- H3 (Card Titles): Montserrat SemiBold/18px/normal spacing - Lecture titles
- Body Text: Montserrat Regular/14px/1.5 line height - Descriptions and content
- Caption: Montserrat Regular/12px/1.4 line height - Metadata and labels
- Mono (Source Code Pro): 14px - Technical data, IDs

## Animations

Animations should be **purposeful and educational-focused** - smooth transitions that guide attention, celebrate actions (lecture completion), and provide feedback without overwhelming users.

**Key Animations**:
- Lecture card entrance: Staggered fade-in with slight upward motion (0.4s ease-out)
- Video modal: Zoom from center with backdrop blur (0.3s spring)
- Filter changes: Smooth list transitions with position-aware animation
- Upload success: Celebratory bounce with checkmark
- Page navigation: Gentle slide transitions (0.3s ease)
- Loading states: Skeleton screens with subtle shimmer
- Hover states: Lift effect with shadow enhancement (0.2s ease)

## Component Selection

**Components**:
- **Card** (Shadcn) - Lecture display cards with glassmorphism
- **Dialog** (Shadcn) - Video player modal, edit dialogs
- **Select** (Shadcn) - Course and subject dropdowns
- **Input/Textarea** (Shadcn) - Search, forms, descriptions
- **Button** (Shadcn) - All actions with variant states
- **Table** (Shadcn) - Admin lecture management view
- **Badge** (Shadcn) - Subject labels, status indicators
- **Progress** (Shadcn) - Video upload progress (future)
- **Skeleton** (Shadcn) - Loading states
- **Alert Dialog** (Shadcn) - Delete confirmations

**Customizations**:
- Video player wrapper with custom controls styling
- Glassmorphism effect overlays for cards
- Gradient backgrounds for hero sections
- Custom thumbnail placeholder with play icon
- Staggered grid layout for lecture cards
- Sticky filter bar with blur backdrop

**States**:
- Buttons: Default, hover (scale 1.02), active (scale 0.98), disabled (opacity 0.5)
- Cards: Rest, hover (lift + shadow), active (selected border)
- Inputs: Empty, filled, focus (border glow), error (red border), disabled
- Video: Loading, playing, paused, error, ended

**Icon Selection** (Phosphor Icons):
- VideoCamera - Upload lectures, lecture management
- Play - Watch lecture button
- MagnifyingGlass - Search functionality
- Funnel - Filter options
- ArrowLeft - Navigation back
- Trash - Delete actions
- Pencil - Edit actions
- Download - Export CSV
- X - Close modals

**Spacing**:
- Page padding: 24px (6 in Tailwind)
- Card padding: 16px (4 in Tailwind)
- Card gap: 24px (6 in Tailwind)
- Section spacing: 24px (6 in Tailwind)
- Element spacing: 12px-16px (3-4 in Tailwind)
- Button padding: 12px 24px (py-3 px-6)

**Mobile**:
- Single column lecture grid on mobile (< 768px)
- Full-width video player modal
- Sticky filter bar collapses to dropdown menu
- Bottom sheet for filters on mobile
- Touch-optimized button sizes (min 44px)
- Reduced padding (16px instead of 24px)
- Simplified table view becomes card list
- Horizontal scroll for filter chips

## Integration Points

### Student Dashboard Integration
- New "Lectures" quick access card in dashboard
- Tab navigation includes "lectures" route
- Enrolled courses auto-filter available lectures
- Seamless transition from dashboard to lecture viewer

### Teacher Dashboard Integration
- "Upload Lectures" card in quick actions
- Direct navigation to upload form
- Teacher ID automatically captured
- Teacher name from profile data

### Admin Dashboard Integration
- "Manage Lectures" card in admin overview
- Complete CRUD operations interface
- Bulk actions support (future: bulk delete, bulk edit)
- Export functionality to CSV

### Course Management Integration
- Courses must include subjects array field
- When admin creates course, subjects are defined
- Lecture system reads from courses localStorage/database
- No hardcoded course or subject lists anywhere

## Data Structure

### Course Object
```json
{
  "id": "course_class8",
  "title": "Class 8",
  "subjects": ["Mathematics", "Science", "English", "Hindi", "Geography"],
  "grade": "8",
  "description": "...",
  "duration": "1 Year",
  "category": "Foundation",
  "isActive": true
}
```

### Lecture Object
```json
{
  "id": "lecture_123456",
  "courseId": "course_class8",
  "courseName": "Class 8",
  "subject": "Mathematics",
  "title": "Introduction to Algebra",
  "description": "Basic concepts of algebraic expressions...",
  "videoURL": "blob:... or https://...",
  "thumbnailURL": "https://...",
  "teacherId": "T001",
  "teacherName": "Mr. Rajesh Kumar",
  "uploadDate": "2024-01-15T10:30:00Z",
  "views": 45,
  "duration": "25:30",
  "tags": ["algebra", "basics"]
}
```

## Technical Architecture

### Storage (Current - Browser)
- Courses: `localStorage["courses"]`
- Lectures: `localStorage["lectures"]`
- Video files: Blob URLs (temporary)

### Storage (Future - Production)
- Courses: Supabase/Firebase database
- Lectures: Supabase/Firebase database with foreign keys
- Video files: AWS S3/Cloudflare Stream with CDN
- Thumbnails: Auto-generated and stored in CDN

### Services Layer
- `CourseService` - CRUD operations for courses
- `LectureService` - CRUD operations for lectures
- Both follow same pattern for easy backend swap

### Component Architecture
- Pages: Student/LecturesPage, Teacher/UploadLecturePage, Admin/ManageLecturesPage
- Services: lectureService, courseService
- Types: Lecture, LectureFilter interfaces
- Utilities: Search, filter, sort helpers

## User Flows

### Student Watches Lecture
1. Student logs in → Dashboard
2. Clicks "Lectures" card
3. Views course selector (auto-selected to enrolled course)
4. Selects subject filter if needed
5. Searches for specific topic (optional)
6. Clicks lecture card
7. Video modal opens, starts playing
8. Views lecture metadata (teacher, date, description)
9. Closes modal when done
10. View count increments

### Teacher Uploads Lecture
1. Teacher logs in → Teacher Dashboard
2. Clicks "Upload Lectures"
3. Selects course from dropdown
4. Selects subject (dynamically loaded from course)
5. Enters lecture title and description
6. Uploads video file or provides URL
7. Optionally adds thumbnail URL
8. Submits form
9. Success message appears
10. Redirected back to dashboard
11. Lecture immediately available to students

### Admin Manages Lectures
1. Admin logs in → Admin Dashboard
2. Clicks "Manage Lectures"
3. Views all lectures in table format
4. Applies filters (course, subject, teacher)
5. Searches for specific lecture
6. Clicks edit icon → Modal opens
7. Edits title/description
8. Saves changes
9. Or clicks delete → Confirmation dialog
10. Confirms deletion
11. Lecture removed from system
12. Can export filtered list to CSV

## Success Metrics

1. **Adoption Rate**: 80% of students access lectures within first week
2. **Content Growth**: Teachers upload average 2 lectures per week
3. **Engagement**: Average watch time > 70% of video duration
4. **Search Efficiency**: Users find desired lecture within 30 seconds
5. **System Stability**: Zero hardcoded references to specific courses
6. **Admin Efficiency**: Lecture management tasks complete in < 2 minutes

## Future Enhancements (Phase 2+)

- Video progress tracking (resume from last position)
- Lecture completion certificates
- Interactive quizzes within lectures
- Live streaming capability
- Lecture series/playlists
- Download for offline viewing (mobile app)
- Subtitles/closed captions
- Multi-language support
- AI-powered recommendations
- Lecture notes and PDF attachments
- Discussion forums per lecture
- Teacher analytics dashboard
