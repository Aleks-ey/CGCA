import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { EventCard } from "@/components/events/event-card";

const fullEvent = {
  title: "Summer Gathering",
  description: "Annual celebration",
  date: "2026-07-15",
  start_time: "6:00 PM",
  end_time: null,
  location: "CGCA Community Hall",
  image_url: "https://example.com/photo.jpg",
  cta_url: null,
};

describe("EventCard", () => {
  it("renders title, description, location, and date/time line for a saved event", () => {
    render(<EventCard event={fullEvent} variant="vertical" />);
    expect(screen.getByText("Summer Gathering")).toBeInTheDocument();
    expect(screen.getByText("Annual celebration")).toBeInTheDocument();
    expect(screen.getByText("CGCA Community Hall")).toBeInTheDocument();
    expect(screen.getByText(/2026-07-15/)).toBeInTheDocument();
    expect(screen.getByText(/Starts at 6:00 PM/)).toBeInTheDocument();
  });

  it("shows a start–end time range when an end time is set", () => {
    render(
      <EventCard
        event={{ ...fullEvent, end_time: "9:00 PM" }}
        variant="vertical"
      />
    );
    expect(screen.getByText(/6:00 PM – 9:00 PM/)).toBeInTheDocument();
  });

  it("falls back to a placeholder for an empty in-progress draft date", () => {
    render(
      <EventCard
        event={{
          title: "",
          description: "",
          date: "",
          start_time: "",
          end_time: null,
          location: null,
          image_url: null,
          cta_url: null,
        }}
        variant="vertical"
      />
    );
    expect(screen.getByText("Select a date")).toBeInTheDocument();
    expect(screen.getByText("Untitled Event")).toBeInTheDocument();
  });

  it("does not render an image when image_url is missing", () => {
    render(
      <EventCard event={{ ...fullEvent, image_url: null }} variant="vertical" />
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows a Learn More CTA only when cta_url is set", () => {
    const { rerender } = render(
      <EventCard event={fullEvent} variant="vertical" />
    );
    expect(screen.queryByText(/Learn More/i)).not.toBeInTheDocument();

    rerender(
      <EventCard
        event={{ ...fullEvent, cta_url: "https://example.com/tickets" }}
        variant="vertical"
      />
    );
    const link = screen.getByText(/Learn More/i);
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute(
      "href",
      "https://example.com/tickets"
    );
  });

  it("renders the horizontal variant as a bordered row card", () => {
    render(<EventCard event={fullEvent} variant="horizontal" />);
    expect(screen.getByText("Summer Gathering")).toBeInTheDocument();
    expect(screen.queryByText(/Learn More/i)).not.toBeInTheDocument();
  });

  it("toggles expanded state when the card is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EventCard event={fullEvent} variant="vertical" />
    );
    const card = container.firstChild as HTMLElement;
    expect(screen.getByText(/Tap to read more/i)).toBeInTheDocument();

    await user.click(card);
    expect(screen.getByText(/Tap to collapse/i)).toBeInTheDocument();
  });
});
