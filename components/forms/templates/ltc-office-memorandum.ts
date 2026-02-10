import LtcOfficeMemorandumPDF from "@/components/pdf/LtcOfficeMemorandumPDF"
import type { FormTemplate } from "../types"

export const ltcOfficeMemorandumTemplate: FormTemplate = {
  id: "ltc-office-memorandum",
  title: "LTC Office Memorandum",

  pdf: LtcOfficeMemorandumPDF,

  fields: [
    { name: "facultyName", label: "Faculty Name (Primary Applicant)" },
    { name: "designation", label: "Designation (Faculty)" },
    { name: "department", label: "Department (Faculty)" },

    { name: "hometown", label: "Hometown / Destination" },
    { name: "blockYear", label: "LTC Block Year" },

    { name: "journeyDetails", label: "Journey Details (Include all travelers: Name, Age, Relation, Dates)", type: "textarea", placeholder: "List faculty and all dependents traveling" },

    { name: "leaveDetails", label: "Details of Leave during LTC", type: "textarea" },

    { name: "advanceRequested", label: "Advance Requested (₹)" },
    { name: "advanceAdmissible", label: "Advance Admissible (₹)" },

    { name: "basicPay", label: "Basic Pay with Cell & Pay Level (Faculty)" },

    { name: "encashment", label: "Encashment of 10 Days EL (Yes / No)" },

    // signature
    { name: "signature", label: "Signature of Faculty", type: "signature" },

    { name: "date", label: "Date", type: "date" },
  ],

  actions: {
    sendToAdmin: true,
  },
}
