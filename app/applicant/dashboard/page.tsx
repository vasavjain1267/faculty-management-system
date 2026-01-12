"use client"

import Link from "next/link"
import { FileText, Clock, CheckCircle, AlertCircle, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { mockJobs } from "@/lib/mock-data"

// Mock applicant's applications
type ApplicationStatus = "submitted" | "draft" | "under-review"

type Application = {
  id: string
  jobTitle: string
  department: string
  status: ApplicationStatus
  submittedAt: string | null
  lastUpdated: string
}

const myApplications: Application[] = [
  {
    id: "APP001",
    jobTitle: "Assistant Professor - Computer Science",
    department: "Computer Science",
    status: "submitted",
    submittedAt: "2026-01-10",
    lastUpdated: "2026-01-11",
  },
  {
    id: "APP002",
    jobTitle: "Associate Professor - Physics",
    department: "Physics",
    status: "draft",
    submittedAt: null,
    lastUpdated: "2026-01-08",
  },
]

export default function ApplicantDashboard() {
  const stats = [
    {
      label: "Total Applications",
      value: myApplications.length,
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "Submitted",
      value: myApplications.filter((a) => a.status === "submitted").length,
      icon: CheckCircle,
      color: "text-success",
    },
    {
      label: "In Draft",
      value: myApplications.filter((a) => a.status === "draft").length,
      icon: Clock,
      color: "text-warning",
    },
    {
      label: "Under Review",
      value: myApplications.filter((a) => a.status === "under-review").length,
      icon: AlertCircle,
      color: "text-info",
    },
  ]

  const activeJobs = mockJobs.filter((job) => job.status === "active").slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Applicant Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage your job applications</p>
        </div>
        <Button asChild>
          <Link href="/jobs">
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* My Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Track the status of your submitted applications</CardDescription>
            </CardHeader>
            <CardContent>
              {myApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No applications yet</p>
                  <Button className="mt-4" asChild>
                    <Link href="/jobs">Browse Open Positions</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{app.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">{app.department}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.status === "draft"
                            ? `Last edited: ${new Date(app.lastUpdated).toLocaleDateString()}`
                            : `Submitted: ${new Date(app.submittedAt!).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={app.status} />
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={app.status === "draft" ? `/apply/${app.id}` : `/applicant/applications/${app.id}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {app.status === "draft" ? "Continue" : "View"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Openings */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Active Openings</CardTitle>
              <CardDescription>Latest faculty positions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                  <p className="font-medium text-sm leading-tight">{job.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Deadline:{" "}
                    {new Date(job.deadline).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <Button variant="link" size="sm" className="h-auto p-0" asChild>
                    <Link href={`/apply/${job.id}`}>Apply Now</Link>
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/jobs">View All Openings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
