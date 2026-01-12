"use client"

import { Calendar, Clock, Award, Briefcase, ChevronRight, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockFaculty, mockNotices, mockLeaveRequests } from "@/lib/mock-data"
import { StatusBadge } from "@/components/ui/status-badge"
import Link from "next/link"

export default function FacultyDashboard() {
  const faculty = mockFaculty
  const myLeaves = mockLeaveRequests.filter((l) => l.facultyId === faculty.id)

  // Calculate service years
  const joiningDate = new Date(faculty.joiningDate)
  const serviceYears = Math.floor((Date.now() - joiningDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))

  const stats = [
    {
      label: "Casual Leave Balance",
      value: faculty.leaveBalance.casual,
      suffix: "days",
      icon: Calendar,
      color: "text-primary",
    },
    {
      label: "Pending Tasks",
      value: 3,
      suffix: "",
      icon: Clock,
      color: "text-warning",
    },
    {
      label: "Next Appraisal",
      value: "Mar 2026",
      suffix: "",
      icon: Award,
      color: "text-success",
    },
    {
      label: "Service Years",
      value: serviceYears,
      suffix: "years",
      icon: Briefcase,
      color: "text-info",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {faculty.name}</h1>
        <p className="text-muted-foreground">
          {faculty.designation} • {faculty.department}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stat.value}
                  {stat.suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.suffix}</span>}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Leave Requests */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Leave Requests</CardTitle>
              <CardDescription>Your latest leave applications</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <Link href="/faculty/leaves">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {myLeaves.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No leave requests found</p>
            ) : (
              <div className="space-y-4">
                {myLeaves.slice(0, 3).map((leave) => (
                  <div
                    key={leave.id}
                    className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium capitalize">{leave.leaveType} Leave</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground truncate max-w-[250px]">{leave.reason}</p>
                    </div>
                    <StatusBadge status={leave.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notice Board */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notice Board
            </CardTitle>
            <CardDescription>Recent department circulars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {mockNotices.map((notice) => (
                <div key={notice.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <p className="font-medium text-sm">{notice.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notice.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notice.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/faculty/leaves">
                <Calendar className="h-5 w-5" />
                Apply for Leave
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/faculty/payroll">
                <FileText className="h-5 w-5" />
                View Salary Slip
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/faculty/profile">
                <Briefcase className="h-5 w-5" />
                Update Profile
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/faculty/profile?tab=dependents">
                <Award className="h-5 w-5" />
                Add Dependent
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
