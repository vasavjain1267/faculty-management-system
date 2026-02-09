// components/forms/templates/undertaking-noc-passport.ts

import UndertakingNocPassportPDF from "@/components/pdf/UndertakingNocPassportPDF"
import type { FormTemplate } from "../types"

export const undertakingNocPassportTemplate: FormTemplate = {
  id: "undertaking-noc-passport",
  title: "Undertaking for NOC for Passport",

  pdf: UndertakingNocPassportPDF,

  fields: [
    { name: "dependentMembers", label: "Dependent family members & relation", type: "textarea" },
    { name: "name", label: "Name" },
    { name: "date", label: "Date", type: "date" },
    { name: "department", label: "Department" },

    // ✅ signature field
    { name: "signature", label: "Digital Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
  },
}