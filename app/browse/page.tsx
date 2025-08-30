"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  MapPin,
  GraduationCap,
  MessageCircle,
  Star,
  Users,
  Code,
  Palette,
  Camera,
  Music,
  Calculator,
  Globe,
  Briefcase,
  BookOpen,
  Mic,
  Heart,
  Zap,
  Target,
  Mail,
  MessageSquare,
} from "lucide-react"
import { useState } from "react"
import Navigation from "@/components/navigation"

const skillCategories = {
  "All Categories": [],
  Tech: ["React", "Python", "Machine Learning", "Web Development", "Programming", "Data Analysis", "Web Design"],
  Design: ["Graphic Design", "Photography", "Adobe Creative Suite", "Web Design"],
  Language: ["Spanish", "Korean", "Hindi", "Globe"],
  Business: ["Digital Marketing", "Business Strategy", "Finance", "Economics"],
  Creative: ["Music Production", "Guitar", "Creative Writing", "Audio Engineering", "Logic Pro"],
  Academic: ["Mathematics", "Statistics", "Research Methods", "Psychology", "Public Speaking"],
  Wellness: ["Meditation"],
}

const skillIcons: { [key: string]: any } = {
  React: Code,
  Python: Code,
  "Machine Learning": Zap,
  "Web Design": Palette,
  Photography: Camera,
  Spanish: Globe,
  Guitar: Music,
  "Digital Marketing": Target,
  "Business Strategy": Briefcase,
  "Public Speaking": Mic,
  "Web Development": Code,
  "Data Analysis": Calculator,
  "Graphic Design": Palette,
  "Adobe Creative Suite": Palette,
  Programming: Code,
  Statistics: Calculator,
  Finance: Briefcase,
  Mathematics: Calculator,
  Economics: Calculator,
  Korean: Globe,
  "Music Production": Music,
  "Creative Writing": BookOpen,
  "Research Methods": BookOpen,
  Psychology: Heart,
  Hindi: Globe,
  Meditation: Heart,
  "Audio Engineering": Music,
  "Logic Pro": Music,
}

