"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { InternalSidebar } from "@/components/layout/internal-sidebar"
import { InternalHeader } from "@/components/layout/internal-header"
import { ProtectedRoute } from "@/components/protected-route"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

const breadcrumbMap: Record<string, { label: string; href?: string }[]> = {
  "/faculty": [{ label: "Dashboard" }],
  "/faculty/profile": [{ label: "Dashboard", href: "/faculty" }, { label: "My Profile" }],
  "/faculty/leaves": [{ label: "Dashboard", href: "/faculty" }, { label: "Leave Management" }],
  "/faculty/payroll": [{ label: "Dashboard", href: "/faculty" }, { label: "Payroll" }],
  "/faculty/settings": [{ label: "Dashboard", href: "/faculty" }, { label: "Settings" }],
}

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const breadcrumbs = breadcrumbMap[pathname] || [{ label: "Dashboard" }]
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchUser()
  }, [])

  async function fetchUser() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profile) {
          setUser({
            name: profile.full_name || authUser.email || 'Faculty Member',
            email: profile.email,
            role: profile.department || 'Faculty',
            avatar: profile.avatar_url
          })
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <InternalSidebar role="faculty" />
        </div>

        {/* Main Content */}
        <div className="lg:pl-64">
          <InternalHeader
            breadcrumbs={breadcrumbs}
            user={user}
            sidebarContent={<InternalSidebar role="faculty" />}
          />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
