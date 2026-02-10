export type FieldType = "text" | "textarea" | "date" | "signature" | "photo" | "select"

export type FormField = {
  name: string
  label: string
  type?: FieldType
  placeholder?: string
  options?: string[]
}

export type FormTemplate = {
  id: string
  title: string
  pdf: React.ComponentType<{ data: Record<string, string> }>
  fields: FormField[]
  actions?: {
    sendToAdmin?: boolean
    needsApproval?: boolean
  }
}
