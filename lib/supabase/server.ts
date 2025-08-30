import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Use standard Supabase env variable names added by the integration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function getServerSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Fail fast on server to avoid confusing 401s later
    throw new Error(
      "[Supabase] Missing env vars: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. Please configure the Supabase integration in Project Settings.",
    )
  }

  const cookieStore = cookies()
  const client = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => {
        cookieStore.set(name, value, options)
      },
      remove: (name, options) => {
        cookieStore.set(name, "", { ...options, maxAge: 0 })
      },
    },
  })

  return client
}
