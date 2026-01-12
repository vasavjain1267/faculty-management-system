"use client"

import type React from "react"

import { useState } from "react"
import { Search, UserPlus, Eye, Pencil, Filter, MoreHorizontal, Mail, Phone, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { mockEmployees, mockDepartments } from "@/lib/mock-data"
import { toast } from "sonner"

type Employee = (typeof mockEmployees)[0]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDept = selectedDepartment === "all" || emp.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || emp.status === selectedStatus
    return matchesSearch && matchesDept && matchesStatus
  })

  const designationCounts = {
    professor: employees.filter((e) => e.designation === "Professor").length,
    associateProfessor: employees.filter((e) => e.designation === "Associate Professor").length,
    assistantProfessor: employees.filter((e) => e.designation === "Assistant Professor").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">Manage faculty members and their details</p>
        </div>
        <AddEmployeeDialog />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Employees</p>
            <p className="text-2xl font-bold">{employees.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Professors</p>
            <p className="text-2xl font-bold">{designationCounts.professor}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Associate Professors</p>
            <p className="text-2xl font-bold">{designationCounts.associateProfessor}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Assistant Professors</p>
            <p className="text-2xl font-bold">{designationCounts.assistantProfessor}</p>
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
                placeholder="Search by name, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty List</CardTitle>
          <CardDescription>
            Showing {filteredEmployees.length} of {employees.length} employees
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {emp.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{emp.employeeId}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>
                    {new Date(emp.joiningDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={emp.status === "active" ? "default" : "secondary"}
                      className={
                        emp.status === "active"
                          ? "bg-success/10 text-success border-success/20"
                          : emp.status === "on-leave"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : ""
                      }
                    >
                      {emp.status === "on-leave" ? "On Leave" : emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <ViewEmployeeDialog employee={emp} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Payroll</DropdownMenuItem>
                          <DropdownMenuItem>View Leave History</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function ViewEmployeeDialog({ employee }: { employee: Employee }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>{employee.employeeId}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="personal" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="leave">Leave Balance</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{employee.designation}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{employee.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {new Date(employee.dateOfBirth).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{employee.gender}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{employee.address}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="professional" className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Designation</p>
                <p className="font-medium">{employee.designation}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Joining Date</p>
                <p className="font-medium">
                  {new Date(employee.joiningDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge
                  variant="outline"
                  className={
                    employee.status === "active"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-warning/10 text-warning border-warning/20"
                  }
                >
                  {employee.status}
                </Badge>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Qualification</p>
                <p className="font-medium">{employee.qualification}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Specialization</p>
                <p className="font-medium">{employee.specialization}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">Bank Account</p>
                <p className="font-medium font-mono">{employee.bankAccount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">PAN Number</p>
                <p className="font-medium font-mono">{employee.panNumber}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leave" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-primary">{employee.leaveBalance.casual}</p>
                  <p className="text-sm text-muted-foreground mt-1">Casual Leave</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-info">{employee.leaveBalance.medical}</p>
                  <p className="text-sm text-muted-foreground mt-1">Medical Leave</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-success">{employee.leaveBalance.earned}</p>
                  <p className="text-sm text-muted-foreground mt-1">Earned Leave</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" className="bg-transparent">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddEmployeeDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Employee added successfully")
    setOpen(false)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter the details of the new faculty member</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Dr. John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@university.edu" required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="9876543210" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select>
                  <SelectTrigger id="designation">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="joining">Joining Date</Label>
                <Input id="joining" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input id="qualification" placeholder="Ph.D in Computer Science" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" placeholder="Machine Learning, AI" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
