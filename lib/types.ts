// User roles
export type UserRole = "applicant" | "faculty" | "admin"

// Job/Notification types
export interface JobNotification {
  id: string
  title: string
  department: string
  postType: "Assistant Professor" | "Associate Professor" | "Professor"
  deadline: string
  pdfUrl: string
  status: "active" | "closed"
  createdAt: string
}

// Applicant types
export interface Applicant {
  id: string
  email: string
  name: string
  applicationStatus: "draft" | "submitted" | "under-review" | "shortlisted" | "rejected"
}

export interface PersonalInfo {
  fullName: string
  fatherName: string
  dob: string
  gender: "male" | "female" | "other"
  category: "General" | "OBC" | "SC" | "ST" | "EWS"
  nationality: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface Education {
  id: string
  degree: string
  boardUniversity: string
  year: string
  percentage: string
  subject: string
}

export interface ResearchPaper {
  id: string
  title: string
  journalName: string
  issn: string
  impactFactor: string
  year: string
  authors: string
}

export interface Application {
  id: string
  jobId: string
  applicantId: string
  personalInfo: PersonalInfo
  education: Education[]
  research: ResearchPaper[]
  documents: {
    photo?: string
    signature?: string
    cv?: string
  }
  apiScore: number
  status: "draft" | "submitted" | "under-review" | "shortlisted" | "rejected"
  paymentStatus: "pending" | "completed"
  submittedAt?: string
}

// Faculty types
export interface Faculty {
  id: string
  employeeId: string
  name: string
  email: string
  department: string
  designation: string
  joiningDate: string
  leaveBalance: {
    casual: number
    medical: number
    earned: number
  }
}

export interface Dependent {
  id: string
  name: string
  relation: string
  dob: string
  isDependent: boolean
}

export interface LeaveRequest {
  id: string
  facultyId: string
  facultyName: string
  leaveType: "casual" | "medical" | "earned"
  fromDate: string
  toDate: string
  reason: string
  status: "pending" | "approved" | "rejected"
  remarks?: string
  appliedAt: string
}

export interface SalarySlip {
  month: string
  year: number
  earnings: {
    basic: number
    da: number
    hra: number
    other: number
  }
  deductions: {
    pf: number
    tax: number
    other: number
  }
  netPay: number
}

// Admin types
export interface Department {
  id: string
  name: string
  code: string
}

export interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  department: string
  designation: string
  joiningDate: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  address: string
  qualification: string
  specialization: string
  status: "active" | "on-leave" | "resigned"
  bankAccount: string
  panNumber: string
  leaveBalance: {
    casual: number
    medical: number
    earned: number
  }
}

export interface SalarySettings {
  daPercent: number
  hraPercent: number
  pfPercent: number
}

export interface Announcement {
  id: string
  title: string
  content: string
  targetAudience: "all" | "faculty" | "applicants"
  priority: "normal" | "important" | "urgent"
  publishedAt: string
  expiresAt?: string
  isActive: boolean
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  module: string
  details: string
  ipAddress: string
  timestamp: string
}

export interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  designation: string
  month: string
  year: number
  basic: number
  da: number
  hra: number
  otherAllowances: number
  pf: number
  tax: number
  otherDeductions: number
  grossPay: number
  netPay: number
  status: "pending" | "processed" | "paid"
  processedAt?: string
}

export interface Report {
  id: string
  name: string
  type: "recruitment" | "attendance" | "payroll" | "leave"
  generatedAt: string
  generatedBy: string
  fileUrl: string
}
