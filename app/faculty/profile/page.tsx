"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Spinner } from "@/components/ui/spinner"
import { mockEducation } from "@/lib/mock-data"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const supabase = createClient()
  const [faculty, setFaculty] = useState<any>(null)
  const [dependents, setDependents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Load profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        // Load dependents
        const { data: deps } = await supabase
          .from('dependents')
          .select('*')
          .eq('profile_id', profile?.id || user.id)

        setFaculty(profile)
        setDependents(deps || [])
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!faculty) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Please complete your profile first.</p>
      </div>
    )
  }

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
                  <p className="font-medium">{faculty.employee_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{faculty.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{faculty.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium">{faculty.department}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Present Designation</Label>
                  <p className="font-medium">{faculty.present_designation || faculty.designation_at_joining}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date of Joining</Label>
                  <p className="font-medium">
                    {faculty.doj ? new Date(faculty.doj).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Gender</Label>
                  <p className="font-medium">{faculty.gender || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nationality</Label>
                  <p className="font-medium">{faculty.nationality || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact Number</Label>
                  <p className="font-medium">{faculty.contact_number || 'N/A'}</p>
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
                  {dependents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No dependents added yet. Click "Add Dependent" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dependents.map((dep) => (
                      <TableRow key={dep.id}>
                        <TableCell className="font-medium">{dep.name}</TableCell>
                        <TableCell>{dep.relation}</TableCell>
                        <TableCell>
                          {dep.dob ? new Date(dep.dob).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }) : 'N/A'}
                        </TableCell>
                        <TableCell>Yes</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={async () => {
                                try {
                                  const { error } = await supabase
                                    .from('dependents')
                                    .delete()
                                    .eq('id', dep.id)
                                  
                                  if (error) throw error
                                  
                                  setDependents(dependents.filter((d) => d.id !== dep.id))
                                  toast.success("Dependent removed")
                                } catch (error) {
                                  console.error('Error deleting dependent:', error)
                                  toast.error("Failed to remove dependent")
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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

function AddDependentDialog({ onAdd }: { onAdd: (dep: any) => void }) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")
  const [dob, setDob] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user and profile
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in to add dependents")
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        toast.error("Profile not found")
        return
      }

      // Insert the dependent
      const { data: newDependent, error } = await supabase
        .from('dependents')
        .insert({
          profile_id: profile.id,
          name,
          relation,
          dob,
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding dependent:', error)
        toast.error("Failed to add dependent")
        return
      }

      // Call the callback to update the parent state
      onAdd(newDependent)
      toast.success("Dependent added successfully")
      setOpen(false)
      setName("")
      setRelation("")
      setDob("")
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error("An error occurred while adding the dependent")
    } finally {
      setLoading(false)
    }
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
