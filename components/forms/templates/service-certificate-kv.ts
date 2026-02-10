// components/forms/templates/service-certificate-kv.ts

import ServiceCertificateKVPDF from "@/components/pdf/ServiceCertificateKVPDF"
import type { FormTemplate } from "../types"

export const serviceCertificateKVTemplate: FormTemplate = {
  id: "service-certificate-kv",
  title: "Service Certificate (KV School)",

  pdf: ServiceCertificateKVPDF,

  fields: [
    { name: "facultyName", label: "Faculty Name" },
    { name: "joiningDate", label: "Joining Date" },
    { name: "department", label: "Department" },
    { name: "employeeName", label: "Employee Name (for whom certificate is issued)" },
    { name: "childName", label: "Child Name" },

    { name: "issueDate", label: "Issue Date", type: "date" },

    { name: "signature", label: "Digital Signature", type: "signature" },
  ],

  actions: {
    sendToAdmin: true,
  },
}
