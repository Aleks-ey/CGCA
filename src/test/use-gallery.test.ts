import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGallery } from "@/hooks/use-gallery";

const stateSelectMock = vi.fn();
const galleryAlbumsSelectMock = vi.fn();

function makeQuery(rows: unknown[]) {
  const query: Record<string, unknown> = {};
  const chain = () => query;
  query.select = vi.fn(chain);
  query.order = vi.fn(chain);
  query.range = vi.fn(() => Promise.resolve({ data: rows }));
  query.limit = vi.fn(() => Promise.resolve({ data: rows }));
  query.eq = vi.fn(chain);
  return query;
}

vi.mock("@/hooks/use-supabase", () => ({
  useSupabase: () => ({
    from: vi.fn((table: string) => {
      if (table === "gallery_state") {
        return {
          select: () => ({
            eq: () => ({ maybeSingle: stateSelectMock }),
          }),
        };
      }
      if (table === "gallery") {
        return {
          select: vi.fn((cols: string) => {
            if (cols === "album") {
              return galleryAlbumsSelectMock();
            }
            return makeQuery([
              { id: 1, image_url: "https://cdn.test/a.jpg", album: "Test" },
            ]);
          }),
        };
      }
      throw new Error(`unexpected table ${table}`);
    }),
  }),
}));

describe("useGallery caching", () => {
  beforeEach(() => {
    localStorage.clear();
    stateSelectMock.mockReset();
    galleryAlbumsSelectMock.mockReset().mockResolvedValue({ data: [] });
  });

  it("skips the network fetch when the cached version matches", async () => {
    localStorage.setItem(
      "cgca_gallery_cache_v3",
      JSON.stringify({
        version: 5,
        images: [
          { id: 99, image_url: "https://cdn.test/cached.jpg", album: "Cached" },
        ],
        albums: ["Cached"],
      })
    );
    stateSelectMock.mockResolvedValue({ data: { version: 5 } });

    const { result } = renderHook(() => useGallery());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.images).toEqual([
      { id: 99, image_url: "https://cdn.test/cached.jpg", album: "Cached" },
    ]);
    expect(galleryAlbumsSelectMock).not.toHaveBeenCalled();
  });

  it("does a full fetch and rewrites the cache when the version differs", async () => {
    localStorage.setItem(
      "cgca_gallery_cache_v3",
      JSON.stringify({ version: 1, images: [], albums: [] })
    );
    stateSelectMock.mockResolvedValue({ data: { version: 2 } });

    const { result } = renderHook(() => useGallery());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(galleryAlbumsSelectMock).toHaveBeenCalled();
    expect(result.current.images).toEqual([
      { id: 1, image_url: "https://cdn.test/a.jpg", album: "Test" },
    ]);

    const cached = JSON.parse(localStorage.getItem("cgca_gallery_cache_v3")!);
    expect(cached.version).toBe(2);
  });
});
