# Faculty Management System - Database Design

## Entity-Relationship Diagram

```
┌─────────────────────┐
│    auth.users       │ (Supabase Auth)
│─────────────────────│
│ id (PK)             │
│ email               │
│ encrypted_password  │
└──────────┬──────────┘
           │
           │ 1:1
           │
┌──────────▼──────────┐
│     profiles        │
│─────────────────────│
│ id (PK, FK)         │
│ email               │
│ full_name           │
│ role                │
│ phone               │
│ department          │
│ employee_id         │
└──────────┬──────────┘
           │
           │ 1:N
           │
    ┌──────┴───────┬──────────────┬─────────────┬──────────────┐
    │              │              │             │              │
┌───▼────┐   ┌────▼─────┐  ┌─────▼────┐  ┌────▼─────┐  ┌────▼─────┐
│  jobs  │   │applications│ │ leaves   │  │ payroll  │  │announce- │
│        │   │            │ │          │  │          │  │  ments   │
└────────┘   └────────────┘ └──────────┘  └──────────┘  └──────────┘
```

## Core Tables

### 1. **profiles**
Extends Supabase auth.users with application-specific user data
- **Primary Key**: id (UUID, references auth.users)
- **Fields**: email, full_name, role, phone, department, employee_id, etc.
- **Roles**: admin, faculty, applicant
- **Relationships**: 
  - Has many: applications, leaves, payroll records, created jobs
  - Referenced by: departments (as head)

### 2. **jobs** (Recruitment Postings)
Manages job postings and recruitment notifications
- **Primary Key**: id (UUID)
- **Fields**: title, department, post_type, description, deadline, status, pdf_url
- **Status**: active, closed, draft
- **Post Types**: Assistant Professor, Associate Professor, Professor
- **Relationships**:
  - Has many: applications
  - Belongs to: profiles (created_by)

### 3. **applications**
Stores job applications with comprehensive applicant data
- **Primary Key**: id (UUID)
- **Foreign Keys**: job_id, applicant_id
- **Status**: pending, under_review, shortlisted, rejected, accepted
- **Data Includes**:
  - Personal info (name, email, phone, address)
  - Education (JSONB array of degrees)
  - Research (interests, publications as JSONB)
  - Experience (teaching, industry as JSONB)
  - Documents (resume, cover letter, certificates)
- **Relationships**:
  - Belongs to: jobs, profiles (as applicant)
  - Reviewed by: profiles (as reviewer)

### 4. **departments**
Academic departments in the institution
- **Primary Key**: id (UUID)
- **Fields**: name, code, description
- **Relationships**:
  - Has one: profiles (as head)

### 5. **leaves**
Faculty leave management
- **Primary Key**: id (UUID)
- **Foreign Keys**: employee_id, approved_by
- **Leave Types**: sick, casual, earned, maternity, paternity, unpaid
- **Status**: pending, approved, rejected
- **Relationships**:
  - Belongs to: profiles (employee)
  - Approved by: profiles (admin)

### 6. **payroll**
Employee salary and payment records
- **Primary Key**: id (UUID)
- **Foreign Key**: employee_id
- **Components**:
  - Earnings: basic_salary, hra, da, special_allowance
  - Deductions: pf, professional_tax, tds
  - Calculated: gross_salary, total_deductions, net_salary (computed)
- **Status**: pending, processed, paid
- **Relationships**:
  - Belongs to: profiles (employee)

### 7. **announcements**
System-wide announcements and notifications
- **Primary Key**: id (UUID)
- **Foreign Key**: created_by
- **Target Audience**: Array ['all', 'faculty', 'admin', 'applicant']
- **Priority**: low, normal, high, urgent
- **Relationships**:
  - Belongs to: profiles (creator)

### 8. **audit_logs**
System activity tracking for security and compliance
- **Primary Key**: id (UUID)
- **Foreign Key**: user_id
- **Fields**: action, entity_type, entity_id, old_values, new_values, ip_address
- **Purpose**: Track all significant actions for audit trail

