"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { formTemplates } from "@/components/forms"
import { getMergedPdfData, getStatusColor, getAnnexureTypeName } from "@/lib/annexure-utils"
import SignaturePad from "@/components/forms/SignaturePad"
import PhotoUpload from "@/components/forms/PhotoUpload"

export default function AdminAnnexureDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [annexure, setAnnexure] = useState<any>(null)
  const [editedData, setEditedData] = useState<Record<string, any>>({})
  const [adminRemarks, setAdminRemarks] = useState('')

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
      setEditedData(data.annexure_data)
      setAdminRemarks(data.admin_remarks || '')
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

  async function saveChanges() {
    setSaving(true)
    try {
      const response = await fetch(`/api/annexures/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annexure_data: editedData,
          admin_remarks: adminRemarks,
        }),
      })

      if (!response.ok) throw new Error('Failed to save changes')

      toast({
        title: 'Success',
        description: 'Changes saved successfully',
      })

      loadAnnexure()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save changes',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  async function approveAnnexure() {
    if (!confirm('Are you sure you want to approve this annexure?')) return

    setSaving(true)
    try {
      const response = await fetch(`/api/annexures/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annexure_data: editedData,
          admin_remarks: adminRemarks,
          status: 'APPROVED',
        }),
      })

      if (!response.ok) throw new Error('Failed to approve')

      toast({
        title: 'Success',
        description: 'Annexure approved successfully',
      })

      router.push('/admin/annexures')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  async function rejectAnnexure() {
    if (!adminRemarks.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide remarks before rejecting',
        variant: 'destructive',
      })
      return
    }

    if (!confirm('Are you sure you want to reject this annexure?')) return

    setSaving(true)
    try {
      const response = await fetch(`/api/annexures/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          admin_remarks: adminRemarks,
        }),
      })

      if (!response.ok) throw new Error('Failed to reject')

      toast({
        title: 'Success',
        description: 'Annexure rejected',
      })

      router.push('/admin/annexures')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
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
    editedData,
    template.fields,
    annexure.dependents
  )

  const isEditable = annexure.status === 'SUBMITTED'
  const isApproved = annexure.status === 'APPROVED'

  // If approved, show full-page PDF only
  if (isApproved) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {getAnnexureTypeName(annexure.annexure_type)}
            </h1>
            <p className="text-muted-foreground mt-1">
              Submitted by: {annexure.profile?.full_name} ({annexure.profile?.employee_id})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(annexure.status)}>
              {annexure.status}
            </Badge>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/annexures')}
            >
              Back to List
            </Button>
          </div>
        </div>

        {/* Full-page PDF Viewer */}
        <Card>
          <CardContent className="p-0">
            <div className="h-[calc(100vh-200px)] w-full overflow-hidden">
              <PDFViewer width="100%" height="100%">
                <PdfComponent data={pdfData} />
              </PDFViewer>
            </div>
            <div className="p-4 border-t">
              <PDFDownloadLink
                document={<PdfComponent data={pdfData} />}
                fileName={`${annexure.annexure_type}_${annexure.profile?.employee_id}.pdf`}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
              </PDFDownloadLink>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {getAnnexureTypeName(annexure.annexure_type)}
          </h1>
          <p className="text-muted-foreground mt-1">
            Submitted by: {annexure.profile?.full_name} ({annexure.profile?.employee_id})
          </p>
        </div>
        <Badge className={getStatusColor(annexure.status)}>
          {annexure.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Faculty Info + Editable Fields */}
        <div className="space-y-6">
          {/* Faculty Profile (Read-only) */}
          <Card>
            <CardHeader>
              <CardTitle>Faculty Profile (Auto-filled)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{annexure.profile?.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Employee ID</Label>
                  <p className="font-medium">{annexure.profile?.employee_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium">{annexure.profile?.department}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Designation</Label>
                  <p className="font-medium">{annexure.profile?.present_designation}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date of Joining</Label>
                  <p className="font-medium">{annexure.profile?.doj}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact</Label>
                  <p className="font-medium">{annexure.profile?.contact_number}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Annexure-Specific Data (Editable) */}
          <Card>
            <CardHeader>
              <CardTitle>
                Annexure-Specific Data
                {isEditable && <span className="text-sm font-normal text-muted-foreground ml-2">(Editable)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.fields
                .filter((field: any) => {
                  // Only show annexure-specific fields
                  const autoFillKeys = ['facultyName', 'employeeName', 'name', 'department', 
                    'designation', 'currentDesignation', 'dateOfJoining', 'doj']
                  return !autoFillKeys.includes(field.name)
                })
                .map((field: any) => {
                  const type = field.type || 'text'
                  const value = editedData[field.name] || ''

                  // Check if this is a faculty signature field (not admin/HOD signature)
                  const isFacultySignature = type === 'signature' && 
                    (field.name.includes('applicant') || 
                     field.name.includes('faculty') || 
                     field.name.includes('employee') ||
                     field.name === 'signature')

                  if (type === 'photo') {
                    return (
                      <div key={field.name} className="space-y-2">
                        <Label>{field.label}</Label>
                        <PhotoUpload
                          value={value}
                          onChange={(base64) => {
                            if (isEditable && !isFacultySignature) {
                              setEditedData(prev => ({ ...prev, [field.name]: base64 }))
                            }
                          }}
                          disabled={!isEditable}
                        />
                      </div>
                    )
                  }

                  if (type === 'signature') {
                    return (
                      <div key={field.name} className="space-y-2">
                        <Label>
                          {field.label}
                          {isFacultySignature && <span className="text-xs text-muted-foreground ml-2">(Faculty - Read-only)</span>}
                        </Label>
                        <SignaturePad
                          value={value}
                          onChange={(base64) => {
                            if (isEditable && !isFacultySignature) {
                              setEditedData(prev => ({ ...prev, [field.name]: base64 }))
                            }
                          }}
                          disabled={!isEditable || isFacultySignature}
                        />
                      </div>
                    )
                  }

                  if (type === 'textarea') {
                    return (
                      <div key={field.name} className="space-y-2">
                        <Label>{field.label}</Label>
                        <Textarea
                          value={value}
                          disabled={!isEditable}
                          onChange={(e) => {
                            if (isEditable) {
                              setEditedData(prev => ({ ...prev, [field.name]: e.target.value }))
                            }
                          }}
                          placeholder={field.placeholder}
                        />
                      </div>
                    )
                  }

                  return (
                    <div key={field.name} className="space-y-2">
                      <Label>{field.label}</Label>
                      <Input
                        type={type}
                        value={value}
                        disabled={!isEditable}
                        onChange={(e) => {
                          if (isEditable) {
                            setEditedData(prev => ({ ...prev, [field.name]: e.target.value }))
                          }
                        }}
                        placeholder={field.placeholder}
                      />
                    </div>
                  )
                })}
            </CardContent>
          </Card>

          {/* Admin Remarks */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Add remarks or notes..."
                rows={4}
                disabled={!isEditable}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          {isEditable && (
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  onClick={saveChanges}
                  variant="outline"
                  className="w-full"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={rejectAnnexure}
                    variant="destructive"
                    disabled={saving}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={approveAnnexure}
                    disabled={saving}
                  >
                    Approve & Sign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: PDF Preview */}
        <Card>
          <CardHeader>
            <CardTitle>PDF Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[800px] w-full overflow-hidden rounded-md border">
              <PDFViewer width="100%" height="100%">
                <PdfComponent data={pdfData} />
              </PDFViewer>
            </div>
            <div className="mt-4">
              <PDFDownloadLink
                document={<PdfComponent data={pdfData} />}
                fileName={`${annexure.annexure_type}_${annexure.profile?.employee_id}.pdf`}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
              </PDFDownloadLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
