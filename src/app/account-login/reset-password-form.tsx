"use client";

import { useState, useTransition } from "react";
import { resetPassword } from "./actions";

export function ResetPasswordForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      setError(null);
      const result = await resetPassword(fd);
      if (result?.error) setError(result.error);
      else setSuccess(true);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-500 underline hover:text-[var(--color-rojo-red)]"
      >
        Forgot your password?
      </button>
    );
  }

  if (success) {
    return (
      <p className="text-sm text-green-600">
        Check your email for a password reset link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
      <label
        htmlFor="reset-email"
        className="text-sm font-medium text-gray-700"
      >
        Enter your email to reset your password:
      </label>
      <input
        id="reset-email"
        name="email"
        type="email"
        required
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-rojo-red)] focus:outline-none"
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[var(--color-prussian-blue)] py-2 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Send Reset Link"}
      </button>
    </form>
  );
}
