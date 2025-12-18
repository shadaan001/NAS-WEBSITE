# Attendance System - Quality Assurance & Testing Guide

## Overview
This document outlines the acceptance tests and QA procedures for the complete attendance management system (Part 8).

## ✅ Acceptance Tests

### 1. Teacher Weekly Schedule → Calendar Highlighting
**Test**: Seeded teacher weekly schedule causes scheduled days to be highlighted in the calendar.

**Steps**:
1. Open teacher portal and login as any seeded teacher (e.g., t-001)
2. Navigate to Attendance section
3. View the current month calendar

**Expected Result**:
- Days matching the teacher's availability schedule (from `teacher.availability`) are highlighted with a colored background
- Days without scheduled classes appear muted/grayed out
- Visual distinction between: Scheduled (grey-green), Held (green border), Cancelled (red border), No Class (muted)

**QA Verification**: Check `mockSeed.ts` - each teacher has `availability` array with day/time slots. Calendar should only highlight days matching these schedules.

---

### 2. Mark Attendance for Scheduled Day
**Test**: Teacher opens a scheduled day → sets Held → marks 10 students Present/Absent/Late and saves → attendance record persisted.

**Steps**:
1. Login as teacher (t-001)
2. Click on a scheduled day in the calendar
3. Modal opens - click "Set as Held"
4. Mark students with various statuses:
   - 5 students as Present
   - 3 students as Absent
   - 2 students as Late
5. Click "Save Attendance"

**Expected Result**:
- Modal displays all assigned students for this teacher
- Each student shows last 7-day attendance history (mini icons)
- Quick action buttons: "Mark All Present" / "Mark All Absent"
- After save: success toast appears with timestamp
- Calendar day updates with badge counts (5P / 3A / 2L)
- Data persists in `localStorage` under key `attendanceRecords`

**QA Check**:
```javascript
// Open browser console and run:
const records = JSON.parse(localStorage.getItem('attendanceRecords'))
console.log(records.filter(r => r.teacherId === 't-001'))
// Should show saved record with correct student statuses
```

---

### 3. Edit Existing Attendance (No Duplicates)
**Test**: Attempt to mark attendance again for same teacher/day → loads existing record and allows edits (no duplicate records).

**Steps**:
1. Click on the same day from Test #2 (already marked as Held)
2. Modal opens with existing data
3. Change 2 students from Present to Absent
4. Save again

**Expected Result**:
- Modal pre-fills with existing attendance data
- Status badge shows "Held" immediately
- Student statuses match previously saved data
- After editing and saving, only ONE record exists for this teacher/date combination
- Updated timestamp reflects the edit time

**QA Check**:
```javascript
const records = JSON.parse(localStorage.getItem('attendanceRecords'))
const teacherRecords = records.filter(r => r.teacherId === 't-001' && r.date === '2025-01-15')
console.log('Record count for this date:', teacherRecords.length) // Should be 1, not 2
console.log('Updated timestamp:', teacherRecords[0].updatedAt)
```

---

### 4. Admin Marks Day as Cancelled
**Test**: Admin marks a day Cancelled → teachers cannot mark attendance for that date (grayed out).

**Steps**:
1. Login as admin
2. Navigate to Admin → Attendance Management
3. Select a teacher from dropdown
4. Use "Bulk Mark Holiday" section:
   - Start date: 2025-01-20
   - End date: 2025-01-20
5. Click "Mark as Cancelled (Holiday)"
6. Logout and login as the same teacher
7. View calendar

**Expected Result**:
- Admin sees warning: "Manual edits are audit-sensitive — add server-side audit logs in production"
- After marking, calendar day shows red border (cancelled status)
- When teacher tries to click that day, modal opens but shows status as "Cancelled"
- No ability to mark student attendance for cancelled days
- Students list is not editable

**QA Check**: Record status should be "Cancelled", not "Held"

---

### 5. Monthly Report Export (CSV)
**Test**: Monthly report export downloads CSV with correct totals.

**Steps**:
1. Login as teacher
2. Navigate to Attendance page
3. Ensure current month has several attendance records
4. Click "Export CSV" button
5. Open downloaded file

**Expected Result**:
- CSV file downloads with name format: `attendance-[TeacherName]-[YYYY]-[MM].csv`
- Contains columns: Teacher, TeacherId, Date, Status, StudentId, StudentName, AttendanceStatus
- Row count matches number of student-attendance entries
- Totals are accurate (count Present/Absent/Late manually and verify)
- Cancelled days show in CSV but without student data

