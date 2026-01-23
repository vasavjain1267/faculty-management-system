import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType =
  | "approved"
  | "pending"
  | "rejected"
  | "active"
  | "closed"
  | "submitted"
  | "draft"
  | "under-review"
  | "shortlisted"
  | "completed"
  | "pending_recommendation"
  | "recommended"
  | "returned"
  | "joined"
  | "accepted"
  | "cancelled"

interface StatusBadgeProps {
  status: StatusType | string // Allow string to support partial matches/unknown statuses gracefully
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  accepted: { label: "Accepted", className: "bg-success/10 text-success border-success/20" },
  shortlisted: { label: "Shortlisted", className: "bg-success/10 text-success border-success/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
  joined: { label: "Joined", className: "bg-success/10 text-success border-success/20" },
  recommended: { label: "Recommended", className: "bg-info/10 text-info border-info/20" },
  submitted: { label: "Submitted", className: "bg-info/10 text-info border-info/20" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  "pending_recommendation": { label: "Pending Rec.", className: "bg-warning/10 text-warning border-warning/20" },
  "under-review": { label: "Under Review", className: "bg-warning/10 text-warning border-warning/20" },
  returned: { label: "Returned", className: "bg-warning/10 text-warning border-warning/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground border-muted" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-muted" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-muted" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" } 

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
