"use client"

import { useState } from "react"
import { DollarSign, Download, Eye, Filter, Search, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/ui/status-badge"
import { mockPayrollRecords, mockDepartments } from "@/lib/mock-data"
import { toast } from "sonner"

const months = [
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
]

export default function PayrollPage() {
  const [payrollRecords, setPayrollRecords] = useState(mockPayrollRecords)
  const [selectedMonth, setSelectedMonth] = useState("January")
  const [selectedYear, setSelectedYear] = useState("2026")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRecords = payrollRecords.filter((record) => {
    const matchesMonth = record.month === selectedMonth
    const matchesYear = record.year === Number(selectedYear)
    const matchesDept = selectedDepartment === "all" || record.department === selectedDepartment
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesMonth && matchesYear && matchesDept && matchesSearch
  })

  const totalGross = filteredRecords.reduce((sum, r) => sum + r.grossPay, 0)
  const totalNet = filteredRecords.reduce((sum, r) => sum + r.netPay, 0)
  const pendingCount = filteredRecords.filter((r) => r.status === "pending").length
  const paidCount = filteredRecords.filter((r) => r.status === "paid").length

  const processPayroll = (id: string) => {
    setPayrollRecords(
      payrollRecords.map((record) =>
        record.id === id
          ? { ...record, status: "paid" as const, processedAt: new Date().toISOString().split("T")[0] }
          : record,
      ),
    )
    toast.success("Payroll processed successfully")
  }

  const processAllPending = () => {
    setPayrollRecords(
      payrollRecords.map((record) =>
        record.status === "pending"
          ? { ...record, status: "paid" as const, processedAt: new Date().toISOString().split("T")[0] }
          : record,
      ),
    )
    toast.success(`Processed ${pendingCount} pending payroll records`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground">Process and manage employee salaries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {pendingCount > 0 && (
            <Button onClick={processAllPending}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Process All Pending ({pendingCount})
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{filteredRecords.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gross</p>
                <p className="text-2xl font-bold">₹{totalGross.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Net Pay</p>
                <p className="text-2xl font-bold">₹{totalNet.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full lg:w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {mockDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Payroll Records - {selectedMonth} {selectedYear}
          </CardTitle>
          <CardDescription>
            {paidCount} paid, {pendingCount} pending
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No payroll records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.designation}</TableCell>
                    <TableCell className="text-right font-medium">₹{record.grossPay.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-destructive">
                      -₹{(record.pf + record.tax + record.otherDeductions).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-success">
                      ₹{record.netPay.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status === "paid" ? "approved" : "pending"} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <PayrollDetailDialog record={record} />
                        {record.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-success/10 text-success border-success/20 hover:bg-success/20"
                            onClick={() => processPayroll(record.id)}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function PayrollDetailDialog({ record }: { record: (typeof mockPayrollRecords)[0] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="bg-transparent">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Salary Slip - {record.month} {record.year}
          </DialogTitle>
          <DialogDescription>
            {record.employeeName} ({record.employeeId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info */}
          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department</span>
              <span className="font-medium">{record.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Designation</span>
              <span className="font-medium">{record.designation}</span>
            </div>
          </div>

          {/* Earnings */}
          <div>
            <h4 className="font-semibold mb-3 text-success">Earnings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Basic Salary</span>
                <span>₹{record.basic.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Dearness Allowance (DA)</span>
                <span>₹{record.da.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>House Rent Allowance (HRA)</span>
                <span>₹{record.hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Other Allowances</span>
                <span>₹{record.otherAllowances.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Earnings</span>
                <span className="text-success">₹{record.grossPay.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h4 className="font-semibold mb-3 text-destructive">Deductions</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Provident Fund (PF)</span>
                <span>₹{record.pf.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Income Tax</span>
                <span>₹{record.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Other Deductions</span>
                <span>₹{record.otherDeductions.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Deductions</span>
                <span className="text-destructive">
                  ₹{(record.pf + record.tax + record.otherDeductions).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="rounded-lg bg-primary/10 p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Net Pay</span>
              <span className="text-2xl font-bold text-primary">₹{record.netPay.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