## Key Features

### Security (Row Level Security)
All tables have RLS enabled with policies:
- Users can only view/edit their own data
- Admins have full access to all records
- Public data (jobs, departments) viewable by all

### Automated Triggers
1. **updated_at**: Auto-updates timestamp on record modification
2. **handle_new_user**: Creates profile when user signs up
3. **update_application_count**: Maintains job application count

### Data Integrity
- Foreign key constraints ensure referential integrity
- CHECK constraints enforce valid enum values
- UNIQUE constraints prevent duplicate entries
- JSONB fields for flexible, structured data storage

## Indexes
Performance indexes on frequently queried columns:
- Profile roles and emails
- Job status and deadlines
- Application statuses
- Leave and payroll employee lookups
- Audit log timestamps

## Setup Instructions

### 1. Configure Google OAuth in Supabase
1. Go to your Supabase project dashboard
2. Navigate to Authentication → Providers
3. Enable Google provider
4. Add authorized redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
5. Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/):
   - Create OAuth 2.0 Client ID
   - Add authorized JavaScript origins
   - Add authorized redirect URIs

### 2. Apply Database Schema
1. Go to Supabase SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL script
4. Verify all tables are created successfully

### 3. Environment Variables
Ensure your `.env` file has:
```env
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Test the Setup
1. Run your Next.js application: `npm run dev`
2. Try logging in with Google
3. Try creating a job posting (admin role required)
4. Submit a job application

## Database Relationships Summary

```
profiles (1) ──── (N) applications
profiles (1) ──── (N) leaves
profiles (1) ──── (N) payroll
profiles (1) ──── (N) jobs (as creator)
profiles (1) ──── (N) announcements (as creator)
profiles (1) ──── (1) departments (as head)

jobs (1) ──── (N) applications

departments (N) ──── (1) profiles (as head)
```

## Data Flow

### Registration & Authentication Flow
1. **New User Registration**:
   - User fills registration form with name, email, phone, password
   - Supabase Auth creates entry in `auth.users`
   - Trigger automatically creates `profiles` record with role='applicant'
   - User is redirected to applicant dashboard

2. **Login**:
   - User signs in with email/password or Google OAuth
   - System checks user role in `profiles` table
   - Redirects based on role:
     - admin → /admin
     - faculty → /faculty  
     - applicant → /applicant/dashboard

### Recruitment & Promotion Workflow
1. **Job Posting**: Admin creates job posting → `jobs` table

2. **Application Submission**: 
   - Applicant (registered user) browses jobs
   - Submits application with education, research, documents → `applications` table
   - Application count auto-increments on `jobs`

3. **Application Review**:
   - Admin views applications at `/admin/recruitment/[jobId]/applications`
   - Can accept or reject applications
   - If rejected: status updated with rejection reason
   - If accepted:
     - Application status → 'accepted'
     - User role promoted: 'applicant' → 'faculty'
     - Employee ID generated
     - Action logged in `audit_logs`

4. **Faculty Access**:
   - Once promoted, user logs in with same credentials
   - Now has access to faculty portal (/faculty)
   - Can view payroll, request leaves, update profile

### Authentication Flow
1. User signs in via email/password or Google OAuth
2. Supabase Auth creates entry in `auth.users`
3. Trigger automatically creates corresponding `profiles` record
4. User is redirected based on role (admin/faculty/applicant)

### Recruitment Flow
1. Admin creates job posting → `jobs` table
2. Applicant submits application → `applications` table
3. Application count auto-increments on `jobs`
4. Admin reviews applications → updates status
5. System logs all actions → `audit_logs` table

### Leave Management Flow
1. Faculty submits leave request → `leaves` table
2. Admin reviews and approves/rejects
3. Status updated with approval details
4. Leave balance can be tracked (future enhancement)

### Payroll Flow
1. Admin generates payroll for month/year → `payroll` table
2. System calculates gross, deductions, net (computed columns)
3. Admin processes payment
4. Status updated to 'paid' with transaction details
