# Supabase Integration Setup Guide

## Prerequisites
- Supabase project created at [supabase.com](https://supabase.com)
- Google Cloud Console project for OAuth

## Step-by-Step Setup

### 1. Google OAuth Configuration

#### A. Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if not done:
   - User Type: External
   - App name: Faculty Management System
   - Add authorized domains
6. Create OAuth Client ID:
   - Application type: Web application
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://yourdomain.com
     ```
   - Authorized redirect URIs:
     ```
     https://your-project.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     https://yourdomain.com/auth/callback
     ```
7. Copy **Client ID** and **Client Secret**

#### B. Supabase Configuration
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and enable it
4. Paste your Google **Client ID** and **Client Secret**
5. Save changes

### 2. Database Setup

1. Open **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy entire contents of `supabase-schema.sql`
4. Execute the SQL script
5. Verify tables in **Table Editor**:
   - ✓ profiles
   - ✓ departments
   - ✓ jobs
   - ✓ applications
   - ✓ leaves
   - ✓ payroll
   - ✓ announcements
   - ✓ audit_logs

### 3. Storage Setup (Optional - for file uploads)

1. Go to **Storage** in Supabase dashboard
2. Create buckets:
   - `resumes` (for applicant resumes)
   - `certificates` (for applicant certificates)
   - `job-pdfs` (for job notification PDFs)
3. Set bucket policies for security:

```sql
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. Environment Variables

Update your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site URL (important for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Create Admin User

After deploying, you need to create an admin user:

1. Sign in with Google or create an account
2. Go to Supabase **Table Editor** → **profiles**
3. Find your user record
4. Update the `role` field to `'admin'`

Or use SQL:

```sql
-- Update specific user to admin by email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 6. Testing

1. **Test Authentication**:
   ```bash
   npm run dev
   ```
   - Navigate to `/login`
   - Try signing in with Google
   - Verify redirect to appropriate dashboard

2. **Test Job Creation** (as admin):
   - Go to `/admin/recruitment`
   - Click "Post New Job"
   - Fill in details and submit
   - Verify job appears in table

3. **Test Application Submission**:
   - Sign out and sign in as applicant
   - Navigate to `/jobs`
   - Apply to a job
   - Check if application is saved in database

## Troubleshooting

### Issue: "Invalid OAuth Callback"
**Solution**: Ensure redirect URLs match exactly in both Google Console and Supabase

### Issue: "Row Level Security Policy Violation"
**Solution**: Check if RLS policies are properly created. Re-run schema script if needed.

### Issue: "User has no profile"
**Solution**: Verify the `handle_new_user()` trigger is active:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Issue: Cannot create jobs (as admin)
**Solution**: Ensure your profile role is set to 'admin':
```sql
SELECT id, email, role FROM profiles WHERE email = 'your-email@example.com';
```

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use service role key only in API routes** - Never expose to client
3. **Validate all user inputs** - Especially in applications
4. **Regular security audits** - Check audit_logs regularly
5. **Implement rate limiting** - Prevent abuse of public endpoints

## Next Steps

1. ✓ Database schema applied
2. ✓ Authentication configured
3. ✓ Login and recruitment implemented
4. ⬜ Implement file upload functionality
5. ⬜ Add email notifications (Supabase Edge Functions)
6. ⬜ Implement real-time updates (Supabase Realtime)
7. ⬜ Add analytics dashboard
8. ⬜ Implement search and filtering
9. ⬜ Add bulk operations for admin

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js App Router + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
