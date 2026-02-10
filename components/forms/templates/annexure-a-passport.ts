import AnnexureAPassportPDF from "@/components/pdf/AnnexureAPassportPDF"
import type { FormTemplate } from "../types"

export const annexureAPassportTemplate: FormTemplate = {
  id: "annexure-a-passport",
  title: "Annexure-A (Passport)",

  pdf: AnnexureAPassportPDF,

  fields: [
    { name: "facultyName", label: "Faculty Name" },
    { name: "applicantName", label: "Applicant Name (Faculty/Dependent)" },
    { name: "fatherName", label: "Father's/Spouse's Name (of Applicant)" },
    { name: "doj", label: "Date of Joining (Faculty)", type: "date" },
    { name: "department", label: "Department (Faculty)" },

    { name: "currentDesignation", label: "Current Designation (Faculty)" },
    { name: "currentDesignationDate", label: "Designation Since", type: "date" },

    { name: "idCardNumber", label: "Faculty ID Card Number" },

    { name: "refNo", label: "Reference Number" },
    { name: "issueDate", label: "Issue Date", type: "date" },

    { name: "applicantPhoto", label: "Applicant's Photo", type: "photo" },
    { name: "signature", label: "Applicant's Digital Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
    needsApproval: true,
  },
}
