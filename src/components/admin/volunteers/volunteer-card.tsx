"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { Database } from "@/types/supabase";

type VolunteerSignup = Database["public"]["Tables"]["volunteer_signups"]["Row"];

interface VolunteerCardProps {
  signup: VolunteerSignup;
  preferredRoleLabel: string | null;
}

export function VolunteerCard({
  signup,
  preferredRoleLabel,
}: VolunteerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: signup.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => setExpanded((v) => !v)}
      className={`flex cursor-grab flex-col gap-1 rounded-md border border-gray-200 bg-white p-2 text-sm active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <p className="font-medium text-gray-900">{signup.name}</p>
      <p className="text-xs text-gray-600">{signup.email}</p>
      {signup.phone && <p className="text-xs text-gray-600">{signup.phone}</p>}
      {preferredRoleLabel && (
        <span className="w-fit rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
          Preferred: {preferredRoleLabel}
        </span>
      )}
      {signup.notes && (
        <p
          className={`text-xs text-gray-500 ${expanded ? "" : "line-clamp-2"}`}
        >
          {signup.notes}
        </p>
      )}
    </div>
  );
}
