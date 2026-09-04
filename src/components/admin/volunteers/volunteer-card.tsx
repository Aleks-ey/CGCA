"use client";

import { useState } from "react";
import type { Database } from "@/types/supabase";

type VolunteerSignup = Database["public"]["Tables"]["volunteer_signups"]["Row"];
type VolunteerOrgRole =
  Database["public"]["Tables"]["volunteer_org_roles"]["Row"];

const UNASSIGNED_ID = "unassigned";

interface VolunteerCardProps {
  signup: VolunteerSignup;
  preferredRoleLabel: string | null;
  tagLabels: string[];
  selectMode: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  orgRoles: VolunteerOrgRole[];
  onMoveSignup: (signupId: number, overId: string) => void;
}

export function VolunteerCard({
  signup,
  preferredRoleLabel,
  tagLabels,
  selectMode,
  selected,
  onToggleSelect,
  orgRoles,
  onMoveSignup,
}: VolunteerCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      className="relative flex flex-col gap-1 rounded-md border border-gray-200 bg-white p-2 text-sm"
    >
      {!selectMode && (
        <select
          value={
            signup.assigned_org_role_id === null
              ? UNASSIGNED_ID
              : String(signup.assigned_org_role_id)
          }
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onMoveSignup(signup.id, e.target.value)}
          className="w-fit rounded-md border border-gray-300 bg-white px-1.5 py-0.5 text-xs text-gray-700"
        >
          <option value={UNASSIGNED_ID}>Unassigned</option>
          {orgRoles.map((role) => (
            <option key={role.id} value={String(role.id)}>
              {role.label}
            </option>
          ))}
        </select>
      )}
      {selectMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          aria-label={selected ? "Deselect volunteer" : "Select volunteer"}
          aria-pressed={selected}
          className={`absolute top-2 right-2 h-4 w-4 shrink-0 rounded-full border transition-colors ${
            selected
              ? "border-blue-400 bg-blue-300"
              : "border-gray-400 bg-transparent"
          }`}
        />
      )}
      <p className="pr-5 font-medium text-gray-900">{signup.name}</p>
      <p className="text-xs text-gray-600">{signup.email}</p>
      {signup.phone && <p className="text-xs text-gray-600">{signup.phone}</p>}
      {preferredRoleLabel && (
        <span className="w-fit rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
          Preferred: {preferredRoleLabel}
        </span>
      )}
      {tagLabels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tagLabels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700"
            >
              {label}
            </span>
          ))}
        </div>
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
