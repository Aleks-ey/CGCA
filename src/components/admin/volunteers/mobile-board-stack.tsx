"use client";

import { OrgRoleColumnBody } from "@/components/admin/volunteers/org-role-column-body";
import type { Database } from "@/types/supabase";

type VolunteerSignup = Database["public"]["Tables"]["volunteer_signups"]["Row"];
type VolunteerOrgRole =
  Database["public"]["Tables"]["volunteer_org_roles"]["Row"];

interface MobileBoardStackProps {
  signups: VolunteerSignup[];
  orgRoles: VolunteerOrgRole[];
  preferredRoleLabels: Map<number, string>;
  tagLabelsBySignup: Map<number, string[]>;
  selectMode: boolean;
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onMoveSignup: (signupId: number, overId: string) => void;
}

export function MobileBoardStack({
  signups,
  orgRoles,
  preferredRoleLabels,
  tagLabelsBySignup,
  selectMode,
  selectedIds,
  onToggleSelect,
  onMoveSignup,
}: MobileBoardStackProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <OrgRoleColumnBody
        label="Unassigned"
        signups={signups.filter((s) => s.assigned_org_role_id === null)}
        orgRoles={orgRoles}
        preferredRoleLabels={preferredRoleLabels}
        tagLabelsBySignup={tagLabelsBySignup}
        selectMode={selectMode}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
        onMoveSignup={onMoveSignup}
        className="w-full"
      />
      {orgRoles.map((role) => (
        <OrgRoleColumnBody
          key={role.id}
          label={role.label}
          signups={signups.filter((s) => s.assigned_org_role_id === role.id)}
          orgRoles={orgRoles}
          preferredRoleLabels={preferredRoleLabels}
          tagLabelsBySignup={tagLabelsBySignup}
          selectMode={selectMode}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
          onMoveSignup={onMoveSignup}
          className="w-full"
        />
      ))}
    </div>
  );
}
