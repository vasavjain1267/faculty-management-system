import Link from "next/link"
import { ArrowRight, Briefcase, Building2, FileText, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const features = [
    {
      icon: Briefcase,
      title: "Job Openings",
      description: "Browse current faculty positions across various departments and apply online.",
    },
    {
      icon: FileText,
      title: "Easy Application",
      description: "Complete your application with our guided step-by-step wizard.",
    },
    {
      icon: Users,
      title: "Track Status",
      description: "Monitor your application status and receive updates in real-time.",
    },
    {
      icon: Building2,
      title: "Faculty Portal",
      description: "Access leave management, payroll, and profile services.",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-primary py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              Faculty Recruitment & Management System
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              A comprehensive platform for faculty recruitment, management, and administrative services for the
              Government Faculty Affairs Department.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/jobs">
                  View Current Openings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/register">Register as Applicant</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Everything You Need</h2>
            <p className="mt-4 text-muted-foreground">
              Our integrated system provides all the tools for recruitment and faculty management.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-semibold text-lg mb-4">For Applicants</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/jobs" className="hover:text-primary transition-colors">
                    Current Job Openings
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-primary transition-colors">
                    New Registration
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-primary transition-colors">
                    Application Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">For Faculty</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/login" className="hover:text-primary transition-colors">
                    Faculty Portal Login
                  </Link>
                </li>
                <li>
                  <Link href="/faculty/leaves" className="hover:text-primary transition-colors">
                    Leave Management
                  </Link>
                </li>
                <li>
                  <Link href="/faculty/payroll" className="hover:text-primary transition-colors">
                    Salary & Payroll
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Faculty Affairs Department</li>
                <li>Email: contact@frms.gov.in</li>
                <li>Phone: 1800-XXX-XXXX</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
