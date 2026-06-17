"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import type { Database } from "@/types/supabase";

type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];

export function useEvents() {
  const supabase = useSupabase();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const { data } = await supabase.from("events").select("*").order("date");
    setEvents(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { events, loading, refresh };
}
