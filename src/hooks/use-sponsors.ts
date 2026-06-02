"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import type { Database } from "@/types/supabase";

type Sponsor = Database["public"]["Tables"]["sponsors"]["Row"];

export function useSponsors() {
  const supabase = useSupabase();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const { data } = await supabase.from("sponsors").select("*").order("id");
    setSponsors(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sponsors, loading, refresh };
}
