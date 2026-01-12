"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockDepartments } from "@/lib/mock-data"
import { toast } from "sonner"

const mockDesignations = [
  { id: "1", name: "Professor", level: 4 },
  { id: "2", name: "Associate Professor", level: 3 },
  { id: "3", name: "Assistant Professor", level: 2 },
  { id: "4", name: "Guest Lecturer", level: 1 },
]

const mockSalarySettings = {
  daPercent: 20,
  hraPercent: 24,
  pfPercent: 12,
}

export default function SettingsPage() {
  const [departments, setDepartments] = useState(mockDepartments)
  const [designations, setDesignations] = useState(mockDesignations)
  const [salarySettings, setSalarySettings] = useState(mockSalarySettings)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Master Settings</h1>
        <p className="text-muted-foreground">Configure departments, designations, and salary parameters</p>
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
          <TabsTrigger value="salary">Salary Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="departments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Departments</CardTitle>
                <CardDescription>Manage university departments</CardDescription>
              </div>
              <AddDepartmentDialog
                onAdd={(dept) => setDepartments([...departments, { ...dept, id: Date.now().toString() }])}
              />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.code}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => {
                              setDepartments(departments.filter((d) => d.id !== dept.id))
                              toast.success("Department deleted")
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="designations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Designations</CardTitle>
                <CardDescription>Manage faculty designation levels</CardDescription>
              </div>
              <AddDesignationDialog
                onAdd={(designation) =>
                  setDesignations([...designations, { ...designation, id: Date.now().toString() }])
                }
              />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Designation</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designations.map((designation) => (
                    <TableRow key={designation.id}>
                      <TableCell className="font-medium">{designation.name}</TableCell>
                      <TableCell>Level {designation.level}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => {
                              setDesignations(designations.filter((d) => d.id !== designation.id))
                              toast.success("Designation deleted")
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardHeader>
              <CardTitle>Salary Allowances & Deductions</CardTitle>
              <CardDescription>Configure salary calculation parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success("Salary settings updated")
                }}
                className="space-y-6 max-w-md"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="da">Dearness Allowance (DA) %</Label>
                    <Input
                      id="da"
                      type="number"
                      value={salarySettings.daPercent}
                      onChange={(e) =>
                        setSalarySettings({ ...salarySettings, daPercent: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hra">House Rent Allowance (HRA) %</Label>
                    <Input
                      id="hra"
                      type="number"
                      value={salarySettings.hraPercent}
                      onChange={(e) =>
                        setSalarySettings({ ...salarySettings, hraPercent: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pf">Provident Fund (PF) %</Label>
                    <Input
                      id="pf"
                      type="number"
                      value={salarySettings.pfPercent}
                      onChange={(e) =>
                        setSalarySettings({ ...salarySettings, pfPercent: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <Button type="submit">Save Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AddDepartmentDialog({ onAdd }: { onAdd: (dept: { name: string; code: string }) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onAdd({ name, code })
    toast.success("Department added")
    setOpen(false)
    setLoading(false)
    setName("")
    setCode("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
            <DialogDescription>Create a new department</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name">Department Name</Label>
              <Input
                id="dept-name"
                placeholder="e.g., Computer Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-code">Department Code</Label>
              <Input
                id="dept-code"
                placeholder="e.g., CS"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Department
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddDesignationDialog({ onAdd }: { onAdd: (designation: { name: string; level: number }) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [level, setLevel] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onAdd({ name, level: Number.parseInt(level) })
    toast.success("Designation added")
    setOpen(false)
    setLoading(false)
    setName("")
    setLevel("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Designation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Designation</DialogTitle>
            <DialogDescription>Create a new faculty designation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="desig-name">Designation Name</Label>
              <Input
                id="desig-name"
                placeholder="e.g., Senior Lecturer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desig-level">Level</Label>
              <Input
                id="desig-level"
                type="number"
                placeholder="e.g., 3"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Designation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
