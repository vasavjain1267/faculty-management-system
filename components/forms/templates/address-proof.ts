import AddressProofPDF from "@/components/pdf/AddressProofPDF"
import type { FormTemplate } from "../types"

export const addressProofTemplate: FormTemplate = {
  id: "address-proof",
  title: "Address Proof Certificate",

  pdf: AddressProofPDF,

  fields: [
    { name: "applicantName", label: "Applicant Name (Faculty/Dependent)" },
    { name: "facultyName", label: "Faculty Name (If applying for dependent)" },
    { name: "designation", label: "Designation (Faculty)" },
    { name: "department", label: "Department (Faculty)" },
    { name: "dateOfJoining", label: "Date of Joining (Faculty)", type: "date" },

    { name: "currentDesignation", label: "Current Designation (Faculty)" },
    { name: "currentDesignationDate", label: "Current Designation w.e.f.", type: "date" },

    { name: "addressHindi", label: "Residential Address (Hindi)", type: "textarea" },
    { name: "addressEnglish", label: "Residential Address (English)", type: "textarea" },

    { name: "reason", label: "Purpose / Reason", type: "textarea" },

    // signature
    { name: "signature", label: "Applicant's Signature", type: "signature" },
    { name: "issueDate", label: "Date of Issue", type: "date" },
  ],

  actions: {
    sendToAdmin: true,
  },
}
