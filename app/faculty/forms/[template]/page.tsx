"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"

import { formTemplates } from "@/components/forms"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import SignaturePad from "@/components/forms/SignaturePad"
import PhotoUpload from "@/components/forms/PhotoUpload"

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
  const templateId = params.template as string

  const template = (formTemplates as Record<string, FormTemplate>)[templateId]

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

  /* ======================================================
     INITIAL STATE
     ====================================================== */
  const initialState = useMemo(() => {
    const obj: Record<string, string> = {}
    template.fields.forEach((f) => {
      obj[f.name] = ""
    })
    return obj
  }, [template.fields])

  const [formData, setFormData] = useState<Record<string, string>>(initialState)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{template.title}</h1>
        <p className="text-muted-foreground mt-2">
          Fill the details below. PDF will update live and you can download it.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ================= FORM ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {template.fields.map((field) => {
              const type = field.type || "text"

              /* ===== PHOTO UPLOAD ===== */
              if (type === "photo") {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <PhotoUpload
                      value={formData[field.name]}
                      onChange={(base64) =>
                        setFormData((prev) => ({
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
                      value={formData[field.name]}
                      onChange={(base64) =>
                        setFormData((prev) => ({
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
                    <Label>{field.label}</Label>
                    <Textarea
                      value={formData[field.name]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: e.target.value,
                        }))
                      }
                    />
                  </div>
                )
              }

              /* ===== DATE ===== */
              if (type === "date") {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="date"
                      value={formData[field.name]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: e.target.value,
                        }))
                      }
                    />
                  </div>
                )
              }

              /* ===== TEXT ===== */
              return (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  <Input
                    value={formData[field.name]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                  />
                </div>
              )
            })}

            {template.actions?.sendToAdmin && (
              <Button variant="outline" className="w-full">
                Send to Admin (next step)
              </Button>
            )}

            <PDFDownloadLink
              document={<PdfComponent data={formData} />}
              fileName={`${template.id}.pdf`}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
            </PDFDownloadLink>
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
                <PdfComponent data={formData} />
              </PDFViewer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
