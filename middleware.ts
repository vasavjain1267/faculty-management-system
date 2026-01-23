import { updateSession } from './lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for auth callback routes
  if (pathname.startsWith('/auth/')) {
    return await updateSession(request)
  }

  // Update session
  let response = await updateSession(request)

  // Protected routes that require authentication
  const isAdminRoute = pathname.startsWith('/admin')
  const isFacultyRoute = pathname.startsWith('/faculty')
  const isApplicantRoute = pathname.startsWith('/applicant')

  // If accessing a protected route, check authentication
  if (isAdminRoute || isFacultyRoute || isApplicantRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // We don't need to set cookies here
          },
          remove(name: string, options: any) {
            // We don't need to remove cookies here
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // If no user, redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      // Role-based access control
      if (isAdminRoute && profile.role !== 'admin') {
        // Non-admin trying to access admin routes
        if (profile.role === 'faculty') {
          return NextResponse.redirect(new URL('/faculty', request.url))
        } else {
          return NextResponse.redirect(new URL('/applicant/dashboard', request.url))
        }
      }

      if (isFacultyRoute && !['faculty', 'admin'].includes(profile.role)) {
        // Applicant trying to access faculty routes
        return NextResponse.redirect(new URL('/applicant/dashboard', request.url))
      }

      if (isApplicantRoute && profile.role !== 'applicant') {
        // Faculty/Admin trying to access applicant routes
        if (profile.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else if (profile.role === 'faculty') {
          return NextResponse.redirect(new URL('/faculty', request.url))
        }
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
