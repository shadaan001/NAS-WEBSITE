# Smart School Manager - Teachers Management Module

## Overview
The Teachers Management module provides comprehensive CRUD operations, availability scheduling, student assignment, and approval workflows for managing teachers in the school management system.

## Features

### 1. Teacher CRUD Operations
- **Add Teacher**: Create new teacher records with complete information
- **Edit Teacher**: Update existing teacher details, subjects, and availability
- **Delete Teacher**: Remove teachers with automatic cleanup of student assignments
- **Search & Filter**: Search by name/email/subject, filter by subject and availability day

### 2. Teacher Data Model
Each teacher record includes:
- Basic Info: Name, email, contact, address, employee ID
- Professional: Qualification, experience, joining date
- Teaching: Subjects, assigned classes
- Photo: Base64-encoded profile photo (up to 2MB)
- Availability: Weekly schedule with day/time slots
- Assignments: List of assigned student IDs
- Approval: Boolean flag for login access control

### 3. Photo Upload System
- Upload teacher photos (JPG, PNG)
- Maximum size: 2MB
- Stored as Base64 strings in the database
- Photo preview in cards and forms
- ⚠️ **TODO**: Replace Base64 uploads with cloud storage (S3/Firebase) and save returned URLs

### 4. Weekly Availability Scheduling
- Add multiple time slots per teacher
- Select day of week (Mon-Sun)
- Set from/to times (HH:MM format)
- Client-side validation:
  - Prevents overlapping times on same day
  - Ensures end time > start time
- Display as badges on teacher cards
- ⚠️ **Note**: Editing availability won't break existing attendance records

### 5. Student Assignment System
- **Assign Students**: Multi-select interface with search
- **Bidirectional Sync**: Updates both teacher.assignedStudentIds and student.assignedTeacherIds
- **Visual Feedback**: Shows newly assigned and removed students
- **Idempotent**: Prevents duplicate assignments
- **Link to Attendance**: Only assigned students appear in teacher's attendance marking UI
- ⚠️ **TODO**: Shift relationship management to server-side transactional APIs to avoid data mismatch

### 6. Teacher Approval Workflow
- **Approval Toggle**: Admin can approve/unapprove teachers
- **Login Gating**: Only approved teachers can access Teacher Portal
- **Visual Indicators**: Green checkmark (approved) or red X (unapproved)
- ⚠️ **TODO**: In production, replace with server-side roles and audit logs

### 7. Data Seeding
- 10 placeholder teachers pre-seeded on first load
- Diverse subjects: Math, Science, Arts, PE, Commerce, etc.
- Varied availability schedules
- Mix of approved/unapproved statuses

## Usage Guide

### Adding a Teacher
1. Navigate to Admin → Teachers
2. Click "Add" button
3. Fill in Basic Info tab (name*, email* required)
4. Upload photo (optional, max 2MB)
5. Add Subjects tab - select at least one subject*
6. Add Availability tab - set weekly schedule
7. Click "Add Teacher"

### Assigning Students to Teachers
1. Find teacher card
2. Click "Assign" button
3. Search/filter students
4. Check/uncheck students to assign
5. Click "Save Assignments"
6. System automatically updates:
   - teacher.assignedStudentIds
   - student.assignedTeacherIds (bidirectional sync)

### Managing Teacher Approval
1. Find teacher card
2. Click "Approve" to grant login access
3. Click "Revoke" to block login access
4. Status reflected by icon next to teacher name

### Editing Teacher Info
1. Click "Edit" button on teacher card
2. Modify any fields across tabs
3. Click "Save Changes"

### Deleting a Teacher
1. Click "Delete" button
2. Confirm deletion in dialog
3. System automatically:
   - Removes teacher record
   - Removes teacher ID from all assigned students
   - ⚠️ **QA Note**: Run cleanup script to verify no dangling teacherIds

## Technical Details

### Data Storage
- Uses Spark's `useKV` hook for persistent storage
- Key: `admin-teachers-records`
- Syncs with `admin-students-records` for assignments

### File Structure
```
src/
├── pages/
│   └── AdminTeacherManagement.tsx    # Main teachers list page
├── components/
│   ├── TeacherCard.tsx               # Teacher display card
│   ├── TeacherForm.tsx               # Add/Edit form with tabs
│   └── TeacherAssignModal.tsx        # Student assignment UI
├── data/
│   └── mockSeed.ts                   # 10 seeded teachers
└── types/
    └── admin.ts                      # TeacherRecord & WeeklyAvailability types
```

### Edge Cases Handled
- **Duplicate Prevention**: Warns if teacher with same name+contact exists
- **Validation**: Client-side checks for required fields, time overlaps, file size
- **Orphaned Data**: Deleting teacher removes their ID from student records
- **Empty States**: Helpful messages when no teachers or filtered results

### Known Limitations & TODOs
```typescript
// TODO: Replace localStorage with backend API endpoints: /teachers, /students, /assignments
// TODO: Replace Base64 uploads with cloud storage (S3/Firebase) and return URLs
// TODO: Add server-side validation to prevent race conditions when assigning students
// TODO: In production, replace approval with server-side roles and audit logs
// QA: After teacher deletion, run script to remove dangling teacherIds from students
```

## Acceptance Tests Checklist
✅ Seeded 10 teachers visible on /admin/teachers  
✅ Add new teacher with photo → photo shows on card  
✅ Edit teacher subject list → changes reflected  
✅ Assign 3 students to teacher → both teacher.assignedStudentIds and student.assignedTeacherIds updated  
✅ Toggle approval → attempt teacher login blocked if not approved  
✅ Add availability slot → shows on card  
✅ Overlapping times blocked client-side  
✅ Delete teacher → teacher removed and ID removed from affected students  

## Integration with Attendance System
When a teacher marks attendance, the system filters students to show only those in:
- `teacher.assignedStudentIds`

This ensures teachers only see and mark attendance for their assigned students.

---

📄 **License**: The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
