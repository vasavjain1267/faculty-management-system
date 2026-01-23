-- =====================================================
-- FACULTY MANAGEMENT SYSTEM - DATABASE SCHEMA
-- =====================================================
-- This schema supports a complete faculty management system including:
-- - User authentication and profiles
-- - Recruitment and job postings
-- - Job applications
-- - Leave management
-- - Payroll
-- - Announcements
-- - Audit logging
--
-- WORKFLOW:
-- 1. Applicants register via the registration form (role: 'applicant')
-- 2. They browse job openings and submit applications
-- 3. Admin reviews applications and can approve/reject
-- 4. When approved (status: 'accepted'), applicant is promoted to 'faculty'
-- 5. Faculty can then login with their original credentials to access faculty portal
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
-- Extends Supabase auth.users with additional profile information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'applicant' CHECK (role IN ('admin', 'faculty', 'applicant')),
  phone TEXT,
  avatar_url TEXT,
  department TEXT,
  employee_id TEXT UNIQUE,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  head_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Departments are viewable by everyone" ON departments
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert departments" ON departments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update departments" ON departments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- JOBS TABLE (Recruitment Postings)
-- =====================================================
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('Assistant Professor', 'Associate Professor', 'Professor')),
  description TEXT,
  requirements TEXT,
  deadline DATE NOT NULL,
  pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  application_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert jobs" ON jobs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update jobs" ON jobs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- APPLICATIONS TABLE
-- =====================================================
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'shortlisted', 'rejected', 'accepted')),
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  
  -- Education Details (JSON array)
  education JSONB DEFAULT '[]'::jsonb,
  -- Example structure:
  -- [{"degree": "PhD", "field": "Computer Science", "university": "MIT", "year": 2020, "cgpa": 3.8}]
  
  -- Research Details
  research_interests TEXT[],
  publications JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"title": "Paper Title", "journal": "IEEE", "year": 2021, "doi": "10.1234/5678"}]
  
  -- Experience
  teaching_experience JSONB DEFAULT '[]'::jsonb,
  industry_experience JSONB DEFAULT '[]'::jsonb,
  
  -- Document URLs
  resume_url TEXT,
  cover_letter_url TEXT,
  certificates_url TEXT[],
  
  -- Additional Info
  additional_notes TEXT,
  rejection_reason TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  UNIQUE(job_id, applicant_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Admins can view all applications" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Users can update their own pending applications" ON applications
  FOR UPDATE USING (
    auth.uid() = applicant_id AND status = 'pending'
  );

CREATE POLICY "Admins can update any application" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- LEAVES TABLE
-- =====================================================
CREATE TABLE leaves (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('sick', 'casual', 'earned', 'maternity', 'paternity', 'unpaid')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own leaves" ON leaves
  FOR SELECT USING (auth.uid() = employee_id);

CREATE POLICY "Admins can view all leaves" ON leaves
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Faculty can insert their own leaves" ON leaves
  FOR INSERT WITH CHECK (
    auth.uid() = employee_id AND
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Only admins can update leaves" ON leaves
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- PAYROLL TABLE
-- =====================================================
CREATE TABLE payroll (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  
  -- Salary Components
  basic_salary DECIMAL(10, 2) NOT NULL,
  hra DECIMAL(10, 2) DEFAULT 0,
  da DECIMAL(10, 2) DEFAULT 0,
  special_allowance DECIMAL(10, 2) DEFAULT 0,
  other_allowances DECIMAL(10, 2) DEFAULT 0,
  
  -- Deductions
  pf DECIMAL(10, 2) DEFAULT 0,
  professional_tax DECIMAL(10, 2) DEFAULT 0,
  tds DECIMAL(10, 2) DEFAULT 0,
  other_deductions DECIMAL(10, 2) DEFAULT 0,
  
  -- Calculated Fields
  gross_salary DECIMAL(10, 2) GENERATED ALWAYS AS (
    basic_salary + hra + da + special_allowance + other_allowances
  ) STORED,
  total_deductions DECIMAL(10, 2) GENERATED ALWAYS AS (
    pf + professional_tax + tds + other_deductions
  ) STORED,
  net_salary DECIMAL(10, 2) GENERATED ALWAYS AS (
    basic_salary + hra + da + special_allowance + other_allowances - 
    (pf + professional_tax + tds + other_deductions)
  ) STORED,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid')),
  payment_date DATE,
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'check', 'cash')),
  transaction_id TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  UNIQUE(employee_id, month, year)
);

ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payroll" ON payroll
  FOR SELECT USING (auth.uid() = employee_id);

CREATE POLICY "Admins can view all payroll" ON payroll
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can manage payroll" ON payroll
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- ANNOUNCEMENTS TABLE
-- =====================================================
CREATE TABLE announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('general', 'academic', 'administrative', 'event', 'urgent')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_audience TEXT[] DEFAULT ARRAY['all'], -- ['all', 'faculty', 'admin', 'applicant']
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published announcements viewable by target audience" ON announcements
  FOR SELECT USING (
    is_published = true AND
    (
      'all' = ANY(target_audience) OR
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = ANY(target_audience)
      )
    )
  );

CREATE POLICY "Only admins can manage announcements" ON announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- AUDIT_LOGS TABLE
-- =====================================================
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
  entity_type TEXT NOT NULL, -- e.g., 'job', 'application', 'leave'
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaves_updated_at BEFORE UPDATE ON leaves
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_updated_at BEFORE UPDATE ON payroll
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update job application count
CREATE OR REPLACE FUNCTION update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs SET application_count = application_count + 1 WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs SET application_count = application_count - 1 WHERE id = OLD.job_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_application_count
  AFTER INSERT OR DELETE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_job_application_count();

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_deadline ON jobs(deadline);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_leaves_employee_id ON leaves(employee_id);
CREATE INDEX idx_leaves_status ON leaves(status);
CREATE INDEX idx_payroll_employee_id ON payroll(employee_id);
CREATE INDEX idx_payroll_month_year ON payroll(month, year);
CREATE INDEX idx_announcements_published ON announcements(is_published);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample departments
INSERT INTO departments (name, code, description) VALUES
  ('Computer Science', 'CS', 'Department of Computer Science and Engineering'),
  ('Electrical Engineering', 'EE', 'Department of Electrical Engineering'),
  ('Mechanical Engineering', 'ME', 'Department of Mechanical Engineering'),
  ('Mathematics', 'MATH', 'Department of Mathematics'),
  ('Physics', 'PHY', 'Department of Physics')
ON CONFLICT (name) DO NOTHING;
