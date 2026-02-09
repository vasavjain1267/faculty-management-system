import BonafidePDF from "@/components/pdf/BonafidePDF"

export const bonafideTemplate = {
  id: "bonafide",
  title: "Bonafide Application",

  pdf: BonafidePDF,

  fields: [
    { name: "name", label: "Name (in Block Letters)" },
    { name: "fatherName", label: "Father’s Name" },
    { name: "program", label: "Program" },
    { name: "branch", label: "Branch" },
    { name: "year", label: "Year" },
    { name: "semester", label: "Semester" },
    { name: "purpose", label: "Purpose" },
    { name: "mobile", label: "Mobile" },
    { name: "email", label: "Email ID" },
  ],

  actions: {
    sendToAdmin: true,
    needsApproval: false,
  },
}