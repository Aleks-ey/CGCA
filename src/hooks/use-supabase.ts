"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Returns a stable Supabase browser client instance.
 * Only use in Client Components ("use client").
 *
 * Usage:
 *   const supabase = useSupabase();
 *   const { data } = await supabase.from("profiles").select();
 */
export function useSupabase() {
  // Memoize so we don't create a new client on every render
  return useMemo(() => createClient(), []);
}