const mockProfiles = [
  {
    id: 1,
    name: "Sarah Chen",
    university: "MIT",
    major: "Computer Science",
    avatar: "/young-woman-student.png",
    bio: "Passionate about web development and machine learning. Love teaching others!",
    skillsOffered: ["React", "Python", "Machine Learning", "Web Design"],
    skillsNeeded: ["Photography", "Spanish", "Guitar"],
    rating: 4.9,
    exchanges: 12,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    university: "Stanford",
    major: "Business",
    avatar: "/young-man-student.png",
    bio: "Business student with a passion for entrepreneurship and digital marketing.",
    skillsOffered: ["Digital Marketing", "Business Strategy", "Public Speaking"],
    skillsNeeded: ["Web Development", "Data Analysis", "Graphic Design"],
    rating: 4.8,
    exchanges: 8,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    university: "UC Berkeley",
    major: "Art & Design",
    avatar: "/young-woman-artist.png",
    bio: "Creative designer who loves sharing knowledge about visual arts and languages.",
    skillsOffered: ["Graphic Design", "Spanish", "Photography", "Adobe Creative Suite"],
    skillsNeeded: ["Programming", "Statistics", "Finance"],
    rating: 5.0,
    exchanges: 15,
  },
  {
    id: 4,
    name: "David Kim",
    university: "Harvard",
    major: "Economics",
    avatar: "/young-man-student-asian.png",
    bio: "Economics major with strong analytical skills and love for teaching math.",
    skillsOffered: ["Mathematics", "Economics", "Data Analysis", "Korean"],
    skillsNeeded: ["Music Production", "Creative Writing", "Public Speaking"],
    rating: 4.7,
    exchanges: 6,
  },
  {
    id: 5,
    name: "Aisha Patel",
    university: "NYU",
    major: "Psychology",
    avatar: "/young-woman-student-indian.png",
    bio: "Psychology student passionate about mental health and research methods.",
    skillsOffered: ["Research Methods", "Psychology", "Hindi", "Meditation"],
    skillsNeeded: ["Web Development", "Photography", "Guitar"],
    rating: 4.9,
    exchanges: 10,
  },
  {
    id: 6,
    name: "Alex Thompson",
    university: "MIT",
    major: "Music Technology",
    avatar: "/young-person-musician.png",
    bio: "Music tech student who loves combining creativity with technology.",
    skillsOffered: ["Music Production", "Guitar", "Audio Engineering", "Logic Pro"],
    skillsNeeded: ["Python", "Machine Learning", "Mathematics"],
    rating: 4.8,
    exchanges: 9,
  },
]

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const stars = []

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)
  }

  if (hasHalfStar) {
    stars.push(<Star key="half" className="w-3 h-3 fill-yellow-400/50 text-yellow-400" />)
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />)
  }

  return stars
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [filteredProfiles, setFilteredProfiles] = useState(mockProfiles)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<(typeof mockProfiles)[0] | null>(null)

  const applyFilters = (query: string, category: string) => {
    let filtered = mockProfiles

    if (query.trim()) {
      filtered = filtered.filter(
        (profile) =>
          profile.name.toLowerCase().includes(query.toLowerCase()) ||
          profile.university.toLowerCase().includes(query.toLowerCase()) ||
          profile.major.toLowerCase().includes(query.toLowerCase()) ||
          profile.skillsOffered.some((skill) => skill.toLowerCase().includes(query.toLowerCase())) ||
          profile.skillsNeeded.some((skill) => skill.toLowerCase().includes(query.toLowerCase())),
      )
    }

    if (category !== "All Categories") {
      const categorySkills = skillCategories[category as keyof typeof skillCategories]
      filtered = filtered.filter(
        (profile) =>
          profile.skillsOffered.some((skill) => categorySkills.includes(skill)) ||
          profile.skillsNeeded.some((skill) => categorySkills.includes(skill)),
      )
    }

    setFilteredProfiles(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    applyFilters(query, selectedCategory)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    applyFilters(searchQuery, category)
  }

  const handleConnectClick = (profile: (typeof mockProfiles)[0]) => {
    setSelectedProfile(profile)
    setIsConnectModalOpen(true)
  }

  const handleEmailConnect = () => {
    if (selectedProfile) {
      const subject = `SkillEcho: Let's exchange skills!`
      const body = `Hi ${selectedProfile.name},\n\nI found your profile on SkillEcho and I'm interested in exchanging skills with you. I can help you with some of the skills you're looking to learn, and I'd love to learn from your expertise!\n\nLet's connect and discuss how we can help each other.\n\nBest regards!`
      window.open(
        `mailto:${selectedProfile.name.toLowerCase().replace(" ", ".")}@university.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      )
    }
    setIsConnectModalOpen(false)
  }

  const handleWhatsAppConnect = () => {
    if (selectedProfile) {
      const message = `Hi ${selectedProfile.name}! I found your profile on SkillEcho and I'm interested in exchanging skills with you. Let's connect!`
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)
    }
    setIsConnectModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Browse Skills</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Discover students with skills you want to learn and find those who need what you can teach.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, university..."
                className="pl-10 bg-input border-border h-12 sm:h-10 text-base sm:text-sm"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full border-border bg-background h-12 sm:h-10">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.keys(skillCategories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProfiles.length} student{filteredProfiles.length !== 1 ? "s" : ""}
            {selectedCategory !== "All Categories" && (
              <span className="ml-2">
                in{" "}
                <Badge variant="secondary" className="text-xs">
                  {selectedCategory}
                </Badge>
              </span>
            )}
          </p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProfiles.map((profile) => (
            <Card
              key={profile.id}
              className="bg-gradient-to-br from-card via-card to-card/80 border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden"
            >
              <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Avatar className="w-14 h-14 sm:w-16 sm:h-16 ring-2 ring-primary/20 flex-shrink-0">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-base sm:text-lg font-semibold">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-card-foreground text-base sm:text-lg truncate">{profile.name}</h3>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-1">
                      <GraduationCap className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="truncate">{profile.major}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
                      <span className="truncate">{profile.university}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {renderStars(profile.rating)}
                      <span className="text-xs sm:text-sm font-medium text-foreground ml-1">{profile.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-card-foreground mb-2 sm:mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    Can Teach
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {profile.skillsOffered.slice(0, 3).map((skill) => {
                      const IconComponent = skillIcons[skill] || BookOpen
                      return (
                        <Badge
                          key={skill}
                          className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 hover:from-green-200 hover:to-emerald-200 transition-all duration-200 px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          <IconComponent className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{skill}</span>
                        </Badge>
                      )
                    })}
                    {profile.skillsOffered.length > 3 && (
                      <Badge className="bg-muted text-muted-foreground text-xs rounded-full px-2 py-1">
                        +{profile.skillsOffered.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-card-foreground mb-2 sm:mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    Wants to Learn
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {profile.skillsNeeded.slice(0, 3).map((skill) => {
                      const IconComponent = skillIcons[skill] || Target
                      return (
                        <Badge
                          key={skill}
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          <IconComponent className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{skill}</span>
                        </Badge>
                      )
                    })}
                    {profile.skillsNeeded.length > 3 && (
                      <Badge className="bg-muted text-muted-foreground text-xs rounded-full px-2 py-1">
                        +{profile.skillsNeeded.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                      <Users className="w-3 h-3 text-primary" />
                      <span className="font-medium">{profile.exchanges} exchanges</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleConnectClick(profile)}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-4 py-3 sm:py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base h-12 sm:h-auto"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No students found</h3>
            <p className="text-sm text-muted-foreground mb-4 px-4">
              Try adjusting your search terms or selecting a different category.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All Categories")
                setFilteredProfiles(mockProfiles)
              }}
              variant="outline"
              className="border-border hover:bg-muted bg-transparent h-12 sm:h-10 px-6"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Connect Modal */}
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedProfile && (
                <>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedProfile.avatar || "/placeholder.svg"} alt={selectedProfile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {selectedProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  Connect with {selectedProfile.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Choose how you'd like to connect and start your skill exchange journey!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 pt-4">
            <Button
              onClick={handleEmailConnect}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 sm:py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 text-base"
            >
              <Mail className="w-5 h-5" />
              Connect via Email
            </Button>

            <Button
              onClick={handleWhatsAppConnect}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 sm:py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 text-base"
            >
              <MessageSquare className="w-5 h-5" />
              Connect via WhatsApp
            </Button>

            <Button
              onClick={() => setIsConnectModalOpen(false)}
              variant="outline"
              className="w-full border-border hover:bg-muted py-4 sm:py-3 text-base"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
