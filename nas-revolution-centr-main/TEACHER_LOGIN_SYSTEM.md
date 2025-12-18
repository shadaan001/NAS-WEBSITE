# Teacher Login System Documentation

## Overview
Complete Teacher Login & Management System for the Smart School Manager coaching website admin panel.

- **Frontend**: React 

- **Session Manageme

✅ **Password Hashing**: SHA-256 with random salt (16-byte)
✅ **Session Timeout**: 24-hour automatic expiration
✅ **Approval System**: Admin must approve teacher login access
---
## Features Implemented

#### Add Teacher
- Fields:
  - Email (required)
  - Subjects (multi-select)
  - Qualification
✅ **Approval System**: Admin must approve teacher login access

---

## Features Implemented

### 1. Admin Portal - Teacher Management

#### Add Teacher
- Location: Admin Dashboard → Teachers → Add Button
- Fields:
  - Name (required)
  - Email (required)
  - Phone
  - Subjects (multi-select)
  - Classes Assigned
  - Qualification
  - Experience
  - Address
  - Weekly Availability
  - Profile Photo (base64 upload)

#### Edit Teacher
- Update all teacher information
- Modify subjects and availability
- Change approval status

#### Delete Teacher
- Removes teacher from system
- Automatically removes from all student assignments
- Confirmation dialog for safety

#### Create Login Credentials
- Located in Teacher Card → "Create Credentials" button
- Auto-generate or manual entry
- Username generation: `{name}{random4digits}`
- Password generation: 12 characters (uppercase, lowercase, numbers, symbols)
- Copy to clipboard functionality
- Show/hide password toggle
- Secure password hashing before storage

#### Teacher Approval System
- Toggle approval status from teacher card
- Approved teachers can login
- Unapproved teachers see "Contact Admin" message

---

### 2. Teacher Login System

#### Login Page
- URL: Teacher Portal (from homepage)
- Fields:
  - Username (created by admin)
  - Password (created by admin)
- Features:
  - Show/hide password toggle
  - Loading state during authentication
  - Error messages for invalid credentials
  - Approval status check

}



```typescript
  id: string,                    /
  email: string,
  subjects: string[],
  employeeId: string,           
  q

  availability?: {
    from: str
  }[],
 
  role: "teacher",
  userId: "{teacherId}",
  createdAt: "{ISO timestamp}",
  expiresAt: "{ISO timestamp + 24 hours}"
}
```

---

## Database Schema (KV Store)

### Teacher Record
```typescript
{
  id: string,                    // e.g., "t-001"
  name: string,
  email: string,
  contactNumber: string,
  subjects: string[],
  classesAssigned: string[],
  employeeId: string,            // e.g., "EMP001"
  joiningDate: string,           // ISO date
  qualification?: string,
  experience?: string,
  address?: string,
  profilePhoto?: string,         // base64
  availability?: {
    day: "Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"|"Sun",
    from: string,                // e.g., "09:00"
    to: string                   // e.g., "17:00"
  }[],
  assignedStudentIds?: string[],
  approved: boolean              // Login access flag
}
```

### Credentials Record
```typescript
{
  userId: string,
  username: string,
  passwordHash: string,          // SHA-256 hash
  salt: string,                  // 16-byte random salt
  role: "admin"|"teacher"|"student",
  createdAt: string,             // ISO timestamp
  createdBy: string              // Admin ID
}
```

### Storage Keys
- `admin-teachers-records`: Array<TeacherRecord>
- `credentials:{username}`: UserCredentials
- `userId:{userId}`: username mapping

---

## API Routes (Client-Side Services)

### CredentialsService

#### createCredentials()
```typescript
await CredentialsService.createCredentials(
  userId: string,
  username: string,
  password: string,
  role: "teacher",
  createdBy: string
)

// Returns: { success: boolean, message: string }
```

#### verifyCredentials()
```typescript
await CredentialsService.verifyCredentials(
  username: string,
  password: string
)

// Returns: { 
//   success: boolean, 
//   userId?: string, 
//   role?: string, 
//   message: string 
// }
```

#### updatePassword()
```typescript
await CredentialsService.updatePassword(
  username: string,
  oldPassword: string,
  newPassword: string
)

// Returns: { success: boolean, message: string }
```

#### deleteCredentials()
```typescript
await CredentialsService.deleteCredentials(userId: string)

// Returns: { success: boolean, message: string }
```

### PasswordHasher

#### hashPassword()
```typescript
await PasswordHasher.hashPassword(password: string)

// Returns: { hash: string, salt: string }
```

#### verifyPassword()
```typescript
await PasswordHasher.verifyPassword(
  password: string,
  hash: string,
  salt: string
)

// Returns: boolean
```

---

## User Flows

### Admin: Create Teacher Account

1. Navigate to Admin Dashboard
2. Click "Teachers" tab
3. Click "Add" button
4. Fill teacher details form
5. Submit to create teacher record
6. Teacher appears in list with "Not Approved" badge
7. Click "Create Credentials" button on teacher card
8. Auto-generate or manually enter username/password
9. Copy credentials to share with teacher
10. Click "Create Credentials" to save
11. Toggle approval switch to enable login

### Teacher: Login & Access Dashboard

1. Navigate to Homepage
2. Click "Teacher Portal"
3. Enter username (provided by admin)
4. Enter password (provided by admin)
5. Click "Sign In"
6. System validates credentials
7. If approved → redirect to dashboard
8. If not approved → show "Contact Admin" error

### Admin: Manage Teacher Access

1. Go to Teachers page
2. Find teacher in list
3. Toggle approval switch (green = approved, red = unapproved)
4. Edit teacher details using pencil icon
5. Delete teacher using trash icon (with confirmation)




GENERATED_PASSWO

```
---
## How to Run

- Internet conn
### Installation
# No backend installation needed!

npm install
# Start development server
```

- **Teacher Login**:

No default credentials - admin must create t

## Security Best Practices
### Implemented ✅
- Never store passwords in plain text

- S

- HTTPS for all 

- Rate limiting on login 
- Password strength requirements

---

### Admin Por
- [ ] Can edit tea
- [ ] Can create login cre


- [ ] Valid credentials
- [ ] Invalid password 
- [ ] Approved teacher can log


- [ ] Passwords
- [



1. Check if c


1. Check browser localStorage quota
3. Check console for JavaScript errors

1. Check system 
3. Chec
---
## File Structure

├── components/
│   ├── Tea

│   ├── AdminTeacherManage
│   └── Tea
│  

    └── admin.ts 




- [ ] Password strength
- [ ] Two-factor authentication

- [

- Replace Spark KV with Mo

- Setup Redis for
- Implement file upload service (AWS S3)
---
## Support
### Common Issues
- **"Account pending approval"**: Co

For technical support, conta

## License



- ✅ Teacher CRUD operations
- ✅ Password hashing (SHA-256 + s
- ✅ Approval workflow
- ✅ Role-based access control








































































































































