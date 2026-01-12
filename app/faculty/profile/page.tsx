"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { mockFaculty, mockDependents, mockEducation } from "@/lib/mock-data"
import { toast } from "sonner"

export default function ProfilePage() {
  const [dependents, setDependents] = useState(mockDependents)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">View and manage your service book details</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="academic">Academic Record</TabsTrigger>
          <TabsTrigger value="dependents">Family/Dependents</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic personal and employment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label className="text-muted-foreground">Employee ID</Label>
                  <p className="font-medium">{mockFaculty.employeeId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{mockFaculty.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{mockFaculty.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium">{mockFaculty.department}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Designation</Label>
                  <p className="font-medium">{mockFaculty.designation}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date of Joining</Label>
                  <p className="font-medium">
                    {new Date(mockFaculty.joiningDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Record</CardTitle>
              <CardDescription>Your educational qualifications</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Degree</TableHead>
                    <TableHead>Board/University</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>% / CGPA</TableHead>
                    <TableHead>Subject</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEducation.map((edu) => (
                    <TableRow key={edu.id}>
                      <TableCell className="font-medium">{edu.degree}</TableCell>
                      <TableCell>{edu.boardUniversity}</TableCell>
                      <TableCell>{edu.year}</TableCell>
                      <TableCell>{edu.percentage}</TableCell>
                      <TableCell>{edu.subject}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Family & Dependents</CardTitle>
                <CardDescription>Manage dependents for medical claims and benefits</CardDescription>
              </div>
              <AddDependentDialog onAdd={(dep) => setDependents([...dependents, dep])} />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Relation</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Dependent</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dependents.map((dep) => (
                    <TableRow key={dep.id}>
                      <TableCell className="font-medium">{dep.name}</TableCell>
                      <TableCell>{dep.relation}</TableCell>
                      <TableCell>
                        {new Date(dep.dob).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{dep.isDependent ? "Yes" : "No"}</TableCell>
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
                              setDependents(dependents.filter((d) => d.id !== dep.id))
                              toast.success("Dependent removed")
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

        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle>Promotion History</CardTitle>
              <CardDescription>Track your career progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-muted space-y-8">
                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">Associate Professor</p>
                    <p className="text-sm text-muted-foreground">Promoted on July 15, 2023</p>
                    <p className="text-sm text-muted-foreground">Computer Science Department</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-muted" />
                  <div>
                    <p className="font-medium">Assistant Professor</p>
                    <p className="text-sm text-muted-foreground">Joined on July 15, 2020</p>
                    <p className="text-sm text-muted-foreground">Computer Science Department</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AddDependentDialog({ onAdd }: { onAdd: (dep: (typeof mockDependents)[0]) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")
  const [dob, setDob] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onAdd({
      id: Date.now().toString(),
      name,
      relation,
      dob,
      isDependent: true,
    })
    toast.success("Dependent added successfully")
    setOpen(false)
    setLoading(false)
    setName("")
    setRelation("")
    setDob("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Dependent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Dependent</DialogTitle>
            <DialogDescription>Add a family member for medical claims and benefits.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dep-name">Full Name</Label>
              <Input
                id="dep-name"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dep-relation">Relation</Label>
              <Select value={relation} onValueChange={setRelation} required>
                <SelectTrigger id="dep-relation">
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Son">Son</SelectItem>
                  <SelectItem value="Daughter">Daughter</SelectItem>
                  <SelectItem value="Father">Father</SelectItem>
                  <SelectItem value="Mother">Mother</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dep-dob">Date of Birth</Label>
              <Input id="dep-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Dependent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
