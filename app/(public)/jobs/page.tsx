"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Calendar, Download, Filter, Search, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { mockJobs, mockDepartments } from "@/lib/mock-data"

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [postTypeFilter, setPostTypeFilter] = useState<string>("all")

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
      const matchesPostType = postTypeFilter === "all" || job.postType === postTypeFilter
      return matchesSearch && matchesDepartment && matchesPostType
    })
  }, [searchQuery, departmentFilter, postTypeFilter])

  const activeJobs = filteredJobs.filter((job) => job.status === "active")
  const closedJobs = filteredJobs.filter((job) => job.status === "closed")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Current Job Openings</h1>
        <p className="mt-2 text-muted-foreground">
          Browse available faculty positions and submit your application online.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {mockDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={postTypeFilter} onValueChange={setPostTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Post Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Post Types</SelectItem>
                <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                <SelectItem value="Professor">Professor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Jobs */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">
          Active Positions <span className="text-muted-foreground">({activeJobs.length})</span>
        </h2>
        {activeJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No active positions match your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Closed Jobs */}
      {closedJobs.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
            Closed Positions <span>({closedJobs.length})</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {closedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function JobCard({ job }: { job: (typeof mockJobs)[0] }) {
  const isActive = job.status === "active"
  const deadlineDate = new Date(job.deadline)
  const isDeadlineNear = isActive && deadlineDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

  return (
    <Card className={!isActive ? "opacity-75" : undefined}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
            <CardDescription className="mt-1">{job.department}</CardDescription>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className={isDeadlineNear ? "text-destructive font-medium" : ""}>
            Deadline: {deadlineDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <div className="mt-2">
          <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            {job.postType}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3 border-t">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
          <a href={job.pdfUrl} download>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </a>
        </Button>
        {isActive && (
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/apply/${job.id}`}>Apply Now</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
