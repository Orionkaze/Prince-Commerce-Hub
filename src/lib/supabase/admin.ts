import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lwcsiphwzoknmnwmeecj.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Trusted server-side administrative Supabase client using Service Role Key.
 * NEVER import or execute this on client-side components.
 */
export const createAdminClient = () => {
  if (!serviceRoleKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not set. Admin client operations will fall back to anon key.");
  }
  return createClient(supabaseUrl, serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "", {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
