-- =====================================================
-- CREATE ADMIN USER
-- =====================================================
-- This script creates an admin user with specific credentials
-- Email: frmsiiti@gmail.com
-- Password: 123456
-- 
-- IMPORTANT: Run this AFTER the main schema is applied
-- =====================================================

-- Step 1: First, you need to create the user via Supabase Auth
-- This can be done through the Supabase Dashboard or via API

-- For manual creation via Dashboard:
-- 1. Go to Authentication → Users
-- 2. Click "Add User"
-- 3. Email: frmsiiti@gmail.com
-- 4. Password: 123456
-- 5. Auto-confirm user: YES

-- Step 2: After user is created in auth.users, run this to set as admin
-- Replace 'USER_UUID_HERE' with the actual UUID from auth.users

-- Option 1: If you know the user's UUID
-- UPDATE profiles 
-- SET role = 'admin', 
--     employee_id = 'ADMIN001',
--     full_name = 'System Administrator'
-- WHERE id = 'USER_UUID_HERE';

-- Option 2: Update by email (safer)
UPDATE profiles 
SET role = 'admin', 
    employee_id = 'ADMIN001',
    full_name = 'System Administrator'
WHERE email = 'frmsiiti@gmail.com';

-- Step 3: Verify the admin user was created
SELECT id, email, full_name, role, employee_id 
FROM profiles 
WHERE email = 'frmsiiti@gmail.com';

-- =====================================================
-- ALTERNATIVE: Create user programmatically using Supabase Admin API
-- =====================================================
-- You can also run this from your application using the service role key:
--
-- const { data, error } = await supabase.auth.admin.createUser({
--   email: 'frmsiiti@gmail.com',
--   password: '123456',
--   email_confirm: true,
--   user_metadata: {
--     full_name: 'System Administrator'
--   }
-- })
--
-- Then update the profile:
-- await supabase
--   .from('profiles')
--   .update({ role: 'admin', employee_id: 'ADMIN001' })
--   .eq('email', 'frmsiiti@gmail.com')
-- =====================================================
