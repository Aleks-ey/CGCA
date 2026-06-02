import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountClient } from "./account-client";
import { signOut } from "@/app/account-login/actions";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/account-login");

  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex flex-col px-6 md:px-16 py-12 gap-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1
          className="text-3xl font-bold text-[var(--color-prussian-blue)]"
          style={{ fontFamily: "var(--font-merriweather)" }}
        >
          My Account
        </h1>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-[var(--color-rojo-red)] underline"
          >
            Sign Out
          </button>
        </form>
      </div>

      <AccountClient
        userId={user.id}
        profile={profile ?? { id: user.id, email: user.email ?? "", name: "", phone_number: "" }}
      />
    </div>
  );
}
