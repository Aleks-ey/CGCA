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
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12 md:px-16">
      <div className="flex items-center justify-between">
        <h1 className="h12">My Account</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-gray-500 underline hover:text-[var(--color-rojo-red)]"
          >
            Sign Out
          </button>
        </form>
      </div>

      <AccountClient
        userId={user.id}
        profile={
          profile ?? {
            id: user.id,
            email: user.email ?? "",
            name: "",
            phone_number: "",
          }
        }
      />
    </div>
  );
}
