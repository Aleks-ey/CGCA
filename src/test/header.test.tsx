import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Header } from "@/components/layout/header";

describe("Header", () => {
  it("renders the CGCA logo link", () => {
    render(<Header />);
    expect(
      screen.getByRole("link", {
        name: /colorado georgian community association/i,
      })
    ).toBeInTheDocument();
  });

  it("shows desktop nav links", () => {
    render(<Header />);
    expect(
      screen.getByRole("link", { name: /meet the board/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /events/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /gallery/i })).toBeInTheDocument();
  });

  it("hamburger button is accessible", () => {
    render(<Header />);
    const btn = screen.getByRole("button", { name: /open menu/i });
    expect(btn).toBeInTheDocument();
  });

  it("toggles mobile menu on hamburger click", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const btn = screen.getByRole("button", { name: /open menu/i });
    await user.click(btn);
    expect(
      screen.getByRole("navigation", { name: /mobile navigation/i })
    ).toBeInTheDocument();
  });
});
