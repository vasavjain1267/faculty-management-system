"use client"

import { useState } from "react"
import { Eye, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { mockApplications, mockJobs } from "@/lib/mock-data"
import type { Application } from "@/lib/types"
import { toast } from "sonner"

export default function ScrutinyPage() {
  const [selectedJob, setSelectedJob] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredApplications = mockApplications.filter((app) => {
    const matchesJob = selectedJob === "all" || app.jobId === selectedJob
    const matchesSearch =
      app.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesJob && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Application Scrutiny</h1>
        <p className="text-muted-foreground">Review and verify applicant submissions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or application ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {mockJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>Click Scrutinize to review detailed application information</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>API Score</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.id}</TableCell>
                  <TableCell>{app.personalInfo.fullName}</TableCell>
                  <TableCell>{app.personalInfo.category}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{app.apiScore}</span>/100
                  </TableCell>
                  <TableCell>{new Date(app.submittedAt!).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>
                    <ScrutinizeDialog application={app} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function ScrutinizeDialog({ application }: { application: Application }) {
  const [checklist, setChecklist] = useState({
    photoVerified: false,
    signatureVerified: false,
    educationVerified: false,
    documentsVerified: false,
    eligibilityVerified: false,
  })

  const handleApprove = () => {
    toast.success(`Application ${application.id} marked as verified`)
  }

  const handleReject = () => {
    toast.error(`Application ${application.id} marked as rejected`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Eye className="mr-2 h-4 w-4" />
          Scrutinize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Scrutiny - {application.id}</DialogTitle>
          <DialogDescription>{application.personalInfo.fullName}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="font-medium">{application.personalInfo.fullName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Father&apos;s Name</Label>
                <p className="font-medium">{application.personalInfo.fatherName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Date of Birth</Label>
                <p className="font-medium">{application.personalInfo.dob}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Category</Label>
                <p className="font-medium">{application.personalInfo.category}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{application.personalInfo.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{application.personalInfo.phone}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Degree</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {application.education.map((edu) => (
                  <TableRow key={edu.id}>
                    <TableCell>{edu.degree}</TableCell>
                    <TableCell>{edu.boardUniversity}</TableCell>
                    <TableCell>{edu.year}</TableCell>
                    <TableCell>{edu.percentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="research" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Total Papers: {application.research.length}</p>
              <p className="text-lg font-bold text-primary">API Score: {application.apiScore}/100</p>
            </div>
            {application.research.map((paper, index) => (
              <Card key={paper.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    Paper {index + 1}: {paper.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Journal:</span> {paper.journalName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">ISSN:</span> {paper.issn}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Impact Factor:</span> {paper.impactFactor}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="checklist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Verification Checklist</CardTitle>
                <CardDescription>Mark items as verified to approve the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="photo"
                    checked={checklist.photoVerified}
                    onCheckedChange={(checked) => setChecklist({ ...checklist, photoVerified: checked as boolean })}
                  />
                  <Label htmlFor="photo" className="text-sm font-normal cursor-pointer">
                    Passport photograph verified (correct size, recent, clear background)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="signature"
                    checked={checklist.signatureVerified}
                    onCheckedChange={(checked) => setChecklist({ ...checklist, signatureVerified: checked as boolean })}
                  />
                  <Label htmlFor="signature" className="text-sm font-normal cursor-pointer">
                    Signature verified (clear, on white background)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="education"
                    checked={checklist.educationVerified}
                    onCheckedChange={(checked) => setChecklist({ ...checklist, educationVerified: checked as boolean })}
                  />
                  <Label htmlFor="education" className="text-sm font-normal cursor-pointer">
                    Educational qualifications match job requirements
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="documents"
                    checked={checklist.documentsVerified}
                    onCheckedChange={(checked) => setChecklist({ ...checklist, documentsVerified: checked as boolean })}
                  />
                  <Label htmlFor="documents" className="text-sm font-normal cursor-pointer">
                    All supporting documents uploaded and readable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="eligibility"
                    checked={checklist.eligibilityVerified}
                    onCheckedChange={(checked) =>
                      setChecklist({ ...checklist, eligibilityVerified: checked as boolean })
                    }
                  />
                  <Label htmlFor="eligibility" className="text-sm font-normal cursor-pointer">
                    Candidate meets eligibility criteria for the post
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-destructive hover:text-destructive"
                onClick={handleReject}
              >
                Reject Application
              </Button>
              <Button className="flex-1" onClick={handleApprove}>
                Mark as Verified
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
