"use client";

import type { Database } from "@/types/supabase";

type VolunteerTag = Database["public"]["Tables"]["volunteer_tags"]["Row"];

interface TagSortRowProps {
  tags: VolunteerTag[];
  selectedTagIds: Set<number>;
  onToggle: (tagId: number) => void;
}

export function TagSortRow({
  tags,
  selectedTagIds,
  onToggle,
}: TagSortRowProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="shrink-0 text-xs font-medium text-gray-500">
        Filter by tag:
      </span>
      {tags.length === 0 ? (
        <span className="text-xs text-gray-400">No tags yet</span>
      ) : (
        tags.map((tag) => {
          const active = selectedTagIds.has(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggle(tag.id)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs whitespace-nowrap transition-colors ${
                active
                  ? "border-[var(--color-prussian-blue)] bg-[var(--color-prussian-blue)] text-white"
                  : "border-gray-300 text-gray-600 hover:border-[var(--color-prussian-blue)]"
              }`}
            >
              {tag.label}
            </button>
          );
        })
      )}
    </div>
  );
}
