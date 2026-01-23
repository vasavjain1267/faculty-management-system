'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: ('admin' | 'faculty' | 'applicant')[]
  redirectTo?: string
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(redirectTo)
        return
      }

      // Get user profile to check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile) {
        router.push(redirectTo)
        return
      }

      // Check if user's role is in allowed roles
      if (allowedRoles.includes(profile.role as any)) {
        setIsAuthorized(true)
      } else {
        // Redirect based on actual role
        if (profile.role === 'admin') {
          router.push('/admin')
        } else if (profile.role === 'faculty') {
          router.push('/faculty')
        } else {
          router.push('/applicant/dashboard')
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push(redirectTo)
    }
  }

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
