"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Pencil, Trash2, Megaphone, Loader2, AlertTriangle, Users, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { mockAnnouncements } from "@/lib/mock-data"
import type { Announcement } from "@/lib/types"
import { toast } from "sonner"

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements)

  const addAnnouncement = (announcement: Omit<Announcement, "id" | "publishedAt" | "isActive">) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString().split("T")[0],
      isActive: true,
    }
    setAnnouncements([newAnnouncement, ...announcements])
  }

  const toggleActive = (id: string) => {
    setAnnouncements(announcements.map((ann) => (ann.id === id ? { ...ann, isActive: !ann.isActive } : ann)))
    toast.success("Announcement status updated")
  }

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== id))
    toast.success("Announcement deleted")
  }

  const activeCount = announcements.filter((a) => a.isActive).length
  const urgentCount = announcements.filter((a) => a.priority === "urgent" && a.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Manage notices and announcements</p>
        </div>
        <CreateAnnouncementDialog onAdd={addAnnouncement} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Announcements</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
              <Megaphone className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
              <Eye className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold">{urgentCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
          <CardDescription>Manage and publish announcements for users</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{announcement.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{announcement.content}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      <Users className="mr-1 h-3 w-3" />
                      {announcement.targetAudience}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        announcement.priority === "urgent"
                          ? "destructive"
                          : announcement.priority === "important"
                            ? "default"
                            : "secondary"
                      }
                      className="capitalize"
                    >
                      {announcement.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(announcement.publishedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {announcement.expiresAt ? new Date(announcement.expiresAt).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <Switch checked={announcement.isActive} onCheckedChange={() => toggleActive(announcement.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteAnnouncement(announcement.id)}
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
    </div>
  )
}

function CreateAnnouncementDialog({
  onAdd,
}: {
  onAdd: (announcement: Omit<Announcement, "id" | "publishedAt" | "isActive">) => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [targetAudience, setTargetAudience] = useState<Announcement["targetAudience"]>("all")
  const [priority, setPriority] = useState<Announcement["priority"]>("normal")
  const [expiresAt, setExpiresAt] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onAdd({
      title,
      content,
      targetAudience,
      priority,
      expiresAt: expiresAt || undefined,
    })
    toast.success("Announcement published")
    setOpen(false)
    setLoading(false)
    setTitle("")
    setContent("")
    setTargetAudience("all")
    setPriority("normal")
    setExpiresAt("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>Publish a new announcement for users</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your announcement content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="target">Target Audience</Label>
                <Select
                  value={targetAudience}
                  onValueChange={(v) => setTargetAudience(v as Announcement["targetAudience"])}
                >
                  <SelectTrigger id="target">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="faculty">Faculty Only</SelectItem>
                    <SelectItem value="applicants">Applicants Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Announcement["priority"])}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires">Expiration Date (Optional)</Label>
              <Input id="expires" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
