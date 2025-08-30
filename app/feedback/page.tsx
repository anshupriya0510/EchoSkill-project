"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { useSearchParams } from "next/navigation"

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const searchParams = useSearchParams()

  const [student, setStudent] = useState({
    name: "Sarah Chen",
    avatar: "/young-woman-student.png",
    skillExchanged: "React Development",
    exchangeDate: "December 15, 2024",
  })

  useEffect(() => {
    setIsVisible(true)
    const studentName = searchParams.get("student")
    const skill = searchParams.get("skill")

    if (studentName) {
      setStudent((prev) => ({
        ...prev,
        name: studentName,
        skillExchanged: skill || prev.skillExchanged,
      }))
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    // Here you would typically send the feedback to your backend
    console.log("Feedback submitted:", { rating, review, student: student.name })
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div
            className={`max-w-md mx-auto text-center transition-all duration-800 ${isVisible ? "animate-fade-in-up" : ""}`}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Thank You!</h1>
            <p className="text-muted-foreground mb-8">
              Your feedback has been submitted successfully. It helps make EchoSkill better for everyone.
            </p>
            <Link href="/matches">
              <Button className="bg-primary hover:bg-primary/90 animate-button-hover">Back to Matches</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className={`max-w-2xl mx-auto transition-all duration-800 ${isVisible ? "animate-fade-in-up" : ""}`}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/matches">
              <Button variant="ghost" size="sm" className="animate-button-hover">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Leave Feedback</h1>
          </div>

          {/* Student Info Card */}
          <Card className="mb-8 animate-card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback>
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{student.name}</h3>
                  <p className="text-muted-foreground">Skill exchanged: {student.skillExchanged}</p>
                  <p className="text-sm text-muted-foreground">Exchange date: {student.exchangeDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Form */}
          <Card className="animate-card-hover">
            <CardHeader>
              <CardTitle>How was your experience?</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Rate your experience</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 transition-colors"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {rating === 1 && "Poor experience"}
                      {rating === 2 && "Below average"}
                      {rating === 3 && "Average experience"}
                      {rating === 4 && "Good experience"}
                      {rating === 5 && "Excellent experience"}
                    </p>
                  )}
                </div>

                {/* Written Review */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Write a review (optional)</label>
                  <Textarea
                    placeholder="Share your experience with this skill exchange. What did you learn? How was the teaching style?"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="min-h-[120px] resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-2">{review.length}/500 characters</p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Link href="/matches" className="flex-1">
                    <Button type="button" variant="outline" className="w-full bg-transparent animate-button-hover">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={rating === 0}
                    className="flex-1 bg-primary hover:bg-primary/90 animate-button-hover"
                  >
                    Submit Feedback
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
