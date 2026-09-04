"use client";

import { OrgRoleColumn } from "@/components/admin/volunteers/org-role-column";
import { AddOrgRoleForm } from "@/components/admin/volunteers/add-org-role-form";
import type { Database } from "@/types/supabase";

type VolunteerSignup = Database["public"]["Tables"]["volunteer_signups"]["Row"];
type VolunteerOrgRole =
  Database["public"]["Tables"]["volunteer_org_roles"]["Row"];

interface DesktopBoardProps {
  signups: VolunteerSignup[];
  orgRoles: VolunteerOrgRole[];
  preferredRoleLabels: Map<number, string>;
  tagLabelsBySignup: Map<number, string[]>;
  selectMode: boolean;
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onMoveSignup: (signupId: number, overId: string) => void;
  onAddOrgRole: (label: string) => void;
  onDeleteOrgRole: (roleId: number) => void;
}

export function DesktopBoard({
  signups,
  orgRoles,
  preferredRoleLabels,
  tagLabelsBySignup,
  selectMode,
  selectedIds,
  onToggleSelect,
  onMoveSignup,
  onAddOrgRole,
  onDeleteOrgRole,
}: DesktopBoardProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      <OrgRoleColumn
        label="Unassigned"
        signups={signups.filter((s) => s.assigned_org_role_id === null)}
        orgRoles={orgRoles}
        preferredRoleLabels={preferredRoleLabels}
        tagLabelsBySignup={tagLabelsBySignup}
        selectMode={selectMode}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
        onMoveSignup={onMoveSignup}
      />
      {orgRoles.map((role) => (
        <OrgRoleColumn
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
          onDelete={() => onDeleteOrgRole(role.id)}
        />
      ))}
      <AddOrgRoleForm onAdd={onAddOrgRole} />
    </div>
  );
}
