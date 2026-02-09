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
    { name: "employeeName", label: "Employee Name" },
    { name: "gender", label: "Gender (he/she/they)", placeholder: "she" },
    { name: "dateOfJoining", label: "Date of Joining", type: "date" },
    { name: "entryDesignation", label: "Designation at Entry Level", placeholder: "Assistant Professor" },
    { name: "department", label: "Department" },
    { name: "currentDesignation", label: "Current Designation", placeholder: "Professor" },
    { name: "currentDesignationDate", label: "Current Designation Date", type: "date" },
    { name: "passportNumber", label: "Passport Number" },
    { name: "travelCountry", label: "Country to Travel", placeholder: "Spain" },
    { 
      name: "purpose", 
      label: "Purpose of Visit", 
      type: "textarea",
      placeholder: "e.g., to deliver a talk to the 'Conference Name' to be held at..."
    },
    { name: "eventName", label: "Event/Conference Name (optional)" },
    { name: "eventLocation", label: "Event Location/Address (optional)", type: "textarea" },
    { name: "travelStartDate", label: "Travel Start Date", type: "date" },
    { name: "travelEndDate", label: "Travel End Date", type: "date" },
    { 
      name: "fundingSource", 
      label: "Funding Source", 
      type: "textarea",
      placeholder: "e.g., Institute's Cumulative Professional Development Allowance (CPDA) fund and B & C & D allotted to employee"
    },
    { name: "signature", label: "Digital Signature", type: "signature" },
    { name: "recipientName", label: "To: Recipient Name" },
    { name: "recipientDesignation", label: "Recipient Designation" },
    { name: "recipientDepartment", label: "Recipient Department" },
  ],

  actions: {
    sendToAdmin: false,
  },
}