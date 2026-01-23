-- =====================================================
-- DEBUG ADMIN LOGIN ISSUE
-- =====================================================
-- Run these queries to diagnose the problem
-- =====================================================

-- 1. Check if user exists in auth.users
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'frmsiiti@gmail.com';

-- 2. Check if profile exists
SELECT *
FROM profiles
WHERE email = 'frmsiiti@gmail.com';

-- 3. If profile doesn't exist, create it manually
INSERT INTO profiles (id, email, role, employee_id, department, full_name)
SELECT 
  id,
  'frmsiiti@gmail.com',
  'admin',
  'ADMIN001',
  'Administration',
  'System Administrator'
FROM auth.users
WHERE email = 'frmsiiti@gmail.com'
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  employee_id = 'ADMIN001',
  department = 'Administration',
  full_name = 'System Administrator';

-- 4. Verify the profile now exists with admin role
SELECT id, email, role, employee_id, department, full_name
FROM profiles
WHERE email = 'frmsiiti@gmail.com';
