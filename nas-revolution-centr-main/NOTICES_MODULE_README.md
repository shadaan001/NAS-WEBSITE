# 📢 Notice Board Module - Implementation Guide

## Overview

The Notice Board Module provides a comprehensive announcement and communication system for the Smart School Manager. It supports two-tier notices (General + Class-wise), with full CRUD operations for admins and filtered viewing for students.

## Features Implemented

### ✅ Core Features

1. **Two-Tier Notice System**
   - **General Notices**: Visible to all students across all classes
   - **Class-Specific Notices**: Targeted to individual classes only

2. **Admin Capabilities** (`/pages/Admin/Notices.jsx`)
   - Create, edit, and delete notices
   - Pin/unpin important notices (appear at top)
   - Set expiry dates for automatic hiding
   - Upload attachments (PDF, images, documents)
   - Filter notices by class, status (active/expired/pinned)
   - Search notices by title or content
   - Export notices to CSV
   - Toggle between grid and list view

3. **Student Capabilities** (`/pages/Student/Notices.jsx`)
   - View filtered notices (general + own class only)
   - Pinned notices displayed prominently at top
   - Search and filter notices
   - Download attachments
   - Automatic hiding of expired notices

## File Structure

```
src/
├── pages/
│   ├── Admin/
│   │   └── Notices.jsx          # Admin notice management page
│   └── Student/
│       └── Notices.jsx           # Student notice viewing page
├── components/
│   ├── NoticeCard.jsx            # Reusable notice display card
│   └── NoticeForm.jsx            # Notice create/edit form modal
├── lib/
│   └── useLocalDB.ts             # Database helpers (updated with notices)
└── data/
    └── mockSeed.ts               # Sample notice data seeding
```

## Data Model

```typescript
{
  id: "n-001",
  title: "Holiday Notice",
  content: "<p>School will be closed on 25th Dec.</p>",
  pinned: true | false,
  class: null | "Class 10" | "Class 11 Science",  // null = general
  attachments: [
    { name: "file.pdf", url: "/uploads/file.pdf" }
  ],
  createdAt: "2024-12-01T10:00:00.000Z",
  expiryDate: "2025-01-05T00:00:00.000Z" | null,
  author: "Principal",
  updatedAt: "2024-12-01T10:00:00.000Z"
}
```

## Database Helpers (useLocalDB)

### Notice Management Functions

```typescript
// Get all notices
LocalDB.getAllNotices(): Notice[]

// Get specific notice by ID
LocalDB.getNotice(id: string): Notice | null

// Add new notice
LocalDB.addNotice(notice: NoticeData): Notice

// Update existing notice
LocalDB.updateNotice(id: string, updates: Partial<Notice>): Notice

// Delete notice
LocalDB.deleteNotice(id: string): void

// Get active notices for a specific class (filters by expiry)
LocalDB.getActiveNoticesForClass(className: string | null): Notice[]

// Export notices to CSV
LocalDB.exportNoticesToCSV(noticeIds?: string[]): string
```

## Usage Examples

### Admin - Creating a Notice

1. Navigate to Admin → Notices tab
2. Click "Create Notice" button
3. Fill in the form:
   - **Title**: Required
   - **Content**: Required (supports HTML)
   - **Target Class**: Select specific class or "General"
   - **Expiry Date**: Optional (must be today or later)
   - **Author**: Optional
   - **Pinned**: Toggle for important notices
   - **Attachments**: Upload files
4. Click "Create Notice"

### Admin - Filtering Notices

- **Search**: Type in search box to filter by title/content
- **Class Filter**: Dropdown to filter by class or general
- **Status Tabs**: All / Pinned / Active / Expired
- **View Mode**: Toggle between grid and list layout

### Student - Viewing Notices

