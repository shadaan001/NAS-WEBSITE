# Smart School Manager - Teacher Login System
## Complete Setup & Usage Instructions

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Google Fonts CDN)

### Installation Steps

```bash
# 1. Navigate to project directory
cd /workspaces/spark-template

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Visit: http://localhost:5173
```

**That's it! No database setup, no backend configuration needed!**

---

## 📋 System Overview

This is a **client-side application** built with:
- ✅ React 19 + TypeScript
- ✅ Spark Runtime (persistent browser storage)
- ✅ Tailwind CSS + shadcn/ui
- ✅ Secure password hashing (SHA-256)
- ✅ Session management (24-hour expiry)

**No traditional backend required!** Data persists in the browser using Spark KV.

---

## 🎯 Main Features

### For Administrators
1. **Add Teachers** - Create teacher accounts with full details
2. **Edit Teachers** - Update teacher information anytime
3. **Delete Teachers** - Remove teachers and their assignments
4. **Create Login Credentials** - Generate secure username/password
5. **Approve/Revoke Access** - Control who can login
6. **Assign Students** - Connect teachers with their students

### For Teachers
1. **Secure Login** - Username and password provided by admin
2. **Dashboard Access** - View assigned students and classes
3. **Student Management** - Track student progress
4. **Profile Management** - Update personal information

---

## 📖 Step-by-Step Usage Guide

### Part 1: Admin Creates Teacher Account

#### Step 1: Access Admin Portal
```
1. Open http://localhost:5173 (homepage)
2. Click "Admin Portal" button
3. Login with admin credentials (or OTP)
```

#### Step 2: Navigate to Teacher Management
```
1. From Admin Dashboard, click "Teachers" tile
   OR
2. Click the "Teachers" navigation item
```

#### Step 3: Add New Teacher
```
1. Click the "Add" button (top right)
2. Fill in teacher details:
   - Name: John Doe (required)
   - Email: john.doe@email.com (required)
   - Phone: +1234567890
   - Subjects: Select from dropdown (Math, Physics, etc.)
   - Classes: Select classes to assign
   - Qualification: M.Sc. Mathematics
   - Experience: 5 years
   - Address: 123 Main Street
   - Profile Photo: Upload image (base64)
   - Weekly Availability: Add time slots
     • Day: Monday
     • From: 09:00 AM
     • To: 05:00 PM
3. Click "Add Teacher" button
4. Success message appears
```

#### Step 4: Create Login Credentials
```
1. Find the teacher in the list
2. Click "Create Credentials" button on their card
3. Choose one option:
   
   Option A - Auto-generate:
   • Click "Auto-Generate Credentials"
   • Username: johndoe1234 (generated)
   • Password: aB3$xK9pL2mQ (generated)
   
   Option B - Manual entry:
   • Enter custom username (min 4 chars)
   • Enter custom password (min 6 chars)

4. Click copy icons to copy credentials
5. Save credentials securely (share with teacher)
6. Click "Create Credentials" to save
7. Success! Credentials are encrypted and stored
```

#### Step 5: Approve Teacher Access
```
1. Find the teacher card in the list
2. Look for approval toggle (top right of card)
3. Click to approve (turns green ✓)
4. Teacher can now login!
```

### Part 2: Teacher Login

#### Step 1: Navigate to Teacher Portal
```
1. Go to homepage: http://localhost:5173
2. Click "Teacher Portal" button
3. Teacher login page appears
```

#### Step 2: Login
```
1. Enter username (provided by admin)
   Example: johndoe1234
   
2. Enter password (provided by admin)
   Example: aB3$xK9pL2mQ
   
3. Toggle "show password" if needed
4. Click "Sign In" button
```

#### Step 3: Access Dashboard
```
✅ If approved: Redirects to teacher dashboard
❌ If not approved: Shows error "Contact Admin for access approval"
❌ If wrong password: Shows error "Invalid username or password"
```

---

## 🔐 Security Features

