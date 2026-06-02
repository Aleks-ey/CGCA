"use client";

import { useRouter } from "next/navigation";
import { UpdateAccountForm } from "@/components/account/update-account-form";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profile"]["Row"];

interface AccountClientProps {
  userId: string;
  profile: Profile;
}

export function AccountClient({ userId, profile }: AccountClientProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="mb-4 text-xl font-semibold text-[var(--color-prussian-blue)]">
          Account Info
        </h2>
        <div className="mb-4 flex flex-col gap-1 rounded-lg border p-4 text-sm text-gray-600">
          <p>
            <span className="font-medium">Name:</span> {profile.name || "—"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            {profile.phone_number || "—"}
          </p>
        </div>
        <UpdateAccountForm
          userId={userId}
          currentName={profile.name}
          currentPhone={profile.phone_number}
          currentEmail={profile.email}
          onUpdated={() => router.refresh()}
        />
      </section>
    </div>
  );
}
