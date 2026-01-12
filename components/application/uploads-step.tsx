"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, FileText, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface UploadsStepProps {
  data: {
    photo?: File
    signature?: File
    cv?: File
  }
  onChange: (data: { photo?: File; signature?: File; cv?: File }) => void
}

type DocumentType = "photo" | "signature" | "cv"

const documentConfig = {
  photo: {
    title: "Passport Photo",
    description: "Upload a recent passport-size photograph (Max 200KB, JPG/PNG)",
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxSize: 200 * 1024,
    icon: ImageIcon,
  },
  signature: {
    title: "Signature",
    description: "Upload your signature on white background (Max 100KB, JPG/PNG)",
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxSize: 100 * 1024,
    icon: ImageIcon,
  },
  cv: {
    title: "CV / Resume",
    description: "Upload your detailed CV (Max 2MB, PDF only)",
    accept: { "application/pdf": [".pdf"] },
    maxSize: 2 * 1024 * 1024,
    icon: FileText,
  },
}

export function UploadsStep({ data, onChange }: UploadsStepProps) {
  const handleFileChange = (type: DocumentType, file: File | undefined) => {
    onChange({ ...data, [type]: file })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Document Uploads</h3>
        <p className="text-sm text-muted-foreground">Upload required documents for your application</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {(Object.keys(documentConfig) as DocumentType[]).map((type) => (
          <DocumentUploader
            key={type}
            type={type}
            file={data[type]}
            config={documentConfig[type]}
            onChange={(file) => handleFileChange(type, file)}
          />
        ))}
      </div>
    </div>
  )
}

interface DocumentUploaderProps {
  type: DocumentType
  file?: File
  config: (typeof documentConfig)[DocumentType]
  onChange: (file: File | undefined) => void
}

function DocumentUploader({ type, file, config, onChange }: DocumentUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0]
      if (selectedFile) {
        onChange(selectedFile)
        if (type !== "cv") {
          const reader = new FileReader()
          reader.onload = () => setPreview(reader.result as string)
          reader.readAsDataURL(selectedFile)
        }
      }
    },
    [onChange, type],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: config.accept,
    maxSize: config.maxSize,
    multiple: false,
  })

  const removeFile = () => {
    onChange(undefined)
    setPreview(null)
  }

  const Icon = config.icon

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {config.title}
        </CardTitle>
        <CardDescription className="text-xs">{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {file ? (
          <div className="relative">
            {preview && type !== "cv" ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <img src={preview || "/placeholder.svg"} alt={config.title} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-lg border bg-muted">
                <div className="text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium truncate max-w-[150px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
              onClick={removeFile}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              "flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground text-center px-2">
              {isDragActive ? "Drop file here" : "Drag & drop or click to upload"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
