# 📋 Job Posting with PDF Upload - Setup Guide

## What I've Implemented ✅

### 1. Admin Side - Post Job Openings
- **Location**: `/admin/recruitment`
- **Features**:
  - Create new job postings with full details
  - Upload PDF job descriptions (max 5MB)
  - Set deadline, department, post type
  - Add description and requirements
  - All data saved to Supabase

### 2. Public Side - Current Openings
- **Location**: `/jobs`
- **Features**:
  - Real-time data from Supabase (no mock data)
  - Filter by department and post type
  - Search functionality
  - View/download PDF job descriptions
  - Apply directly from job cards
  - Shows deadline with urgency indicator

### 3. File Upload System
- PDF upload to Supabase Storage
- Automatic file validation (PDF only, max 5MB)
- Public URL generation for PDFs
- Download/view PDFs from job listings

## Setup Required

### Step 1: Create Storage Bucket in Supabase

You need to create a storage bucket for PDF uploads:

**Option A: Using SQL (Recommended)**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `setup-storage.sql`
3. Run the query
4. This creates the `documents` bucket with proper permissions

**Option B: Using Dashboard**
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `documents`
4. Make it **Public**
5. Click "Create bucket"

### Step 2: Test the Flow

1. **Login as Admin**
   - Go to http://localhost:3000/login
   - Email: `frmsiiti@gmail.com`
   - Password: `123456`

2. **Create a Job Posting**
   - Navigate to `/admin/recruitment`
   - Click "Post New Job"
   - Fill in:
     - Job Title (e.g., "Assistant Professor - Computer Science")
     - Department
     - Post Type (Assistant/Associate/Professor)
     - Deadline
     - Description
     - Requirements
     - Upload PDF (optional)
   - Click "Post Job"

3. **View in Current Openings**
   - Logout or open incognito window
   - Go to http://localhost:3000/jobs
   - You'll see your posted job
   - Can filter, search, and view PDF
   - Click "Apply Now" to apply

## Features Overview

### Admin Recruitment Page
```
/admin/recruitment
├── View all job postings
├── Post new job button
│   ├── Job title
│   ├── Department dropdown
│   ├── Post type (Assistant/Associate/Professor)
│   ├── Deadline picker
│   ├── Description textarea
│   ├── Requirements textarea
│   └── PDF upload (with validation)
├── Real-time application count
└── View applications per job
```

### Public Jobs Page
```
/jobs
├── Search bar (by title/department)
├── Filter by department
├── Filter by post type
├── Job cards showing:
│   ├── Title & department
│   ├── Status badge
│   ├── Deadline (with urgency indicator)
│   ├── Post type
│   ├── Description preview
│   ├── View PDF button (if uploaded)
│   └── Apply Now button
└── Real-time updates from database
```

## PDF Upload Details

### Validation
- **File type**: Only PDF allowed
- **File size**: Maximum 5MB
- **Automatic upload**: Uploads to Supabase Storage on file selection
- **Error handling**: Shows errors if validation fails

### Storage Structure
```
documents/
└── job-descriptions/
    ├── 1736895234-job-description.pdf
    ├── 1736895456-computer-science-professor.pdf
    └── ...
```

### Access
- **Admins**: Can upload, update, delete files
- **Public**: Can view/download files (read-only)
- **Authenticated users**: Can upload files

## Database Schema Used

### Jobs Table
```sql
jobs (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  post_type TEXT NOT NULL,  -- 'Assistant Professor', 'Associate Professor', 'Professor'
  description TEXT,
  requirements TEXT,
  deadline DATE NOT NULL,
  pdf_url TEXT,             -- Public URL to PDF in storage
  status TEXT DEFAULT 'active',
  application_count INTEGER DEFAULT 0,
  created_by UUID,          -- Admin who created the job
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Troubleshooting

### Issue: "Failed to upload PDF"
**Solution**: 
1. Make sure you created the storage bucket (see Step 1)
2. Check that bucket is named exactly `documents`
3. Verify bucket is set to public

### Issue: "PDF doesn't show in job listing"
**Solution**:
1. Check if `pdf_url` field is populated in database
2. Verify storage bucket exists and is public
3. Check browser console for CORS errors

### Issue: "No jobs showing on /jobs page"
**Solution**:
1. Make sure you created at least one job with status='active'
2. Check browser console for errors
3. Verify Supabase connection in .env file

## Next Steps

After creating jobs:
1. **Test application flow**: Apply for a job as an applicant
2. **Review applications**: Go to `/admin/recruitment` → Click job → View applications
3. **Approve applicants**: Promote them to faculty
4. **Manage job status**: Close jobs when deadline passes

## File Locations

- **Admin recruitment page**: `app/admin/recruitment/page.tsx`
- **Public jobs page**: `app/(public)/jobs/page.tsx`
- **Storage setup SQL**: `setup-storage.sql`
- **Database schema**: `supabase-schema.sql`

---

**Everything is ready! Just create the storage bucket and start posting jobs!**
