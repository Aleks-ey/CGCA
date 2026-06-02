"use client";

import { useState, useTransition } from "react";
import { useSupabase } from "@/hooks/use-supabase";

interface UpdateAccountFormProps {
  userId: string;
  currentName: string;
  currentPhone: string;
  currentEmail: string;
  onUpdated?: () => void;
}

export function UpdateAccountForm({
  userId,
  currentName,
  currentPhone,
  currentEmail,
  onUpdated,
}: UpdateAccountFormProps) {
  const supabase = useSupabase();
  const [tab, setTab] = useState<"info" | "email" | "password">("info");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setError(null);
    setSuccess(null);
  }

  async function updateInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const phone = fd.get("phone") as string;
    startTransition(async () => {
      reset();
      const { error: err } = await supabase
        .from("profile")
        .update({ name, phone_number: phone })
        .eq("id", userId);
      if (err) setError(err.message);
      else {
        setSuccess("Profile updated.");
        onUpdated?.();
      }
    });
  }

  async function updateEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newEmail = fd.get("email") as string;
    startTransition(async () => {
      reset();
      const { error: err } = await supabase.auth.updateUser({ email: newEmail });
      if (err) setError(err.message);
      else setSuccess("Check your new email for a confirmation link.");
    });
  }

  async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPassword = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    startTransition(async () => {
      reset();
      const { error: err } = await supabase.auth.updateUser({ password: newPassword });
      if (err) setError(err.message);
      else setSuccess("Password updated.");
    });
  }

  const tabs = [
    { key: "info", label: "Profile Info" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
  ] as const;

  const inputClass =
    "rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-rojo-red)]";

  return (
    <div className="border rounded-xl p-6 flex flex-col gap-4">
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              reset();
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-[var(--color-prussian-blue)] text-white"
                : "border border-gray-300 text-gray-600 hover:border-[var(--color-prussian-blue)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "info" && (
        <form onSubmit={updateInfo} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
            <input id="name" name="name" type="text" defaultValue={currentName} required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
            <input id="phone" name="phone" type="tel" defaultValue={currentPhone} className={inputClass} />
          </div>
          <SubmitBtn pending={isPending} label="Save Changes" />
        </form>
      )}

      {tab === "email" && (
        <form onSubmit={updateEmail} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">New Email</label>
            <input id="email" name="email" type="email" defaultValue={currentEmail} required className={inputClass} />
          </div>
          <SubmitBtn pending={isPending} label="Update Email" />
        </form>
      )}

      {tab === "password" && (
        <form onSubmit={updatePassword} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</label>
            <input id="password" name="password" type="password" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm" className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input id="confirm" name="confirm" type="password" required className={inputClass} />
          </div>
          <SubmitBtn pending={isPending} label="Update Password" />
        </form>
      )}

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {success && <p role="status" className="text-sm text-green-600">{success}</p>}
    </div>
  );
}

function SubmitBtn({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[var(--color-rojo-red)] py-2 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
