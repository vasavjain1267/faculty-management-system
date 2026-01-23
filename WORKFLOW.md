# User Workflow Guide

## For New Applicants

### Step 1: Registration
1. Visit `/login` or `/register`
2. Click on **Register** tab
3. Fill in the registration form:
   - First Name & Last Name
   - Email Address
   - Phone Number
   - Password (minimum 6 characters)
   - Confirm Password
4. Click **Create Account**
5. You'll be automatically logged in and redirected to the Applicant Dashboard

**Note**: All new registrations start with the role of 'applicant'

### Step 2: Browse & Apply for Jobs
1. Navigate to **Jobs** section
2. Browse available faculty positions
3. Click on a job to view details
4. Click **Apply** to submit your application
5. Fill in the comprehensive application form:
   - Personal Information (auto-filled from registration)
   - Educational Qualifications
   - Research Interests & Publications
   - Teaching & Industry Experience
   - Upload Documents (Resume, Cover Letter, Certificates)
6. Submit your application

### Step 3: Wait for Admin Review
- Your application status will be "Pending"
- Admin will review your application
- You'll be notified of the decision

### Step 4: Upon Acceptance
When your application is **accepted**:
1. Your account is automatically promoted from 'applicant' to 'faculty'
2. You receive an Employee ID
3. You can now access the Faculty Portal

### Step 5: Login as Faculty
1. Use the **same email and password** you registered with
2. Go to `/login`
3. Sign in
4. You'll now be redirected to the Faculty Dashboard (`/faculty`)
5. Access features like:
   - View & Manage Payroll
   - Request Leaves
   - Update Profile
   - View Announcements

## For Faculty Members

### Login Process
1. Visit `/login`
2. Enter your email and password (from original registration)
   - OR click **Sign in with Google** (if you registered via Google)
3. Click **Sign In**
4. You'll be redirected to the Faculty Dashboard

### Available Features
- **Dashboard**: Overview of your information
- **Payroll**: View salary slips and payment history
- **Leaves**: Request and track leave applications
- **Profile**: Update personal information
- **Settings**: Manage account settings

## For Administrators

### Managing Applications

1. **View Job Postings**:
   - Go to `/admin/recruitment`
   - See all posted jobs with application counts

2. **Review Applications**:
   - Click the **Users icon** on any job to view applications
   - See list of all applicants with their details
   - Applications show: Name, Email, Phone, Submission Date, Status

3. **Accept an Application**:
   - Click the **green checkmark** icon
   - Confirm the action
   - This will:
     - Change application status to "Accepted"
     - Promote applicant to Faculty role
     - Generate an Employee ID
     - Log the action in audit logs
   - Applicant can now login and access faculty portal

4. **Reject an Application**:
   - Click the **red X** icon
   - Provide a reason for rejection
   - Application status changes to "Rejected"
   - Applicant remains in 'applicant' role

### Creating Admin Users

Since registration creates applicants only, admin users must be created manually:

**Option 1: Via SQL (Supabase Dashboard)**
```sql
-- First, have the person register normally
-- Then update their role:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

**Option 2: Promote Existing User**
```sql
UPDATE profiles 
SET role = 'admin', employee_id = 'ADMIN001'
WHERE id = 'user-uuid-here';
```

## User Role Transitions

```
┌─────────────┐
│  Register   │  → Creates account with role: 'applicant'
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Applicant  │  → Can apply for jobs
└──────┬──────┘
       │
       │ (Admin accepts application)
       ▼
┌─────────────┐
│   Faculty   │  → Full faculty portal access
└─────────────┘
```

## Authentication Methods

### Email/Password
- Used during registration
- Can login with these credentials anytime
- Password reset available via "Forgot Password"

### Google OAuth
- Alternative sign-in method
- Links to existing account if email matches
- Faster login process

## Important Notes

1. **Same Credentials Throughout**: Faculty members use the exact same email/password they registered with as applicants

2. **No Separate Faculty Registration**: Faculty accounts are created through the applicant → approval → faculty workflow

3. **Role-Based Access**: The system automatically routes users based on their role:
   - Applicants → `/applicant/dashboard`
   - Faculty → `/faculty`
   - Admins → `/admin`

4. **Cannot Register as Faculty Directly**: This prevents unauthorized faculty access. All faculty must go through the application review process.

5. **Password Reset**: Available for all users via the "Forgot Password" link on login page

## Troubleshooting

**Q: I was accepted but still see applicant dashboard**
A: Sign out and sign back in. The role change requires a fresh login.

**Q: Can I apply to multiple jobs?**
A: Yes! You can submit applications to different job postings.

**Q: What happens to my old applications after becoming faculty?**
A: They remain in the system for record-keeping and audit purposes.

**Q: I forgot my password**
A: Click "Forgot Password" on the login page and follow the email instructions.

**Q: Can I change my email?**
A: Contact an administrator to change your email address.