1. Navigate to Student → Notices tab
2. See pinned notices at the top
3. Recent notices below (filtered to student's class + general)
4. Use search and filters to find specific notices
5. Click attachments to download (simulated)

## UI/UX Features

### Animations & Visual Feedback

- ✨ **Fade-in entrance animations** for notice cards
- 🎯 **Hover lift effect** on cards
- 📌 **Visual distinction** for pinned notices (neon border, gradient background)
- 🔄 **Smooth transitions** between filters and views
- 📱 **Responsive grid layout** (adapts to mobile)

### Accessibility

- ✅ **ARIA labels** on all interactive elements
- ⌨️ **Keyboard navigation** support
- 🎨 **High contrast** text and borders
- 📖 **Screen reader friendly** content structure

## Sample Data

The system includes 10 pre-seeded notices covering various scenarios:

1. **General Notices**: Holiday announcements, library reminders, annual day
2. **Class-Specific**: Board exam schedules, lab maintenance, field trips
3. **Pinned Notices**: Important announcements (winter break, parent meetings)
4. **Expired Notices**: Past events for testing expiry functionality
5. **With Attachments**: Documents, schedules, permission slips

## Navigation Integration

### Admin Navigation
- Added "Notices" tab to bottom navigation (Bell icon)
- Located in second row between "Tests" and "Fees"

### Student Navigation
- Added "Notices" tab to bottom navigation (Bell icon)
- Located between "Home" and "Attendance"

## Technical Implementation Notes

### State Management
- Uses `useState` for local component state
- Filters applied in real-time without page reload
- Form validation on client-side before submission

### Data Persistence
- **Current**: localStorage (for development/demo)
- **TODO**: Backend API integration
- **TODO**: Scheduled cron job for expiry handling
- **TODO**: Cloud storage for attachments

### Filtering Logic

```typescript
// Students see only:
// 1. General notices (class === null)
// 2. Class-specific notices matching their class
// 3. Non-expired notices only (expiryDate > now or null)
// 4. Pinned notices always appear first
```

## QA Acceptance Tests

### ✅ Test Results

1. **Seeded Notices Visible**: All 10 sample notices display correctly ✓
2. **Add/Edit/Delete**: CRUD operations work immediately ✓
3. **Pin Notice**: Pinned notices move to top of list ✓
4. **Class Filtering**: Students only see general + own class ✓
5. **Expiry Handling**: Expired notices hidden from students ✓
6. **Attachments**: Clickable with download simulation ✓
7. **CSV Export**: Generates correct CSV with all notice info ✓

### Additional Tests Passed

- Search functionality works across title and content
- Multiple filters work together correctly
- View mode toggle preserves filter state
- Form validation prevents invalid submissions
- Responsive layout works on mobile screens
- Animations don't interfere with usability

## TODO Items for Production

### Backend Integration
```typescript
// TODO: Replace localStorage with backend API and implement scheduled expiry
// Location: src/lib/useLocalDB.ts

// TODO: Attachments to use cloud storage instead of local paths
// Location: src/components/NoticeForm.jsx

// TODO: Server-side API should handle filtering and expiry server-side
// Location: src/pages/Admin/Notices.jsx
```

### Recommended Backend Endpoints

```
POST   /api/notices              - Create notice
GET    /api/notices              - List all notices (admin)
GET    /api/notices/:id          - Get specific notice
PUT    /api/notices/:id          - Update notice
DELETE /api/notices/:id          - Delete notice
GET    /api/notices/student/:id  - Get notices for student class
POST   /api/notices/upload       - Upload attachments
GET    /api/notices/export       - Export CSV
```

### Scheduled Jobs

```bash
# Cron job to auto-hide expired notices
# Run daily at midnight
0 0 * * * node scripts/expire-notices.js
```

## Styling & Theme

- Uses existing theme colors and variables
- Glass card effect for pinned notices
- Neon border styling from design system
- Responsive breakpoints: mobile (< 768px), tablet, desktop

## Known Limitations (Demo Mode)

1. **Attachments**: File uploads are simulated (not actually stored)
2. **Expiry**: Client-side filtering only (no scheduled background job)
3. **Persistence**: Data in localStorage (cleared on browser reset)
4. **Rich Text**: Basic HTML only (no WYSIWYG editor)
5. **Notifications**: No push notifications for new notices

## Future Enhancements

- [ ] Rich text editor (WYSIWYG) for notice content
- [ ] Email/SMS notifications for important notices
- [ ] Read receipts tracking
- [ ] Notice templates for common announcements
- [ ] Multi-language support
- [ ] Notice categories/tags
- [ ] Parent access to student notices
- [ ] Archive feature for old notices

## Support & Questions

For issues or questions about the Notice Board module, refer to:
- Main README: Project overview
- INTEGRATION.md: How notices integrate with other modules
- PRD.md: Original product requirements

---

**Implementation Status**: ✅ Complete
**Version**: 1.0.0
**Last Updated**: December 2024
