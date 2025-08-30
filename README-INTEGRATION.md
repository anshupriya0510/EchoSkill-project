# Backend Integration (Supabase)

This project uses Supabase for authentication and profile storage.

- Auth endpoints:
  - GET /api/auth/session → returns { user } or null
  - POST /api/auth/signin → { email, password }
  - POST /api/auth/signup → { email, password } (also upserts empty profile)

- Profile endpoints:
  - GET /api/profile?id=<uuid> → fetch profile by id (public read)
  - GET /api/profile → fetch current user's profile (requires auth)
  - POST /api/profile → upsert current user's profile; body supports fields:
    { full_name?, bio?, avatar_url?, skills?: string[], metadata?: object }

Client helpers:
- getBrowserSupabase() from lib/supabase/client
- getServerSupabase() from lib/supabase/server

Run SQL (from /scripts) to create tables and RLS policies.
