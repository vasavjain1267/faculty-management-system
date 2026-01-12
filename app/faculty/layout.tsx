"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { InternalSidebar } from "@/components/layout/internal-sidebar"
import { InternalHeader } from "@/components/layout/internal-header"
import { mockFaculty } from "@/lib/mock-data"

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

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <InternalSidebar role="faculty" />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <InternalHeader
          breadcrumbs={breadcrumbs}
          user={{
            name: mockFaculty.name,
            email: mockFaculty.email,
            role: mockFaculty.designation,
          }}
          sidebarContent={<InternalSidebar role="faculty" />}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
