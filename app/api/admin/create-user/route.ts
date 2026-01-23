import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * API Route to create admin user programmatically
 * POST /api/admin/create-user
 * 
 * This should be protected and only run once during setup
 */
export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Create user in Supabase Auth using service role
    // Note: This requires SUPABASE_SERVICE_ROLE_KEY
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || 'Admin User'
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Update profile to set as admin
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: 'admin',
        employee_id: 'ADMIN001',
        full_name: fullName || 'Admin User'
      })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json(
        { error: 'User created but failed to set admin role' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    })

  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
