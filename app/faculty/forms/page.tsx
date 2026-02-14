"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Eye, Download, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { createClient } from "@/lib/supabase/client"

export default function FacultyFormsPage() {
  const [loading, setLoading] = useState(true)
  const [draftAnnexures, setDraftAnnexures] = useState<any[]>([])
  const [submittedAnnexures, setSubmittedAnnexures] = useState<any[]>([])
  const [verifiedAnnexures, setVerifiedAnnexures] = useState<any[]>([])
  const [rejectedAnnexures, setRejectedAnnexures] = useState<any[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadAnnexures()
  }, [])

  async function loadAnnexures() {
    try {
      setLoading(true)
      
      // Fetch all annexures
      const response = await fetch('/api/annexures')
      if (!response.ok) throw new Error('Failed to load annexures')
      
      const { annexures } = await response.json()
      
      // Separate by status
      setDraftAnnexures(annexures.filter((a: any) => a.status === 'DRAFT'))
      setSubmittedAnnexures(annexures.filter((a: any) => a.status === 'SUBMITTED'))
      setVerifiedAnnexures(annexures.filter((a: any) => a.status === 'APPROVED'))
      setRejectedAnnexures(annexures.filter((a: any) => a.status === 'REJECTED'))
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

  async function deleteAnnexure(id: string) {
    if (!confirm('Are you sure you want to delete this draft?')) return

    try {
      const response = await fetch(`/api/annexures/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast({
        title: 'Success',
        description: 'Draft deleted successfully',
      })

      loadAnnexures()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete',
        variant: 'destructive',
      })
    }
  }

  const templates = [
    {
      title: "Bonafide Application",
      description: "Fill the bonafide application form and export as PDF.",
      href: "/faculty/forms/bonafide",
    },
    {
      title: "Undertaking for NOC for Passport",
      description: "Fill undertaking details and export as PDF.",
      href: "/faculty/forms/undertaking-noc-passport",
    },
    {
      title: "LTC Office Memorandum",
      description: "Fill LTC details and export the office memorandum as PDF.",
      href: "/faculty/forms/ltc-office-memorandum",
    },
    {
      title: "Address Proof Certificate",
      description: "Generate bilingual (Hindi & English) address proof certificate.",
      href: "/faculty/forms/address-proof",
    },
    {
      title: "Service Certificate (KV School)",
      description: "Generate bilingual Hindi & English service certificate for KV admission.",
      href: "/faculty/forms/service-certificate-kv",
    },
    {
      title: "Annexure-A (Passport)",
      description: "Generate Identity Certificate (Annexure-A) for Passport application.",
      href: "/faculty/forms/annexure-a-passport",
    },
    {
      title: "Annexure-G NOC for Passport Renewal",
      description: "Generate No Objection Certificate for passport renewal.",
      href: "/faculty/forms/annexure-g-noc-passport",
    },
    {
      title: "NOC for VISA",
      description: "Generate No Objection Certificate for international travel and visa applications.",
      href: "/faculty/forms/noc-visa",
    },
    {
      title: "Annexure 'H' - Prior Intimation for Passport",
      description: "Generate prior intimation letter for passport application submission to administrative office.",
      href: "/faculty/forms/annexure-h-passport",
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Forms & Annexures</h1>
        <p className="text-muted-foreground mt-2">
          Create new forms or manage your submitted annexures.
        </p>
      </div>

      <Tabs defaultValue="new" className="w-full">
        <TabsList>
          <TabsTrigger value="new">Create New</TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts ({draftAnnexures.length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted ({submittedAnnexures.length})
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified ({verifiedAnnexures.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedAnnexures.length})
          </TabsTrigger>
        </TabsList>

        {/* NEW FORMS */}
        <TabsContent value="new">
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <Link key={t.title} href={t.href}>
                <Card className="hover:shadow-md transition cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{t.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* DRAFTS */}
        <TabsContent value="drafts">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : draftAnnexures.length === 0 ? (
            <Alert>
              <AlertDescription>
                No draft annexures found.
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Draft Annexures</CardTitle>
                <CardDescription>
                  Draft annexures can be edited or deleted before submission.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftAnnexures.map((annexure) => (
                      <TableRow key={annexure.id}>
                        <TableCell className="font-medium">
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
                              onClick={() => deleteAnnexure(annexure.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Link href={`/faculty/forms/annexures/${annexure.id}/edit`}>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Link href={`/faculty/forms/annexures/${annexure.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
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

        {/* SUBMITTED */}
        <TabsContent value="submitted">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : submittedAnnexures.length === 0 ? (
            <Alert>
              <AlertDescription>
                No submitted annexures found.
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Submitted Annexures</CardTitle>
                <CardDescription>
                  These annexures are awaiting admin approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submittedAnnexures.map((annexure) => (
                      <TableRow key={annexure.id}>
                        <TableCell className="font-medium">
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
                            <Link href={`/faculty/forms/annexures/${annexure.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
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
                <CardTitle>Verified Annexures</CardTitle>
                <CardDescription>
                  These annexures have been approved and signed by admin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
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
                          <div className="flex justify-end gap-2">
                            <Link href={`/faculty/forms/annexures/${annexure.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            {annexure.signed_pdf_url && (
                              <Button size="sm" variant="default" asChild>
                                <a href={annexure.signed_pdf_url} download>
                                  <Download className="h-4 w-4 mr-1" />
                                  Download PDF
                                </a>
                              </Button>
                            )}
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

        {/* REJECTED */}
        <TabsContent value="rejected">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : rejectedAnnexures.length === 0 ? (
            <Alert>
              <AlertDescription>
                No rejected annexures found.
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Rejected Annexures</CardTitle>
                <CardDescription>
                  These annexures were rejected by admin. View rejection reason and resubmit if needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rejected On</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedAnnexures.map((annexure) => (
                      <TableRow key={annexure.id}>
                        <TableCell className="font-medium">
                          {getAnnexureTypeName(annexure.annexure_type)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(annexure.status)}>
                            {annexure.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {annexure.updated_at 
                            ? new Date(annexure.updated_at).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {annexure.admin_remarks || 'No reason provided'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/faculty/forms/annexures/${annexure.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
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
      </Tabs>
    </div>
  )
}