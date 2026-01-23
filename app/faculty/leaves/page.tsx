"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CalendarDays, Loader2, Plus, FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

// New Leave Types
const LEAVE_TYPES = [
  { id: "CL", label: "Casual Leave (CL)" },
  { id: "SL", label: "Sick Leave (SL)" },
  { id: "EL", label: "Earned Leave (EL/PL)" },
  { id: "Half-day", label: "Half-day Leave" },
  { id: "RH", label: "Restricted Holiday (RH)" },
  { id: "Duty Leave", label: "Duty Leave" },
  { id: "Study Leave", label: "Study Leave" },
  { id: "Sabbatical", label: "Sabbatical" },
  { id: "Special CL", label: "Special CL" },
  { id: "Maternity", label: "Maternity Leave" },
  { id: "Paternity", label: "Paternity Leave" },
  { id: "Child Care Leave", label: "Child Care Leave" },
  { id: "Comp-Off", label: "Compensatory Off" },
  { id: "LWP", label: "Leave Without Pay (LWP/EOL)" },
  { id: "Tour", label: "Tour / On Duty" }
]

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [incomingLeaves, setIncomingLeaves] = useState<any[]>([])
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      // 1. Fetch My Leaves
      const { data: leavesData } = await supabase
        .from('leaves')
        .select(`
          *,
          recommender:recommender_id(full_name),
          approver:approver_id(full_name)
        `)
        .eq('employee_id', user.id)
        .order('created_at', { ascending: false })

      setLeaves(leavesData || [])

      // 2. Fetch Incoming Requests (where I am recommender OR approver)
      const { data: incomingData } = await supabase
        .from('leaves')
        .select(`
          *,
          employee:employee_id(full_name, department, employee_id)
        `)
        .or(`recommender_id.eq.${user.id},approver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      setIncomingLeaves(incomingData || [])

      // Fetch Balances
      const { data: balanceData } = await supabase
        .from('leave_balances')
        .select('balances')
        .eq('employee_id', user.id)
        .eq('year', new Date().getFullYear())
        .single()

      if (balanceData) {
        setBalances(balanceData.balances)
      } else {
        // Default balances if not found
        setBalances({
          "CL": 12, "SL": 10, "EL": 30, "RH": 2
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leaves')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      toast.success(`Leave request updated to ${newStatus}`)
      
      // Simulate Email Trigger
      if (newStatus === 'recommended') {
        console.log(`Email sent to Approver for Leave ${id}`)
      } else if (newStatus === 'approved') {
        console.log(`Email sent to Applicant: Leave ${id} Approved`)
      }

      fetchData()
    } catch (error) {
      console.error(error)
      toast.error("Failed to update status")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">Apply for leave, track status, and manage approvals</p>
        </div>
        <ApplyLeaveDialog user={user} onSuccess={fetchData} balances={balances} />
      </div>

      <Tabs defaultValue="my-leaves" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-leaves">My Applications</TabsTrigger>
          <TabsTrigger value="approvals">
            Incoming Requests
            {incomingLeaves.some(l => 
              (l.recommender_id === user?.id && l.status === 'pending_recommendation') ||
              (l.approver_id === user?.id && l.status === 'recommended')
            ) && (
              <span className="ml-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-leaves" className="space-y-4">
          {/* Leave Balance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Balances ({new Date().getFullYear()})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                {Object.entries(balances).map(([type, count]) => (
                  <div key={type} className="flex flex-col p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <span className="text-xs text-muted-foreground uppercase">{type}</span>
                    <span className="text-2xl font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leave History */}
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Your past and pending leave applications</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No leave requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">
                          {leave.leave_type}
                          {leave.session !== 'full' && <span className="text-xs text-muted-foreground block">({leave.session})</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span>{new Date(leave.start_date).toLocaleDateString()}</span>
                            <span className="text-muted-foreground">to</span>
                            <span>{new Date(leave.end_date).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>{leave.total_days}</TableCell>
                        <TableCell>
                          <StatusBadge status={leave.status} />
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <p>Rec: {leave.recommender?.full_name || 'N/A'}</p>
                            <p>App: {leave.approver?.full_name || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {leave.status === 'approved' && !leave.joining_report_status && (
                            <JoiningReportDialog leave={leave} onSuccess={fetchData} />
                          )}
                          {leave.joining_report_status === 'submitted' && (
                            <span className="text-xs text-info">Joining Submitted</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Leaves assigned to you for Recommendation or Approval</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Your Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomingLeaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No incoming requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    incomingLeaves.map((leave) => {
                      const isRecommender = leave.recommender_id === user?.id
                      const isApprover = leave.approver_id === user?.id
                      
                      const canRecommend = isRecommender && leave.status === 'pending_recommendation'
                      const canApprove = isApprover && (leave.status === 'recommended' || (!leave.recommender_id && leave.status === 'pending_recommendation'))

                      return (
                        <TableRow key={leave.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{leave.employee?.full_name}</p>
                              <p className="text-xs text-muted-foreground">{leave.employee?.department}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{leave.leave_type}</TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              <span>{new Date(leave.start_date).toLocaleDateString()}</span>
                              <span className="text-xs text-muted-foreground">({leave.total_days} days)</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={leave.reason}>
                             {leave.reason}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={leave.status} />
                          </TableCell>
                          <TableCell>
                             {isRecommender && <span className="text-xs border px-2 py-1 rounded bg-blue-50 text-blue-700">Recommender</span>}
                             {isApprover && <span className="text-xs border px-2 py-1 rounded bg-purple-50 text-purple-700 ml-1">Approver</span>}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {canRecommend && (
                                <>
                                  <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(leave.id, 'recommended')}>Recommend</Button>
                                  <Button size="sm" variant="destructive" className="h-8" onClick={() => handleUpdateStatus(leave.id, 'rejected')}>Reject</Button>
                                </>
                              )}
                              {canApprove && (
                                <>
                                  <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(leave.id, 'approved')}>Approve</Button>
                                  <Button size="sm" variant="outline" className="h-8 text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => handleUpdateStatus(leave.id, 'returned')}>Return</Button>
                                  <Button size="sm" variant="destructive" className="h-8" onClick={() => handleUpdateStatus(leave.id, 'rejected')}>Reject</Button>
                                </>
                              )}
                              {!canRecommend && !canApprove && (
                                <span className="text-xs text-muted-foreground">No action required</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApplyLeaveDialog({ user, onSuccess, balances }: { user: any, onSuccess: () => void, balances: Record<string, number> }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  
  // Form State
  const [leaveType, setLeaveType] = useState<string>("CL")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [session, setSession] = useState("full")
  const [reason, setReason] = useState("")
  const [remarks, setRemarks] = useState("")
  
  // Selection State
  const [faculties, setFaculties] = useState<any[]>([])
  const [recommenderId, setRecommenderId] = useState("")
  const [approverId, setApproverId] = useState("")
  const [substituteId, setSubstituteId] = useState("")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (open) {
      fetchFaculties()
    }
  }, [open])

  async function fetchFaculties() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, department')
      .in('role', ['faculty', 'admin'])
      .neq('id', user?.id) // Exclude self
    
    setFaculties(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let attachmentUrl = null
      if (file) {
        const fileName = `${user.id}/${Date.now()}_${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('leave-documents')
          .upload(fileName, file)
        
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('leave-documents')
          .getPublicUrl(fileName)
        attachmentUrl = publicUrl
      }

      // Calculate days (simplified)
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 
      if (session !== 'full') diffDays = 0.5 

      // Check balance
      if (balances[leaveType] !== undefined && balances[leaveType] < diffDays) {
        toast.error(`Insufficient ${leaveType} balance! Available: ${balances[leaveType]}`)
        setLoading(false)
        return
      }

      const leaveData = {
        employee_id: user.id,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        session,
        reason,
        remarks,
        total_days: diffDays,
        recommender_id: recommenderId || null,
        approver_id: approverId || null,
        substitute_faculty_id: substituteId || null,
        status: 'pending_recommendation',
        attachment_url: attachmentUrl
      }

      const { error } = await supabase.from('leaves').insert(leaveData)
      if (error) throw error

      toast.success("Leave application submitted")
      
      // Simulate Emails
      if (leaveData.recommender_id) {
        console.log(`Email sent to Recommender: ${leaveData.recommender_id}`)
      }
      
      onSuccess()
      setOpen(false)
      resetForm()
    } catch (error: any) {
      toast.error(error.message || "Failed to submit leave")
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setReason("")
    setRemarks("")
    setFile(null)
    setStartDate("")
    setEndDate("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Apply for Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Leave Application</DialogTitle>
            <DialogDescription>Fill in the details to submit your leave request.</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Leave Type & Session */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_TYPES.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.label} {balances[t.id] !== undefined ? `(${balances[t.id]})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Session</Label>
                <Select value={session} onValueChange={setSession}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Day</SelectItem>
                    <SelectItem value="half_morning">Half Day (Morning)</SelectItem>
                    <SelectItem value="half_afternoon">Half Day (Afternoon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
              </div>
            </div>

            {/* People Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Substitute Faculty</Label>
                <Select value={substituteId} onValueChange={setSubstituteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Recommender</Label>
                <Select value={recommenderId} onValueChange={setRecommenderId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Approver</Label>
                <Select value={approverId} onValueChange={setApproverId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reason & Docs */}
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea 
                value={reason} 
                onChange={e => setReason(e.target.value)} 
                placeholder="Enter detailed reason..." 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Supporting Document (Optional)</Label>
              <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function JoiningReportDialog({ leave, onSuccess }: { leave: any, onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [joiningDate, setJoiningDate] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let reportUrl = null
      if (file) {
        const fileName = `joining/${leave.id}_${file.name}`
        // Upload logic here similar to above
         const { error: uploadError } = await supabase.storage
          .from('leave-documents')
          .upload(fileName, file)
        
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('leave-documents')
          .getPublicUrl(fileName)
        reportUrl = publicUrl
      }

      const { error } = await supabase
        .from('leaves')
        .update({
          joining_date: joiningDate,
          joining_report_status: 'submitted',
          joining_report_url: reportUrl,
          status: 'joined' // Or keep 'approved' and just rely on joining_report_status
        })
        .eq('id', leave.id)

      if (error) throw error
      
      toast.success("Joining report submitted")
      onSuccess()
      setOpen(false)
    } catch (error) {
      toast.error("Failed to submit joining report")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Submit Joining</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Joining Report</DialogTitle>
            <DialogDescription>Submit your joining report after leave.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Joining Date</Label>
              <Input type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Joining Report Document</Label>
              <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} required />
            </div>
          </div>
          <DialogFooter>
             <Button type="submit" disabled={loading}>Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
