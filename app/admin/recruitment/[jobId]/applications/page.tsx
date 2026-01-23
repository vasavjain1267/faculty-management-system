"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft, CheckCircle, XCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface Application {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
  submitted_at: string
  education: any[]
  research_interests: string[]
  resume_url?: string
}

export default function JobApplicationsPage() {
  const params = useParams()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [jobTitle, setJobTitle] = useState("")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [reviewAction, setReviewAction] = useState<"accept" | "reject" | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()
  const jobId = params.jobId as string

  useEffect(() => {
    fetchApplications()
  }, [jobId])

  const fetchApplications = async () => {
    try {
      // Fetch job details
      const { data: job } = await supabase
        .from('jobs')
        .select('title')
        .eq('id', jobId)
        .single()

      if (job) {
        setJobTitle(job.title)
      }

      // Fetch applications
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId)
        .order('submitted_at', { ascending: false })

      if (error) throw error

      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error("Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (application: Application, action: "accept" | "reject") => {
    setSelectedApp(application)
    setReviewAction(action)
    setReviewDialog(true)
    setRejectionReason("")
  }

  const submitReview = async () => {
    if (!selectedApp || !reviewAction) return

    if (reviewAction === "reject" && !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/applications/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status: reviewAction === "accept" ? "accepted" : "rejected",
          rejectionReason: reviewAction === "reject" ? rejectionReason : null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Failed to update application")
        return
      }

      toast.success(result.message)
      setReviewDialog(false)
      fetchApplications() // Refresh the list
    } catch (error) {
      console.error('Error reviewing application:', error)
      toast.error("An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">{jobTitle}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Applications</CardTitle>
          <CardDescription>Review and manage job applications</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications submitted yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.first_name} {app.last_name}
                    </TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>
                      {new Date(app.submitted_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status as any} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {app.status === "pending" || app.status === "under_review" ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700"
                              onClick={() => handleReview(app, "accept")}
                              title="Accept Application"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() => handleReview(app, "reject")}
                              title="Reject Application"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "accept" ? "Accept Application" : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "accept"
                ? `Accept ${selectedApp?.first_name} ${selectedApp?.last_name}'s application and promote them to faculty?`
                : `Reject ${selectedApp?.first_name} ${selectedApp?.last_name}'s application?`}
            </DialogDescription>
          </DialogHeader>

          {reviewAction === "reject" && (
            <div className="space-y-2 py-4">
              <Label htmlFor="reason">Reason for Rejection</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                required
              />
            </div>
          )}

          {reviewAction === "accept" && (
            <div className="py-4 text-sm text-muted-foreground">
              <p>This will:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Change the application status to "Accepted"</li>
                <li>Promote the applicant to Faculty role</li>
                <li>Generate an employee ID</li>
                <li>Grant access to the faculty portal</li>
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReviewDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitReview}
              disabled={submitting}
              variant={reviewAction === "accept" ? "default" : "destructive"}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {reviewAction === "accept" ? "Accept & Promote" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
