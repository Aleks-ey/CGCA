"use client";

import { useDroppable } from "@dnd-kit/core";
import { VolunteerCard } from "@/components/admin/volunteers/volunteer-card";
import type { Database } from "@/types/supabase";

type VolunteerSignup = Database["public"]["Tables"]["volunteer_signups"]["Row"];

interface OrgRoleColumnProps {
  droppableId: string;
  label: string;
  signups: VolunteerSignup[];
  preferredRoleLabels: Map<number, string>;
  onDelete?: () => void;
}

export function OrgRoleColumn({
  droppableId,
  label,
  signups,
  preferredRoleLabels,
  onDelete,
}: OrgRoleColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[10rem] w-64 shrink-0 flex-col gap-2 rounded-lg border p-3 ${
        isOver
          ? "border-[var(--color-prussian-blue)] bg-blue-50"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          {label} ({signups.length})
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
        {signups.map((signup) => (
          <VolunteerCard
            key={signup.id}
            signup={signup}
            preferredRoleLabel={
              signup.preferred_role_id
                ? (preferredRoleLabels.get(signup.preferred_role_id) ?? null)
                : null
            }
          />
        ))}
      </div>
    </div>
  );
}
