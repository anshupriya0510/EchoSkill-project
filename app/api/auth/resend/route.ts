import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}))
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }

  const supabase = getServerSupabase()
  const origin = (() => {
    try {
      return new URL(req.url).origin
    } catch {
      return undefined
    }
  })()

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || (origin ? `${origin}/profile-setup` : undefined),
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true }, { status: 200 })
}
