import AddressProofPDF from "@/components/pdf/AddressProofPDF"
import type { FormTemplate } from "../types"

export const addressProofTemplate: FormTemplate = {
  id: "address-proof",
  title: "Address Proof Certificate",

  pdf: AddressProofPDF,

  fields: [
    { name: "facultyName", label: "Faculty Name" },
    { name: "designation", label: "Designation" },
    { name: "department", label: "Department" },
    { name: "dateOfJoining", label: "Date of Joining", type: "date" },

    { name: "currentDesignation", label: "Current Designation" },
    { name: "currentDesignationDate", label: "Current Designation w.e.f.", type: "date" },

    { name: "dependentName", label: "Dependent Name" },
    { name: "relationship", label: "Relationship (e.g. Daughter)" },

    { name: "addressHindi", label: "Residential Address (Hindi)", type: "textarea" },
    { name: "addressEnglish", label: "Residential Address (English)", type: "textarea" },

    { name: "reason", label: "Purpose / Reason", type: "textarea" },

    // signature
    { name: "signature", label: "Signature", type: "signature" },
    { name: "issueDate", label: "Date of Issue", type: "date" },
  ],

  actions: {
    sendToAdmin: true,
  },
}
