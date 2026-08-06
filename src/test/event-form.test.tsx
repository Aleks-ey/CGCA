import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventForm } from "@/components/admin/event-form";

const insertMock = vi.fn();
const eqMock = vi.fn();
const updateMock = vi.fn(() => ({ eq: eqMock }));
const uploadMock = vi.fn();
const getPublicUrlMock = vi.fn(() => ({
  data: { publicUrl: "https://cdn.test/image.jpg" },
}));

vi.mock("@/hooks/use-supabase", () => ({
  useSupabase: () => ({
    from: vi.fn(() => ({ insert: insertMock, update: updateMock })),
    storage: {
      from: vi.fn(() => ({
        upload: uploadMock,
        getPublicUrl: getPublicUrlMock,
      })),
    },
  }),
}));

async function fillRequiredFields(
  user: ReturnType<typeof userEvent.setup>,
  overrides?: { title?: string; description?: string }
) {
  await user.type(
    screen.getByLabelText(/^title/i),
    overrides?.title ?? "New Event"
  );
  await user.type(
    screen.getByLabelText(/^description/i),
    overrides?.description ?? "A description"
  );
  await user.type(screen.getByLabelText(/^date/i), "2026-08-01");
  await user.type(screen.getByLabelText(/start time/i), "18:00");
}

describe("EventForm", () => {
  beforeEach(() => {
    insertMock.mockReset().mockResolvedValue({ error: null });
    eqMock.mockReset().mockResolvedValue({ error: null });
    uploadMock.mockReset().mockResolvedValue({ error: null });
  });

  it("blocks submit when required fields are only whitespace", async () => {
    // Title/description/start time have HTML `required`, which already
    // blocks a fully empty submit natively — this exercises the custom
    // .trim() check that catches whitespace-only input, which HTML's
    // required attribute alone would let through.
    const onSaved = vi.fn();
    const user = userEvent.setup();
    render(<EventForm mode="create" onSaved={onSaved} />);

    await fillRequiredFields(user, { title: "  ", description: "  " });
    await user.click(screen.getByRole("button", { name: /add event/i }));

    expect(
      await screen.findByText(/title, description, and date are required/i)
    ).toBeInTheDocument();
    expect(insertMock).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it("pre-fills fields from initialEvent in edit mode", () => {
    render(
      <EventForm
        mode="edit"
        initialEvent={{
          id: 1,
          title: "Existing Event",
          description: "Existing description",
          date: "2026-05-01",
          start_time: "17:00",
          end_time: "20:00",
          location: "CGCA Community Hall",
          cta_url: null,
          image_url: "https://example.com/existing.jpg",
          created_at: "2026-01-01T00:00:00Z",
        }}
        onSaved={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue("Existing Event")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Existing description")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("CGCA Community Hall")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save changes/i })
    ).toBeInTheDocument();
  });

  it("calls insert (not update) when submitting in create mode", async () => {
    const onSaved = vi.fn();
    const user = userEvent.setup();
    render(<EventForm mode="create" onSaved={onSaved} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /add event/i }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));
    expect(updateMock).not.toHaveBeenCalled();
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(insertMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({ start_time: "18:00", end_time: null })
    );
  });

  it("calls update().eq() (not insert) when submitting in edit mode", async () => {
    const onSaved = vi.fn();
    const user = userEvent.setup();
    render(
      <EventForm
        mode="edit"
        initialEvent={{
          id: 42,
          title: "Existing Event",
          description: "Existing description",
          date: "2026-05-01",
          start_time: "17:00",
          end_time: null,
          location: "",
          cta_url: null,
          image_url: "",
          created_at: "2026-01-01T00:00:00Z",
        }}
        onSaved={onSaved}
      />
    );

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => expect(updateMock).toHaveBeenCalledTimes(1));
    expect(eqMock).toHaveBeenCalledWith("id", 42);
    expect(insertMock).not.toHaveBeenCalled();
    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it("surfaces a database error via role=alert instead of failing silently", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "insert failed" } });
    const user = userEvent.setup();
    render(<EventForm mode="create" onSaved={vi.fn()} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /add event/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("insert failed");
  });
});
