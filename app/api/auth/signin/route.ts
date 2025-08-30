import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))

  if (!email || !password) {
    return NextResponse.json(
      { error: { message: "Email and password are required.", code: "bad_request" } },
      { status: 400 },
    )
  }

  const supabase = getServerSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const msg = error.message || "Authentication failed"
    const code = /not\s*confirmed/i.test(msg) ? "email_not_confirmed" : "auth_failed"
    return NextResponse.json({ error: { message: msg, code } }, { status: 401 })
  }

  return NextResponse.json({ user: data.user }, { status: 200 })
}
