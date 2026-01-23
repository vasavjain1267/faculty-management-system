-- =====================================================
-- SET ADMIN ROLE FOR EXISTING USER
-- =====================================================
-- Run this AFTER applying supabase-schema.sql
-- This sets the admin role for frmsiiti@gmail.com
-- =====================================================

-- Update the profile to admin role
UPDATE profiles 
SET 
  role = 'admin',
  employee_id = 'ADMIN001',
  department = 'Administration',
  full_name = 'System Administrator'
WHERE email = 'frmsiiti@gmail.com';

-- Verify the update
SELECT 
  id,
  email,
  role,
  employee_id,
  department,
  full_name,
  created_at
FROM profiles 
WHERE email = 'frmsiiti@gmail.com';

-- Expected result:
-- role: admin
-- employee_id: ADMIN001
-- department: Administration
-- full_name: System Administrator
