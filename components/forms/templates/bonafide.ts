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
    { name: "employeeName", label: "Name of Employee" },
    { name: "entryDesignation", label: "Designation at Entry Level", placeholder: "e.g., Assistant Professor" },
    { name: "currentDesignation", label: "Present Designation", placeholder: "e.g., Associate Professor" },
    { name: "currentDesignationDate", label: "Present Designation Date", type: "date" },
    { name: "department", label: "Department" },
    { 
      name: "purpose", 
      label: "Purpose of Certificate", 
      type: "textarea",
      placeholder: "e.g., to submit as workplace proof for spouse at..."
    },
    { name: "requestedBy", label: "Requested By (Employee Name)", placeholder: "Dr. Full Name" },
    { name: "recipientName", label: "Recipient Name (To whom addressed)" },
    { name: "recipientDesignation", label: "Recipient Designation" },
    { name: "recipientOrganization", label: "Recipient Organization" },
    { name: "signature", label: "Digital Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: false,
  },
}