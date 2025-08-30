"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, BookOpen, Zap } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {/* Navigation Component */}
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1
            className={`text-5xl md:text-6xl font-bold mb-6 text-balance transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Swap Skills. <span className="text-gradient-primary">Unlock Potential.</span>
          </h1>
          <p
            className={`text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Connect with fellow students to exchange knowledge, learn new skills, and grow together. Your expertise is
            someone else's opportunity.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-white px-8 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Exchanging
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 bg-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-200 hover:border-primary/40"
              >
                Browse Skills
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl font-bold text-foreground mb-4 transition-all duration-800 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            How EchoSkill Works
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-800 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Simple steps to connect with peers and start your skill exchange journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link href="/login" className="block">
            <Card
              className={`bg-gradient-card border-0 text-center p-6 hover:shadow-xl hover:-translate-y-3 transition-all duration-300 backdrop-blur-sm shadow-lg cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-200 shadow-lg">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Create Your Profile</h3>
                <p className="text-muted-foreground">
                  List the skills you can teach and what you want to learn. Build your learning network.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/browse" className="block">
            <Card
              className={`bg-gradient-card border-0 text-center p-6 hover:shadow-xl hover:-translate-y-3 transition-all duration-300 backdrop-blur-sm shadow-lg cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-200 shadow-lg">
                  <BookOpen className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Find Matches</h3>
                <p className="text-muted-foreground">
                  Our smart matching system connects you with students who complement your skills.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/matches" className="block">
            <Card
              className={`bg-gradient-card border-0 text-center p-6 hover:shadow-xl hover:-translate-y-3 transition-all duration-300 backdrop-blur-sm shadow-lg cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "1000ms" }}
            >
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-200 shadow-lg">
                  <Zap className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Start Learning</h3>
                <p className="text-muted-foreground">
                  Connect, collaborate, and grow together. Exchange knowledge and unlock new potential.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-muted via-muted/80 to-accent/10 py-20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div
              className={`hover:scale-110 transition-all duration-300 p-6 rounded-xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "1200ms" }}
            >
              <div className="text-4xl font-bold text-gradient-primary mb-2">500+</div>
              <div className="text-muted-foreground font-medium">Active Students</div>
            </div>
            <div
              className={`hover:scale-110 transition-all duration-300 p-6 rounded-xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "1400ms" }}
            >
              <div className="text-4xl font-bold text-gradient-secondary mb-2">1,200+</div>
              <div className="text-muted-foreground font-medium">Skills Exchanged</div>
            </div>
            <div
              className={`hover:scale-110 transition-all duration-300 p-6 rounded-xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "1600ms" }}
            >
              <div className="text-4xl font-bold text-gradient-accent mb-2">95%</div>
              <div className="text-muted-foreground font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2
            className={`text-3xl font-bold text-foreground mb-4 transition-all duration-800 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "1800ms" }}
          >
            Ready to Start Your Journey?
          </h2>
          <p
            className={`text-lg text-muted-foreground mb-8 transition-all duration-800 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "2000ms" }}
          >
            Join thousands of students already exchanging skills and unlocking their potential.
          </p>
          <div
            className={`transition-all duration-800 ${isVisible ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "2200ms" }}
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 hover:scale-105 transition-all duration-200 group shadow-xl hover:shadow-2xl"
              >
                Join EchoSkill Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-gradient-to-r from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div
            className={`flex flex-col md:flex-row justify-between items-center transition-all duration-800 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "2400ms" }}
          >
            <div className="flex items-center gap-2 mb-4 md:mb-0 hover:scale-105 transition-transform duration-200">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground text-lg">EchoSkill</span>
            </div>
            <div className="text-sm text-muted-foreground">© 2024 EchoSkill. Empowering student connections.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
