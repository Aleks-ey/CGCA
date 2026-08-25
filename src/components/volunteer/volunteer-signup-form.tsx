"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSupabase } from "@/hooks/use-supabase";
import type { Database } from "@/types/supabase";

type VolunteerRole = Database["public"]["Tables"]["volunteer_roles"]["Row"];

interface VolunteerSignupFormProps {
  eventId: number;
  roles: VolunteerRole[];
}

export function VolunteerSignupForm({
  eventId,
  roles,
}: VolunteerSignupFormProps) {
  const supabase = useSupabase();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredRoleId, setPreferredRoleId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    startTransition(async () => {
      const { error: dbError } = await supabase
        .from("volunteer_signups")
        .insert({
          event_id: eventId,
          preferred_role_id: preferredRoleId ? Number(preferredRoleId) : null,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        });

      if (dbError) {
        setError(dbError.message);
        return;
      }

      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border p-5">
        <p className="font-medium text-gray-900">
          Thanks for signing up — we&apos;ll be in touch!
        </p>
        <Link
          href="/events"
          className="text-sm text-[var(--color-prussian-blue)] underline"
        >
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border p-5"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="volunteer-name"
          className="text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="volunteer-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="volunteer-email"
          className="text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="volunteer-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="volunteer-phone"
          className="text-sm font-medium text-gray-700"
        >
          Phone (optional)
        </label>
        <input
          id="volunteer-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {roles.length > 0 && (
        <div className="flex flex-col gap-1">
          <label
            htmlFor="volunteer-role"
            className="text-sm font-medium text-gray-700"
          >
            Preferred role (optional)
          </label>
          <select
            id="volunteer-role"
            value={preferredRoleId}
            onChange={(e) => setPreferredRoleId(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">No preference</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label
          htmlFor="volunteer-notes"
          className="text-sm font-medium text-gray-700"
        >
          Anything else we should know? (optional)
        </label>
        <textarea
          id="volunteer-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[var(--color-prussian-blue)] px-4 py-2 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Sign Up"}
      </button>
    </form>
  );
}
