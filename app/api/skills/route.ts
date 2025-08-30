import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getServerSupabase()
  // If you later add a dedicated skills table, adjust here. For now, aggregate from profiles.
  const { data, error } = await supabase.from("profiles").select("id, full_name, skills")
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Unique skills list
  const set = new Set<string>()
  for (const row of data || []) {
    ;(row.skills as string[] | null | undefined)?.forEach((s) => set.add(s))
  }
  return NextResponse.json({ skills: Array.from(set) }, { status: 200 })
}

export async function POST(req: Request) {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { skills } = (await req.json().catch(() => ({}))) as { skills?: string[] }
  if (!Array.isArray(skills)) {
    return NextResponse.json({ error: "skills must be an array of strings" }, { status: 400 })
  }

  const { data: profile } = await supabase.from("profiles").select("skills").eq("id", user.id).maybeSingle()
  const newSkills = Array.from(new Set([...(profile?.skills || []), ...skills]))

  const { error } = await supabase
    .from("profiles")
    .update({ skills: newSkills, updated_at: new Date().toISOString() })
    .eq("id", user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ skills: newSkills }, { status: 200 })
}
