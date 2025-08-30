import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"
import { getAdminSupabase } from "@/lib/supabase/admin"

async function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

export async function POST(req: Request) {
  const { email, password, firstName, lastName } = await req.json().catch(() => ({}))

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
  }

  const supabase = getServerSupabase()
  const origin = (() => {
    try {
      return new URL(req.url).origin
    } catch {
      return undefined
    }
  })()

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || (origin ? `${origin}/profile-setup` : undefined),
    },
  })

  if (signUpError) {
    console.error("Supabase sign up error:", signUpError.message)
    return NextResponse.json({ error: signUpError.message }, { status: 400 })
  }

  const userId = data.user?.id

  if (userId) {
    try {
      const admin = getAdminSupabase()

      // This avoids foreign key errors caused by eventual consistency or URL mismatches.
      let userExists = false
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data: u, error } = await admin.auth.admin.getUserById(userId)
        if (u?.user) {
          userExists = true
          break
        }
        // If we received a 404/not found or transient error, wait briefly and retry
        await wait(200)
      }

      if (!userExists) {
        console.warn(
          "[Supabase] admin.getUserById did not find the new user yet. Skipping profile upsert to avoid FK error. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_URL point to the SAME project URL.",
        )
      } else {
        const full_name =
          typeof firstName === "string" || typeof lastName === "string"
            ? [firstName || "", lastName || ""].join(" ").trim() || null
            : null

        const { error: profileError } = await admin
          .from("profiles")
          .upsert({ id: userId, ...(full_name ? { full_name } : {}) }, { onConflict: "id" })
          .single()

        if (profileError) {
          const isFK =
            // @ts-ignore - some drivers expose code
            profileError.code === "23503" || /foreign key/i.test(profileError.message)
          if (isFK) {
            console.warn(
              "[Supabase] Profile FK violation. Skipping profile insert. Confirm both NEXT_PUBLIC_SUPABASE_URL and SUPABASE_URL are the SAME project URL.",
            )
          } else {
            console.error("Supabase profile creation error:", profileError.message)
          }
          // Do not block sign up; profile can be completed after verification/login.
        }
      }
    } catch (upsertError) {
      console.error("An unexpected error occurred during profile upsert:", upsertError)
    }
  }

  const requiresConfirmation = !data.session
  return NextResponse.json({ user: data.user, requiresConfirmation }, { status: 200 })
}
