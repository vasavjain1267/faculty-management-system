import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/annexures - Get all annexures for current faculty
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let query = supabase
      .from('annexures')
      .select(`
        *,
        profile:profiles!faculty_id (
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
          gender,
          nationality
        ),
        approver:profiles!approved_by (
          full_name
        )
      `)
      .eq('faculty_id', user.id)
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching annexures:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ annexures: data })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/annexures - Create new annexure
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { annexure_type, annexure_data, status = 'DRAFT' } = body
    
    if (!annexure_type || !annexure_data) {
      return NextResponse.json(
        { error: 'annexure_type and annexure_data are required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('annexures')
      .insert({
        faculty_id: user.id,
        annexure_type,
        annexure_data,
        status,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating annexure:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ annexure: data }, { status: 201 })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
