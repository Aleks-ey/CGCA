"use client";

import { useEffect, useState, useTransition } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import type { Database } from "@/types/supabase";

type VolunteerRole = Database["public"]["Tables"]["volunteer_roles"]["Row"];

interface VolunteerRolesManagerProps {
  eventId: number;
}

export function VolunteerRolesManager({ eventId }: VolunteerRolesManagerProps) {
  const supabase = useSupabase();
  const [roles, setRoles] = useState<VolunteerRole[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("volunteer_roles")
      .select("*")
      .eq("event_id", eventId)
      .order("sort_order")
      .then(({ data }) => {
        if (!cancelled) setRoles(data ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [supabase, eventId]);

  function addRole() {
    if (!newLabel.trim()) return;
    setError(null);
    startTransition(async () => {
      const { data, error: dbError } = await supabase
        .from("volunteer_roles")
        .insert({
          event_id: eventId,
          label: newLabel.trim(),
          sort_order: roles.length,
        })
        .select()
        .single();

      if (dbError) {
        setError(dbError.message);
        return;
      }

      setRoles((prev) => [...prev, data]);
      setNewLabel("");
    });
  }

  function removeRole(roleId: number) {
    setError(null);
    startTransition(async () => {
      const { error: dbError } = await supabase
        .from("volunteer_roles")
        .delete()
        .eq("id", roleId);

      if (dbError) {
        setError(dbError.message);
        return;
      }

      setRoles((prev) => prev.filter((r) => r.id !== roleId));
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-gray-200 p-3">
      <p className="text-sm font-medium text-gray-700">
        Preferred roles (optional)
      </p>
      <p className="text-xs text-gray-500">
        If you add roles here, volunteers will be able to pick one on the public
        signup form.
      </p>

      {roles.length > 0 && (
        <ul className="flex flex-col gap-1">
          {roles.map((role) => (
            <li
              key={role.id}
              className="flex items-center justify-between rounded border border-gray-200 px-2 py-1 text-sm"
            >
              <span>{role.label}</span>
              <button
                type="button"
                onClick={() => removeRole(role.id)}
                disabled={isPending}
                className="text-xs text-red-600 hover:underline disabled:opacity-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* A plain div, not a <form> — this component is rendered inside
          EventForm's own <form>, and HTML doesn't allow nested forms. */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addRole();
            }
          }}
          placeholder="e.g. Setup crew"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addRole}
          disabled={isPending || !newLabel.trim()}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-[var(--color-prussian-blue)] disabled:opacity-50"
        >
          Add role
        </button>
      </div>
    </div>
  );
}
