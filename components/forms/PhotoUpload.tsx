"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface PhotoUploadProps {
  value: string
  onChange: (photo: string) => void
}

export default function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    setIsLoading(true)

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange(result)
        setIsLoading(false)
      }
      reader.onerror = () => {
        alert("Failed to read file")
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading photo:", error)
      alert("Failed to upload photo")
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <Card className="relative p-4">
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src={value}
              alt="Uploaded photo"
              fill
              className="object-cover rounded-md"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="w-full mt-2"
          >
            <X className="h-4 w-4 mr-2" />
            Remove Photo
          </Button>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-md flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="photo-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Uploading..." : "Upload Photo"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Max size: 5MB. Formats: JPG, PNG
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
