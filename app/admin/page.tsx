"use client"

import Link from "next/link"
import { FileText, Users, Calendar, Briefcase, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { mockJobs, mockApplications, mockLeaveRequests } from "@/lib/mock-data"

const applicationData = [
  { month: "Aug", received: 45, screened: 38 },
  { month: "Sep", received: 52, screened: 45 },
  { month: "Oct", received: 38, screened: 35 },
  { month: "Nov", received: 48, screened: 40 },
  { month: "Dec", received: 55, screened: 48 },
  { month: "Jan", received: 62, screened: 52 },
]

export default function AdminDashboard() {
  const activeJobs = mockJobs.filter((j) => j.status === "active").length
  const totalApplications = mockApplications.length
  const pendingLeaves = mockLeaveRequests.filter((l) => l.status === "pending").length
  const totalEmployees = 156

  const stats = [
    {
      label: "Active Job Postings",
      value: activeJobs,
      icon: Briefcase,
      color: "text-primary",
      link: "/admin/recruitment",
    },
    {
      label: "Total Applications",
      value: totalApplications,
      icon: FileText,
      color: "text-info",
      link: "/admin/scrutiny",
    },
    {
      label: "Pending Leave Approvals",
      value: pendingLeaves,
      icon: Calendar,
      color: "text-warning",
      link: "/admin/leaves",
    },
    {
      label: "Total Employees",
      value: totalEmployees,
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
        {stats.map((stat) => (
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
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Applications Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Application Analytics</CardTitle>
            <CardDescription>Applications received vs screened over last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                received: { label: "Received", color: "hsl(var(--primary))" },
                screened: { label: "Screened", color: "hsl(var(--success))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="received" fill="hsl(var(--primary))" name="Received" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="screened" fill="hsl(var(--success))" name="Screened" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
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
          <div className="space-y-4">
            {[
              { time: "2 hours ago", event: "New application received for Assistant Professor - Computer Science" },
              { time: "5 hours ago", event: "Leave request approved for Dr. Anand Mishra" },
              { time: "1 day ago", event: "Job posting closed - Associate Professor - Physics" },
              { time: "1 day ago", event: "3 applications shortlisted for final interview" },
              { time: "2 days ago", event: "New employee verified - Dr. Priya Singh" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{activity.event}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
