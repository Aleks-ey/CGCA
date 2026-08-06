"use client";

import { useEffect, useRef, useState } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import type { Database } from "@/types/supabase";

type GalleryImage = Database["public"]["Tables"]["gallery"]["Row"];

const PAGE_SIZE = 12;
// Small club site — fetching the whole unfiltered set in one query (rather
// than DB-paginating it) is what lets "All" be randomized without fighting
// page-offset pagination. This caps that single fetch.
const ALL_VIEW_FETCH_CAP = 500;
// Bump this suffix any time the cached payload's shape or meaning changes —
// old cached blobs under a stale key are simply ignored (cache miss) instead
// of being read with a mismatched/stale shape.
const CACHE_VERSION_KEY = "cgca_gallery_version";
const CACHE_DATA_KEY = "cgca_gallery_cache_v3";

interface CachedGalleryPayload {
  version: number;
  images: GalleryImage[];
  albums: string[];
}

function isValidCache(value: unknown): value is CachedGalleryPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CachedGalleryPayload>;
  return (
    typeof candidate.version === "number" &&
    Array.isArray(candidate.images) &&
    Array.isArray(candidate.albums)
  );
}

function readCache(): CachedGalleryPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_DATA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidCache(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(payload: CachedGalleryPayload) {
  try {
    localStorage.setItem(CACHE_DATA_KEY, JSON.stringify(payload));
    localStorage.setItem(CACHE_VERSION_KEY, String(payload.version));
  } catch {
    // localStorage unavailable/full — caching is a pure optimization, safe to skip.
  }
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function useGallery(album?: string) {
  const supabase = useSupabase();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [albums, setAlbums] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const cacheVersionRef = useRef<number | null>(null);
  const albumsRef = useRef<string[]>([]);
  // Full randomized set backing the unfiltered "All" view — "Load More"
  // there just reveals more of this already-fetched array.
  const allShuffledRef = useRef<GalleryImage[]>([]);

  async function fetchGalleryVersion(): Promise<number | null> {
    const { data } = await supabase
      .from("gallery_state")
      .select("version")
      .eq("id", 1)
      .maybeSingle();
    return data?.version ?? null;
  }

  async function fetchAlbums(): Promise<string[]> {
    const { data } = await supabase.from("gallery").select("album");
    if (!data) return [];
    const unique = [
      ...new Set(data.map((r) => r.album).filter(Boolean)),
    ] as string[];
    return unique;
  }

  async function fetchAllShuffled(): Promise<GalleryImage[]> {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("id", { ascending: false })
      .limit(ALL_VIEW_FETCH_CAP);
    return shuffle(data ?? []);
  }

  async function fetchAlbumPage(pageNum: number, activeAlbum: string) {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .eq("album", activeAlbum)
      .order("id", { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);
    const rows = data ?? [];
    setHasMore(rows.length === PAGE_SIZE);
    return rows;
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setPage(0);
      setLoading(true);

      // Only the unfiltered "All" view is cached/randomized — filtering by
      // album is an explicit user action, so it's fine (and much simpler)
      // to always hit the network for it in original insertion order.
      if (!album) {
        const version = await fetchGalleryVersion();
        cacheVersionRef.current = version;
        const cached = readCache();

        if (cached && version !== null && cached.version === version) {
          if (cancelled) return;
          allShuffledRef.current = cached.images;
          setAlbums(cached.albums);
          albumsRef.current = cached.albums;
          setImages(cached.images.slice(0, PAGE_SIZE));
          setHasMore(cached.images.length > PAGE_SIZE);
          setLoading(false);
          return;
        }

        const [freshAlbums, shuffled] = await Promise.all([
          fetchAlbums(),
          fetchAllShuffled(),
        ]);
        if (cancelled) return;
        allShuffledRef.current = shuffled;
        setAlbums(freshAlbums);
        albumsRef.current = freshAlbums;
        setImages(shuffled.slice(0, PAGE_SIZE));
        setHasMore(shuffled.length > PAGE_SIZE);
        setLoading(false);

        if (version !== null) {
          writeCache({ version, images: shuffled, albums: freshAlbums });
        }
        return;
      }

      const [freshAlbums, freshImages] = await Promise.all([
        fetchAlbums(),
        fetchAlbumPage(0, album),
      ]);
      if (cancelled) return;
      setAlbums(freshAlbums);
      albumsRef.current = freshAlbums;
      setImages(freshImages);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [album]);

  async function loadMore() {
    const next = page + 1;

    if (!album) {
      const revealed = allShuffledRef.current.slice(0, (next + 1) * PAGE_SIZE);
      setImages(revealed);
      setHasMore(revealed.length < allShuffledRef.current.length);
      setPage(next);
      return;
    }

    const rows = await fetchAlbumPage(next, album);
    setImages((prev) => [...prev, ...rows]);
    setPage(next);
  }

  return { images, albums, loading, hasMore, loadMore };
}
