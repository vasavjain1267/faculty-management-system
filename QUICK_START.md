# Faculty Management System - Quick Start Guide

## 🚀 What's Been Implemented

### ✅ Complete Authentication System
- **Registration**: New users can register as applicants
- **Login**: Email/password + Google OAuth
- **Password Reset**: Forgot password functionality
- **Role-based Routing**: Auto-redirect based on user role

### ✅ Recruitment Module (Admin)
- Create and manage job postings
- View all applications per job
- Accept/Reject applications with one click
- Automatic role promotion (applicant → faculty)

### ✅ Complete Database Schema
- 8 comprehensive tables with RLS policies
- Automated triggers for user creation and updates
- Audit logging for compliance
- Performance indexes

## 📋 User Workflow

### For Applicants (New Users)
```
Register → Browse Jobs → Apply → Wait for Approval → Become Faculty
```

1. **Register** at `/login` (Register tab)
2. **Apply** for job openings
3. **Wait** for admin review
4. **Get Promoted** when accepted
5. **Login** with same credentials to access faculty portal

### For Faculty (Approved Applicants)
```
Login (same credentials) → Access Faculty Portal
```

- Use the **same email/password** from initial registration
- Access payroll, leaves, profile management

### For Admins
```
Login → View Jobs → Review Applications → Accept/Reject
```

- View all job applications
- One-click approval promotes applicants to faculty
- Track all actions in audit logs

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Make sure your `.env` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Setup Supabase Database

**a. Apply the Schema:**
1. Go to Supabase SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Execute the SQL

**b. Configure Google OAuth:**
1. Follow detailed steps in `SUPABASE_SETUP.md`
2. Get credentials from Google Cloud Console
3. Add to Supabase Authentication → Providers

### 4. Create First Admin User

After the database schema is applied:

**Option 1: Register then promote via SQL**
```sql
-- First, register a user normally via the UI
-- Then run this in Supabase SQL Editor:
UPDATE profiles 
SET role = 'admin', employee_id = 'ADMIN001'
WHERE email = 'your-admin-email@example.com';
```

**Option 2: Direct SQL insert** (if user already exists in auth.users)
```sql
UPDATE profiles 
SET role = 'admin'
WHERE id = 'user-uuid-from-auth-users';
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📚 Key Pages

| Route | Access | Purpose |
|-------|--------|---------|
| `/login` | Public | Login & Registration |
| `/jobs` | Public | Browse job openings |
| `/applicant/dashboard` | Applicant | Applicant dashboard |
| `/faculty` | Faculty | Faculty dashboard |
| `/admin/recruitment` | Admin | Manage jobs & applications |
| `/admin/recruitment/[id]/applications` | Admin | Review applications |

## 🗂️ Database Tables

1. **profiles** - User profiles with roles
2. **jobs** - Job postings
3. **applications** - Job applications (detailed)
4. **departments** - Academic departments
5. **leaves** - Leave management
6. **payroll** - Salary records
7. **announcements** - System announcements
8. **audit_logs** - Activity tracking

## 🔐 Roles & Permissions

| Role | Access |
|------|--------|
| **applicant** | Browse jobs, Submit applications, View own applications |
| **faculty** | Faculty portal, View payroll, Request leaves, Manage profile |
| **admin** | All features, Manage jobs, Review applications, Promote users |

## 🎯 Complete Workflow Example

### Scenario: Hiring a New Faculty Member

1. **Admin Posts Job**
   - Login as admin
   - Go to `/admin/recruitment`
   - Click "Post New Job"
   - Fill details and submit

2. **Applicant Registers & Applies**
   - User visits `/login`
   - Clicks "Register" tab
   - Creates account (becomes applicant)
   - Browses jobs at `/jobs`
   - Submits application with all details

3. **Admin Reviews Application**
   - Go to `/admin/recruitment`
   - Click "Users" icon on the job
   - See list of applicants
   - Click green checkmark to accept
   - Confirm promotion

4. **System Automatically**
   - Changes application status to "accepted"
   - Promotes user role to "faculty"
   - Generates employee ID
   - Logs action in audit_logs

5. **New Faculty Logs In**
   - User signs out
   - Signs back in with same credentials
   - Now redirected to `/faculty`
   - Has access to faculty features

## 📖 Documentation Files

- **`DATABASE.md`** - Complete ER diagram and schema details
- **`SUPABASE_SETUP.md`** - Step-by-step Supabase configuration
- **`WORKFLOW.md`** - Detailed user workflows for each role
- **`supabase-schema.sql`** - Full database schema with comments

## 🔍 Testing the System

### Test Registration
```bash
# 1. Go to http://localhost:3000/login
# 2. Click Register tab
# 3. Fill form and submit
# 4. Should redirect to /applicant/dashboard
```

### Test Job Application
```bash
# 1. As applicant, go to /jobs
# 2. Click on a job
# 3. Fill application form
# 4. Submit
# 5. Check /applicant/applications
```

### Test Admin Approval
```bash
# 1. Login as admin
# 2. Go to /admin/recruitment
# 3. Click Users icon on a job
# 4. Accept an application
# 5. Verify user role changed in profiles table
```

### Test Faculty Login
```bash
# 1. After being promoted
# 2. Sign out
# 3. Sign in again with same credentials
# 4. Should redirect to /faculty
```

## 🛠️ API Endpoints

- `POST /api/applications/review` - Review and approve/reject applications
- `GET /auth/callback` - OAuth callback handler
- `POST /auth/logout` - Sign out user

## ⚡ Key Features

✅ Supabase Authentication (Email/Password + Google OAuth)  
✅ Row Level Security (RLS) on all tables  
✅ Automated triggers for user creation  
✅ Role-based access control  
✅ Application approval workflow  
✅ Automatic role promotion  
✅ Audit logging  
✅ Password reset functionality  

## 🔒 Security Features

- Row Level Security (RLS) policies on all tables
- JWT-based authentication via Supabase
- Service role key only used in API routes
- Input validation on all forms
- Audit logs for admin actions
- Secure password requirements (min 6 characters)

## 📱 Next Steps / Future Enhancements

- [ ] File upload functionality (resumes, certificates)
- [ ] Email notifications (application status updates)
- [ ] Real-time updates using Supabase Realtime
- [ ] Advanced search and filtering
- [ ] Bulk operations for admin
- [ ] Employee performance tracking
- [ ] Leave balance management
- [ ] Detailed payroll calculations

## 🐛 Troubleshooting

**Error: "Invalid login credentials"**
- Verify email and password are correct
- Check if email is confirmed (if email confirmation is enabled)

**Error: "Row Level Security policy violation"**
- Ensure user is logged in
- Check user has correct role in profiles table
- Verify RLS policies are created (re-run schema)

**Applications not showing**
- Ensure jobs table has entries
- Check applications table for data
- Verify foreign key relationships

**Role not updating after approval**
- Sign out and sign back in
- Check profiles table for role value
- Verify API route `/api/applications/review` is working

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review the database schema
3. Check Supabase logs for errors
4. Verify RLS policies are active

---

**Built with**: Next.js 16, Supabase, TypeScript, Tailwind CSS, shadcn/ui
