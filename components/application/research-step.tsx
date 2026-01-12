"use client"

import { Plus, Trash2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ResearchPaper } from "@/lib/types"

interface ResearchStepProps {
  data: ResearchPaper[]
  onChange: (data: ResearchPaper[]) => void
  apiScore: number
}

export function ResearchStep({ data, onChange, apiScore }: ResearchStepProps) {
  const addPaper = () => {
    const newId = Date.now().toString()
    onChange([...data, { id: newId, title: "", journalName: "", issn: "", impactFactor: "", year: "", authors: "" }])
  }

  const removePaper = (id: string) => {
    onChange(data.filter((paper) => paper.id !== id))
  }

  const updatePaper = (id: string, field: keyof ResearchPaper, value: string) => {
    onChange(data.map((paper) => (paper.id === id ? { ...paper, [field]: value } : paper)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Research Publications & API Score</h3>
          <p className="text-sm text-muted-foreground">Add your research papers and publications</p>
        </div>
        <Card className="w-full sm:w-64">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              API Score
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Academic Performance Index is calculated based on impact factor: IF ≥ 5 (20 pts), IF ≥ 3 (15 pts),
                      IF ≥ 1 (10 pts), Other (5 pts). Max: 100
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{apiScore}/100</div>
            <Progress value={apiScore} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No research papers added yet</p>
            <Button className="mt-4" onClick={addPaper}>
              <Plus className="mr-2 h-4 w-4" />
              Add Research Paper
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((paper, index) => (
            <Card key={paper.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Paper {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePaper(paper.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Enter publication details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${paper.id}`}>Paper Title</Label>
                  <Input
                    id={`title-${paper.id}`}
                    placeholder="Enter paper title"
                    value={paper.title}
                    onChange={(e) => updatePaper(paper.id, "title", e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`journal-${paper.id}`}>Journal Name</Label>
                    <Input
                      id={`journal-${paper.id}`}
                      placeholder="Enter journal name"
                      value={paper.journalName}
                      onChange={(e) => updatePaper(paper.id, "journalName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`issn-${paper.id}`}>ISSN</Label>
                    <Input
                      id={`issn-${paper.id}`}
                      placeholder="Enter ISSN number"
                      value={paper.issn}
                      onChange={(e) => updatePaper(paper.id, "issn", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`impact-${paper.id}`}>Impact Factor</Label>
                    <Input
                      id={`impact-${paper.id}`}
                      type="number"
                      step="0.01"
                      placeholder="e.g., 4.5"
                      value={paper.impactFactor}
                      onChange={(e) => updatePaper(paper.id, "impactFactor", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`year-${paper.id}`}>Publication Year</Label>
                    <Input
                      id={`year-${paper.id}`}
                      placeholder="e.g., 2024"
                      value={paper.year}
                      onChange={(e) => updatePaper(paper.id, "year", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`authors-${paper.id}`}>Authors</Label>
                    <Input
                      id={`authors-${paper.id}`}
                      placeholder="Author names"
                      value={paper.authors}
                      onChange={(e) => updatePaper(paper.id, "authors", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={addPaper} className="w-full bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            Add Another Paper
          </Button>
        </div>
      )}

      {data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Note: Research papers are optional but highly recommended for faculty positions.
        </p>
      )}
    </div>
  )
}
