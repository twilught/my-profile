import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _anon: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

/** Public read-only client (anon key) */
export function getSupabase(): SupabaseClient {
  if (!_anon) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
    _anon = createClient(url, key);
  }
  return _anon;
}

/** Admin client (service role key) — bypasses RLS, use only in server API routes */
export function getAdminSupabase(): SupabaseClient {
  if (!_admin) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    _admin = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return _admin;
}

export type Work = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  category: string | null;
  tags: string[];
  image_url: string | null;
  images: string[];
  link: string | null;
  github: string | null;
  year: number | null;
  date: string | null;
  featured: boolean;
  created_at: string;
};
