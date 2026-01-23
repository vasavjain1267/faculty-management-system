# Setup Instructions

## Critical: Database Setup Required

Before testing login/registration, you **MUST** set up the database:

### Step 1: Apply Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New query**
5. Open `supabase-schema.sql` from this project
6. Copy the **entire contents** and paste into the SQL editor
7. Click **Run** (or press Ctrl/Cmd + Enter)

This will create:
- `profiles` table with user data and roles
- `jobs` table for job postings
- `applications` table for job applications
- `departments`, `leaves`, `payroll`, `announcements`, `audit_logs` tables
- Automatic trigger to create profile when user signs up
- Row Level Security (RLS) policies

### Step 2: Set Admin User Role

After creating the admin user with the script, you need to manually set their role:

1. In Supabase Dashboard, go to **SQL Editor**
2. Run this query:

```sql
UPDATE profiles 
SET role = 'admin', 
    employee_id = 'ADMIN001',
    department = 'Administration',
    designation = 'System Administrator'
WHERE email = 'frmsiiti@gmail.com';
```

3. Verify by running:

```sql
SELECT * FROM profiles WHERE email = 'frmsiiti@gmail.com';
```

### Step 3: Verify Environment Variables

Make sure your `.env` file has these variables with `NEXT_PUBLIC_` prefix:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 4: Test the Flow

1. **Test Admin Login:**
   - Go to http://localhost:3000/login
   - Login with: `frmsiiti@gmail.com` / `123456`
   - Should redirect to `/admin`

2. **Test Applicant Registration:**
   - Go to http://localhost:3000/login
   - Click "Register" tab
   - Fill in details and register
   - Should redirect to `/applicant/dashboard`
   - New profile should be created automatically with role = 'applicant'

3. **Test Applicant to Faculty Workflow:**
   - As applicant: Browse jobs at `/jobs`
   - Apply for a job
   - Login as admin
   - Go to `/admin/recruitment`
   - Click on a job posting
   - View applications and approve one
   - Applicant is promoted to faculty (role changes to 'faculty')
   - Applicant can now access `/faculty` routes

## Troubleshooting

### "Not redirecting after login"

**Cause:** Profiles table doesn't exist or trigger isn't working

**Fix:** 
1. Apply the database schema (Step 1 above)
2. Check Supabase logs for errors
3. Verify the trigger was created:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### "Access denied" or "Insufficient permissions"

**Cause:** RLS policies blocking access

**Fix:**
1. Make sure you applied the full schema (includes RLS policies)
2. Check if profile exists and has correct role:

```sql
SELECT id, email, role FROM profiles WHERE email = 'your-email@example.com';
```

### "Profile not found"

**Cause:** Trigger didn't fire when user was created

**Fix:**
1. Manually create profile:

```sql
INSERT INTO profiles (id, email, role, full_name)
VALUES (
  'user-id-from-auth-users',
  'user@example.com',
  'applicant',
  'Full Name'
);
```

2. Get user ID from:

```sql
SELECT id, email FROM auth.users WHERE email = 'user@example.com';
```

## Current Status

✅ Frontend integration complete
✅ Authentication flows implemented
✅ Role-based redirects working
✅ Middleware protection configured
✅ Admin user created in auth.users

⚠️ **PENDING:** Apply database schema in Supabase
⚠️ **PENDING:** Set admin role in profiles table
⚠️ **PENDING:** Test complete flows

## Next Steps

1. Apply the schema NOW before testing
2. Set admin role for frmsiiti@gmail.com
3. Test admin login
4. Test applicant registration
5. Test job application flow
6. Test application approval workflow
