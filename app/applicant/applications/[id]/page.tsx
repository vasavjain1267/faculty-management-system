import { ArrowLeft, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockApplications, mockJobs } from "@/lib/mock-data"
import Link from "next/link"

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const application = mockApplications.find((app) => app.id === id)
  const job = application ? mockJobs.find((j) => j.id === application.jobId) : null

  if (!application || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Application not found</p>
            <Button className="mt-4" asChild>
              <Link href="/applicant/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/applicant/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Application Details</h1>
          <p className="text-muted-foreground">{application.id}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>
            {job.department} • Applied on {new Date(application.submittedAt!).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <span className="text-muted-foreground">Application ID:</span>
              <p className="font-medium">{application.id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">API Score:</span>
              <p className="font-medium">{application.apiScore}/100</p>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Status:</span>
              <p className="font-medium capitalize">{application.paymentStatus}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Category:</span>
              <p className="font-medium">{application.personalInfo.category}</p>
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download Application PDF
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
        </CardContent>
      </Card>

      {application.research.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Research Publications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {application.research.map((paper, index) => (
                <div key={paper.id} className="flex gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {index + 1}. {paper.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {paper.journalName} • IF: {paper.impactFactor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
