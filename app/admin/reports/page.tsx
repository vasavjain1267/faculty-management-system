"use client"

import { useState } from "react"
import { FileBarChart, Download, Calendar, Users, DollarSign, Briefcase, Loader2, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const reportTypes = [
  {
    id: "recruitment",
    name: "Recruitment Report",
    description: "Applications, shortlists, and hiring statistics",
    icon: Briefcase,
  },
  {
    id: "attendance",
    name: "Attendance Report",
    description: "Faculty attendance and leave records",
    icon: Calendar,
  },
  {
    id: "payroll",
    name: "Payroll Report",
    description: "Salary disbursement and deductions summary",
    icon: DollarSign,
  },
  {
    id: "employee",
    name: "Employee Report",
    description: "Department-wise faculty statistics",
    icon: Users,
  },
]

const generatedReports = [
  {
    id: "1",
    name: "Recruitment Summary - January 2026",
    type: "recruitment",
    generatedAt: "2026-01-12T10:30:00",
    generatedBy: "Admin User",
    size: "245 KB",
  },
  {
    id: "2",
    name: "Payroll Report - December 2025",
    type: "payroll",
    generatedAt: "2026-01-05T09:15:00",
    generatedBy: "HR Manager",
    size: "312 KB",
  },
  {
    id: "3",
    name: "Leave Summary - Q4 2025",
    type: "attendance",
    generatedAt: "2026-01-02T14:20:00",
    generatedBy: "Admin User",
    size: "178 KB",
  },
  {
    id: "4",
    name: "Employee Directory - 2025",
    type: "employee",
    generatedAt: "2025-12-28T11:00:00",
    generatedBy: "HR Manager",
    size: "425 KB",
  },
]

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState("January")
  const [selectedYear, setSelectedYear] = useState("2026")

  const generateReport = async (type: string) => {
    setGenerating(type)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setGenerating(null)
    toast.success(`${reportTypes.find((r) => r.id === type)?.name} generated successfully`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate and download system reports</p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Period Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Report Period</CardTitle>
              <CardDescription>Select the time period for the report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full sm:w-[120px]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Types */}
          <div className="grid gap-4 sm:grid-cols-2">
            {reportTypes.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <report.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => generateReport(report.id)}
                    disabled={generating === report.id}
                  >
                    {generating === report.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileBarChart className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Previously generated reports available for download</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Generated By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generatedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{report.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.generatedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(report.generatedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="bg-transparent">
                          <Download className="mr-2 h-3 w-3" />
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