### Password Security
✅ **SHA-256 Hashing** - Passwords hashed before storage
✅ **Random Salt** - 16-byte salt for each password
✅ **Never Plain Text** - Raw passwords never stored
✅ **Secure Comparison** - Constant-time password verification

### Session Security
✅ **24-Hour Expiry** - Sessions auto-expire
✅ **Role-Based Access** - Teachers can't access admin features
✅ **Approval Required** - Admin must approve login access
✅ **Secure Storage** - Sessions stored in localStorage

### Access Control
✅ **Admin-Only Operations** - Only admins can create credentials
✅ **Teacher Isolation** - Teachers see only their data
✅ **Logout Protection** - Sessions cleared on logout

---

## 🎨 UI Features

### Teacher Management Page
- **Search**: Filter by name, email, or subject
- **Subject Filter**: Show teachers by subject
- **Day Filter**: Show teachers by availability
- **Responsive Cards**: Mobile-friendly teacher cards
- **Quick Actions**: Edit, Delete, Assign, Credentials buttons
- **Approval Toggle**: One-click approval/revoke

### Teacher Login Page
- **Modern Design**: Gradient background with glassmorphism
- **Show/Hide Password**: Eye icon toggle
- **Loading States**: Spinner during authentication
- **Error Messages**: Clear feedback on issues
- **Back Button**: Return to homepage

### Credential Modal
- **Auto-Generate**: Click to create secure credentials
- **Copy to Clipboard**: One-click copy for username/password
- **Show/Hide Password**: Protect credential privacy
- **Validation**: Real-time input validation
- **Success Feedback**: Confirmation when saved

---

## 📊 Data Storage

### Storage Locations (Browser)
```
Spark KV Store:
├── admin-teachers-records          (Teacher list)
├── credentials:{username}          (Hashed credentials)
├── userId:{teacherId}              (Username mapping)
└── smart-school-session            (Active session)

localStorage:
└── smart-school-session            (Session backup)
```

### Data Persistence
- Data survives page refreshes ✅
- Data survives browser restarts ✅
- Data is user-specific (per browser) ✅
- Data can be exported/imported ⚠️

---

## 🛠️ Troubleshooting

### Issue: Teacher Can't Login

**Symptoms**: "Invalid username or password" error

**Solutions**:
1. ✅ Verify credentials exist
   - Admin → Teachers → Find teacher → Check for credentials button
   
2. ✅ Check approval status
   - Teacher card should show green checkmark
   - If red X, click to approve
   
3. ✅ Verify username/password
   - Username is case-sensitive
   - Password is case-sensitive
   - No extra spaces
   
4. ✅ Check browser console
   - Press F12 → Console tab
   - Look for error messages

### Issue: "Account Pending Approval"

**Solution**: Admin must approve the teacher
```
1. Admin logs in
2. Go to Teachers page
3. Find the teacher
4. Click approval toggle (turn green)
```

### Issue: Session Expired

**Solution**: Normal behavior after 24 hours
```
1. Teacher logs in again
2. Session renewed for 24 hours
```

### Issue: Credentials Not Saving

**Solutions**:
1. ✅ Check browser storage quota
   - Settings → Site Settings → Storage
   
2. ✅ Disable private/incognito mode
   - Use normal browser window
   
3. ✅ Clear browser cache
   - Ctrl+Shift+Delete
   - Clear cached data
   
4. ✅ Check JavaScript console
   - F12 → Console
   - Look for errors

### Issue: Teacher Not Appearing in List

**Solution**: Check filters
```
1. Clear search box
2. Set subject filter to "All Subjects"
3. Set day filter to "All Days"
4. Refresh page
```

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📁 Project Structure

