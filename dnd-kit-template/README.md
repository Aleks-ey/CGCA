# dnd-kit board template

A generic drag-and-drop kanban board, extracted from the volunteer
assignment board (`src/components/admin/volunteers/`) before drag-and-drop
was replaced there with a plain `<select>` (not needed for that UI, but
the pattern was worth keeping).

This folder is intentionally kept outside `src/` so it isn't part of the
app's build, type-check, or lint (`dnd-kit-template` is excluded in
`tsconfig.json`). It's parked here for now — move it into another project
when you need this pattern.

## Files

- `card.tsx` — presentational card; renders the same whether it's draggable or static
- `draggable-card.tsx` — wraps `Card` with dnd-kit's `useDraggable`
- `column.tsx` — a drop target (`useDroppable`) that lists its items
- `board.tsx` — `DndContext` + one `Column` per column + drag-end → move handler
- `use-board-state.ts` — optimistic move-with-rollback state hook (e.g. for a Supabase-backed board)

## Using it elsewhere

1. Copy this folder into the target project.
2. `npm install @dnd-kit/core`
3. Swap the `@/*` alias usage — there is none; imports here are relative — but double check Tailwind classes match the target project's design tokens.
4. Wire it up:

```tsx
import { Board } from "./board";
import { useBoardState } from "./use-board-state";

const { items, moveItem } = useBoardState({
  initialItems,
  getColumnId: (item) => item.columnId ?? "unassigned",
  setColumnId: (item, columnId) => ({
    ...item,
    columnId: columnId === "unassigned" ? null : columnId,
  }),
  persist: async (itemId, columnId) => {
    const { error } = await supabase
      .from("items")
      .update({ column_id: columnId === "unassigned" ? null : columnId })
      .eq("id", itemId);
    return { error: error?.message };
  },
});

<Board
  columns={[{ id: "unassigned", label: "Unassigned" }, ...columns]}
  items={items}
  getItemColumnId={(item) => item.columnId ?? "unassigned"}
  renderItemContent={(item) => <p>{item.name}</p>}
  onMoveItem={moveItem}
/>;
```

Mobile/touch note: the original board only enabled this on desktop
(`md:` breakpoint) and used a plain stacked list with no drag on mobile,
since `useDraggable`'s default pointer sensor is awkward on touch without
extra tuning (long-press activation constraints, `TouchSensor`, etc.).
Budget for that if you want drag-and-drop on mobile too.
