/**
 * One-time script to create admin user
 * Run this with: node --env-file=.env scripts/create-admin.mjs
 * Or: node -r dotenv/config scripts/create-admin.mjs
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file manually
const envPath = join(__dirname, '..', '.env')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["'](.*)["']$/, '$1')
      process.env[key] = value
    }
  })
} catch (error) {
  console.error('Error loading .env file:', error.message)
  process.exit(1)
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing environment variables!')
  console.error('SUPABASE_URL:', SUPABASE_URL)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '[PRESENT]' : '[MISSING]')
  process.exit(1)
}

async function createAdminUser() {
  const email = 'frmsiiti@gmail.com'
  const password = '123456'

  console.log('Creating admin user...')
  console.log('Email:', email)

  try {
    // Create user via Supabase Admin API
    const createUserResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: false,  // No email confirmation required for admin
        user_metadata: {
          full_name: 'System Administrator'
        }
      })
    })

    const userData = await createUserResponse.json()
    
    if (!createUserResponse.ok) {
      console.error('Error creating user:', userData)
      return
    }

    console.log('✓ User created in auth.users')
    console.log('User ID:', userData.id)

    // Update profile to set as admin
    const updateProfileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        role: 'admin',
        employee_id: 'ADMIN001',
        full_name: 'System Administrator'
      })
    })

    if (!updateProfileResponse.ok) {
      const error = await updateProfileResponse.text()
      console.error('Error updating profile:', error)
      return
    }

    console.log('✓ Profile updated with admin role')
    console.log('\n✅ Admin user created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('\nYou can now login at http://localhost:3000/login')

  } catch (error) {
    console.error('Error:', error)
  }
}

createAdminUser()
