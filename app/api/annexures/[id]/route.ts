import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/annexures/[id] - Get specific annexure
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Fetching annexure:', id, 'for user:', user.id)

    const { data, error } = await supabase
      .from('annexures')
      .select(`
        *,
        profile:profiles!faculty_id (
          id,
          full_name,
          email,
          employee_id,
          department,
          designation_at_joining,
          doj,
          present_designation,
          present_tenure_doj,
          contact_number,
          current_address,
          permanent_address,
          passport_number,
          pan_number,
          aadhar_number,
          gender,
          nationality,
          marital_status
        ),
        approver:profiles!approved_by (
          full_name
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching annexure:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      console.error('Annexure not found:', id)
      return NextResponse.json({ error: 'Annexure not found' }, { status: 404 })
    }
    
    console.log('Found annexure:', data.id, 'faculty:', data.faculty_id)

    // Fetch dependents separately
    let dependents = []
    if (data?.faculty_id) {
      const { data: depsData, error: depsError } = await supabase
        .from('dependents')
        .select('*')
        .eq('profile_id', data.faculty_id)
      
      if (depsError) {
        console.error('Error fetching dependents:', depsError)
      } else {
        dependents = depsData || []
      }
    }
    
    // Add dependents to response
    const annexureWithDeps = {
      ...data,
      dependents
    }
    
    // Check authorization
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    console.log('User role:', profile?.role, 'Faculty ID:', annexureWithDeps.faculty_id, 'User ID:', user.id)

    if (annexureWithDeps.faculty_id !== user.id && profile?.role !== 'admin') {
      console.error('Access denied: user', user.id, 'tried to access annexure of', annexureWithDeps.faculty_id)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    console.log('Returning annexure with', dependents.length, 'dependents')
    return NextResponse.json({ annexure: annexureWithDeps })
  } catch (error: any) {
    console.error('Unexpected error in GET /api/annexures/[id]:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/annexures/[id] - Update annexure
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Get current annexure
    const { data: existing, error: fetchError } = await supabase
      .from('annexures')
      .select('faculty_id, status')
      .eq('id', id)
      .single()
    
    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Annexure not found' }, { status: 404 })
    }
    
    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const isAdmin = profile?.role === 'admin'
    const isFaculty = existing.faculty_id === user.id
    
    // Authorization checks
    if (!isAdmin && !isFaculty) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Faculty can only update DRAFT
    if (isFaculty && !isAdmin && existing.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Can only edit DRAFT annexures' },
        { status: 403 }
      )
    }
    
    // Prepare update data
    const updateData: any = {}
    
    if (body.annexure_data !== undefined) {
      updateData.annexure_data = body.annexure_data
    }
    
    if (body.status !== undefined) {
      updateData.status = body.status
    }
    
    if (isAdmin) {
      if (body.admin_remarks !== undefined) {
        updateData.admin_remarks = body.admin_remarks
      }
      if (body.signed_pdf_url !== undefined) {
        updateData.signed_pdf_url = body.signed_pdf_url
      }
      if (body.status === 'APPROVED') {
        updateData.approved_by = user.id
        updateData.approved_at = new Date().toISOString()
      }
      if (body.status === 'REJECTED') {
        updateData.approved_by = user.id
        updateData.approved_at = new Date().toISOString()
      }
    }
    
    const { data, error } = await supabase
      .from('annexures')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating annexure:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ annexure: data })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/annexures/[id] - Delete annexure (DRAFT only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only faculty can delete their own DRAFT annexures
    const { error } = await supabase
      .from('annexures')
      .delete()
      .eq('id', id)
      .eq('faculty_id', user.id)
      .eq('status', 'DRAFT')
    
    if (error) {
      console.error('Error deleting annexure:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
