import type React from "react"
import { PublicNavbar } from "@/components/layout/public-navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Faculty Recruitment & Management System. All rights reserved.</p>
          <p className="mt-1">Government Faculty Affairs Department</p>
        </div>
      </footer>
    </div>
  )
}
