import Link from "next/link"
import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FacultyFormsPage() {
  const templates = [
    {
      title: "Bonafide Application",
      description: "Fill the bonafide application form and export as PDF.",
      href: "/faculty/forms/bonafide",
    },

    {
    title: "R&D Request Form (R-15)",
    description: "Fill the PI/Student request form and export as PDF.",
    href: "/faculty/forms/rd-request",
    },

    {
    title: "Undertaking for NOC for Passport",
    description: "Fill undertaking details and export as PDF.",
    href: "/faculty/forms/undertaking-noc-passport",
    },

    {
    title: "LTC Office Memorandum",
    description: "Fill LTC details and export the office memorandum as PDF.",
    href: "/faculty/forms/ltc-office-memorandum",
  },

  {
    title: "Address Proof Certificate",
    description: "Generate bilingual (Hindi & English) address proof certificate.",
    href: "/faculty/forms/address-proof",
  },
  {
    title: "Service Certificate (KV School)",
    description: "Generate bilingual Hindi & English service certificate for KV admission.",
    href: "/faculty/forms/service-certificate-kv",
  },
  {
    title: "Annexure-A (Passport)",
    description: "Generate Identity Certificate (Annexure-A) for Passport application.",
    href: "/faculty/forms/annexure-a-passport",
  }


  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Forms</h1>
      <p className="text-muted-foreground mt-2">
        Select a template form, fill it, and generate a PDF.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Link key={t.title} href={t.href}>
            <Card className="hover:shadow-md transition cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}