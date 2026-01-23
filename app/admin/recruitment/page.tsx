"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Pencil, Eye, Loader2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/ui/status-badge"
import { mockDepartments } from "@/lib/mock-data"
import { toast } from "sonner"
import type { JobNotification } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState<JobNotification[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }

  const addJob = (job: JobNotification) => {
    setJobs([job, ...jobs])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recruitment Management</h1>
          <p className="text-muted-foreground">Manage job postings and recruitment notifications</p>
        </div>
        <PostJobDialog onPost={addJob} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Postings</CardTitle>
          <CardDescription>All recruitment notifications and their status</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Post Type</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">#{job.id}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.post_type || job.postType}</TableCell>
                    <TableCell>{new Date(job.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className="font-medium">{job.application_count || 0}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={job.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => router.push(`/admin/recruitment/${job.id}/applications`)}
                          title="View Applications"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PostJobDialog({ onPost }: { onPost: (job: JobNotification) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [postType, setPostType] = useState<JobNotification["postType"]>("Assistant Professor")
  const [deadline, setDeadline] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState("")
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error("Only PDF files are allowed")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setPdfFile(file)
    
    // Upload to Supabase Storage
    setUploading(true)
    try {
      const fileExt = 'pdf'
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `job-descriptions/${fileName}`

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      setPdfUrl(publicUrl)
      toast.success("PDF uploaded successfully")
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error("Failed to upload PDF. Continuing without file.")
      setPdfFile(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            title,
            department,
            post_type: postType,
            deadline,
            description,
            requirements,
            pdf_url: pdfUrl || null,
            status: 'active',
            created_by: user?.id,
          }
        ])
        .select()
        .single()

      if (error) throw error

      onPost({
        id: data.id,
        title: data.title,
        department: data.department,
        postType: data.post_type,
        deadline: data.deadline,
        pdfUrl: data.pdf_url || "#",
        status: data.status,
        createdAt: data.created_at,
      })

      toast.success("Job posting created successfully")
      setOpen(false)
      setTitle("")
      setDepartment("")
      setDeadline("")
      setDescription("")
      setRequirements("")
      setPdfFile(null)
      setPdfUrl("")
    } catch (error) {
      console.error('Error creating job:', error)
      toast.error("Failed to create job posting")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Post New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
            <DialogDescription>Create a new recruitment notification</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                placeholder="e.g., Assistant Professor - Computer Science"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment} required>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-type">Post Type</Label>
                <Select value={postType} onValueChange={(v) => setPostType(v as JobNotification["postType"])}>
                  <SelectTrigger id="post-type">
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Enter job description and overview"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="Enter job requirements and qualifications"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdf">Job Description PDF (Optional)</Label>
              <Input
                id="pdf"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Uploading PDF...
                </p>
              )}
              {pdfFile && !uploading && (
                <p className="text-xs text-success flex items-center gap-2">
                  ✓ {pdfFile.name} uploaded successfully
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Upload a detailed job description PDF (max 5MB)
              </p>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Enter job requirements and qualifications"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
