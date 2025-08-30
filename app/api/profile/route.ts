import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"

// helper to read bearer token if present
function getBearer(req: Request) {
  const auth = req.headers.get("authorization") || ""
  const [scheme, token] = auth.split(" ")
  if (scheme?.toLowerCase() === "bearer" && token) return token
  return null
}

async function getAuthedClient(req: Request) {
  // default cookie-based client
  const supabase = getServerSupabase()
  const bearer = getBearer(req)
  if (!bearer) return supabase

  // When an access token is sent explicitly, create a client bound to that token.
  // This fixes flows where cookies are not yet set (email-confirmation or SSR timing).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  if (!url || !anon) return supabase

  const cookieFreeClient = createServerClient(url, anon, {
    cookies: {
      get() {
        return undefined
      },
      set() {},
      remove() {},
    },
    global: {
      headers: { Authorization: `Bearer ${bearer}` },
    },
  })
  return cookieFreeClient
}

type ProfilePayload = {
  full_name?: string | null
  bio?: string | null
  avatar_url?: string | null
  skills?: string[] | null
  metadata?: Record<string, unknown> | null
}

export async function GET(req: Request) {
  const supabase = await getAuthedClient(req)
  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  if (id) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ profile: data }, { status: 200 })
  }

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ profile: data }, { status: 200 })
}

export async function POST(req: Request) {
  const supabase = await getAuthedClient(req)
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as ProfilePayload
  const payload: Record<string, unknown> = {
    id: user.id,
    updated_at: new Date().toISOString(),
  }

  if ("full_name" in body) payload.full_name = body.full_name
  if ("bio" in body) payload.bio = body.bio
  if ("avatar_url" in body) payload.avatar_url = body.avatar_url
  if ("skills" in body) payload.skills = body.skills
  if ("metadata" in body) payload.metadata = body.metadata

  const { data, error } = await supabase.from("profiles").upsert(payload).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ profile: data }, { status: 200 })
}

export async function PATCH(req: Request) {
  return POST(req)
}
