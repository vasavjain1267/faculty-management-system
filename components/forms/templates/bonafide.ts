// components/forms/templates/bonafide.ts

import BonafidePDF from "@/components/pdf/BonafidePDF"
import type { FormTemplate } from "../types"

export const bonafideTemplate: FormTemplate = {
  id: "bonafide",
  title: "Bonafide Certificate",

  pdf: BonafidePDF,

  fields: [
    { name: "refNumber", label: "Reference Number (e.g., IITI/FA/PT/8/2025/)", placeholder: "IITI/FA/PT/8/2025/" },
    { name: "issueDate", label: "Issue Date", type: "date" },
    { name: "applicantName", label: "Name of Applicant (Faculty/Dependent)" },
    { name: "entryDesignation", label: "Designation at Entry Level (For Faculty)", placeholder: "e.g., Assistant Professor" },
    { name: "currentDesignation", label: "Present Designation (For Faculty)", placeholder: "e.g., Associate Professor" },
    { name: "currentDesignationDate", label: "Present Designation Date", type: "date" },
    { name: "department", label: "Department (Faculty)" },
    { 
      name: "purpose", 
      label: "Purpose of Certificate", 
      type: "textarea",
      placeholder: "e.g., to submit as workplace proof for spouse at..."
    },
    { name: "requestedBy", label: "Requested By (Faculty Name)", placeholder: "Dr. Full Name" },
    { name: "signature", label: "Applicant's Digital Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
  },
}