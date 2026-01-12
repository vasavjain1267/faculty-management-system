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

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground border-muted" },
  submitted: { label: "Submitted", className: "bg-info/10 text-info border-info/20" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-muted" },
  "under-review": { label: "Under Review", className: "bg-warning/10 text-warning border-warning/20" },
  shortlisted: { label: "Shortlisted", className: "bg-success/10 text-success border-success/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
