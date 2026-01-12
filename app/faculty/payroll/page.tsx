"use client"

import { useState } from "react"
import { ChevronRight, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mockSalarySlips, mockFaculty } from "@/lib/mock-data"
import type { SalarySlip } from "@/lib/types"

export default function PayrollPage() {
  const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payroll & Salary</h1>
        <p className="text-muted-foreground">View your monthly salary slips and payment history</p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Month Summary</CardTitle>
          <CardDescription>January 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Gross Salary</p>
              <p className="text-2xl font-bold text-success">
                ₹
                {(
                  mockSalarySlips[0].earnings.basic +
                  mockSalarySlips[0].earnings.da +
                  mockSalarySlips[0].earnings.hra +
                  mockSalarySlips[0].earnings.other
                ).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Deductions</p>
              <p className="text-2xl font-bold text-destructive">
                ₹
                {(
                  mockSalarySlips[0].deductions.pf +
                  mockSalarySlips[0].deductions.tax +
                  mockSalarySlips[0].deductions.other
                ).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Pay</p>
              <p className="text-2xl font-bold text-primary">₹{mockSalarySlips[0].netPay.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Slips List */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Slips</CardTitle>
          <CardDescription>Click on a month to view detailed salary slip</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockSalarySlips.map((slip) => (
              <button
                key={`${slip.month}-${slip.year}`}
                onClick={() => setSelectedSlip(slip)}
                className="w-full flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors text-left"
              >
                <div>
                  <p className="font-medium">
                    {slip.month} {slip.year}
                  </p>
                  <p className="text-sm text-muted-foreground">Net Pay: ₹{slip.netPay.toLocaleString()}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Salary Slip Modal */}
      <Dialog open={!!selectedSlip} onOpenChange={() => setSelectedSlip(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Salary Slip - {selectedSlip?.month} {selectedSlip?.year}
            </DialogTitle>
          </DialogHeader>
          {selectedSlip && <SalarySlipView slip={selectedSlip} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SalarySlipView({ slip }: { slip: SalarySlip }) {
  const totalEarnings = slip.earnings.basic + slip.earnings.da + slip.earnings.hra + slip.earnings.other
  const totalDeductions = slip.deductions.pf + slip.deductions.tax + slip.deductions.other

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      <div className="rounded-lg border p-4 bg-muted/30">
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <span className="text-muted-foreground">Employee Name:</span>
            <p className="font-medium">{mockFaculty.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Employee ID:</span>
            <p className="font-medium">{mockFaculty.employeeId}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Department:</span>
            <p className="font-medium">{mockFaculty.department}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Designation:</span>
            <p className="font-medium">{mockFaculty.designation}</p>
          </div>
        </div>
      </div>

      {/* Earnings & Deductions Table */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="font-semibold mb-2 text-success">Earnings</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Basic Salary</TableCell>
                <TableCell className="text-right">{slip.earnings.basic.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dearness Allowance (DA)</TableCell>
                <TableCell className="text-right">{slip.earnings.da.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>House Rent Allowance (HRA)</TableCell>
                <TableCell className="text-right">{slip.earnings.hra.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other Allowances</TableCell>
                <TableCell className="text-right">{slip.earnings.other.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow className="font-semibold">
                <TableCell>Total Earnings</TableCell>
                <TableCell className="text-right text-success">{totalEarnings.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-destructive">Deductions</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Provident Fund (PF)</TableCell>
                <TableCell className="text-right">{slip.deductions.pf.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Income Tax</TableCell>
                <TableCell className="text-right">{slip.deductions.tax.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other Deductions</TableCell>
                <TableCell className="text-right">{slip.deductions.other.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow className="font-semibold">
                <TableCell>Total Deductions</TableCell>
                <TableCell className="text-right text-destructive">{totalDeductions.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <Separator />

      {/* Net Pay */}
      <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
        <span className="text-lg font-semibold">Net Pay</span>
        <span className="text-2xl font-bold text-primary">₹{slip.netPay.toLocaleString()}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" className="bg-transparent">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  )
}
