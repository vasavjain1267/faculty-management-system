// components/forms/types.ts

import type React from "react"

export type FormField = {
  name: string
  label: string
  type?: "text" | "textarea" | "date" | "signature"
  placeholder?: string
}

export type TemplateActions = {
  sendToAdmin?: boolean
  needsApproval?: boolean
}

export type FormTemplate = {
  id: string
  title: string
  pdf: React.ComponentType<{ data: Record<string, string> }>
  fields: FormField[]
  actions?: TemplateActions
}