// components/forms/templates/service-certificate-kv.ts

import ServiceCertificateKVPDF from "@/components/pdf/ServiceCertificateKVPDF"
import type { FormTemplate } from "../types"

export const serviceCertificateKVTemplate: FormTemplate = {
  id: "service-certificate-kv",
  title: "Service Certificate (KV School)",

  pdf: ServiceCertificateKVPDF,

  fields: [
    { name: "facultyName", label: "Faculty Name (Parent/Guardian)" },
    { name: "joiningDate", label: "Joining Date (Faculty)" },
    { name: "department", label: "Department (Faculty)" },
    { name: "childName", label: "Child's Name (Student)" },

    { name: "issueDate", label: "Issue Date", type: "date" },

    { name: "signature", label: "Faculty Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
  },
}
