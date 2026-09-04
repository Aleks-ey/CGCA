"use client";

import type { CSSProperties, ReactNode } from "react";

export interface CardProps<T> {
  item: T;
  renderContent: (item: T) => ReactNode;
  dragRef?: (node: HTMLElement | null) => void;
  dragStyle?: CSSProperties;
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
}

/**
 * Presentational card. Works with or without drag props, so the same
 * component renders a static list item (e.g. on mobile) or a draggable
 * one (via DraggableCard) without duplicating markup/styles.
 */
export function Card<T>({
  item,
  renderContent,
  dragRef,
  dragStyle,
  dragHandleProps,
  isDragging,
}: CardProps<T>) {
  const draggable = !!dragHandleProps;

  return (
    <div
      ref={dragRef}
      style={dragStyle}
      {...(draggable ? dragHandleProps : {})}
      className={`rounded-md border border-gray-200 bg-white p-2 text-sm ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      {renderContent(item)}
    </div>
  );
}