**Sample CSV format**:
```
"Teacher","TeacherId","Date","Status","StudentId","StudentName","AttendanceStatus"
"Dr. Rajesh Kumar","t-001","2025-01-15","Held","s-001","Aarav Sharma","Present"
"Dr. Rajesh Kumar","t-001","2025-01-15","Held","s-002","Diya Patel","Absent"
```

---

### 6. Student Attendance Summary (Combined Across Teachers)
**Test**: Student attendance summary reflects combined attendance across all assigned teachers and subjects.

**Steps**:
1. Open browser console
2. Run:
```javascript
import { getStudentAttendanceSummary } from '@/lib/attendanceUtils'

const summary = getStudentAttendanceSummary(
  's-001', 
  '2025-01-01', 
  '2025-01-31'
)
console.log(summary)
```

**Expected Result**:
- `summary.overall` shows combined totals across all teachers/subjects
- `summary.bySubject` breaks down by subject (e.g., Math, Chemistry)
- Percentages calculated correctly: `(present + late) / totalClasses * 100`
- If student s-001 is assigned to t-001 (Math) and t-002 (Chemistry), both subjects appear

**QA Formula**:
```
Overall % = ((totalPresent + totalLate) / totalClasses) * 100
```

Verify this matches manual calculation from localStorage records.

---

### 7. Unapproved Teacher Cannot Mark Attendance
**Test**: Permission check - unapproved teacher cannot mark attendance.

**Steps**:
1. Check `mockSeed.ts` - teachers t-008 and t-010 have `approved: false`
2. Login as admin → navigate to Teacher Management
3. Find t-008 or t-010 and note their status
4. Login as t-008 (if credentials exist) OR manually set t-001 to `approved: false` via console:
```javascript
const teachers = JSON.parse(localStorage.getItem('admin-teachers-records'))
const t = teachers.find(x => x.id === 't-001')
t.approved = false
localStorage.setItem('admin-teachers-records', JSON.stringify(teachers))
location.reload()
```
5. Try to mark attendance

**Expected Result**:
- Warning banner appears: "⚠️ Your account is pending approval. Contact admin to enable attendance marking."
- "Mark All Present" and "Mark All Absent" buttons are disabled
- Individual student attendance buttons are disabled
- Cannot save attendance
- Modal shows teacher name but blocks all interactions

---

### 8. Delete Teacher Warning (Orphan Prevention)
**Test**: Deleting a teacher warns about attendance records and suggests reassignment.

**Steps**:
1. Login as admin
2. Navigate to Teacher Management
3. Find a teacher with assigned students (e.g., t-001)
4. Click "Delete" button

**Expected Result**:
- System prevents deletion if students are assigned
- Shows dialog: "Cannot delete teacher. Please reassign students first."
- Lists assigned students
- QA script notes: "Deleting a teacher does not orphan attendance records — admin page warns and suggests reassignment"

**Technical Note**: 
- Existing attendance records remain in localStorage
- Admin can later export these for historical purposes
- In production, implement soft-delete with archived status

---

## 🎨 UI/UX & Animations

### Calendar Tile Hover
- **Expected**: Subtle neon glow + 3px lift effect
- **CSS**: `hover:scale-105 hover:shadow-lg transition-all duration-200`
- **Test**: Hover over scheduled days and verify animation is smooth

### Modal Open Animation
- **Expected**: Scale + fade-in effect
- **CSS**: `animate-scale-in` class applied to DialogContent
- **Test**: Click any calendar day, modal should zoom in smoothly

### Bulk Actions Progress
- **Expected**: When marking multiple dates as holiday, show animated progress indicator
- **Current**: Toast notification with success message
- **Enhancement Opportunity**: Add progress bar for date range operations

### Export Toast
- **Expected**: Small animated toast with progress indication
- **Implementation**: Uses `sonner` library
- **Test**: Click export, verify toast appears bottom-right with success message

---

## 🔍 Performance & Data Integrity

### Monthly Calendar Optimization
**Test**: Calendar only reads current month data, not entire year.

**Verification**:
```javascript
// In attendanceUtils.js - getAttendanceByTeacherAndMonth
// Should filter by date range, not load all records
const startDate = `${year}-${String(month).padStart(2, "0")}-01`
const endDate = `${year}-${String(month).padStart(2, "0")}-31`
```

**QA**: Check Network tab (if using API) or console logs - should not iterate over unnecessary data.

---

### Batch Writes
**Test**: Saving marks for 10 students writes a SINGLE record per day, not 10 separate records.

