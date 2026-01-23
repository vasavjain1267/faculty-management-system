"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Calendar, Download, Filter, Search, Building2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Job {
  id: string
  title: string
  department: string
  post_type: string
  deadline: string
  description: string
  requirements: string
  pdf_url: string | null
  status: string
  application_count: number
  created_at: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [postTypeFilter, setPostTypeFilter] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // Fetch all active jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (jobsError) throw jobsError

      setJobs(jobsData || [])

      // Extract unique departments
      const uniqueDepts = [...new Set(jobsData?.map(job => job.department) || [])]
      setDepartments(uniqueDepts)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
      const matchesPostType = postTypeFilter === "all" || job.post_type === postTypeFilter
      return matchesSearch && matchesDepartment && matchesPostType
    })
  }, [jobs, searchQuery, departmentFilter, postTypeFilter])

  const activeJobs = filteredJobs

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
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
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

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Active Jobs */}
          <section className="mb-12">
            <h2 className="mb-4 text-lg font-semibold">
              Active Positions <span className="text-muted-foreground">({activeJobs.length})</span>
            </h2>
            {activeJobs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No active positions available at the moment.</p>
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
        </>
      )}
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  const deadlineDate = new Date(job.deadline)
  const isDeadlineNear = deadlineDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

  return (
    <Card>
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
            {job.post_type}
          </span>
        </div>
        {job.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 pt-3 border-t">
        {job.pdf_url && (
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
            <a href={job.pdf_url} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              View PDF
            </a>
          </Button>
        )}
        <Button size="sm" className="flex-1" asChild>
          <Link href={`/apply/${job.id}`}>Apply Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
