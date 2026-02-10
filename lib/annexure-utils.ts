// Annexure system types and utilities

export type AnnexureStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'

export interface Annexure {
  id: string
  faculty_id: string
  annexure_type: string
  annexure_data: Record<string, any>
  status: AnnexureStatus
  admin_remarks?: string | null
  signed_pdf_url?: string | null
  approved_by?: string | null
  approved_at?: string | null
  created_at: string
  updated_at: string
}

export interface AnnexureWithProfile extends Annexure {
  profile: {
    full_name: string
    email: string
    employee_id: string
    department: string
    designation_at_joining: string
    doj: string
    present_designation: string
    present_tenure_doj: string
    contact_number: string
    current_address: string
    permanent_address: string
    passport_number: string
    pan_number: string
    aadhar_number: string
    gender: string
    nationality: string
    marital_status: string
  }
  dependents?: Array<{
    id: string
    relation: string
    name: string
    dob: string
  }>
}

// Map of which fields can be auto-filled from profiles table
export const PROFILE_AUTO_FILL_MAP: Record<string, keyof AnnexureWithProfile['profile']> = {
  facultyName: 'full_name',
  applicantName: 'full_name', // For self-applications
  employeeName: 'full_name',
  name: 'full_name',
  department: 'department',
  entryDesignation: 'designation_at_joining',
  designation: 'present_designation',
  currentDesignation: 'present_designation',
  dateOfJoining: 'doj',
  doj: 'doj',
  joiningDate: 'doj',
  currentDesignationDate: 'present_tenure_doj',
  passportNumber: 'passport_number',
  gender: 'gender',
  nationality: 'nationality',
  currentAddress: 'current_address',
  permanentAddress: 'permanent_address',
  residentialAddress: 'current_address',
  addressEnglish: 'current_address',
  presentOfficeAddress: 'current_address',
  contactNumber: 'contact_number',
  employeeId: 'employee_id',
}

// Fields that should be pre-filled but editable (in case profile is incomplete)
export const EDITABLE_PROFILE_FIELDS = [
  'addressHindi',
  'addressEnglish',
  'residentialAddress',
  'fatherName',
  'dateOfBirth',
  'relationship', // For dependent applications
]

// Determine which fields are annexure-specific (not in profiles/dependents)
export function getAnnexureSpecificFields(
  templateFields: Array<{ name: string; type?: string }>,
  profileData: AnnexureWithProfile['profile'],
  dependentsData?: AnnexureWithProfile['dependents']
): string[] {
  const autoFillableFields = Object.keys(PROFILE_AUTO_FILL_MAP)
  const dependentFields = ['dependentName', 'relationship', 'childName', 'dependentMembers']
  
  return templateFields
    .map(f => f.name)
    .filter(fieldName => {
      // Exclude auto-fillable profile fields
      if (autoFillableFields.includes(fieldName)) return false
      
      // Exclude dependent fields if dependents exist
      if (dependentFields.includes(fieldName) && dependentsData?.length) return false
      
      return true
    })
}

// Get auto-filled data from profile
export function getAutoFilledData(
  templateFields: Array<{ name: string; type?: string }>,
  profile: AnnexureWithProfile['profile'],
  dependents?: AnnexureWithProfile['dependents']
): Record<string, string> {
  const autoFilled: Record<string, string> = {}
  
  templateFields.forEach(field => {
    const profileKey = PROFILE_AUTO_FILL_MAP[field.name]
    
    if (profileKey && profile[profileKey]) {
      autoFilled[field.name] = String(profile[profileKey] || '')
    }
    
    // Handle dependent fields
    if (field.name === 'dependentName' && dependents?.[0]) {
      autoFilled[field.name] = dependents[0].name
    }
    if (field.name === 'relationship' && dependents?.[0]) {
      autoFilled[field.name] = dependents[0].relation
    }
    if (field.name === 'childName' && dependents?.[0]) {
      autoFilled[field.name] = dependents[0].name
    }
    if (field.name === 'dependentMembers' && dependents?.length) {
      autoFilled[field.name] = dependents
        .map(d => `${d.name} (${d.relation})`)
        .join(', ')
    }
  })
  
  return autoFilled
}

// Check if field should be read-only
export function isFieldReadOnly(fieldName: string): boolean {
  return (
    fieldName in PROFILE_AUTO_FILL_MAP &&
    !EDITABLE_PROFILE_FIELDS.includes(fieldName)
  )
}

// Merge profile + dependents + annexure_data for PDF rendering
export function getMergedPdfData(
  profile: AnnexureWithProfile['profile'],
  annexureData: Record<string, any>,
  templateFields: Array<{ name: string; type?: string }>,
  dependents?: AnnexureWithProfile['dependents']
): Record<string, string> {
  const autoFilled = getAutoFilledData(templateFields, profile, dependents)
  
  return {
    ...autoFilled,
    ...annexureData,
  }
}

// Status badge colors
export function getStatusColor(status: AnnexureStatus): string {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800'
    case 'SUBMITTED':
      return 'bg-blue-100 text-blue-800'
    case 'APPROVED':
      return 'bg-green-100 text-green-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get friendly annexure type name
export function getAnnexureTypeName(type: string): string {
  const names: Record<string, string> = {
    'address-proof': 'Address Proof Certificate',
    'annexure-a-passport': 'Annexure-A (Passport)',
    'annexure-g-noc-passport': 'Annexure-G NOC for Passport Renewal',
    'annexure-h-passport': "Annexure 'H' - Prior Intimation for Passport",
    'bonafide': 'Bonafide Certificate',
    'ltc-office-memorandum': 'LTC Office Memorandum',
    'noc-visa': 'NOC for VISA',
    'service-certificate-kv': 'Service Certificate (KV School)',
    'undertaking-noc-passport': 'Undertaking for NOC for Passport',
  }
  return names[type] || type
}
