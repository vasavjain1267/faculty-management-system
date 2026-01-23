"use client"

import { useState, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
// import { mockJobs } from "@/lib/mock-data"
import { PersonalInfoStep } from "@/components/application/personal-info-step"
import { EducationStep } from "@/components/application/education-step"
import { ResearchStep } from "@/components/application/research-step"
import { UploadsStep } from "@/components/application/uploads-step"
import { PreviewStep } from "@/components/application/preview-step"
import type { PersonalInfo, Education, ResearchPaper } from "@/lib/types"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"

const steps = [
  { id: 1, title: "Personal Info", description: "Basic details" },
  { id: 2, title: "Education", description: "Academic qualifications" },
  { id: 3, title: "Research/API", description: "Publications & score" },
  { id: 4, title: "Uploads", description: "Documents" },
  { id: 5, title: "Preview & Pay", description: "Review & submit" },
]

export default function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  // const job = mockJobs.find((j) => j.id === resolvedParams.jobId)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const jobId = resolvedParams.jobId

  useEffect(() => {
    async function fetchJob() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single()
        
        if (error) throw error
        setJob(data)
      } catch (error) {
        console.error('Error fetching job:', error)
        toast.error("Failed to load job details")
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [jobId])

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    fatherName: "",
    dob: "",
    gender: "male",
    category: "General",
    nationality: "Indian",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  const [education, setEducation] = useState<Education[]>([
    { id: "1", degree: "10th", boardUniversity: "", year: "", percentage: "", subject: "" },
    { id: "2", degree: "12th", boardUniversity: "", year: "", percentage: "", subject: "" },
  ])

  const [research, setResearch] = useState<ResearchPaper[]>([])

  const [documents, setDocuments] = useState<{
    photo?: File
    signature?: File
    cv?: File
  }>({})

  // Calculate API Score
  const calculateApiScore = useCallback(() => {
    let score = 0
    research.forEach((paper) => {
      const impactFactor = Number.parseFloat(paper.impactFactor) || 0
      if (impactFactor >= 5) score += 20
      else if (impactFactor >= 3) score += 15
      else if (impactFactor >= 1) score += 10
      else score += 5
    })
    return Math.min(score, 100)
  }, [research])

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please login to apply")
        router.push(`/login?redirect=/apply/${jobId}`)
        return
      }

      // Helper for file upload
      const uploadFile = async (file: File, path: string) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${path}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('documents') // Ensure this bucket exists
          .upload(fileName, file, { upsert: true })

        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName)
          
        return publicUrl
      }

      // Upload files
      let resumeUrl = null
      let photoUrl = null
      let signatureUrl = null

      if (documents.cv) {
        resumeUrl = await uploadFile(documents.cv, `${user.id}/${jobId}/cv`)
      }
      if (documents.photo) {
        photoUrl = await uploadFile(documents.photo, `${user.id}/${jobId}/photo`)
      }
      if (documents.signature) {
        signatureUrl = await uploadFile(documents.signature, `${user.id}/${jobId}/signature`)
      }

      // Prepare payload
      const nameParts = personalInfo.fullName.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || firstName // Fallback

      const applicationData = {
        job_id: jobId,
        applicant_id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        date_of_birth: personalInfo.dob || null,
        gender: personalInfo.gender,
        address: personalInfo.address,
        city: personalInfo.city,
        state: personalInfo.state,
        pincode: personalInfo.pincode,
        education: education,
        publications: research,
        resume_url: resumeUrl,
        certificates_url: [photoUrl, signatureUrl].filter(Boolean) as string[],
        status: 'pending'
      }

      const { error } = await supabase
        .from('applications')
        .insert(applicationData)

      if (error) throw error

      toast.success("Application submitted successfully!")
      router.push("/applicant/dashboard")
    
    } catch (error: any) {
      console.error('Submission error:', error)
      toast.error(error.message || "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Job not found</p>
            <Button className="mt-4" onClick={() => router.push("/jobs")}>
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Job Header */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">{job.title}</CardTitle>
          <CardDescription>
            {job.department} • Deadline:{" "}
            {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    currentStep > step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <div className="mt-2 hidden text-center sm:block">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 w-8 sm:w-16 lg:w-24",
                    currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30",
                  )}
                />
              )}
            </div>
          ))}
        </div>
        {/* Mobile step label */}
        <div className="mt-4 text-center sm:hidden">
          <p className="font-medium">
            Step {currentStep}: {steps[currentStep - 1].title}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardContent className="pt-6">
          {currentStep === 1 && <PersonalInfoStep data={personalInfo} onChange={setPersonalInfo} />}
          {currentStep === 2 && <EducationStep data={education} onChange={setEducation} />}
          {currentStep === 3 && <ResearchStep data={research} onChange={setResearch} apiScore={calculateApiScore()} />}
          {currentStep === 4 && <UploadsStep data={documents} onChange={setDocuments} />}
          {currentStep === 5 && (
            <PreviewStep
              personalInfo={personalInfo}
              education={education}
              research={research}
              documents={documents}
              apiScore={calculateApiScore()}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1} className="bg-transparent">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep < 5 ? (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        )}
      </div>
    </div>
  )
}
