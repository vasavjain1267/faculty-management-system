import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { applicationId, status, rejectionReason } = await request.json()
    const supabase = await createClient()

    // Verify the user is an admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Get the application details
    const { data: application } = await supabase
      .from('applications')
      .select('applicant_id, job_id')
      .eq('id', applicationId)
      .single()

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Update application status
    const updateData: any = {
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    }

    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason
    }

    const { error: updateError } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // If application is accepted, promote applicant to faculty
    if (status === 'accepted') {
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ 
          role: 'faculty',
          employee_id: `EMP${Date.now()}`, // Generate employee ID
        })
        .eq('id', application.applicant_id)

      if (roleError) {
        console.error('Error updating role:', roleError)
        return NextResponse.json({ 
          error: 'Application updated but failed to promote to faculty' 
        }, { status: 500 })
      }

      // Log the action in audit logs
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'PROMOTE_TO_FACULTY',
          entity_type: 'application',
          entity_id: applicationId,
          new_values: { 
            applicant_id: application.applicant_id, 
            new_role: 'faculty' 
          },
        })
    }

    return NextResponse.json({ 
      success: true,
      message: status === 'accepted' 
        ? 'Application accepted and user promoted to faculty'
        : `Application ${status}`,
    })

  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
