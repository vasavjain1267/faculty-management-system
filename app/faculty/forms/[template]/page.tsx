"use client"

import { useMemo, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PDFDownloadLink } from "@react-pdf/renderer"
import dynamic from "next/dynamic"

import { formTemplates } from "@/components/forms"

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading PDF preview...</div>,
  }
)

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import SignaturePad from "@/components/forms/SignaturePad"
import PhotoUpload from "@/components/forms/PhotoUpload"
import { 
  getAutoFilledData, 
  isFieldReadOnly, 
  getMergedPdfData,
  getAnnexureSpecificFields 
} from "@/lib/annexure-utils"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

/* ======================================================
   TYPES
   ====================================================== */
type FieldType = "text" | "textarea" | "date" | "signature" | "photo"

type FormField = {
  name: string
  label: string
  type?: FieldType
  placeholder?: string
}

type FormTemplate = {
  id: string
  title: string
  pdf: React.ComponentType<{ data: Record<string, string> }>
  fields: FormField[]
  actions?: {
    sendToAdmin?: boolean
    needsApproval?: boolean
  }
}

export default function DynamicTemplatePage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.template as string
  const { toast } = useToast()
  const supabase = createClient()

  const template = (formTemplates as Record<string, FormTemplate>)[templateId]

  // State
  const [profileData, setProfileData] = useState<any>(null)
  const [dependentsData, setDependentsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [autoFilledData, setAutoFilledData] = useState<Record<string, string>>({})
  const [annexureData, setAnnexureData] = useState<Record<string, string>>({})
  
  // New state for applicant type
  const [applicantType, setApplicantType] = useState<'self' | 'dependent'>('self')
  const [selectedDependentId, setSelectedDependentId] = useState<string>('')
  const [selectedDependent, setSelectedDependent] = useState<any>(null)

  // Load faculty profile and dependents
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        console.log('User ID:', user.id)
        console.log('Profile ID:', profile?.id)

        // Fetch dependents using profile id
        const { data: dependents, error: dependentsError } = await supabase
          .from('dependents')
          .select('*')
          .eq('profile_id', profile.id)

        if (dependentsError) {
          console.error('Error fetching dependents:', dependentsError)
        } else {
          console.log('Fetched dependents:', dependents)
        }

        setProfileData(profile)
        setDependentsData(dependents || [])
        console.log('Set dependents data:', dependents?.length || 0, 'items')

        // Auto-fill data from profile (self)
        if (template && profile) {
          const autoFilled = getAutoFilledData(template.fields, profile, dependents || [])
          setAutoFilledData(autoFilled)
        }

        setLoading(false)
      } catch (error: any) {
        console.error('Error loading data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        })
        setLoading(false)
      }
    }

    if (template) {
      loadData()
    }
  }, [template, supabase, router, toast])

  // Handle applicant type change and dependent selection
  useEffect(() => {
    if (!template || !profileData) return

    if (applicantType === 'self') {
      // Auto-fill from faculty profile
      const autoFilled = getAutoFilledData(template.fields, profileData, dependentsData)
      setAutoFilledData(autoFilled)
      setSelectedDependent(null)
      setSelectedDependentId('')
    } else if (applicantType === 'dependent' && selectedDependentId) {
      // Find selected dependent
      const dependent = dependentsData.find(d => d.id === selectedDependentId)
      if (dependent) {
        setSelectedDependent(dependent)
        // Auto-fill from dependent data (matching database schema)
        const dependentAutoFill: Record<string, string> = {}
        dependentAutoFill['applicantName'] = dependent.name || ''
        dependentAutoFill['name'] = dependent.name || ''
        dependentAutoFill['relationship'] = dependent.relation || ''
        dependentAutoFill['dateOfBirth'] = dependent.dob || ''
        
        // Keep faculty info for context
        dependentAutoFill['facultyName'] = profileData.full_name || ''
        dependentAutoFill['employeeId'] = profileData.employee_id || ''
        dependentAutoFill['department'] = profileData.department || ''
        dependentAutoFill['designation'] = profileData.present_designation || ''
        
        setAutoFilledData(dependentAutoFill)
      }
    }
  }, [applicantType, selectedDependentId, template, profileData, dependentsData])

  if (!template) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Template not found</h1>
        <p className="text-muted-foreground mt-2">
          No form template exists for: <b>{templateId}</b>
        </p>
      </div>
    )
  }

  const PdfComponent = template.pdf

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Profile data not found. Please complete your profile first.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Merge data for PDF
  const pdfData = getMergedPdfData(profileData, annexureData, template.fields, dependentsData)

  // Save as draft
  const saveDraft = async () => {
    setSaving(true)
    try {
      const dataToSave = {
        ...annexureData,
        _applicantType: applicantType,
        _dependentId: applicantType === 'dependent' ? selectedDependentId : null,
        _dependentName: applicantType === 'dependent' ? selectedDependent?.name : null,
      }
      
      const response = await fetch('/api/annexures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annexure_type: templateId,
          annexure_data: dataToSave,
          status: 'DRAFT',
        }),
      })

      if (!response.ok) throw new Error('Failed to save draft')

      const { annexure } = await response.json()

      toast({
        title: 'Success',
        description: 'Draft saved successfully',
      })

      router.push('/faculty/forms')
    } catch (error: any) {
      console.error('Error saving draft:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to save draft',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  // Submit to admin
  const submitToAdmin = async () => {
    setSaving(true)
    try {
      const dataToSave = {
        ...annexureData,
        _applicantType: applicantType,
        _dependentId: applicantType === 'dependent' ? selectedDependentId : null,
        _dependentName: applicantType === 'dependent' ? selectedDependent?.name : null,
      }
      
      const response = await fetch('/api/annexures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annexure_type: templateId,
          annexure_data: dataToSave,
          status: 'SUBMITTED',
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      toast({
        title: 'Success',
        description: 'Annexure submitted to admin for approval',
      })

      router.push('/faculty/forms')
    } catch (error: any) {
      console.error('Error submitting:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{template.title}</h1>
        <p className="text-muted-foreground mt-2">
          Fill the details below. Profile data is auto-filled from your account.
        </p>
      </div>

      {/* Info alert */}
      <Alert>
        <AlertDescription>
          ℹ️ Fields marked with a badge are auto-filled and cannot be edited here.
          Please update your profile or dependent information if any data is incorrect.
        </AlertDescription>
      </Alert>

      {/* Applicant Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Who is this application for?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={applicantType} onValueChange={(value: 'self' | 'dependent') => setApplicantType(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="self" id="self" />
              <Label htmlFor="self" className="cursor-pointer">For Myself (Faculty)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dependent" id="dependent" />
              <Label htmlFor="dependent" className="cursor-pointer">For Family Dependent</Label>
            </div>
          </RadioGroup>

          {applicantType === 'dependent' && (
            <div className="space-y-2 pt-2">
              <Label>Select Dependent</Label>
              {dependentsData.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No dependents found. Please add dependents in your profile first.
                  </AlertDescription>
                </Alert>
              ) : (
                <Select value={selectedDependentId} onValueChange={setSelectedDependentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a dependent" />
                  </SelectTrigger>
                  <SelectContent>
                    {dependentsData.map((dep) => (
                      <SelectItem key={dep.id} value={dep.id}>
                        {dep.name} ({dep.relation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedDependent && (
                <div className="mt-3 p-3 bg-muted rounded-md text-sm space-y-1">
                  <p><strong>Name:</strong> {selectedDependent.name}</p>
                  <p><strong>Relationship:</strong> {selectedDependent.relation}</p>
                  <p><strong>Date of Birth:</strong> {selectedDependent.dob}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ================= FORM ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {template.fields.map((field) => {
              const type = field.type || "text"
              const isReadOnly = isFieldReadOnly(field.name)
              const value = isReadOnly 
                ? (autoFilledData[field.name] || '') 
                : (annexureData[field.name] || '')

              /* ===== PHOTO UPLOAD ===== */
              if (type === "photo") {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <PhotoUpload
                      value={value}
                      onChange={(base64) =>
                        setAnnexureData((prev) => ({
                          ...prev,
                          [field.name]: base64,
                        }))
                      }
                    />
                  </div>
                )
              }

              /* ===== SIGNATURE PAD ===== */
              if (type === "signature") {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <SignaturePad
                      value={value}
                      onChange={(base64) =>
                        setAnnexureData((prev) => ({
                          ...prev,
                          [field.name]: base64,
                        }))
                      }
                    />
                  </div>
                )
              }

              /* ===== TEXTAREA ===== */
              if (type === "textarea") {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {field.label}
                      {isReadOnly && <Badge variant="secondary" className="text-xs">Auto-filled</Badge>}
                    </Label>
                    <Textarea
                      value={value}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        if (!isReadOnly) {
                          setAnnexureData((prev) => ({
                            ...prev,
                            [field.name]: e.target.value,
                          }))
                        }
                      }}
                      placeholder={field.placeholder}
                      className={isReadOnly ? 'bg-muted cursor-not-allowed' : ''}
                    />
                  </div>
                )
              }

              /* ===== DATE ===== */
              if (type === "date") {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {field.label}
                      {isReadOnly && <Badge variant="secondary" className="text-xs">Auto-filled</Badge>}
                    </Label>
                    <Input
                      type="date"
                      value={value}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        if (!isReadOnly) {
                          setAnnexureData((prev) => ({
                            ...prev,
                            [field.name]: e.target.value,
                          }))
                        }
                      }}
                      className={isReadOnly ? 'bg-muted cursor-not-allowed' : ''}
                    />
                  </div>
                )
              }

              /* ===== TEXT ===== */
              return (
                <div key={field.name} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {field.label}
                    {isReadOnly && <Badge variant="secondary" className="text-xs">Auto-filled</Badge>}
                  </Label>
                  <Input
                    value={value}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      if (!isReadOnly) {
                        setAnnexureData((prev) => ({
                          ...prev,
                          [field.name]: e.target.value,
                        }))
                      }
                    }}
                    placeholder={field.placeholder}
                    className={isReadOnly ? 'bg-muted cursor-not-allowed' : ''}
                  />
                </div>
              )
            })}

            <div className="space-y-2 pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={saveDraft}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save as Draft'}
              </Button>

              {template.actions?.sendToAdmin && (
                <Button 
                  className="w-full"
                  onClick={submitToAdmin}
                  disabled={saving}
                >
                  {saving ? 'Submitting...' : 'Submit to Admin'}
                </Button>
              )}

              <PDFDownloadLink
                document={<PdfComponent data={pdfData} />}
                fileName={`${template.id}.pdf`}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
              </PDFDownloadLink>
            </div>
          </CardContent>
        </Card>

        {/* ================= PREVIEW ================= */}
        <Card>
          <CardHeader>
            <CardTitle>PDF Preview</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[750px] w-full overflow-hidden rounded-md border">
              <PDFViewer width="100%" height="100%">
                <PdfComponent data={pdfData} />
              </PDFViewer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
