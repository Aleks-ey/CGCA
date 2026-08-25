"use client";

import { useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useSupabase } from "@/hooks/use-supabase";
import { OrgRoleColumn } from "@/components/admin/volunteers/org-role-column";
import { AddOrgRoleForm } from "@/components/admin/volunteers/add-org-role-form";
import type { Database } from "@/types/supabase";

type VolunteerSignup = Database["public"]["Tables"]["volunteer_signups"]["Row"];
type VolunteerOrgRole =
  Database["public"]["Tables"]["volunteer_org_roles"]["Row"];
type VolunteerRole = Database["public"]["Tables"]["volunteer_roles"]["Row"];

interface VolunteerBoardProps {
  eventId: number;
  initialSignups: VolunteerSignup[];
  initialOrgRoles: VolunteerOrgRole[];
  preferredRoles: VolunteerRole[];
}

const UNASSIGNED_ID = "unassigned";

export function VolunteerBoard({
  eventId,
  initialSignups,
  initialOrgRoles,
  preferredRoles,
}: VolunteerBoardProps) {
  const supabase = useSupabase();
  const [signups, setSignups] = useState(initialSignups);
  const [orgRoles, setOrgRoles] = useState(initialOrgRoles);
  const [error, setError] = useState<string | null>(null);

  const preferredRoleLabels = new Map(
    preferredRoles.map((r) => [r.id, r.label])
  );

  async function handleDragEnd(event: DragEndEvent) {
    const signupId = Number(event.active.id);
    const overId = event.over?.id;
    if (!overId) return;

    const newOrgRoleId = overId === UNASSIGNED_ID ? null : Number(overId);
    const signup = signups.find((s) => s.id === signupId);
    if (!signup || signup.assigned_org_role_id === newOrgRoleId) return;

    const previous = signup.assigned_org_role_id;
    setSignups((prev) =>
      prev.map((s) =>
        s.id === signupId ? { ...s, assigned_org_role_id: newOrgRoleId } : s
      )
    );

    const { error: dbError } = await supabase
      .from("volunteer_signups")
      .update({ assigned_org_role_id: newOrgRoleId })
      .eq("id", signupId);

    if (dbError) {
      setError(dbError.message);
      setSignups((prev) =>
        prev.map((s) =>
          s.id === signupId ? { ...s, assigned_org_role_id: previous } : s
        )
      );
    }
  }

  async function addOrgRole(label: string) {
    setError(null);
    const { data, error: dbError } = await supabase
      .from("volunteer_org_roles")
      .insert({ event_id: eventId, label, sort_order: orgRoles.length })
      .select()
      .single();

    if (dbError) {
      setError(dbError.message);
      return;
    }

    setOrgRoles((prev) => [...prev, data]);
  }

  async function deleteOrgRole(roleId: number) {
    setError(null);
    const { error: dbError } = await supabase
      .from("volunteer_org_roles")
      .delete()
      .eq("id", roleId);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    setOrgRoles((prev) => prev.filter((r) => r.id !== roleId));
    setSignups((prev) =>
      prev.map((s) =>
        s.assigned_org_role_id === roleId
          ? { ...s, assigned_org_role_id: null }
          : s
      )
    );
  }

  if (signups.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No volunteers have signed up for this event yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <OrgRoleColumn
            droppableId={UNASSIGNED_ID}
            label="Unassigned"
            signups={signups.filter((s) => s.assigned_org_role_id === null)}
            preferredRoleLabels={preferredRoleLabels}
          />
          {orgRoles.map((role) => (
            <OrgRoleColumn
              key={role.id}
              droppableId={String(role.id)}
              label={role.label}
              signups={signups.filter(
                (s) => s.assigned_org_role_id === role.id
              )}
              preferredRoleLabels={preferredRoleLabels}
              onDelete={() => deleteOrgRole(role.id)}
            />
          ))}
          <AddOrgRoleForm onAdd={addOrgRole} />
        </div>
      </DndContext>
    </div>
  );
}
