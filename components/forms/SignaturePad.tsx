"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SignaturePadProps {
  value: string
  onChange: (signature: string) => void
}

export default function SignaturePad({ value, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setContext(ctx)

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = 150

    // Configure context
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Load existing signature if any
    if (value) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
      img.src = value
    }
  }, [])

  useEffect(() => {
    if (value && context && canvasRef.current) {
      const img = new Image()
      img.onload = () => {
        if (context && canvasRef.current) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          context.drawImage(img, 0, 0)
        }
      }
      img.src = value
    }
  }, [value])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return

    setIsDrawing(true)
    const rect = canvasRef.current.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    context.beginPath()
    context.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    
    setIsDrawing(false)
    
    // Convert canvas to base64 and emit change
    if (canvasRef.current) {
      const signature = canvasRef.current.toDataURL("image/png")
      onChange(signature)
    }
  }

  const clear = () => {
    if (!context || !canvasRef.current) return

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    onChange("")
  }

  return (
    <div className="space-y-2">
      <Card className="p-0 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-[150px] border-0 cursor-crosshair touch-none bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </Card>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={clear}
        className="w-full"
      >
        Clear Signature
      </Button>
    </div>
  )
}
