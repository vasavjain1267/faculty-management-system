-- =====================================================
-- UPDATE LEAVES SCHEMA
-- =====================================================

-- 1. Create table for Leave Balances
CREATE TABLE IF NOT EXISTS leave_balances (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  balances JSONB DEFAULT '{}'::jsonb, 
  -- Example: {"CL": 12, "SL": 10, "EL": 30}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(employee_id, year)
);

ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own leave balances" ON leave_balances
  FOR SELECT USING (auth.uid() = employee_id);

CREATE POLICY "Admins can view all leave balances" ON leave_balances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update leave balances" ON leave_balances
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- 2. Update Leaves Table

-- Drop the existing constraints if possible (this might fail if dependent, but we'll try to ALTER)
ALTER TABLE leaves DROP CONSTRAINT IF EXISTS leaves_leave_type_check;
ALTER TABLE leaves DROP CONSTRAINT IF EXISTS leaves_status_check;

-- Add new columns
ALTER TABLE leaves 
ADD COLUMN IF NOT EXISTS session TEXT DEFAULT 'full' CHECK (session IN ('full', 'half_morning', 'half_afternoon')),
ADD COLUMN IF NOT EXISTS recommender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS approver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS substitute_faculty_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS remarks TEXT,
ADD COLUMN IF NOT EXISTS joining_date DATE,
ADD COLUMN IF NOT EXISTS joining_report_status TEXT CHECK (joining_report_status IN ('pending', 'submitted', 'verified')),
ADD COLUMN IF NOT EXISTS joining_report_url TEXT;

-- Add constraint for updated leave types
ALTER TABLE leaves ADD CONSTRAINT leaves_leave_type_check_new CHECK (
  leave_type IN (
    'CL', 'SL', 'EL', 'Half-day', 'RH', 'Duty Leave', 'Study Leave', 
    'Sabbatical', 'Special CL', 'Maternity', 'Paternity', 
    'Child Care Leave', 'Comp-Off', 'LWP', 'Tour'
  )
);

-- Add constraint for updated statuses
ALTER TABLE leaves ADD CONSTRAINT leaves_status_check_new CHECK (
  status IN (
    'draft', 
    'pending_recommendation', 
    'recommended', 
    'approved', 
    'rejected', 
    'returned',
    'cancelled'
  )
);

-- 3. Update Policies for Approvers and Recommenders

-- Allow Recommender to view requests assigned to them
CREATE POLICY "Recommenders can view assigned leaves" ON leaves
  FOR SELECT USING (auth.uid() = recommender_id);

-- Allow Approver to view requests assigned to them
CREATE POLICY "Approvers can view assigned leaves" ON leaves
  FOR SELECT USING (auth.uid() = approver_id);

-- Allow Substitute to view requests assigned to them
CREATE POLICY "Substitute can view assigned leaves" ON leaves
  FOR SELECT USING (auth.uid() = substitute_faculty_id);

-- Allow Recommender to update assigned leaves (to recommend status)
CREATE POLICY "Recommenders can update assigned leaves" ON leaves
  FOR UPDATE USING (auth.uid() = recommender_id);

-- Allow Approver to update assigned leaves (to approve status)
CREATE POLICY "Approvers can update assigned leaves" ON leaves
  FOR UPDATE USING (auth.uid() = approver_id);

-- Storage bucket for leave documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('leave-documents', 'leave-documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload leave docs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'leave-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Public read leave docs"
ON storage.objects FOR SELECT
USING ( bucket_id = 'leave-documents' );
