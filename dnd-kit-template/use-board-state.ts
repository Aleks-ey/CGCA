"use client";

import { useState } from "react";

interface UseBoardStateArgs<T extends { id: number }> {
  initialItems: T[];
  getColumnId: (item: T) => string;
  setColumnId: (item: T, columnId: string) => T;
  /** Persist the move (e.g. a Supabase update). Return an error message on failure. */
  persist: (itemId: number, columnId: string) => Promise<{ error?: string }>;
}

/**
 * Generic optimistic-update-with-rollback state for a drag-and-drop board:
 * move the item locally immediately, persist in the background, and roll
 * back the local move if persistence fails.
 */
export function useBoardState<T extends { id: number }>({
  initialItems,
  getColumnId,
  setColumnId,
  persist,
}: UseBoardStateArgs<T>) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);

  async function moveItem(itemId: number, columnId: string) {
    const item = items.find((i) => i.id === itemId);
    if (!item || getColumnId(item) === columnId) return;

    const previousColumnId = getColumnId(item);
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? setColumnId(i, columnId) : i))
    );

    const { error: persistError } = await persist(itemId, columnId);
    if (persistError) {
      setError(persistError);
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? setColumnId(i, previousColumnId) : i
        )
      );
    }
  }

  return { items, error, moveItem };
}