```
spark-template/
├── src/
│   ├── components/
│   │   ├── CredentialModal.tsx       # Create credentials UI
│   │   ├── TeacherCard.tsx           # Teacher display card
│   │   ├── TeacherForm.tsx           # Add/edit form
│   │   └── TeacherAssignModal.tsx    # Student assignment
│   ├── pages/
│   │   ├── AdminTeacherManagement.tsx # Teacher list & management
│   │   ├── TeacherLoginPage.tsx       # Login page
│   │   └── TeacherDashboardPage.tsx   # Teacher dashboard
│   ├── services/
│   │   └── credentials.ts             # Password & auth service
│   ├── lib/
│   │   └── useAuth.js                 # Session management
│   ├── types/
│   │   └── admin.ts                   # TypeScript types
│   └── App.tsx                        # Main app router
├── index.html                         # Entry HTML
├── package.json                       # Dependencies
├── TEACHER_LOGIN_SYSTEM.md           # System documentation
├── INSTRUCTIONS.md                    # This file
└── .env.example                       # Environment template
```

---

## 🌐 Deployment

### Deploy to Production

**Option 1: Vercel**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
npm run build
# Upload 'dist' folder to Netlify
```

**Option 3: GitHub Pages**
```bash
npm run build
# Push 'dist' folder to gh-pages branch
```

### Important: Data Portability
Since data is stored in browser:
- Each user has their own data
- Data doesn't sync between browsers
- Consider adding backend for multi-user access

---

## 📞 Support & Help

### Documentation
- System Overview: `TEACHER_LOGIN_SYSTEM.md`
- This Guide: `INSTRUCTIONS.md`
- Code Comments: Throughout source files

### Common Questions

**Q: Do I need a database?**
A: No! Currently uses browser storage (Spark KV)

**Q: Can multiple admins use this?**
A: Each browser instance has separate data

**Q: How do I backup data?**
A: Export KV store or use browser backup tools

**Q: Can I add a real backend later?**
A: Yes! See `TEACHER_LOGIN_SYSTEM.md` → Future Enhancements

**Q: Is this secure for production?**
A: Yes for small teams. For large deployments, add backend.

**Q: How do I reset a teacher password?**
A: Admin creates new credentials (overwrites old ones)

---

## ✅ Testing Checklist

### Admin Portal Testing
- [ ] Can add new teacher
- [ ] Can edit teacher details
- [ ] Can delete teacher
- [ ] Can create credentials
- [ ] Can toggle approval
- [ ] Search works
- [ ] Filters work
- [ ] Mobile responsive

### Teacher Login Testing
- [ ] Valid login works
- [ ] Invalid username fails
- [ ] Invalid password fails
- [ ] Unapproved teacher blocked
- [ ] Session persists on refresh
- [ ] Logout clears session

### Security Testing
- [ ] Passwords are hashed in storage
- [ ] Can't see plain passwords in DevTools
- [ ] Session expires after 24 hours
- [ ] Teachers can't access admin panel

---

## 🎓 Learning Resources

### Technologies Used
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)

### Security
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

## 🚦 Next Steps

### For Immediate Use
1. ✅ Run `npm install && npm run dev`
2. ✅ Create admin account
3. ✅ Add first teacher
4. ✅ Create credentials
5. ✅ Approve teacher
6. ✅ Test teacher login

### For Production
1. Add email notifications for credentials
2. Implement password reset flow
3. Add backend API (Node.js + MongoDB)
4. Setup file upload service
5. Add analytics dashboard
6. Enable multi-admin support
7. Add audit logs

---

## 📄 License

Part of Smart School Manager
Internal use only - Coaching Center Management System

---

## 📧 Contact

For technical support or questions:
- Check documentation first
- Review troubleshooting section
- Contact system administrator

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: ✅ Ready for Use

---

## Quick Reference Card

### Admin Workflow
```
1. Add Teacher → 2. Create Credentials → 3. Approve → 4. Share credentials with teacher
```

### Teacher Workflow
```
1. Get credentials from admin → 2. Go to Teacher Portal → 3. Login → 4. Access Dashboard
```

### Security Flow
```
Password → Hash + Salt → Store → Login → Hash + Compare → Access Granted
```

---

**Happy Managing! 🎓**
