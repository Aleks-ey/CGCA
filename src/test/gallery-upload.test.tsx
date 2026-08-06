import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GalleryUpload } from "@/components/gallery/gallery-upload";

const uploadMock = vi.fn();
const getPublicUrlMock = vi.fn((path: string) => ({
  data: { publicUrl: `https://cdn.test/${path}` },
}));
const galleryInsertMock = vi.fn();
const storageListMock = vi.fn();

vi.mock("@/hooks/use-supabase", () => ({
  useSupabase: () => ({
    from: vi.fn((table: string) => {
      if (table === "gallery") return { insert: galleryInsertMock };
      throw new Error(`unexpected table ${table}`);
    }),
    storage: {
      from: vi.fn(() => ({
        upload: uploadMock,
        getPublicUrl: getPublicUrlMock,
        list: storageListMock,
      })),
    },
  }),
}));

function makeImageFile(name: string) {
  return new File(["fake-image-bytes"], name, { type: "image/png" });
}

describe("GalleryUpload", () => {
  beforeEach(() => {
    uploadMock.mockReset().mockResolvedValue({ error: null });
    galleryInsertMock.mockReset().mockResolvedValue({ error: null });
    storageListMock.mockReset().mockResolvedValue({
      data: [{ name: "Summer Gathering", id: null }],
    });
  });

  it("calls onUploaded after a successful upload (regression: prop must be onUploaded)", async () => {
    const onUploaded = vi.fn();
    const user = userEvent.setup();
    render(<GalleryUpload onUploaded={onUploaded} />);

    await screen.findByRole("option", { name: "Summer Gathering" });
    await user.selectOptions(screen.getByRole("combobox"), "Summer Gathering");

    const fileInput = document.getElementById(
      "gallery-files"
    ) as HTMLInputElement;
    await user.upload(fileInput, makeImageFile("photo.png"));

    await user.click(screen.getByRole("button", { name: /upload/i }));

    await vi.waitFor(() => expect(onUploaded).toHaveBeenCalledTimes(1));
    expect(uploadMock).toHaveBeenCalledTimes(1);
    expect(uploadMock.mock.calls[0][0]).toMatch(/^Summer Gathering\//);
    expect(galleryInsertMock).toHaveBeenCalledTimes(1);
    expect(galleryInsertMock.mock.calls[0][0]).toEqual([
      expect.objectContaining({ album: "Summer Gathering" }),
    ]);
  });

  it("uploads multiple selected images in one batch", async () => {
    const onUploaded = vi.fn();
    const user = userEvent.setup();
    render(<GalleryUpload onUploaded={onUploaded} />);

    await screen.findByRole("option", { name: "Summer Gathering" });
    await user.selectOptions(screen.getByRole("combobox"), "Summer Gathering");
    const fileInput = document.getElementById(
      "gallery-files"
    ) as HTMLInputElement;
    await user.upload(fileInput, [
      makeImageFile("a.png"),
      makeImageFile("b.png"),
    ]);

    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent === "✓ 2 image(s) selected and ready to upload."
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /upload/i }));

    await vi.waitFor(() => expect(onUploaded).toHaveBeenCalledTimes(1));
    expect(uploadMock).toHaveBeenCalledTimes(2);
    expect(galleryInsertMock.mock.calls[0][0]).toHaveLength(2);
  });

  it("disables submit until both an album and files are selected", async () => {
    render(<GalleryUpload onUploaded={vi.fn()} />);
    await screen.findByRole("option", { name: "Summer Gathering" });
    expect(screen.getByRole("button", { name: /upload/i })).toBeDisabled();
  });
});
