"use client"

import { useState } from "react"
import { History, Search, Filter, ChevronLeft, ChevronRight, User, Clock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { mockAuditLogs } from "@/lib/mock-data"

const actionColors: Record<string, string> = {
  CREATE: "bg-success/10 text-success border-success/20",
  UPDATE: "bg-info/10 text-info border-info/20",
  DELETE: "bg-destructive/10 text-destructive border-destructive/20",
  VIEW: "bg-muted text-muted-foreground",
}

const modules = ["All", "Recruitment", "Leave Approval", "Employee", "Settings", "Payroll", "Scrutiny"]

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModule, setSelectedModule] = useState("All")
  const [selectedAction, setSelectedAction] = useState("all")

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesModule = selectedModule === "All" || log.module === selectedModule
    const matchesAction = selectedAction === "all" || log.action === selectedAction
    return matchesSearch && matchesModule && matchesAction
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Track system activity and user actions</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Actions</p>
                <p className="text-2xl font-bold">{mockAuditLogs.length}</p>
              </div>
              <History className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Creates</p>
                <p className="text-2xl font-bold text-success">
                  {mockAuditLogs.filter((l) => l.action === "CREATE").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Updates</p>
                <p className="text-2xl font-bold text-info">
                  {mockAuditLogs.filter((l) => l.action === "UPDATE").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deletes</p>
                <p className="text-2xl font-bold text-destructive">
                  {mockAuditLogs.filter((l) => l.action === "DELETE").length}
                </p>
              </div>
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
                placeholder="Search by user, action, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Showing {filteredLogs.length} log entries</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead className="min-w-[300px]">Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No log entries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{log.userName}</p>
                          <p className="text-xs text-muted-foreground">{log.userId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={actionColors[log.action]}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.module}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{log.details}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />
                        {log.ipAddress}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Showing 1-{filteredLogs.length} of {filteredLogs.length} entries
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled className="bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
