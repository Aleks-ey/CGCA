"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ConfirmDeleteTagsModal } from "@/components/admin/volunteers/confirm-delete-tags-modal";
import type { Database } from "@/types/supabase";

type VolunteerSignup = Database["public"]["Tables"]["volunteer_signups"]["Row"];
type VolunteerRole = Database["public"]["Tables"]["volunteer_roles"]["Row"];
type VolunteerTag = Database["public"]["Tables"]["volunteer_tags"]["Row"];

interface TagModalProps {
  open: boolean;
  onClose: () => void;
  signups: VolunteerSignup[];
  preferredRoles: VolunteerRole[];
  tags: VolunteerTag[];
  baseSelectedIds: Set<number>;
  onApplySuccess: () => void;
  addTag: (label: string) => Promise<VolunteerTag | null>;
  deleteTags: (tagIds: number[]) => Promise<void>;
  applyTags: (signupIds: number[], tagIds: number[]) => Promise<boolean>;
  showToast: (variant: "success" | "error", message: string) => void;
}

export function TagModal({
  open,
  onClose,
  signups,
  preferredRoles,
  tags,
  baseSelectedIds,
  onApplySuccess,
  addTag,
  deleteTags,
  applyTags,
  showToast,
}: TagModalProps) {
  const [roleChipAdditions, setRoleChipAdditions] = useState<
    Map<number, Set<number>>
  >(new Map());
  const [applyTagIds, setApplyTagIds] = useState<Set<number>>(new Set());
  const [editTagsOpen, setEditTagsOpen] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [addingTag, setAddingTag] = useState(false);
  const [tagsToDeleteIds, setTagsToDeleteIds] = useState<Set<number>>(
    new Set()
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  // Role-chip additions and the apply/delete selections are scoped to a
  // single modal session — reset each time it's opened, but baseSelectedIds
  // (card-driven) intentionally persists across opens/closes.
  useEffect(() => {
    if (open) {
      setRoleChipAdditions(new Map());
      setApplyTagIds(new Set());
      setEditTagsOpen(false);
      setNewTagLabel("");
      setTagsToDeleteIds(new Set());
    }
  }, [open]);

  const preferredRoleLabels = useMemo(
    () => new Map(preferredRoles.map((r) => [r.id, r.label])),
    [preferredRoles]
  );

  const usedRoles = useMemo(() => {
    const usedIds = new Set(
      signups
        .map((s) => s.preferred_role_id)
        .filter((id): id is number => id != null)
    );
    return preferredRoles.filter((r) => usedIds.has(r.id));
  }, [signups, preferredRoles]);

  const effectiveSelection = useMemo(() => {
    const ids = new Set(baseSelectedIds);
    for (const set of roleChipAdditions.values()) {
      for (const id of set) ids.add(id);
    }
    return ids;
  }, [baseSelectedIds, roleChipAdditions]);

  const selectedVolunteers = useMemo(
    () => signups.filter((s) => effectiveSelection.has(s.id)),
    [signups, effectiveSelection]
  );

  function toggleRoleChip(roleId: number) {
    setRoleChipAdditions((prev) => {
      const next = new Map(prev);
      if (next.has(roleId)) {
        next.delete(roleId);
      } else {
        const ids = new Set(
          signups.filter((s) => s.preferred_role_id === roleId).map((s) => s.id)
        );
        next.set(roleId, ids);
      }
      return next;
    });
  }

  function toggleApplyTag(tagId: number) {
    setApplyTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  }

  function toggleDeleteTag(tagId: number) {
    setTagsToDeleteIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  }

  async function handleAddTag() {
    const label = newTagLabel.trim();
    if (!label) return;
    setAddingTag(true);
    const created = await addTag(label);
    setAddingTag(false);
    if (!created) {
      showToast("error", "Could not create tag.");
      return;
    }
    setNewTagLabel("");
  }

  async function handleConfirmDeleteTags() {
    const ids = Array.from(tagsToDeleteIds);
    await deleteTags(ids);
    setTagsToDeleteIds(new Set());
    setConfirmDeleteOpen(false);
    showToast(
      "success",
      `Deleted ${ids.length} tag${ids.length === 1 ? "" : "s"}.`
    );
  }

  async function handleApply() {
    if (effectiveSelection.size === 0 || applyTagIds.size === 0) return;
    setApplying(true);
    const ok = await applyTags(
      Array.from(effectiveSelection),
      Array.from(applyTagIds)
    );
    setApplying(false);
    if (ok) {
      onApplySuccess();
      onClose();
      showToast("success", "Tags applied.");
    } else {
      showToast("error", "Could not apply tags.");
    }
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title="Manage Volunteer Tags">
        {usedRoles.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-gray-500">
              Add by preferred role:
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {usedRoles.map((role) => {
                const active = roleChipAdditions.has(role.id);
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => toggleRoleChip(role.id)}
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs whitespace-nowrap transition-colors ${
                      active
                        ? "border-[var(--color-prussian-blue)] bg-[var(--color-prussian-blue)] text-white"
                        : "border-gray-300 text-gray-600 hover:border-[var(--color-prussian-blue)]"
                    }`}
                  >
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-gray-500">
            Selected volunteers ({selectedVolunteers.length}):
          </p>
          {selectedVolunteers.length === 0 ? (
            <p className="text-sm text-gray-400">No volunteers selected.</p>
          ) : (
            <ul className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded-md border border-gray-200 p-2">
              {selectedVolunteers.map((s) => (
                <li key={s.id} className="text-sm text-gray-700">
                  {s.name}
                  {s.preferred_role_id != null && (
                    <span className="text-gray-400">
                      {" — "}
                      {preferredRoleLabels.get(s.preferred_role_id) ?? "—"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Tags:</p>
          <button
            type="button"
            onClick={() => setEditTagsOpen((v) => !v)}
            aria-pressed={editTagsOpen}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              editTagsOpen
                ? "bg-[var(--color-prussian-blue)] text-white"
                : "border border-gray-300 text-gray-600 hover:border-[var(--color-prussian-blue)]"
            }`}
          >
            Edit Tags
          </button>
        </div>

        <div
          className={`flex flex-col gap-3 overflow-hidden transition-[max-height] duration-200 ease-in-out ${
            editTagsOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2 rounded-md border border-gray-200 p-3">
            <input
              type="text"
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="e.g. Returning volunteer"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={addingTag || !newTagLabel.trim()}
              className="w-fit rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-[var(--color-prussian-blue)] disabled:opacity-50"
            >
              Add Tag
            </button>

            {tags.length > 0 && (
              <>
                <p className="mt-2 text-xs font-medium text-gray-500">
                  Existing tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const marked = tagsToDeleteIds.has(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleDeleteTag(tag.id)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                          marked
                            ? "border-[var(--color-rojo-red)] bg-[var(--color-rojo-red)] text-white"
                            : "border-gray-300 text-gray-600 hover:border-[var(--color-rojo-red)]"
                        }`}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={tagsToDeleteIds.size === 0}
                  className="w-fit rounded-md border border-[var(--color-rojo-red)] px-3 py-2 text-sm text-[var(--color-rojo-red)] hover:bg-[var(--color-rojo-red)] hover:text-white disabled:opacity-50"
                >
                  Delete Tag(s)
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {tags.length === 0 ? (
            <p className="text-sm text-gray-400">
              No tags yet — create one with Edit Tags above.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = applyTagIds.has(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleApplyTag(tag.id)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      active
                        ? "border-[var(--color-prussian-blue)] bg-[var(--color-prussian-blue)] text-white"
                        : "border-gray-300 text-gray-600 hover:border-[var(--color-prussian-blue)]"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={handleApply}
            disabled={
              applying ||
              effectiveSelection.size === 0 ||
              applyTagIds.size === 0
            }
            className="w-fit rounded-md bg-[var(--color-prussian-blue)] px-4 py-2 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
          >
            {applying ? "Applying…" : "Apply Tags"}
          </button>
        </div>
      </Modal>

      <ConfirmDeleteTagsModal
        open={confirmDeleteOpen}
        count={tagsToDeleteIds.size}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDeleteTags}
      />
    </>
  );
}
