// ====================================================================
// MISIÓN — Supabase Database & Auth Client Helper for Edge Functions
// ====================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  return createClient(supabaseUrl, supabaseServiceKey);
}

export function getSupabaseUserClient(authHeader: string | null) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || '';
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {}
    }
  });
}
