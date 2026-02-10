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
    { name: "applicantName", label: "Applicant Name (Faculty/Dependent)" },
    { name: "facultyName", label: "Faculty Name (If applying for dependent)" },
    { name: "dateOfBirth", label: "Applicant's Date of Birth", type: "date" },
    { name: "designation", label: "Designation (For Faculty)", placeholder: "Leave blank for dependent" },
    { name: "officeWorking", label: "Name of Office/Institute", placeholder: "e.g., IIT Indore" },
    { name: "presentOfficeAddress", label: "Address of Institute", type: "textarea" },
    { name: "residentialAddress", label: "Residential Address", type: "textarea" },
    { name: "applicantSignature", label: "Applicant's Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
  },
}