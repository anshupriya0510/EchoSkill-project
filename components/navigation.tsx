"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Zap, LogOut, User2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import useSWR from "swr"
import { getBrowserSupabase } from "@/lib/supabase/client"

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
    if (!res.ok) {
      return { user: null, profile: null }
    }
    return await res.json()
  } catch {
    return { user: null, profile: null }
  }
}

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // Session
  const { data, isLoading, mutate } = useSWR<{
    user: { id: string; email?: string } | null
    profile?: { full_name?: string } | null
    error?: string
  }>("/api/auth/session", fetcher, { revalidateOnFocus: true, shouldRetryOnError: false })
  const user = data?.user ?? null
  const isAuthed = !!user

  // Detect if Supabase public env vars are present; Next.js replaces these at build time
  const hasPublicSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  // Subscribe to auth changes to keep header in sync without full reloads
  useEffect(() => {
    if (!hasPublicSupabase) return
    try {
      const supabase = getBrowserSupabase()
      const { data: sub } = supabase.auth.onAuthStateChange(() => {
        mutate()
      })
      return () => {
        sub?.subscription.unsubscribe()
      }
    } catch (e) {
      console.warn("[v0] Supabase not initialized; skipping auth subscription.")
      return
    }
  }, [mutate, hasPublicSupabase])

  const handleSignOut = useCallback(async () => {
    if (!hasPublicSupabase) {
      await mutate({ user: null, profile: null }, false)
      router.refresh()
      return
    }
    try {
      const supabase = getBrowserSupabase()
      await supabase.auth.signOut()
    } catch {
      // ignore sign-out failures if client can't be created
    }
    await mutate({ user: null, profile: null }, false)
    router.refresh()
  }, [mutate, router, hasPublicSupabase])

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/browse", label: "Browse" },
      // Keep Profile link, but only highlight when authed
      { href: "/profile-setup", label: "Profile" },
      { href: "/matches", label: "Matches" },
    ],
    [],
  )

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Zap className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent group-hover:from-accent group-hover:via-secondary group-hover:to-primary transition-all duration-500">
                EchoSkill
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Swap Skills. Unlock Potential.
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-6">
                  <Link href="/" className="flex items-center gap-3 mb-4 group" onClick={() => setIsOpen(false)}>
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                        <Zap className="w-6 h-6 text-white drop-shadow-sm" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                        EchoSkill
                      </span>
                      <span className="text-xs text-muted-foreground font-medium tracking-wide">
                        Swap Skills. Unlock Potential.
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary py-2 ${
                          pathname === link.href ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>

                    {/* Mobile auth actions */}
                    {isLoading ? (
                      <Button className="w-full" size="lg" disabled>
                        Loading...
                      </Button>
                    ) : isAuthed ? (
                      <div className="flex flex-col gap-3">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <User2 className="h-4 w-4" />
                          <span>{data?.profile?.full_name || user?.email}</span>
                        </div>
                        <Link href="/profile-setup" onClick={() => setIsOpen(false)}>
                          <Button className="w-full" size="lg">
                            Profile
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={handleSignOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full" size="lg">
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop auth actions */}
            {isLoading ? null : isAuthed ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/profile-setup"
                  className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-2"
                >
                  <User2 className="h-4 w-4" />
                  <span className="truncate max-w-[160px]">{data?.profile?.full_name || user?.email}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-primary"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign out
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
