"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { InternalSidebar } from "@/components/layout/internal-sidebar"
import { InternalHeader } from "@/components/layout/internal-header"

const breadcrumbMap: Record<string, { label: string; href?: string }[]> = {
  "/admin": [{ label: "Dashboard" }],
  "/admin/recruitment": [{ label: "Dashboard", href: "/admin" }, { label: "Recruitment" }],
  "/admin/scrutiny": [{ label: "Dashboard", href: "/admin" }, { label: "Scrutiny" }],
  "/admin/leaves": [{ label: "Dashboard", href: "/admin" }, { label: "Leave Approvals" }],
  "/admin/employees": [{ label: "Dashboard", href: "/admin" }, { label: "Employees" }],
  "/admin/settings": [{ label: "Dashboard", href: "/admin" }, { label: "Master Settings" }],
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const breadcrumbs = breadcrumbMap[pathname] || [{ label: "Dashboard" }]

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <InternalSidebar role="admin" />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <InternalHeader
          breadcrumbs={breadcrumbs}
          user={{
            name: "Dr. Registrar",
            email: "registrar@university.edu",
            role: "Administrator",
          }}
          sidebarContent={<InternalSidebar role="admin" />}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
