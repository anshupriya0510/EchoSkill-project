import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVER_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Prefer NEXT_PUBLIC_SUPABASE_URL so admin and app clients hit the same project.
// Fall back to SUPABASE_URL only if public URL is not set.
const RESOLVED_URL = PUBLIC_URL || SERVER_URL

let _adminClient: SupabaseClient | null = null

export function getAdminSupabase() {
  if (!_adminClient) {
    if (!RESOLVED_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        "[Supabase] Missing Supabase envs. Ensure NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY are set.",
      )
    }

    // Warn if URLs disagree to surface cross-project configuration mistakes.
    if (PUBLIC_URL && SERVER_URL && PUBLIC_URL !== SERVER_URL) {
      console.warn(
        `[Supabase] NEXT_PUBLIC_SUPABASE_URL (${PUBLIC_URL}) and SUPABASE_URL (${SERVER_URL}) differ. Using NEXT_PUBLIC_SUPABASE_URL for admin client to prevent cross-project writes.`,
      )
    }

    _adminClient = createClient(RESOLVED_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })
  }
  return _adminClient
}
