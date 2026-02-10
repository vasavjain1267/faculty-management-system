// components/forms/templates/annexure-h-passport.ts

import AnnexureHPassportPDF from "@/components/pdf/AnnexureHPassportPDF"
import type { FormTemplate } from "../types"

export const annexureHPassportTemplate: FormTemplate = {
  id: "annexure-h-passport",
  title: "Annexure 'H' - Prior Intimation for Passport",

  pdf: AnnexureHPassportPDF,

  fields: [
    { name: "place", label: "Place", placeholder: "e.g., Indore" },
    { name: "date", label: "Date", type: "date" },
    { name: "passportOffice", label: "Regional Passport Office", placeholder: "e.g., Bhopal" },
    { name: "employeeName", label: "Employee Name" },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    { name: "designation", label: "Designation" },
    { name: "officeWorking", label: "Name of Office Where Working", placeholder: "e.g., Department of Computer Science" },
    { name: "presentOfficeAddress", label: "Address of Present Office", type: "textarea" },
    { name: "residentialAddress", label: "Residential Address", type: "textarea" },
    { name: "employeeSignature", label: "Employee Signature", type: "signature" },
    { name: "employerSignature", label: "Employer Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
  },
}