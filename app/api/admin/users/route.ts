// Secure admin endpoint to list users via Supabase Admin API
import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"
import { getAdminSupabase } from "@/lib/supabase/admin"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"))
    const perPage = Math.min(100, Math.max(1, Number(url.searchParams.get("perPage") || "20")))

    // Require an authenticated session (cookies handled by getServerSupabase)
    const supabase = getServerSupabase()
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()
    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Simple admin gate: only allow a specific admin email
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      return NextResponse.json(
        {
          error: "Forbidden",
          detail: "Set ADMIN_EMAIL in Project Settings to the email allowed to access admin endpoints.",
        },
        { status: 403 },
      )
    }
    if (user.email !== adminEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Use service role on the server to call Admin API
    const admin = getAdminSupabase()
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return a minimal safe subset
    const users =
      data?.users?.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        app_metadata: u.app_metadata, // contains provider/roles; avoid identities or tokens
      })) ?? []

    return NextResponse.json({
      page,
      perPage,
      // Some SDK versions include nextPage/lastPage; pass through if present
      nextPage: (data as any)?.nextPage ?? null,
      lastPage: (data as any)?.lastPage ?? null,
      users,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 })
  }
}
