"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  Users,
  Briefcase,
  ClipboardCheck,
  DollarSign,
  LogOut,
  Megaphone,
  FileBarChart,
  History,
  CreditCard,
  FileText,
  FolderCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  role: "faculty" | "admin"
}

const facultyLinks = [
  { href: "/faculty", label: "Dashboard", icon: LayoutDashboard },
  { href: "/faculty/profile", label: "My Profile", icon: User },
  { href: "/faculty/leaves", label: "Leave Management", icon: Calendar },
  { href: "/faculty/payroll", label: "Payroll", icon: DollarSign },
  { href: "/faculty/forms", label: "Forms", icon: FileText },
  { href: "/faculty/settings", label: "Settings", icon: Settings },
  
]

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/recruitment", label: "Recruitment", icon: Briefcase },
  { href: "/admin/scrutiny", label: "Scrutiny", icon: ClipboardCheck },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/payroll", label: "Payroll", icon: CreditCard },
  { href: "/admin/leaves", label: "Leave Approvals", icon: Calendar },
  { href: "/admin/annexures", label: "Annexures", icon: FolderCheck },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: History },
  { href: "/admin/settings", label: "Master Settings", icon: Settings },
]

export function InternalSidebar({ role }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const links = role === "faculty" ? facultyLinks : adminLinks

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href={role === "faculty" ? "/faculty" : "/admin"} className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              {!collapsed && <span className="text-lg font-bold text-sidebar-foreground">FRMS</span>}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== `/${role}` && pathname.startsWith(link.href))

              const linkContent = (
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={link.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{link.label}</TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={link.href}>{linkContent}</div>
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-2">
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className="flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                  >
                    <LogOut className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            )}
          </div>

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-card shadow-sm"
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
