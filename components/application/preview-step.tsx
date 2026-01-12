"use client"

import { useState } from "react"
import { CreditCard, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
import type { PersonalInfo, Education, ResearchPaper } from "@/lib/types"

interface PreviewStepProps {
  personalInfo: PersonalInfo
  education: Education[]
  research: ResearchPaper[]
  documents: { photo?: File; signature?: File; cv?: File }
  apiScore: number
  onSubmit: () => void
  isSubmitting: boolean
}

export function PreviewStep({
  personalInfo,
  education,
  research,
  documents,
  apiScore,
  onSubmit,
  isSubmitting,
}: PreviewStepProps) {
  const [paymentComplete, setPaymentComplete] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Review Your Application</h3>
        <p className="text-sm text-muted-foreground">Please review all details before submitting</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span className="text-muted-foreground">Full Name:</span>
              <p className="font-medium">{personalInfo.fullName || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Father&apos;s Name:</span>
              <p className="font-medium">{personalInfo.fatherName || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date of Birth:</span>
              <p className="font-medium">{personalInfo.dob || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Gender:</span>
              <p className="font-medium capitalize">{personalInfo.gender || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Category:</span>
              <p className="font-medium">{personalInfo.category || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Nationality:</span>
              <p className="font-medium">{personalInfo.nationality || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Phone:</span>
              <p className="font-medium">{personalInfo.phone || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <p className="font-medium">{personalInfo.email || "-"}</p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <span className="text-muted-foreground">Address:</span>
              <p className="font-medium">
                {[personalInfo.address, personalInfo.city, personalInfo.state, personalInfo.pincode]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Educational Qualifications</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Degree</TableHead>
                <TableHead>Board/University</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>% / CGPA</TableHead>
                <TableHead>Subject</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {education.filter((e) => e.degree).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No education details added
                  </TableCell>
                </TableRow>
              ) : (
                education
                  .filter((e) => e.degree)
                  .map((edu) => (
                    <TableRow key={edu.id}>
                      <TableCell>{edu.degree}</TableCell>
                      <TableCell>{edu.boardUniversity || "-"}</TableCell>
                      <TableCell>{edu.year || "-"}</TableCell>
                      <TableCell>{edu.percentage || "-"}</TableCell>
                      <TableCell>{edu.subject || "-"}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Research Papers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Research Publications
            <span className="text-sm font-normal text-primary">API Score: {apiScore}/100</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {research.length === 0 ? (
            <p className="text-sm text-muted-foreground">No research papers added</p>
          ) : (
            <div className="space-y-4">
              {research.map((paper, index) => (
                <div key={paper.id} className="rounded-lg border p-4">
                  <p className="font-medium">
                    {index + 1}. {paper.title || "Untitled"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {paper.journalName} • ISSN: {paper.issn || "-"} • IF: {paper.impactFactor || "-"} • Year:{" "}
                    {paper.year || "-"}
                  </p>
                  {paper.authors && <p className="text-sm text-muted-foreground">Authors: {paper.authors}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <span className="text-muted-foreground">Photo:</span>
              <p className={documents.photo ? "text-success font-medium" : "text-destructive"}>
                {documents.photo ? "Uploaded" : "Not uploaded"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Signature:</span>
              <p className={documents.signature ? "text-success font-medium" : "text-destructive"}>
                {documents.signature ? "Uploaded" : "Not uploaded"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">CV:</span>
              <p className={documents.cv ? "text-success font-medium" : "text-destructive"}>
                {documents.cv ? "Uploaded" : "Not uploaded"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Payment & Submit */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Application Fee</CardTitle>
          <CardDescription>Complete payment to submit your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Application Fee:</span>
            <span className="text-2xl font-bold text-primary">₹1,000</span>
          </div>

          {paymentComplete ? (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Payment Completed</span>
            </div>
          ) : (
            <PaymentDialog onComplete={() => setPaymentComplete(true)} />
          )}

          <Button className="w-full" size="lg" onClick={onSubmit} disabled={!paymentComplete || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PaymentDialog({ onComplete }: { onComplete: () => void }) {
  const [processing, setProcessing] = useState(false)

  const handlePayment = async () => {
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setProcessing(false)
    onComplete()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-transparent">
          <CreditCard className="mr-2 h-4 w-4" />
          Pay Application Fee
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Gateway</DialogTitle>
          <DialogDescription>This is a mock payment gateway for demonstration purposes.</DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="rounded-lg border p-6 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-2xl font-bold">₹1,000</p>
            <p className="text-sm text-muted-foreground">Application Fee</p>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={handlePayment} disabled={processing}>
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
