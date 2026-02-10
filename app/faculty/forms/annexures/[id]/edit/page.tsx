"use client"

import { useMemo, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PDFDownloadLink } from "@react-pdf/renderer"
import dynamic from "next/dynamic"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading PDF preview...</div>,
  }
)

import { formTemplates } from "@/components/forms"
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
} from "@/lib/annexure-utils"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

type FormField = {
  name: string
  label: string
  type?: string
  placeholder?: string
}

export default function EditAnnexurePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [annexure, setAnnexure] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [dependentsData, setDependentsData] = useState<any[]>([])
  const [annexureData, setAnnexureData] = useState<Record<string, string>>({})
  const [autoFilledData, setAutoFilledData] = useState<Record<string, string>>({})
  
  const [applicantType, setApplicantType] = useState<'self' | 'dependent'>('self')
  const [selectedDependentId, setSelectedDependentId] = useState<string>('')
  const [selectedDependent, setSelectedDependent] = useState<any>(null)

  // Load annexure data
  useEffect(() => {
    async function loadAnnexure() {
      try {
        const id = await params.id
        const response = await fetch(`/api/annexures/${id}`)
        
        if (!response.ok) throw new Error('Failed to load annexure')
        
        const { annexure: data } = await response.json()
        
        if (data.status !== 'DRAFT') {
          toast({
            title: 'Error',
            description: 'Only DRAFT annexures can be edited',
            variant: 'destructive',
          })
          router.push('/faculty/forms')
          return
        }
        
        setAnnexure(data)
        setProfileData(data.profile)
        setDependentsData(data.dependents || [])
        setAnnexureData(data.annexure_data || {})
        
        // Restore applicant type
        if (data.annexure_data._applicantType) {
          setApplicantType(data.annexure_data._applicantType)
        }
        if (data.annexure_data._dependentId) {
          setSelectedDependentId(data.annexure_data._dependentId)
        }
        
        setLoading(false)
      } catch (error: any) {
        console.error('Error loading annexure:', error)
        toast({
          title: 'Error',
          description: error.message || 'Failed to load annexure',
          variant: 'destructive',
        })
        router.push('/faculty/forms')
      }
    }
    
    loadAnnexure()
  }, [params, router, toast, supabase])

  // Handle auto-fill when applicant type or dependent changes
  useEffect(() => {
    if (!annexure || !profileData) return
    
    const template = (formTemplates as any)[annexure.annexure_type]
    if (!template) return

    if (applicantType === 'self') {
      const autoFilled = getAutoFilledData(template.fields, profileData, dependentsData)
      setAutoFilledData(autoFilled)
      setSelectedDependent(null)
    } else if (applicantType === 'dependent' && selectedDependentId) {
      const dependent = dependentsData.find(d => d.id === selectedDependentId)
      setSelectedDependent(dependent)
      
      if (dependent) {
        const dependentAutoFill: Record<string, string> = {}
        const autoFilled = getAutoFilledData(template.fields, profileData, [dependent])
        
        dependentAutoFill['applicantName'] = dependent.name || ''
        dependentAutoFill['relationship'] = dependent.relation || ''
        dependentAutoFill['dateOfBirth'] = dependent.dob || ''
        dependentAutoFill['childName'] = dependent.name || ''
        
        Object.assign(dependentAutoFill, autoFilled)
        setAutoFilledData(dependentAutoFill)
      }
    }
  }, [applicantType, selectedDependentId, annexure, profileData, dependentsData])

  const handleInputChange = (fieldName: string, value: string) => {
    setAnnexureData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const dataToSave = {
        ...annexureData,
        _applicantType: applicantType,
        _dependentId: applicantType === 'dependent' ? selectedDependentId : null,
        _dependentName: applicantType === 'dependent' ? selectedDependent?.name : null,
      }
      
      const id = await params.id
      const response = await fetch(`/api/annexures/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annexure_data: dataToSave,
          status: 'DRAFT',
        }),
      })

      if (!response.ok) throw new Error('Failed to update')

      toast({
        title: 'Success',
        description: 'Draft updated successfully',
      })

      router.push('/faculty/forms')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update',
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
          <AlertDescription>Template not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  const PdfComponent = template.pdf
  const pdfData = getMergedPdfData(profileData, { ...autoFilledData, ...annexureData }, template.fields, dependentsData)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/faculty/forms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Draft: {template.title}</h1>
          <p className="text-muted-foreground">Update your draft annexure</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Applicant Type Selection */}
            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
              <Label>Applying For</Label>
              <RadioGroup value={applicantType} onValueChange={(v) => setApplicantType(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="self" id="self" />
                  <Label htmlFor="self" className="font-normal cursor-pointer">For Myself (Faculty)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dependent" id="dependent" />
                  <Label htmlFor="dependent" className="font-normal cursor-pointer">For Family Dependent</Label>
                </div>
              </RadioGroup>

              {applicantType === 'dependent' && (
                <div className="space-y-2 mt-3">
                  <Label htmlFor="dependent-select">Select Dependent</Label>
                  <Select value={selectedDependentId} onValueChange={setSelectedDependentId}>
                    <SelectTrigger id="dependent-select">
                      <SelectValue placeholder="Choose a dependent" />
                    </SelectTrigger>
                    <SelectContent>
                      {dependentsData.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">No dependents found</div>
                      ) : (
                        dependentsData.map((dep) => (
                          <SelectItem key={dep.id} value={dep.id}>
                            {dep.name} ({dep.relation})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  
                  {selectedDependent && (
                    <div className="mt-2 p-3 bg-background border rounded-md text-sm">
                      <p><strong>Name:</strong> {selectedDependent.name}</p>
                      <p><strong>Relationship:</strong> {selectedDependent.relation}</p>
                      {selectedDependent.dob && <p><strong>DOB:</strong> {new Date(selectedDependent.dob).toLocaleDateString()}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Fields */}
            {template.fields.map((field: FormField) => {
              const currentValue = annexureData[field.name] ?? autoFilledData[field.name] ?? ''
              const readOnly = isFieldReadOnly(field.name)

              if (field.type === 'signature') {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <SignaturePad
                      value={currentValue}
                      onChange={(val) => handleInputChange(field.name, val)}
                    />
                  </div>
                )
              }

              if (field.type === 'photo') {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <PhotoUpload
                      value={currentValue}
                      onChange={(val) => handleInputChange(field.name, val)}
                    />
                  </div>
                )
              }

              if (field.type === 'textarea') {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Textarea
                      id={field.name}
                      placeholder={field.placeholder || field.label}
                      value={currentValue}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      rows={3}
                      disabled={readOnly}
                    />
                    {readOnly && <p className="text-xs text-muted-foreground">Auto-filled from profile</p>}
                  </div>
                )
              }

              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    type={field.type || 'text'}
                    placeholder={field.placeholder || field.label}
                    value={currentValue}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    disabled={readOnly}
                  />
                  {readOnly && <p className="text-xs text-muted-foreground">Auto-filled from profile</p>}
                </div>
              )
            })}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1"
              >
                {saving ? 'Updating...' : 'Update Draft'}
              </Button>
            </div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
