"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { PersonalInfo } from "@/lib/types"

interface PersonalInfoStepProps {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

export function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <p className="text-sm text-muted-foreground">Enter your basic details as per official documents</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="Enter full name"
            value={data.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherName">
            Father&apos;s Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fatherName"
            placeholder="Enter father's name"
            value={data.fatherName}
            onChange={(e) => updateField("fatherName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">
            Date of Birth <span className="text-destructive">*</span>
          </Label>
          <Input id="dob" type="date" value={data.dob} onChange={(e) => updateField("dob", e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">
            Gender <span className="text-destructive">*</span>
          </Label>
          <Select value={data.gender} onValueChange={(value) => updateField("gender", value)}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.category}
            onValueChange={(value) => updateField("category", value as PersonalInfo["category"])}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="OBC">OBC</SelectItem>
              <SelectItem value="SC">SC</SelectItem>
              <SelectItem value="ST">ST</SelectItem>
              <SelectItem value="EWS">EWS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">
            Nationality <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nationality"
            placeholder="Enter nationality"
            value={data.nationality}
            onChange={(e) => updateField("nationality", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            value={data.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={data.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          Address <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="address"
          placeholder="Enter your complete address"
          value={data.address}
          onChange={(e) => updateField("address", e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            placeholder="Enter city"
            value={data.city}
            onChange={(e) => updateField("city", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">
            State <span className="text-destructive">*</span>
          </Label>
          <Input
            id="state"
            placeholder="Enter state"
            value={data.state}
            onChange={(e) => updateField("state", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode">
            Pincode <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pincode"
            placeholder="Enter pincode"
            value={data.pincode}
            onChange={(e) => updateField("pincode", e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  )
}
