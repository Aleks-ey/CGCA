import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

describe("ScrollToTop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  it("is not visible when scrollY is 0", () => {
    render(<ScrollToTop />);
    expect(
      screen.queryByRole("button", { name: /scroll to top/i })
    ).not.toBeInTheDocument();
  });

  it("becomes visible after scrolling past 400px", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "scrollY", {
        value: 500,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(
      screen.getByRole("button", { name: /scroll to top/i })
    ).toBeInTheDocument();
  });

  it("calls window.scrollTo when clicked", async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;

    render(<ScrollToTop />);
    act(() => {
      Object.defineProperty(window, "scrollY", {
        value: 500,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    const btn = screen.getByRole("button", { name: /scroll to top/i });
    await userEvent.click(btn);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
