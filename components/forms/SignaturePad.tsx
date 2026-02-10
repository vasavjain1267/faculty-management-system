"use client"

import { useRef } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/components/ui/button"

type SignaturePadProps = {
  value?: string
  onChange: (base64: string) => void
}

export default function SignaturePad({ value, onChange }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas | null>(null)

  const handleClear = () => {
    sigRef.current?.clear()
    onChange("")
  }

  const handleSave = () => {
    if (!sigRef.current) return
    if (sigRef.current.isEmpty()) return

    const base64 = sigRef.current.toDataURL("image/png")
    onChange(base64)
  }

  return (
    <div className="space-y-3">
      <div className="border rounded-md overflow-hidden">
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{
            width: 420,
            height: 160,
            className: "bg-white",
          }}
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={handleClear}>
          Clear
        </Button>

        <Button type="button" onClick={handleSave}>
          Save Signature
        </Button>
      </div>

      {value && (
        <img
          src={value}
          alt="Signature Preview"
          className="h-16 w-auto border rounded"
        />
      )}
    </div>
  )
}
