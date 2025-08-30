"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Heart,
  Users,
  MessageCircle,
  Star,
  ArrowRight,
  Target,
  BookOpen,
  TrendingUp,
  Sparkles,
  Mail,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Navigation from "@/components/navigation"

// Mock user data (current user)
const currentUser = {
  skillsOffered: ["React", "Python", "Web Design", "JavaScript"],
  skillsNeeded: ["Photography", "Spanish", "Guitar", "Public Speaking"],
}

// Mock matches data with compatibility scores
const mockMatches = [
  {
    id: 1,
    name: "Elena Rodriguez",
    university: "UC Berkeley",
    major: "Art & Design",
    avatar: "/young-woman-artist.png",
    bio: "Creative designer who loves sharing knowledge about visual arts and languages.",
    skillsOffered: ["Photography", "Spanish", "Graphic Design", "Adobe Creative Suite"],
    skillsNeeded: ["Web Development", "React", "JavaScript"],
    compatibility: 95,
    mutualSkills: {
      theyTeach: ["Photography", "Spanish"],
      theyNeed: ["React", "JavaScript"],
    },
    rating: 5.0,
    exchanges: 15,
    responseTime: "Usually responds in 2 hours",
    matchType: "perfect",
  },
  {
    id: 2,
    name: "Alex Thompson",
    university: "MIT",
    major: "Music Technology",
    avatar: "/young-person-musician.png",
    bio: "Music tech student who loves combining creativity with technology.",
    skillsOffered: ["Guitar", "Music Production", "Audio Engineering"],
    skillsNeeded: ["Python", "Web Design"],
    compatibility: 88,
    mutualSkills: {
      theyTeach: ["Guitar"],
      theyNeed: ["Python", "Web Design"],
    },
    rating: 4.8,
    exchanges: 9,
    responseTime: "Usually responds in 4 hours",
    matchType: "perfect",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    university: "Stanford",
    major: "Business",
    avatar: "/young-man-student.png",
    bio: "Business student with a passion for entrepreneurship and digital marketing.",
    skillsOffered: ["Public Speaking", "Business Strategy", "Digital Marketing"],
    skillsNeeded: ["Web Development", "Python"],
    compatibility: 82,
    mutualSkills: {
      theyTeach: ["Public Speaking"],
      theyNeed: ["Python"],
    },
    rating: 4.8,
    exchanges: 8,
    responseTime: "Usually responds in 1 day",
    matchType: "good",
  },
  {
    id: 4,
    name: "Sarah Chen",
    university: "MIT",
    major: "Computer Science",
    avatar: "/young-woman-student.png",
    bio: "Passionate about web development and machine learning. Love teaching others!",
    skillsOffered: ["React", "Python", "Machine Learning"],
    skillsNeeded: ["Photography", "Guitar"],
    compatibility: 75,
    mutualSkills: {
      theyTeach: [],
      theyNeed: ["Photography", "Guitar"],
    },
    rating: 4.9,
    exchanges: 12,
    responseTime: "Usually responds in 6 hours",
    matchType: "good",
  },
  {
    id: 5,
    name: "David Kim",
    university: "Harvard",
    major: "Economics",
    avatar: "/young-man-student-asian.png",
    bio: "Economics major with strong analytical skills and love for teaching math.",
    skillsOffered: ["Mathematics", "Data Analysis", "Korean"],
    skillsNeeded: ["Web Development", "JavaScript"],
    compatibility: 68,
    mutualSkills: {
      theyTeach: [],
      theyNeed: ["JavaScript"],
    },
    rating: 4.7,
    exchanges: 6,
    responseTime: "Usually responds in 12 hours",
    matchType: "potential",
  },
]

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<(typeof mockMatches)[0] | null>(null)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

  const perfectMatches = mockMatches.filter((match) => match.matchType === "perfect")
  const goodMatches = mockMatches.filter((match) => match.matchType === "good")
  const potentialMatches = mockMatches.filter((match) => match.matchType === "potential")

  const getMatchTypeIcon = (type: string) => {
    switch (type) {
      case "perfect":
        return <Sparkles className="w-4 h-4 text-yellow-500" />
      case "good":
        return <Target className="w-4 h-4 text-primary" />
      default:
        return <TrendingUp className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case "perfect":
        return "Perfect Match"
      case "good":
        return "Great Match"
      default:
        return "Potential Match"
    }
  }

  const handleConnect = (student: (typeof mockMatches)[0]) => {
    setSelectedStudent(student)
    setIsConnectModalOpen(true)
  }

  const handleEmailConnect = () => {
    if (selectedStudent) {
      const subject = `SkillEcho Connection Request - ${selectedStudent.name}`
      const body = `Hi ${selectedStudent.name},\n\nI found your profile on SkillEcho and I'm interested in a skill exchange! I can help you with ${selectedStudent.mutualSkills.theyNeed.join(", ")} and I'd love to learn ${selectedStudent.mutualSkills.theyTeach.join(", ")} from you.\n\nLet's connect and discuss how we can help each other grow!\n\nBest regards`
      window.open(
        `mailto:${selectedStudent.name.toLowerCase().replace(" ", ".")}@university.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      )
    }
    setIsConnectModalOpen(false)
  }

  const handleWhatsAppConnect = () => {
    if (selectedStudent) {
      const message = `Hi ${selectedStudent.name}! I found your profile on SkillEcho and I'm interested in a skill exchange. I can help you with ${selectedStudent.mutualSkills.theyNeed.join(", ")} and I'd love to learn ${selectedStudent.mutualSkills.theyTeach.join(", ")} from you. Let's connect!`
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)
    }
    setIsConnectModalOpen(false)
  }

  const MatchCard = ({ match }: { match: (typeof mockMatches)[0] }) => (
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={match.avatar || "/placeholder.svg"} alt={match.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {match.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-card-foreground text-lg">{match.name}</h3>
                {getMatchTypeIcon(match.matchType)}
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {match.major} • {match.university}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-yellow-500" />
                  <span>{match.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{match.exchanges} exchanges</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary mb-1">{match.compatibility}%</div>
            <div className="text-xs text-muted-foreground">{getMatchTypeLabel(match.matchType)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{match.bio}</p>

        {/* Compatibility Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-card-foreground">Match Compatibility</span>
            <span className="text-sm text-muted-foreground">{match.compatibility}%</span>
          </div>
          <Progress value={match.compatibility} className="h-2" />
        </div>

        {/* Mutual Skills */}
        {match.mutualSkills.theyTeach.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              They can teach you
            </h4>
            <div className="flex flex-wrap gap-1">
              {match.mutualSkills.theyTeach.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-primary/10 text-primary text-xs hover:bg-primary/20"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {match.mutualSkills.theyNeed.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              You can teach them
            </h4>
            <div className="flex flex-wrap gap-1">
              {match.mutualSkills.theyNeed.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-accent/10 text-accent text-xs hover:bg-accent/20">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Response Time */}
        <div className="text-xs text-muted-foreground border-t border-border pt-3">{match.responseTime}</div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/profile/${match.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-border hover:bg-muted bg-transparent">
              View Profile
            </Button>
          </Link>
          <Button
            onClick={() => handleConnect(match)}
            className="flex-1 bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300 font-semibold border-0 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <MessageCircle className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Connect</span>
          </Button>
          <Link
            href={`/feedback?student=${encodeURIComponent(match.name)}&skill=${encodeURIComponent(match.mutualSkills.theyTeach[0] || "General")}`}
            className="flex-1"
          >
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent">
              <Star className="w-4 h-4 mr-2" />
              Feedback
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Component */}
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Matches</h1>
          <p className="text-muted-foreground">
            We found students who are perfect for skill exchanges based on your profile.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-card-foreground">{perfectMatches.length}</div>
                  <div className="text-sm text-muted-foreground">Perfect Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-card-foreground">{goodMatches.length}</div>
                  <div className="text-sm text-muted-foreground">Great Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-card-foreground">{mockMatches.length}</div>
                  <div className="text-sm text-muted-foreground">Total Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Matches Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="all" className="data-[state=active]:bg-background">
              All ({mockMatches.length})
            </TabsTrigger>
            <TabsTrigger value="perfect" className="data-[state=active]:bg-background">
              Perfect ({perfectMatches.length})
            </TabsTrigger>
            <TabsTrigger value="good" className="data-[state=active]:bg-background">
              Great ({goodMatches.length})
            </TabsTrigger>
            <TabsTrigger value="potential" className="data-[state=active]:bg-background">
              Potential ({potentialMatches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {mockMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="perfect" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {perfectMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="good" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {goodMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="potential" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {potentialMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-border">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Want More Matches?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Update your skills or browse more students to find additional learning opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/profile-setup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Update Skills
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
                    Browse All Students
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Connect Modal */}
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Connect with {selectedStudent?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-4">
            {selectedStudent && (
              <>
                <Avatar className="w-20 h-20">
                  <AvatarImage src={selectedStudent.avatar || "/placeholder.svg"} alt={selectedStudent.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {selectedStudent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedStudent.major} • {selectedStudent.university}
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
