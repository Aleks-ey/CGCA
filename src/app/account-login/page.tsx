import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Sign In" };

export default function AccountLoginPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="text-center">
          <h1
            className="text-3xl font-bold text-[var(--color-prussian-blue)]"
            style={{ fontFamily: "var(--font-merriweather)" }}
          >
            Sign In
          </h1>
          <p className="mt-2 text-gray-600">
            Access your CGCA community account.
          </p>
        </div>

        <LoginForm />

        <div className="flex flex-col gap-4 border-t pt-6">
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?
          </p>
          <RegisterSection />
          <div className="text-center">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterSection() {
  return (
    <details className="rounded-lg border">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-[var(--color-prussian-blue)] select-none">
        Create a new account ▸
      </summary>
      <div className="px-4 pb-4">
        <RegisterForm />
      </div>
    </details>
  );
}
