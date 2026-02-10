// components/forms/templates/undertaking-noc-passport.ts

import UndertakingNocPassportPDF from "@/components/pdf/UndertakingNocPassportPDF"
import type { FormTemplate } from "../types"

export const undertakingNocPassportTemplate: FormTemplate = {
  id: "undertaking-noc-passport",
  title: "Undertaking for NOC for Passport",

  pdf: UndertakingNocPassportPDF,

  fields: [
    { name: "applicantName", label: "Applicant Name (Faculty/Dependent)" },
    { name: "facultyName", label: "Faculty Name (If dependent is applying)" },
    { name: "dependentMembers", label: "All dependent family members & relations (List all)", type: "textarea", placeholder: "List all family members with relationships" },
    { name: "date", label: "Date", type: "date" },
    { name: "department", label: "Department (Faculty)" },

    // ✅ signature field
    { name: "signature", label: "Applicant's Digital Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
  },
}