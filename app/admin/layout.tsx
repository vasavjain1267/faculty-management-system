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
  "/admin": [{ label: "Dashboard" }],
  "/admin/recruitment": [{ label: "Dashboard", href: "/admin" }, { label: "Recruitment" }],
  "/admin/scrutiny": [{ label: "Dashboard", href: "/admin" }, { label: "Scrutiny" }],
  "/admin/leaves": [{ label: "Dashboard", href: "/admin" }, { label: "Leave Approvals" }],
  "/admin/employees": [{ label: "Dashboard", href: "/admin" }, { label: "Employees" }],
  "/admin/annexures": [{ label: "Dashboard", href: "/admin" }, { label: "Annexures" }],
  "/admin/settings": [{ label: "Dashboard", href: "/admin" }, { label: "Master Settings" }],
}

export default function AdminLayout({
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
            name: profile.full_name || authUser.email || 'Admin User',
            email: profile.email,
            role: 'Administrator',
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
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <InternalSidebar role="admin" />
        </div>

        {/* Main Content */}
        <div className="lg:pl-64">
          <InternalHeader
            breadcrumbs={breadcrumbs}
            user={user}
            sidebarContent={<InternalSidebar role="admin" />}
          />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
