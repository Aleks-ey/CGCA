import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { LoginForm } from "@/components/auth/login-form";

vi.mock("@/app/account-login/actions", () => ({
  signIn: vi.fn().mockResolvedValue({ error: null }),
}));

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("email field has type email", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
  });

  it("password field has type password", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("type", "password");
  });

  it("shows error message when signIn returns an error", async () => {
    const { signIn } = await import("@/app/account-login/actions");
    vi.mocked(signIn).mockResolvedValueOnce({ error: "Invalid credentials" });

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "test@test.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid credentials/i);
  });
});
