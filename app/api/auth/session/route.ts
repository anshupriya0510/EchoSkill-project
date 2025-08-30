export const dynamic = "force-dynamic"
export const revalidate = 0

import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getServerSupabase()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  let profile: { full_name?: string; avatar_url?: string } | null = null
  if (user?.id) {
    const { data: p } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single()
    profile = p ?? null
  }

  const res = NextResponse.json({ user: error ? null : user, profile, error: error?.message }, { status: 200 })
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  res.headers.set("Pragma", "no-cache")
  res.headers.set("Expires", "0")
  return res
}
