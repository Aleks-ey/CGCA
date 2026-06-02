import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroA } from "@/components/ui/hero-a";

describe("HeroA", () => {
  it("renders the title", () => {
    render(
      <HeroA title="Test Title" imageSrc="/test.jpg" imageAlt="Test image" />
    );
    expect(
      screen.getByRole("heading", { name: /test title/i })
    ).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <HeroA
        title="Title"
        description="Some description here"
        imageSrc="/test.jpg"
        imageAlt="Test"
      />
    );
    expect(screen.getByText(/some description here/i)).toBeInTheDocument();
  });

  it("renders a button link when buttonText and buttonHref provided", () => {
    render(
      <HeroA
        title="Title"
        buttonText="Learn More"
        buttonHref="/about"
        imageSrc="/test.jpg"
        imageAlt="Test"
      />
    );
    const link = screen.getByRole("link", { name: /learn more/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/about");
  });

  it("renders an image with correct alt text", () => {
    render(
      <HeroA title="Title" imageSrc="/test.jpg" imageAlt="Beautiful scenery" />
    );
    expect(screen.getByAltText("Beautiful scenery")).toBeInTheDocument();
  });

  it("omits the button when buttonText is not provided", () => {
    render(<HeroA title="Title" imageSrc="/test.jpg" imageAlt="Test" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
