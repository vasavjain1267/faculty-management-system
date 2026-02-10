"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Eye, Edit, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getStatusColor, getAnnexureTypeName } from "@/lib/annexure-utils"
import { useToast } from "@/hooks/use-toast"

export default function AdminAnnexuresPage() {
  const [loading, setLoading] = useState(true)
  const [receivedAnnexures, setReceivedAnnexures] = useState<any[]>([])
  const [verifiedAnnexures, setVerifiedAnnexures] = useState<any[]>([])
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectAnnexureId, setRejectAnnexureId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [rejecting, setRejecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadAnnexures()
  }, [])

  async function loadAnnexures() {
    try {
      setLoading(true)
      
      // Fetch all annexures as admin
      const response = await fetch('/api/admin/annexures')
      if (!response.ok) throw new Error('Failed to load annexures')
      
      const { annexures } = await response.json()
      
      // Separate by status
      setReceivedAnnexures(annexures.filter((a: any) => 
        a.status === 'SUBMITTED'
      ))
      setVerifiedAnnexures(annexures.filter((a: any) => 
        a.status === 'APPROVED'
      ))
    } catch (error: any) {
      console.error('Error loading annexures:', error)
      toast({
        title: 'Error',
        description: 'Failed to load annexures',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function quickApprove(id: string) {
    if (!confirm('Are you sure you want to approve this annexure?')) return

    try {
      const response = await fetch(`/api/annexures/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'APPROVED',
        }),
      })

      if (!response.ok) throw new Error('Failed to approve')

      toast({
        title: 'Success',
        description: 'Annexure approved successfully',
      })

      loadAnnexures()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve',
        variant: 'destructive',
      })
    }
  }

  async function quickReject(id: string) {
    setRejectAnnexureId(id)
    setRejectReason("")
    setRejectDialogOpen(true)
  }

  async function confirmReject() {
    if (!rejectReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      })
      return
    }

    if (!rejectAnnexureId) return

    setRejecting(true)
    try {
      const response = await fetch(`/api/annexures/${rejectAnnexureId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          admin_remarks: rejectReason,
        }),
      })

      if (!response.ok) throw new Error('Failed to reject')

      toast({
        title: 'Success',
        description: 'Annexure rejected',
      })

      setRejectDialogOpen(false)
      setRejectAnnexureId(null)
      setRejectReason("")
      loadAnnexures()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject',
        variant: 'destructive',
      })
    } finally {
      setRejecting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Annexure Management</h1>
        <p className="text-muted-foreground mt-2">
          Review, edit, and approve faculty annexure submissions.
        </p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList>
          <TabsTrigger value="received">
            Received ({receivedAnnexures.length})
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified ({verifiedAnnexures.length})
          </TabsTrigger>
        </TabsList>

        {/* RECEIVED (SUBMITTED) */}
        <TabsContent value="received">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : receivedAnnexures.length === 0 ? (
            <Alert>
              <AlertDescription>
                No pending annexures requiring review.
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Pending Annexures</CardTitle>
                <CardDescription>
                  Review and approve submitted annexures. You can edit annexure-specific data before approving.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Annexure Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivedAnnexures.map((annexure) => (
                      <TableRow key={annexure.id}>
                        <TableCell className="font-medium">
                          {annexure.profile?.full_name || 'N/A'}
                          <div className="text-xs text-muted-foreground">
                            {annexure.profile?.employee_id}
                          </div>
                        </TableCell>
                        <TableCell>
                          {annexure.profile?.department || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {getAnnexureTypeName(annexure.annexure_type)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(annexure.status)}>
                            {annexure.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(annexure.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => quickReject(annexure.id)}
                              className="text-destructive"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => quickApprove(annexure.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Link href={`/admin/annexures/${annexure.id}`}>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* VERIFIED (APPROVED) */}
        <TabsContent value="verified">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : verifiedAnnexures.length === 0 ? (
            <Alert>
              <AlertDescription>
                No approved annexures found.
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Approved Annexures</CardTitle>
                <CardDescription>
                  View-only access to approved and signed annexures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Annexure Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifiedAnnexures.map((annexure) => (
                      <TableRow key={annexure.id}>
                        <TableCell className="font-medium">
                          {annexure.profile?.full_name || 'N/A'}
                          <div className="text-xs text-muted-foreground">
                            {annexure.profile?.employee_id}
                          </div>
                        </TableCell>
                        <TableCell>
                          {annexure.profile?.department || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {getAnnexureTypeName(annexure.annexure_type)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(annexure.status)}>
                            {annexure.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {annexure.approved_at 
                            ? new Date(annexure.approved_at).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {annexure.approver?.full_name || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/annexures/${annexure.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Annexure</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this annexure. The faculty member will be able to see this reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={rejecting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmReject}
              disabled={rejecting}
            >
              {rejecting ? 'Rejecting...' : 'Reject Annexure'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
