"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PDFDownloadLink } from "@react-pdf/renderer"
import dynamic from "next/dynamic"

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading PDF preview...</div>,
  }
)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { formTemplates } from "@/components/forms"
import { getMergedPdfData, getStatusColor, getAnnexureTypeName } from "@/lib/annexure-utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FacultyAnnexureViewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [annexure, setAnnexure] = useState<any>(null)

  useEffect(() => {
    if (params?.id) {
      loadAnnexure()
    }
  }, [params?.id])

  async function loadAnnexure() {
    if (!params?.id) {
      toast({
        title: 'Error',
        description: 'Invalid annexure ID',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/annexures/${params.id}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', response.status, errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to load annexure`)
      }
      
      const { annexure: data } = await response.json()
      console.log('Loaded annexure:', data)
      setAnnexure(data)
    } catch (error: any) {
      console.error('Error loading annexure:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load annexure',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!annexure) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Annexure not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  const template = (formTemplates as any)[annexure.annexure_type]
  if (!template) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Template not found for this annexure type</AlertDescription>
        </Alert>
      </div>
    )
  }

  const PdfComponent = template.pdf
  const pdfData = getMergedPdfData(
    annexure.profile,
    annexure.annexure_data,
    template.fields,
    annexure.dependents
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/faculty/forms">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {getAnnexureTypeName(annexure.annexure_type)}
            </h1>
            <p className="text-muted-foreground mt-1">
              Submitted on: {new Date(annexure.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(annexure.status)}>
          {annexure.status}
        </Badge>
      </div>

      {/* Admin Remarks */}
      {annexure.admin_remarks && (
        <Alert>
          <AlertDescription>
            <strong>Admin Remarks:</strong> {annexure.admin_remarks}
          </AlertDescription>
        </Alert>
      )}

      {/* Approval Info */}
      {annexure.status === 'APPROVED' && (
        <Alert>
          <AlertDescription>
            ✓ Approved by {annexure.approver?.full_name || 'Admin'} on{' '}
            {new Date(annexure.approved_at).toLocaleDateString()}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Details */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={getStatusColor(annexure.status)}>
                {annexure.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="font-medium">{new Date(annexure.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date(annexure.updated_at).toLocaleString()}</p>
            </div>
            {annexure.approved_at && (
              <div>
                <p className="text-sm text-muted-foreground">Approved On</p>
                <p className="font-medium">{new Date(annexure.approved_at).toLocaleString()}</p>
              </div>
            )}
            {annexure.approver && (
              <div>
                <p className="text-sm text-muted-foreground">Approved By</p>
                <p className="font-medium">{annexure.approver.full_name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: PDF Preview */}
        <Card>
          <CardHeader>
            <CardTitle>PDF Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] w-full overflow-hidden rounded-md border">
              <PDFViewer width="100%" height="100%">
                <PdfComponent data={pdfData} />
              </PDFViewer>
            </div>
            <div className="mt-4 space-y-2">
              <PDFDownloadLink
                document={<PdfComponent data={pdfData} />}
                fileName={`${annexure.annexure_type}_${new Date().toISOString().split('T')[0]}.pdf`}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
              </PDFDownloadLink>
              
              {annexure.signed_pdf_url && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={annexure.signed_pdf_url} download>
                    Download Signed PDF
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
