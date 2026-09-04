"use client";

import type { ReactNode } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Column } from "./column";

export interface BoardColumn {
  id: string;
  label: string;
  onDelete?: () => void;
}

export interface BoardProps<T extends { id: number }> {
  columns: BoardColumn[];
  items: T[];
  getItemColumnId: (item: T) => string;
  renderItemContent: (item: T) => ReactNode;
  onMoveItem: (itemId: number, columnId: string) => void;
  disabled?: boolean;
}

/**
 * A horizontally-scrolling kanban board: one DndContext, one droppable
 * Column per entry in `columns`, one draggable Card per item.
 *
 * Usage sketch:
 *
 *   <Board
 *     columns={[{ id: "unassigned", label: "Unassigned" }, ...roles]}
 *     items={signups}
 *     getItemColumnId={(s) => s.assigned_role_id ?? "unassigned"}
 *     renderItemContent={(s) => <p>{s.name}</p>}
 *     onMoveItem={(id, columnId) => moveItem(id, columnId)}
 *   />
 */
export function Board<T extends { id: number }>({
  columns,
  items,
  getItemColumnId,
  renderItemContent,
  onMoveItem,
  disabled,
}: BoardProps<T>) {
  function handleDragEnd(event: DragEndEvent) {
    const overId = event.over?.id;
    if (!overId) return;
    onMoveItem(Number(event.active.id), String(overId));
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {columns.map((column) => (
          <Column
            key={column.id}
            columnId={column.id}
            label={column.label}
            items={items.filter((item) => getItemColumnId(item) === column.id)}
            renderItemContent={renderItemContent}
            onDelete={column.onDelete}
            disabled={disabled}
          />
        ))}
      </div>
    </DndContext>
  );
}
