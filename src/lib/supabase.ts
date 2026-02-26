import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Browser-side Supabase client (anon key — INSERT only via RLS).
 * Returns null when env vars are missing so the app still works without Supabase.
 */
export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;
