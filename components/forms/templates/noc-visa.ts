// components/forms/templates/noc-visa.ts

import NocVisaPDF from "@/components/pdf/NocVisaPDF"
import type { FormTemplate } from "../types"

export const nocVisaTemplate: FormTemplate = {
  id: "noc-visa",
  title: "NOC for VISA (Visitors International Stay Admission)",

  pdf: NocVisaPDF,

  fields: [
    { name: "refNumber", label: "Reference Number", placeholder: "IITI/FA/PT/34/2026/" },
    { name: "issueDate", label: "Issue Date", type: "date" },
    { name: "applicantName", label: "Applicant Name (Traveler)" },
    { name: "facultyName", label: "Faculty Name (If applying for dependent)" },
    { name: "gender", label: "Gender (Applicant)", placeholder: "Male/Female/Other" },
    { name: "dateOfJoining", label: "Date of Joining (Faculty)", type: "date" },
    { name: "entryDesignation", label: "Designation at Entry (Faculty)", placeholder: "Assistant Professor" },
    { name: "department", label: "Department (Faculty)" },
    { name: "currentDesignation", label: "Current Designation (Faculty)", placeholder: "Professor" },
    { name: "currentDesignationDate", label: "Current Designation Date", type: "date" },
    { name: "passportNumber", label: "Applicant's Passport Number" },
    { name: "travelCountry", label: "Country to Travel", placeholder: "Spain" },
    { 
      name: "purpose", 
      label: "Purpose of Visit", 
      type: "textarea",
      placeholder: "e.g., to attend a conference, family vacation, etc."
    },
    { name: "eventName", label: "Event/Conference Name (optional)" },
    { name: "eventLocation", label: "Event Location/Address (optional)", type: "textarea" },
    { name: "travelStartDate", label: "Travel Start Date", type: "date" },
    { name: "travelEndDate", label: "Travel End Date", type: "date" },
    { 
      name: "fundingSource", 
      label: "Funding Source", 
      type: "textarea",
      placeholder: "e.g., Self-funded or Institute funding"
    },
    { name: "signature", label: "Applicant's Digital Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
  },
}