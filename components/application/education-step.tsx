"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Education } from "@/lib/types"

interface EducationStepProps {
  data: Education[]
  onChange: (data: Education[]) => void
}

const degreeOptions = ["10th", "12th", "Diploma", "UG (Bachelor's)", "PG (Master's)", "M.Phil", "Ph.D", "Post-Doc"]

export function EducationStep({ data, onChange }: EducationStepProps) {
  const addRow = () => {
    const newId = (data.length + 1).toString()
    onChange([...data, { id: newId, degree: "", boardUniversity: "", year: "", percentage: "", subject: "" }])
  }

  const removeRow = (id: string) => {
    if (data.length > 2) {
      onChange(data.filter((row) => row.id !== id))
    }
  }

  const updateRow = (id: string, field: keyof Education, value: string) => {
    onChange(data.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Educational Qualifications</h3>
          <p className="text-sm text-muted-foreground">Add your academic qualifications from 10th onwards</p>
        </div>
        <Button onClick={addRow} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Degree</TableHead>
              <TableHead>Board/University</TableHead>
              <TableHead className="w-[100px]">Year</TableHead>
              <TableHead className="w-[100px]">% / CGPA</TableHead>
              <TableHead>Subject/Stream</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Select value={row.degree} onValueChange={(value) => updateRow(row.id, "degree", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {degreeOptions.map((degree) => (
                        <SelectItem key={degree} value={degree}>
                          {degree}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Enter board/university"
                    value={row.boardUniversity}
                    onChange={(e) => updateRow(row.id, "boardUniversity", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Year"
                    value={row.year}
                    onChange={(e) => updateRow(row.id, "year", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="%/CGPA"
                    value={row.percentage}
                    onChange={(e) => updateRow(row.id, "percentage", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Subject"
                    value={row.subject}
                    onChange={(e) => updateRow(row.id, "subject", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(row.id)}
                    disabled={data.length <= 2}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {data.map((row, index) => (
          <div key={row.id} className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Qualification {index + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRow(row.id)}
                disabled={data.length <= 2}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Degree</Label>
                <Select value={row.degree} onValueChange={(value) => updateRow(row.id, "degree", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {degreeOptions.map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Board/University</Label>
                <Input
                  placeholder="Enter board/university"
                  value={row.boardUniversity}
                  onChange={(e) => updateRow(row.id, "boardUniversity", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Year</Label>
                  <Input
                    placeholder="Year"
                    value={row.year}
                    onChange={(e) => updateRow(row.id, "year", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">% / CGPA</Label>
                  <Input
                    placeholder="%/CGPA"
                    value={row.percentage}
                    onChange={(e) => updateRow(row.id, "percentage", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Subject/Stream</Label>
                <Input
                  placeholder="Subject"
                  value={row.subject}
                  onChange={(e) => updateRow(row.id, "subject", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
