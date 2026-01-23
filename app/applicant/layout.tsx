"use client"

import type React from "react"
import { PublicNavbar } from "@/components/layout/public-navbar"
import { ProtectedRoute } from "@/components/protected-route"

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['applicant']}>
      <div className="min-h-screen flex flex-col">
        <PublicNavbar />
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
