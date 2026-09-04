"use client";

import type { ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card } from "./card";

export interface DraggableCardProps<T extends { id: number }> {
  item: T;
  renderContent: (item: T) => ReactNode;
  disabled?: boolean;
}

/** Wraps Card with dnd-kit's draggable behavior, keyed by item.id. */
export function DraggableCard<T extends { id: number }>({
  item,
  renderContent,
  disabled,
}: DraggableCardProps<T>) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id, disabled });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <Card
      item={item}
      renderContent={renderContent}
      dragRef={setNodeRef}
      dragStyle={style}
      dragHandleProps={{ ...attributes, ...listeners }}
      isDragging={isDragging}
    />
  );
}
