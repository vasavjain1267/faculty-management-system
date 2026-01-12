"use client"

import { useState } from "react"
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/ui/status-badge"
import { mockLeaveRequests } from "@/lib/mock-data"
import type { LeaveRequest } from "@/lib/types"
import { toast } from "sonner"

export default function LeavesApprovalPage() {
  const [leaves, setLeaves] = useState(mockLeaveRequests)

  const pendingLeaves = leaves.filter((l) => l.status === "pending")
  const processedLeaves = leaves.filter((l) => l.status !== "pending")

  const updateLeaveStatus = (id: string, status: "approved" | "rejected", remarks?: string) => {
    setLeaves(
      leaves.map((leave) =>
        leave.id === id
          ? {
              ...leave,
              status,
              remarks,
            }
          : leave,
      ),
    )
    toast.success(`Leave request ${status}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leave Approvals</h1>
        <p className="text-muted-foreground">Review and process faculty leave requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingLeaves.length}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{leaves.filter((l) => l.status === "approved").length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{leaves.filter((l) => l.status === "rejected").length}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Leaves */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
          <CardDescription>Requests awaiting your approval</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty Name</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>From Date</TableHead>
                <TableHead>To Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No pending leave requests
                  </TableCell>
                </TableRow>
              ) : (
                pendingLeaves.map((leave) => {
                  const days = Math.ceil(
                    (new Date(leave.toDate).getTime() - new Date(leave.fromDate).getTime()) / (1000 * 60 * 60 * 24) + 1,
                  )
                  return (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{leave.facultyName}</TableCell>
                      <TableCell className="capitalize">{leave.leaveType}</TableCell>
                      <TableCell>{new Date(leave.fromDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(leave.toDate).toLocaleDateString()}</TableCell>
                      <TableCell>{days}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{leave.reason}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-success/10 text-success border-success/20 hover:bg-success/20 hover:text-success"
                            onClick={() => updateLeaveStatus(leave.id, "approved")}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <RejectDialog
                            leave={leave}
                            onReject={(remarks) => updateLeaveStatus(leave.id, "rejected", remarks)}
                          />
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

      {/* Processed Leaves */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Processed</CardTitle>
          <CardDescription>Approved and rejected leave requests</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty Name</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>From Date</TableHead>
                <TableHead>To Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">{leave.facultyName}</TableCell>
                  <TableCell className="capitalize">{leave.leaveType}</TableCell>
                  <TableCell>{new Date(leave.fromDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(leave.toDate).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{leave.reason}</TableCell>
                  <TableCell>
                    <StatusBadge status={leave.status} />
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

function RejectDialog({ leave, onReject }: { leave: LeaveRequest; onReject: (remarks: string) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState("")

  const handleReject = async () => {
    if (!remarks.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onReject(remarks)
    setOpen(false)
    setLoading(false)
    setRemarks("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 hover:text-destructive"
        >
          <XCircle className="mr-1 h-3 w-3" />
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Leave Request</DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting {leave.facultyName}&apos;s leave request.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Leave Details</Label>
            <div className="rounded-lg border p-3 text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Type:</span>{" "}
                <span className="capitalize">{leave.leaveType}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Duration:</span> {new Date(leave.fromDate).toLocaleDateString()}{" "}
                - {new Date(leave.toDate).toLocaleDateString()}
              </p>
              <p>
                <span className="text-muted-foreground">Reason:</span> {leave.reason}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Rejection Reason *</Label>
            <Textarea
              id="remarks"
              placeholder="Enter reason for rejection..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
