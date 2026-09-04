"use client";

import { useState } from "react";

interface AddOrgRoleFormProps {
  onAdd: (label: string) => void;
  disabled?: boolean;
}

export function AddOrgRoleForm({ onAdd, disabled }: AddOrgRoleFormProps) {
  const [label, setLabel] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd(label.trim());
    setLabel("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-72 shrink-0 gap-2">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="e.g. Morning shift"
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={disabled || !label.trim()}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-[var(--color-prussian-blue)] disabled:opacity-50"
      >
        Add bucket
      </button>
    </form>
  );
}
