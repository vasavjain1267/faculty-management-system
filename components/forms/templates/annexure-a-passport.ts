import AnnexureAPassportPDF from "@/components/pdf/AnnexureAPassportPDF"
import type { FormTemplate } from "../types"

export const annexureAPassportTemplate: FormTemplate = {
  id: "annexure-a-passport",
  title: "Annexure-A (Passport)",

  pdf: AnnexureAPassportPDF,

  fields: [
    { name: "facultyName", label: "Faculty Name" },
    { name: "fatherName", label: "Father's Name" },
    { name: "doj", label: "Date of Joining", type: "date" },
    { name: "department", label: "Department" },

    { name: "currentDesignation", label: "Current Designation" },
    { name: "currentDesignationDate", label: "Designation Since", type: "date" },

    { name: "dependentName", label: "Dependent / Spouse Name" },
    { name: "idCardNumber", label: "Faculty ID Card Number" },

    { name: "refNo", label: "Reference Number" },
    { name: "issueDate", label: "Issue Date", type: "date" },

    { name: "applicantPhoto", label: "Applicant Photo", type: "photo" },
    { name: "signature", label: "Digital Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
    needsApproval: true,
  },
}
