"use client";

import { useMemo, useState } from "react";
import { useVolunteerBoardData } from "@/hooks/use-volunteer-board-data";
import { useToast, ToastStack } from "@/components/ui/toast";
import { DesktopBoard } from "@/components/admin/volunteers/desktop-board";
import { MobileBoardStack } from "@/components/admin/volunteers/mobile-board-stack";
import { TagSortRow } from "@/components/admin/volunteers/tag-sort-row";
import { SelectModeFab } from "@/components/admin/volunteers/select-mode-fab";
import { TagModal } from "@/components/admin/volunteers/tag-modal";
import type { Database } from "@/types/supabase";

type VolunteerSignup = Database["public"]["Tables"]["volunteer_signups"]["Row"];
type VolunteerOrgRole =
  Database["public"]["Tables"]["volunteer_org_roles"]["Row"];
type VolunteerRole = Database["public"]["Tables"]["volunteer_roles"]["Row"];
type VolunteerTag = Database["public"]["Tables"]["volunteer_tags"]["Row"];
type VolunteerSignupTag =
  Database["public"]["Tables"]["volunteer_signup_tags"]["Row"];

interface VolunteerBoardProps {
  eventId: number;
  initialSignups: VolunteerSignup[];
  initialOrgRoles: VolunteerOrgRole[];
  preferredRoles: VolunteerRole[];
  initialTags: VolunteerTag[];
  initialSignupTags: VolunteerSignupTag[];
}

export function VolunteerBoard({
  eventId,
  initialSignups,
  initialOrgRoles,
  preferredRoles,
  initialTags,
  initialSignupTags,
}: VolunteerBoardProps) {
  const {
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
  } = useVolunteerBoardData({
    eventId,
    initialSignups,
    initialOrgRoles,
    initialTags,
    initialSignupTags,
  });

  const { toasts, showToast, dismiss } = useToast();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [tagFilterIds, setTagFilterIds] = useState<Set<number>>(new Set());
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const preferredRoleLabels = useMemo(
    () => new Map(preferredRoles.map((r) => [r.id, r.label])),
    [preferredRoles]
  );

  const tagLabelsBySignup = useMemo(() => {
    const tagLabelById = new Map(tags.map((t) => [t.id, t.label]));
    const map = new Map<number, string[]>();
    for (const st of signupTags) {
      const label = tagLabelById.get(st.tag_id);
      if (!label) continue;
      const list = map.get(st.volunteer_signup_id) ?? [];
      list.push(label);
      map.set(st.volunteer_signup_id, list);
    }
    return map;
  }, [tags, signupTags]);

  const filteredSignups = useMemo(() => {
    if (tagFilterIds.size === 0) return signups;
    return signups.filter((s) =>
      signupTags.some(
        (st) => st.volunteer_signup_id === s.id && tagFilterIds.has(st.tag_id)
      )
    );
  }, [signups, signupTags, tagFilterIds]);

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleTagFilter(id: number) {
    setTagFilterIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectMode() {
    setSelectMode((prev) => {
      if (prev) setSelectedIds(new Set());
      return !prev;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <TagSortRow
        tags={tags}
        selectedTagIds={tagFilterIds}
        onToggle={toggleTagFilter}
      />

      {signups.length === 0 ? (
        <p className="text-sm text-gray-500">
          No volunteers have signed up for this event yet.
        </p>
      ) : (
        <>
          <div className="hidden md:block">
            <DesktopBoard
              signups={filteredSignups}
              orgRoles={orgRoles}
              preferredRoleLabels={preferredRoleLabels}
              tagLabelsBySignup={tagLabelsBySignup}
              selectMode={selectMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onMoveSignup={moveSignup}
              onAddOrgRole={addOrgRole}
              onDeleteOrgRole={deleteOrgRole}
            />
          </div>
          <div className="md:hidden">
            <MobileBoardStack
              signups={filteredSignups}
              orgRoles={orgRoles}
              preferredRoleLabels={preferredRoleLabels}
              tagLabelsBySignup={tagLabelsBySignup}
              selectMode={selectMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onMoveSignup={moveSignup}
            />
          </div>
        </>
      )}

      <SelectModeFab
        selectMode={selectMode}
        onToggleSelectMode={toggleSelectMode}
        onOpenTagModal={() => setTagModalOpen(true)}
        selectedCount={selectedIds.size}
      />

      <TagModal
        open={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        signups={signups}
        preferredRoles={preferredRoles}
        tags={tags}
        baseSelectedIds={selectedIds}
        onApplySuccess={() => setSelectedIds(new Set())}
        addTag={addTag}
        deleteTags={deleteTags}
        applyTags={applyTags}
        showToast={showToast}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
