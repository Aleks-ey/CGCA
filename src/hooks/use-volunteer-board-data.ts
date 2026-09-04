"use client";

import { useEffect, useState } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useSupabase } from "@/hooks/use-supabase";
import type { Database } from "@/types/supabase";

type VolunteerSignup = Database["public"]["Tables"]["volunteer_signups"]["Row"];
type VolunteerOrgRole =
  Database["public"]["Tables"]["volunteer_org_roles"]["Row"];
type VolunteerTag = Database["public"]["Tables"]["volunteer_tags"]["Row"];
type VolunteerSignupTag =
  Database["public"]["Tables"]["volunteer_signup_tags"]["Row"];

interface UseVolunteerBoardDataArgs {
  eventId: number;
  initialSignups: VolunteerSignup[];
  initialOrgRoles: VolunteerOrgRole[];
  initialTags: VolunteerTag[];
  initialSignupTags: VolunteerSignupTag[];
}

const UNASSIGNED_ID = "unassigned";

function mergeChange<T extends { id: number }>(
  prev: T[],
  payload: RealtimePostgresChangesPayload<T>
): T[] {
  if (payload.eventType === "DELETE") {
    const oldId = (payload.old as Partial<T>).id;
    if (oldId == null) return prev;
    return prev.filter((row) => row.id !== oldId);
  }

  const newRow = payload.new as T;
  const exists = prev.some((row) => row.id === newRow.id);
  return exists
    ? prev.map((row) => (row.id === newRow.id ? newRow : row))
    : [...prev, newRow];
}

function mergeInsertMany<T extends { id: number }>(prev: T[], rows: T[]): T[] {
  const byId = new Map(prev.map((row) => [row.id, row]));
  for (const row of rows) byId.set(row.id, row);
  return Array.from(byId.values());
}

export function useVolunteerBoardData({
  eventId,
  initialSignups,
  initialOrgRoles,
  initialTags,
  initialSignupTags,
}: UseVolunteerBoardDataArgs) {
  const supabase = useSupabase();
  const [signups, setSignups] = useState(initialSignups ?? []);
  const [orgRoles, setOrgRoles] = useState(initialOrgRoles ?? []);
  const [tags, setTags] = useState(initialTags ?? []);
  const [signupTags, setSignupTags] = useState(initialSignupTags ?? []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`volunteer-board-${eventId}`)
      .on<VolunteerSignup>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "volunteer_signups",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => setSignups((prev) => mergeChange(prev, payload))
      )
      .on<VolunteerOrgRole>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "volunteer_org_roles",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => setOrgRoles((prev) => mergeChange(prev, payload))
      )
      .on<VolunteerTag>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "volunteer_tags",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => setTags((prev) => mergeChange(prev, payload))
      )
      .on<VolunteerSignupTag>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "volunteer_signup_tags",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => setSignupTags((prev) => mergeChange(prev, payload))
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, eventId]);

  async function moveSignup(signupId: number, overId: string) {
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

    setOrgRoles((prev) => mergeInsertMany(prev, [data]));
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

  async function addTag(label: string) {
    setError(null);
    const { data, error: dbError } = await supabase
      .from("volunteer_tags")
      .insert({ event_id: eventId, label })
      .select()
      .single();

    if (dbError) {
      setError(dbError.message);
      return null;
    }

    setTags((prev) => mergeInsertMany(prev, [data]));
    return data;
  }

  async function deleteTags(tagIds: number[]) {
    if (tagIds.length === 0) return;
    setError(null);
    const { error: dbError } = await supabase
      .from("volunteer_tags")
      .delete()
      .in("id", tagIds);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    const removed = new Set(tagIds);
    setTags((prev) => prev.filter((t) => !removed.has(t.id)));
    setSignupTags((prev) => prev.filter((st) => !removed.has(st.tag_id)));
  }

  async function applyTags(signupIds: number[], tagIds: number[]) {
    if (signupIds.length === 0 || tagIds.length === 0) return true;
    setError(null);

    const rows = signupIds.flatMap((volunteer_signup_id) =>
      tagIds.map((tag_id) => ({
        event_id: eventId,
        volunteer_signup_id,
        tag_id,
      }))
    );

    const { data, error: dbError } = await supabase
      .from("volunteer_signup_tags")
      .upsert(rows, {
        onConflict: "volunteer_signup_id,tag_id",
        ignoreDuplicates: true,
      })
      .select();

    if (dbError) {
      setError(dbError.message);
      return false;
    }

    if (data && data.length > 0) {
      setSignupTags((prev) => mergeInsertMany(prev, data));
    }
    return true;
  }

  return {
    signups,
    orgRoles,
    tags,
    signupTags,
    error,
    moveSignup,
    addOrgRole,
    deleteOrgRole,
    addTag,
    deleteTags,
    applyTags,
  };
}
