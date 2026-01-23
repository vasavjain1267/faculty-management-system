"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Users, Calendar, Briefcase, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingLeaves: 0,
    totalEmployees: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch active jobs count
      const { count: activeJobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Fetch total applications
      const { count: applicationsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })

      // Fetch pending leaves
      const { count: pendingLeavesCount } = await supabase
        .from('leaves')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Fetch total faculty employees
      const { count: employeesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['faculty', 'admin'])

      setStats({
        activeJobs: activeJobsCount || 0,
        totalApplications: applicationsCount || 0,
        pendingLeaves: pendingLeavesCount || 0,
        totalEmployees: employeesCount || 0,
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      label: "Active Job Postings",
      value: stats.activeJobs,
      icon: Briefcase,
      color: "text-primary",
      link: "/admin/recruitment",
    },
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-info",
      link: "/admin/scrutiny",
    },
    {
      label: "Pending Leave Approvals",
      value: stats.pendingLeaves,
      icon: Calendar,
      color: "text-warning",
      link: "/admin/leaves",
    },
    {
      label: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      color: "text-success",
      link: "/admin/employees",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Faculty Affairs Department - Overview & Management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          statsCards.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <Link href={stat.link}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Applications Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Application Analytics</CardTitle>
            <CardDescription>Real-time application statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Analytics chart will update based on actual data</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/admin/recruitment">
                <Briefcase className="mr-2 h-4 w-4" />
                Post New Job
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/admin/scrutiny">
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify Applications
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/admin/leaves">
                <Calendar className="mr-2 h-4 w-4" />
                Approve Leaves
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/admin/employees">
                <Users className="mr-2 h-4 w-4" />
                Manage Employees
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Activity feed will show real-time updates from the database</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
