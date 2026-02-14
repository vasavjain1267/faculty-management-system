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
    { name: "applicantName", label: "Applicant Name (Faculty/Dependent)", placeholder: "Enter full name" },
    { name: "facultyName", label: "Faculty Name (If applying for dependent)", placeholder: "Enter faculty name" },
    { name: "fatherName", label: "Father's/Spouse's Name (of Applicant)", placeholder: "Enter name" },
    { name: "doj", label: "Date of Joining (Faculty)", type: "date" },
    { name: "department", label: "Department (Faculty)", placeholder: "e.g., Computer Science and Engineering" },
    { name: "passportNumber", label: "Applicant's Passport Number", placeholder: "e.g., XXXXXXX" },
    { name: "applicantPhoto", label: "Applicant's Photo", type: "photo" },
    { name: "signature", label: "Applicant's Digital Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
    needsApproval: true,
  },
}