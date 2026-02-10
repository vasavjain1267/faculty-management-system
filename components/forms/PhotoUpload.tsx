"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  value?: string
  onChange: (base64: string) => void
}

export default function PhotoUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      {/* hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* trigger button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        Upload Photo
      </Button>

      {/* preview */}
      {value && (
        <img
          src={value}
          alt="Uploaded photo"
          className="h-32 w-24 rounded border object-cover"
        />
      )}
    </div>
  )
}