**Verification**:
```javascript
// After marking attendance for 10 students:
const records = JSON.parse(localStorage.getItem('attendanceRecords'))
const todayRecords = records.filter(r => r.date === '2025-01-15' && r.teacherId === 't-001')

console.log('Records for today:', todayRecords.length) // Should be 1
console.log('Students in record:', todayRecords[0].students.length) // Should be 10
```

---

### Race Condition Prevention
**Test**: Before saving, system re-reads record and merges changes.

**Check**: `createOrUpdateAttendance` in `attendanceUtils.js` and `useLocalDB.ts`

**Code to verify**:
```javascript
// Should see this pattern:
const existingRecord = allRecords[existingIndex]
allRecords[existingIndex] = {
  ...existingRecord,  // ← Preserves existing data
  ...record,          // ← Merges new changes
  createdAt: existingRecord.createdAt,  // ← Keeps original timestamp
  updatedAt: now
}
```

This prevents data loss if two admins edit simultaneously (in real production, use server-side optimistic locking).

---

## 📋 TODO Comments Verification

Ensure the following TODO comments exist in the codebase:

### In `attendanceUtils.js`:
```javascript
// TODO: Move attendance store to server and add audit logs
// TODO: Integrate timezone-aware date handling on server
// TODO: Add server-side export for heavy datasets
// TODO: Replace localStorage with transactional DB calls (server) and implement optimistic locking
```

### In `useLocalDB.ts`:
```javascript
// TODO: Move attendance helpers to server endpoints and add authentication/audit logs
// TODO: Integrate timezone-aware date handling on server
```

### In `mockSeed.ts`:
```javascript
// QA: Seeded teacher weekly schedule causes scheduled days to be highlighted in the calendar
// QA: Verify seeded data integrity
// QA: Verify each teacher has scheduled days based on availability
```

### In Admin Components:
```javascript
// WARNING: Manual edits are audit-sensitive — add server-side audit logs in production
```

---

## 🚀 Final Integration Tests

### End-to-End Flow (Student → Teacher → Admin)
1. **Student Login**: View attendance summary showing 85% across all subjects
2. **Teacher Login (t-001)**: Mark today's attendance for Math class
3. **Student Refresh**: Attendance percentage updates to reflect today's mark
4. **Admin Login**: Export all teacher attendance for the month
5. **Verify CSV**: Contains the attendance marked by t-001

**Success Criteria**: Data flows correctly across all three portals with no sync issues.

---

## 📊 Metrics to Track

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Calendar Load Time | < 1 second | Use Performance tab in DevTools |
| Modal Open Time | < 200ms | Visual inspection + Performance monitor |
| Save Operation | < 500ms | Check toast notification timing |
| CSV Export | < 2 seconds | Time from button click to download |
| Student Summary Calculation | < 100ms | Console.time() the function |

---

## 🐛 Known Limitations (Client-Side Demo)

1. **No Real-Time Sync**: If two admins edit simultaneously, last write wins
2. **No Audit Trail**: localStorage doesn't track who made changes
3. **No Timezone Support**: All dates are local browser time
4. **No Pagination**: Large datasets may slow down calendar rendering
5. **No Server Validation**: Client-side checks only (can be bypassed)

**Mitigation**: All marked with TODO comments for production migration to server APIs.

---

## ✅ Sign-Off Checklist

- [ ] All 8 acceptance tests pass
- [ ] Calendar highlights scheduled days based on teacher availability
- [ ] Attendance modal shows last 7-day history per student
- [ ] No duplicate records created for same teacher/date
- [ ] Admin bulk operations work with audit warnings
- [ ] CSV export contains accurate data
- [ ] Student summary aggregates across all teachers/subjects
- [ ] Unapproved teacher blocked from marking
- [ ] Teacher deletion prevented when students assigned
- [ ] Animations smooth on calendar, modal, and actions
- [ ] TODO comments present in all required files
- [ ] Performance meets targets (<1s calendar, <200ms modal)

---

## 🔗 Related Documentation

- [PRD.md](/PRD.md) - Product Requirements
- [TEACHERS_MODULE_README.md](/TEACHERS_MODULE_README.md) - Teacher Portal Details
- [STUDENTS_MODULE_README.md](/STUDENTS_MODULE_README.md) - Student Portal Details
- [INTEGRATION.md](/INTEGRATION.md) - System Integration Guide

---

**Last Updated**: January 2025  
**Version**: 1.0 (Part 8 - Attendance Core)  
**QA Status**: ✅ Ready for Testing
