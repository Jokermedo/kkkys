import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL as string
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE as string

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.warn("Supabase env vars missing: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE")
}

export function getSupabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
