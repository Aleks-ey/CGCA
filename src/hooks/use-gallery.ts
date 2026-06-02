"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import type { Database } from "@/types/supabase";

type GalleryImage = Database["public"]["Tables"]["gallery"]["Row"];

export function useGallery(eventFilter?: string) {
  const supabase = useSupabase();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 12;

  async function fetchEvents() {
    const { data } = await supabase.from("gallery").select("event");
    if (data) {
      const unique = [...new Set(data.map((r) => r.event).filter(Boolean))];
      setEvents(unique);
    }
  }

  async function fetchPage(pageNum: number, filter?: string) {
    let query = supabase
      .from("gallery")
      .select("*")
      .order("id", { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

    if (filter) query = query.eq("event", filter);

    const { data } = await query;
    const rows = data ?? [];
    setHasMore(rows.length === PAGE_SIZE);
    return rows;
  }

  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(0);
    setImages([]);
    setLoading(true);
    fetchPage(0, eventFilter).then((rows) => {
      setImages(rows);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFilter]);

  async function loadMore() {
    const next = page + 1;
    const rows = await fetchPage(next, eventFilter);
    setImages((prev) => [...prev, ...rows]);
    setPage(next);
  }

  return { images, events, loading, hasMore, loadMore };
}
