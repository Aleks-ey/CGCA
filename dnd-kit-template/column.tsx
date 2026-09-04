"use client";

import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { DraggableCard } from "./draggable-card";

export interface ColumnProps<T extends { id: number }> {
  columnId: string;
  label: string;
  items: T[];
  renderItemContent: (item: T) => ReactNode;
  disabled?: boolean;
  onDelete?: () => void;
}

/** A drop target that lists the items assigned to it. */
export function Column<T extends { id: number }>({
  columnId,
  label,
  items,
  renderItemContent,
  disabled,
  onDelete,
}: ColumnProps<T>) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col gap-2 rounded-lg border border-gray-200 p-3 ${
        isOver ? "border-blue-400 bg-blue-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          {label} ({items.length})
        </h4>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-red-600 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <DraggableCard
            key={item.id}
            item={item}
            renderContent={renderItemContent}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
