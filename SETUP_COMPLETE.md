# Complete Setup Instructions

## ✅ Step 1: Apply Database Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click "New Query"
4. Copy the entire contents of `supabase-schema.sql`
5. Paste and click "Run"
6. Wait for success message

## ✅ Step 2: Create Admin User

The admin user has already been created in Supabase Auth!

**Email**: frmsiiti@gmail.com
**Password**: 123456
**User ID**: 00811060-b8f8-466e-a0fa-d333cb2d72c8

Now you just need to update the profile:

### Option A: Via Supabase SQL Editor

Run this SQL:

```sql
UPDATE profiles 
SET role = 'admin', 
    employee_id = 'ADMIN001',
    full_name = 'System Administrator'
WHERE email = 'frmsiiti@gmail.com';

-- Verify
SELECT id, email, full_name, role, employee_id 
FROM profiles 
WHERE email = 'frmsiiti@gmail.com';
```

### Option B: If profiles table doesn't have the user yet

If the trigger didn't create the profile automatically, insert it manually:

```sql
INSERT INTO profiles (id, email, full_name, role, employee_id)
VALUES (
  '00811060-b8f8-466e-a0fa-d333cb2d72c8',
  'frmsiiti@gmail.com',
  'System Administrator',
  'admin',
  'ADMIN001'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  employee_id = 'ADMIN001',
  full_name = 'System Administrator';
```

## ✅ Step 3: Test Login

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login`

3. Sign in with:
   - **Email**: frmsiiti@gmail.com
   - **Password**: 123456

4. You should be redirected to `/admin` dashboard

## ✅ What Has Been Implemented

### 1. **Authentication System**
- ✅ Login with email/password
- ✅ Login with Google OAuth
- ✅ Registration for new applicants
- ✅ Password reset functionality
- ✅ Auto-logout button in header

### 2. **Role-Based Access Control**
- ✅ **Admin**: Full access to admin panel
- ✅ **Faculty**: Access to faculty portal only
- ✅ **Applicant**: Access to applicant dashboard only
- ✅ Middleware prevents unauthorized access
- ✅ Automatic redirection based on role

### 3. **Protected Routes**
- ✅ `/admin/*` - Admin only
- ✅ `/faculty/*` - Faculty and Admin only  
- ✅ `/applicant/*` - Applicant only
- ✅ Auto-redirect if accessing wrong area

### 4. **Enhanced UI**
- ✅ **Logged Out**: Shows Login/Register buttons
- ✅ **Logged In**: Shows user avatar, name, role
- ✅ Profile dropdown with:
  - Dashboard link
  - Settings link
  - Logout button
- ✅ Different navbar for public vs authenticated users

### 5. **Backend Integration**
- ✅ Real user data from Supabase
- ✅ Profile fetching in layouts
- ✅ Recruitment connected to database
- ✅ Application approval workflow
- ✅ Audit logging

## 🔒 Access Control Matrix

| Route | Applicant | Faculty | Admin |
|-------|-----------|---------|-------|
| `/` | ✅ | ✅ | ✅ |
| `/login` | ✅ | ✅ | ✅ |
| `/jobs` | ✅ | ✅ | ✅ |
| `/applicant/*` | ✅ | ❌ → `/faculty` | ❌ → `/admin` |
| `/faculty/*` | ❌ → `/applicant` | ✅ | ✅ |
| `/admin/*` | ❌ → `/applicant` | ❌ → `/faculty` | ✅ |

## 🎯 Testing Access Control

### Test 1: Admin Access
1. Login as: frmsiiti@gmail.com
2. Should go to: `/admin`
3. Can access: All admin pages
4. Cannot access: `/applicant/*` (auto-redirects to `/admin`)

### Test 2: Create Applicant
1. Register new user at `/register`
2. Should go to: `/applicant/dashboard`
3. Can access: Jobs, applications
4. Cannot access: `/admin/*` or `/faculty/*` (auto-redirects)

### Test 3: Promote Applicant to Faculty
1. Login as admin
2. Go to `/admin/recruitment/[jobId]/applications`
3. Accept an application
4. That user logs out and back in
5. Should now go to: `/faculty`
6. Can access: Faculty pages
7. Cannot access: `/admin/*` (auto-redirects to `/faculty`)

## 🔧 Troubleshooting

### Issue: Can't login as admin
**Solution**: Run the SQL to set role = 'admin' in profiles table

### Issue: Redirected to wrong dashboard
**Solution**: 
1. Check profiles table for correct role
2. Clear browser cookies/cache
3. Sign out and sign in again

### Issue: "Could not find table profiles"
**Solution**: Run the `supabase-schema.sql` in SQL Editor first

### Issue: No user shown in header after login
**Solution**: 
1. Check browser console for errors
2. Verify profile exists in database
3. Refresh the page

## 📝 Next Steps

1. ✅ Apply database schema
2. ✅ Update admin user profile via SQL
3. ✅ Test login
4. ✅ Create more test users
5. ✅ Test role-based access control
6. ✅ Configure Google OAuth (optional)

## 🎉 You're All Set!

The system is now fully configured with:
- Complete authentication
- Role-based access control
- Protected routes
- Real-time user info in UI
- Backend integration
- Admin user ready to use

Login with **frmsiiti@gmail.com** / **123456** and start managing your faculty!
