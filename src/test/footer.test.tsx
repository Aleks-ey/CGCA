import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "@/components/layout/footer";

describe("Footer", () => {
  it("renders org info", () => {
    render(<Footer />);
    expect(
      screen.getAllByText(/Colorado Georgian Community Association/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Denver, CO/i)).toBeInTheDocument();
  });

  it("renders nav sections", () => {
    render(<Footer />);
    expect(screen.getByText("INFO")).toBeInTheDocument();
    expect(screen.getByText("CONTACT")).toBeInTheDocument();
    expect(screen.getByText("SOCIALS")).toBeInTheDocument();
  });

  it("has accessible social links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /facebook/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /instagram/i })
    ).toBeInTheDocument();
  });

  it("social links open in new tab", () => {
    render(<Footer />);
    const fbLink = screen.getByRole("link", { name: /facebook/i });
    expect(fbLink).toHaveAttribute("target", "_blank");
    expect(fbLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
