// components/forms/templates/annexure-g-noc-passport.ts

import AnnexureGNocPassportPDF from "@/components/pdf/AnnexureGNocPassportPDF"
import type { FormTemplate } from "../types"

export const annexureGNocPassportTemplate: FormTemplate = {
  id: "annexure-g-noc-passport",
  title: "Annexure-G NOC for Passport Renewal",

  pdf: AnnexureGNocPassportPDF,

  fields: [
    { name: "refNo", label: "Reference Number", placeholder: "e.g., IITI/FA/PT/242/2026/" },
    { name: "issueDate", label: "Issue Date", type: "date" },
    { name: "facultyName", label: "Faculty Name", placeholder: "Enter full name" },
    { name: "fatherName", label: "Father's Name", placeholder: "Enter father's name" },
    { name: "doj", label: "Date of Joining", type: "date" },
    { name: "department", label: "Department", placeholder: "e.g., Computer Science and Engineering" },
    { name: "passportNumber", label: "Passport Number", placeholder: "e.g., XXXXXXX" },
    { name: "applicantPhoto", label: "Applicant Photo", type: "photo" },
    { name: "signature", label: "Digital Signature (Authority)", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
    needsApproval: true,
  },
}