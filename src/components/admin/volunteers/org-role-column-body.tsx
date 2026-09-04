"use client";

import { VolunteerCard } from "@/components/admin/volunteers/volunteer-card";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/supabase";

type VolunteerSignup = Database["public"]["Tables"]["volunteer_signups"]["Row"];
type VolunteerOrgRole =
  Database["public"]["Tables"]["volunteer_org_roles"]["Row"];

interface OrgRoleColumnBodyProps {
  label: string;
  signups: VolunteerSignup[];
  orgRoles: VolunteerOrgRole[];
  preferredRoleLabels: Map<number, string>;
  tagLabelsBySignup: Map<number, string[]>;
  selectMode: boolean;
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onMoveSignup: (signupId: number, overId: string) => void;
  onDelete?: () => void;
  className?: string;
}

export function OrgRoleColumnBody({
  label,
  signups,
  orgRoles,
  preferredRoleLabels,
  tagLabelsBySignup,
  selectMode,
  selectedIds,
  onToggleSelect,
  onMoveSignup,
  onDelete,
  className,
}: OrgRoleColumnBodyProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-gray-200 p-3",
        className
      )}
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
            tagLabels={tagLabelsBySignup.get(signup.id) ?? []}
            selectMode={selectMode}
            selected={selectedIds.has(signup.id)}
            onToggleSelect={() => onToggleSelect(signup.id)}
            orgRoles={orgRoles}
            onMoveSignup={onMoveSignup}
          />
        ))}
      </div>
    </div>
  );
}
