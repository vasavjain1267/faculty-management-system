import RDRequestPDF from "@/components/pdf/RDRequestPDF"

export const rdRequestTemplate = {
  id: "rd-request",
  title: "R&D Request Form (R-15)",

  pdf: RDRequestPDF,

  fields: [
    { name: "name", label: "Name" },
    { name: "piHodName", label: "PI/HOD Name" },
    { name: "department", label: "Department" },
    { name: "contactNo", label: "Contact No" },
    { name: "date", label: "Date" },
    { name: "subject", label: "Subject" },
    { name: "body", label: "Application Content" },
    { name: "documentsAttached", label: "No. of Supporting Documents Attached" },
    { name: "remarksPI", label: "Remarks of PI/HOD" },
    { name: "remarksDA", label: "Remarks of Dealing Assistant" },
    { name: "remarksJS", label: "Remarks of Junior Superintendent" },
    { name: "remarksAR", label: "Remarks of Assistant Registrar" },
    { name: "remarksDean", label: "Remarks of Dean" },
  ],

  actions: {
    sendToAdmin: true,
  },
}