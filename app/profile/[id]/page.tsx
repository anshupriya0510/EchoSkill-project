"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Star,
  MapPin,
  Calendar,
  Users,
  MessageCircle,
  ArrowLeft,
  BookOpen,
  Target,
  Award,
  Clock,
  Mail,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Navigation from "@/components/navigation"
import { useParams } from "next/navigation"

// Mock detailed user data
const mockUsers = {
  "1": {
    id: 1,
    name: "Elena Rodriguez",
    university: "UC Berkeley",
    major: "Art & Design",
    year: "Junior",
    location: "Berkeley, CA",
    avatar: "/young-woman-artist.png",
    bio: "Creative designer who loves sharing knowledge about visual arts and languages. I'm passionate about helping others discover their artistic potential while learning new technical skills myself. Currently working on my portfolio and always excited to collaborate on creative projects.",
    skillsOffered: ["Photography", "Spanish", "Graphic Design", "Adobe Creative Suite", "UI/UX Design", "Digital Art"],
    skillsNeeded: ["Web Development", "React", "JavaScript", "Python", "Database Design"],
    rating: 5.0,
    totalRatings: 24,
    exchanges: 15,
    joinedDate: "September 2023",
    responseTime: "Usually responds in 2 hours",
    availability: "Weekday evenings, Weekends",
    languages: ["English", "Spanish", "Portuguese"],
    achievements: ["Top Rated Tutor", "Quick Responder", "Skill Master"],
    reviews: [
      {
        id: 1,
        reviewer: "Alex Thompson",
        rating: 5,
        comment:
          "Elena is an amazing photography teacher! She helped me understand composition and lighting in just a few sessions.",
        skill: "Photography",
        date: "2 weeks ago",
      },
      {
        id: 2,
        reviewer: "Sarah Chen",
        rating: 5,
        comment:
          "Her Spanish lessons are so engaging and practical. I learned more in a month than I did in a semester!",
        skill: "Spanish",
        date: "1 month ago",
      },
      {
        id: 3,
        reviewer: "Marcus Johnson",
        rating: 5,
        comment:
          "Great graphic design mentor. Elena provided excellent feedback on my portfolio and helped me improve significantly.",
        skill: "Graphic Design",
        date: "2 months ago",
      },
    ],
  },
  "2": {
    id: 2,
    name: "Alex Thompson",
    university: "MIT",
    major: "Music Technology",
    year: "Senior",
    location: "Cambridge, MA",
    avatar: "/young-person-musician.png",
    bio: "Music tech student who loves combining creativity with technology. I specialize in guitar performance and music production, and I'm always eager to learn new programming languages and web technologies.",
    skillsOffered: ["Guitar", "Music Production", "Audio Engineering", "Logic Pro", "Ableton Live"],
    skillsNeeded: ["Python", "Web Design", "React", "Machine Learning"],
    rating: 4.8,
    totalRatings: 18,
    exchanges: 9,
    joinedDate: "January 2024",
    responseTime: "Usually responds in 4 hours",
    availability: "Flexible schedule",
    languages: ["English"],
    achievements: ["Music Mentor", "Tech Enthusiast"],
    reviews: [
      {
        id: 1,
        reviewer: "David Kim",
        rating: 5,
        comment: "Alex is a fantastic guitar teacher! Very patient and explains techniques clearly.",
        skill: "Guitar",
        date: "1 week ago",
      },
      {
        id: 2,
        reviewer: "Elena Rodriguez",
        rating: 4,
        comment: "Great music production skills. Helped me understand the basics of mixing and mastering.",
        skill: "Music Production",
        date: "3 weeks ago",
      },
    ],
  },
}

export default function ProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

  // Get user data based on ID
  const user = mockUsers[userId as keyof typeof mockUsers]

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">The profile you're looking for doesn't exist.</p>
            <Link href="/matches">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Matches
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleConnect = () => {
    setIsConnectModalOpen(true)
  }

  const handleEmailConnect = () => {
    const subject = `SkillEcho Connection Request - ${user.name}`
    const body = `Hi ${user.name},\n\nI found your profile on SkillEcho and I'm interested in a skill exchange! I'd love to learn ${user.skillsOffered.slice(0, 2).join(" and ")} from you.\n\nLet's connect and discuss how we can help each other grow!\n\nBest regards`
    window.open(
      `mailto:${user.name.toLowerCase().replace(" ", ".")}@university.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    )
    setIsConnectModalOpen(false)
  }

  const handleWhatsAppConnect = () => {
    const message = `Hi ${user.name}! I found your profile on SkillEcho and I'm interested in a skill exchange. I'd love to learn ${user.skillsOffered.slice(0, 2).join(" and ")} from you. Let's connect!`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)
    setIsConnectModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/matches">
            <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Matches
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-card-foreground">{user.name}</h1>
                        <p className="text-lg text-muted-foreground">
                          {user.major} • {user.year}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{user.university}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {user.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(user.rating) ? "fill-current text-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-card-foreground">{user.rating}</span>
                          <span className="text-sm text-muted-foreground">({user.totalRatings} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{user.exchanges} successful exchanges</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">About</h3>
                  <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="font-semibold text-card-foreground mb-3">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.achievements.map((achievement) => (
                      <Badge key={achievement} className="bg-primary/10 text-primary hover:bg-primary/20">
                        <Award className="w-3 h-3 mr-1" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="font-semibold text-card-foreground mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.languages.map((language) => (
                      <Badge key={language} variant="secondary" className="bg-muted text-muted-foreground">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Skills I Can Teach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.map((skill) => (
                      <Badge key={skill} className="bg-primary/10 text-primary hover:bg-primary/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Target className="w-5 h-5 text-accent" />
                    Skills I Want to Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsNeeded.map((skill) => (
                      <Badge key={skill} className="bg-accent/10 text-accent hover:bg-accent/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reviews Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Reviews & Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-card-foreground">{review.reviewer}</span>
                          <Badge variant="secondary" className="text-xs">
                            {review.skill}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "fill-current text-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Connect with {user.name.split(" ")[0]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleConnect}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Connect Now
                </Button>
                <Link
                  href={`/feedback?student=${encodeURIComponent(user.name)}&skill=${encodeURIComponent(user.skillsOffered[0])}`}
                  className="block"
                >
                  <Button variant="outline" className="w-full border-border hover:bg-muted bg-transparent">
                    <Star className="w-4 h-4 mr-2" />
                    Leave Feedback
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user.responseTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user.availability}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profile Rating</span>
                  <span className="font-semibold text-card-foreground">{user.rating}/5.0</span>
                </div>
                <Progress value={user.rating * 20} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Reviews</span>
                  <span className="font-semibold text-card-foreground">{user.totalRatings}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Successful Exchanges</span>
                  <span className="font-semibold text-card-foreground">{user.exchanges}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Connect with {user.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                {user.major} • {user.university}
              </p>
            </div>
            <div className="w-full space-y-3">
              <Button onClick={handleEmailConnect} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Mail className="w-4 h-4 mr-2" />
                Connect via Email
              </Button>
              <Button onClick={handleWhatsAppConnect} className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Connect via WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
