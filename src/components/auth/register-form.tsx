"use client";

import { useState, useTransition } from "react";
import { signUp } from "@/app/account-login/actions";

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm_password") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (
      !/^\d{10}$/.test(
        (formData.get("phone_number") as string).replace(/\D/g, "")
      )
    ) {
      setError("Phone number must be 10 digits.");
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await signUp(formData);
      if (result?.error) setError(result.error);
      else onSuccess?.();
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-name" className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="reg-name"
          name="name"
          type="text"
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-rojo-red)] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="reg-phone"
          className="text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          id="reg-phone"
          name="phone_number"
          type="tel"
          required
          placeholder="10 digits"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-rojo-red)] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="reg-email"
          className="text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-rojo-red)] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="reg-password"
          className="text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-rojo-red)] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="reg-confirm"
          className="text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          id="reg-confirm"
          name="confirm_password"
          type="password"
          required
          autoComplete="new-password"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-rojo-red)] focus:outline-none"
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
        className="rounded-md bg-[var(--color-rojo-red)] py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-rojo-red)]/80 disabled:opacity-50"
      >
        {isPending ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
