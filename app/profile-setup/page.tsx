"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Zap, Plus, X, User, BookOpen, Target } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    university: "",
    major: "",
    skillsOffered: [] as string[],
    skillsNeeded: [] as string[],
  })
  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillNeeded, setNewSkillNeeded] = useState("")
  const router = useRouter()

  const totalSteps = 3

  const supabase = (() => {
    // safe singleton per render
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    return createBrowserClient(url, key)
  })()

  useEffect(() => {
    setIsVisible(true)
    ;(async () => {
      try {
        const res = await fetch("/api/profile", { method: "GET", credentials: "include" })
        if (!res.ok) return
        const { profile } = await res.json()
        if (!profile) return
        const md = (profile.metadata || {}) as Record<string, any>
        setFormData((prev) => ({
          ...prev,
          displayName: profile.full_name || "",
          bio: profile.bio || "",
          university: md.university || "",
          major: md.major || "",
          skillsOffered: Array.isArray(md.skillsOffered) ? md.skillsOffered : [],
          skillsNeeded: Array.isArray(md.skillsNeeded) ? md.skillsNeeded : [],
        }))
      } catch {
        // silent fail, keep defaults
      }
    })()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()],
      }))
      setNewSkillOffered("")
    }
  }

  const removeSkillOffered = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((s) => s !== skill),
    }))
  }

  const addSkillNeeded = () => {
    if (newSkillNeeded.trim() && !formData.skillsNeeded.includes(newSkillNeeded.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsNeeded: [...prev.skillsNeeded, newSkillNeeded.trim()],
      }))
      setNewSkillNeeded("")
    }
  }

  const removeSkillNeeded = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsNeeded: prev.skillsNeeded.filter((s) => s !== skill),
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const payload = {
        full_name: formData.displayName.trim() || null,
        bio: formData.bio.trim() || null,
        // store a combined skills list and detailed breakdown in metadata
        skills: Array.from(new Set([...(formData.skillsOffered || []), ...(formData.skillsNeeded || [])])),
        metadata: {
          university: formData.university.trim() || "",
          major: formData.major.trim() || "",
          skillsOffered: formData.skillsOffered,
          skillsNeeded: formData.skillsNeeded,
        },
      }

      let accessToken: string | undefined
      if (supabase) {
        const { data } = await supabase.auth.getSession()
        accessToken = data.session?.access_token
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (res.status === 401) {
        // Instead of alerting, send the user to login to finish auth
        setIsLoading(false)
        return router.push("/login?next=/profile-setup")
      }
      if (!res.ok) throw new Error(data?.error || "Failed to save profile. Please try again.")

      router.push("/browse")
    } catch (err: any) {
      alert(err?.message || "Failed to save profile. Please try again.")
      setIsLoading(false)
    }
  }

  const canProceedStep1 = formData.displayName.trim() && formData.bio.trim()
  const canProceedStep2 = formData.skillsOffered.length > 0
  const canProceedStep3 = formData.skillsNeeded.length > 0

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className={`max-w-2xl mx-auto transition-all duration-800 ${isVisible ? "animate-fade-in-up" : ""}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">EchoSkill</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Tell us about yourself and the skills you want to exchange</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="bg-card border-border animate-card-hover">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl text-card-foreground">About You</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Let's start with some basic information about yourself
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-card-foreground">
                    Display Name *
                  </Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    placeholder="How should others see your name?"
                    className="bg-input border-border"
                    value={formData.displayName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-card-foreground">
                    Bio *
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us a bit about yourself, your interests, and what you're studying..."
                    className="bg-input border-border min-h-[100px]"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-card-foreground">
                      University
                    </Label>
                    <Input
                      id="university"
                      name="university"
                      placeholder="Your university"
                      className="bg-input border-border"
                      value={formData.university}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major" className="text-card-foreground">
                      Major/Field
                    </Label>
                    <Input
                      id="major"
                      name="major"
                      placeholder="Your major or field"
                      className="bg-input border-border"
                      value={formData.major}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Skills Offered */}
          {currentStep === 2 && (
            <>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl text-card-foreground">Skills You Can Teach</CardTitle>
                <CardDescription className="text-muted-foreground">
                  What skills, knowledge, or expertise can you share with others?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Add Skills You Can Offer</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Python Programming, Guitar, Spanish, etc."
                      className="bg-input border-border"
                      value={newSkillOffered}
                      onChange={(e) => setNewSkillOffered(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillOffered())}
                    />
                    <Button
                      type="button"
                      onClick={addSkillOffered}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground animate-button-hover"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {formData.skillsOffered.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Your Skills ({formData.skillsOffered.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.skillsOffered.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20 pr-1"
                        >
                          {skill}
                          <button onClick={() => removeSkillOffered(skill)} className="ml-2 hover:text-primary/70">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> Include both technical skills (programming languages, software) and soft
                    skills (languages, music, sports, academic subjects).
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Skills Needed */}
          {currentStep === 3 && (
            <>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl text-card-foreground">Skills You Want to Learn</CardTitle>
                <CardDescription className="text-muted-foreground">
                  What would you like to learn from other students?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Add Skills You Want to Learn</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Web Design, Photography, French, etc."
                      className="bg-input border-border"
                      value={newSkillNeeded}
                      onChange={(e) => setNewSkillNeeded(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillNeeded())}
                    />
                    <Button
                      type="button"
                      onClick={addSkillNeeded}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground animate-button-hover"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {formData.skillsNeeded.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Learning Goals ({formData.skillsNeeded.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.skillsNeeded.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-accent/10 text-accent hover:bg-accent/20 pr-1"
                        >
                          {skill}
                          <button onClick={() => removeSkillNeeded(skill)} className="ml-2 hover:text-accent/70">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> Be specific about what you want to learn. This helps us find better matches
                    for skill exchanges.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between p-6 pt-0">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-border hover:bg-muted bg-transparent animate-button-hover"
            >
              Back
            </Button>
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !canProceedStep1) ||
                  (currentStep === 2 && !canProceedStep2) ||
                  (currentStep === 3 && !canProceedStep3)
                }
                className="bg-primary hover:bg-primary/90 text-primary-foreground animate-button-hover"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceedStep3 || isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground animate-button-hover"
              >
                {isLoading ? "Creating Profile..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
