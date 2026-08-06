import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { extractImagesFromZip } from "@/lib/extract-zip-images";

async function buildZipFile(): Promise<File> {
  const zip = new JSZip();
  zip.file("photo1.jpg", "fake-jpg-bytes");
  zip.file("photo2.PNG", "fake-png-bytes");
  zip.file("notes.txt", "not an image");
  zip.file("__MACOSX/._photo1.jpg", "mac metadata");
  zip.folder("subfolder")?.file("nested.gif", "fake-gif-bytes");

  const blob = await zip.generateAsync({ type: "blob" });
  return new File([blob], "photos.zip", { type: "application/zip" });
}

describe("extractImagesFromZip", () => {
  it("only extracts real image entries, skipping non-images and __MACOSX metadata", async () => {
    const zipFile = await buildZipFile();
    const files = await extractImagesFromZip(zipFile);
    const names = files.map((f) => f.name).sort();

    expect(names).toEqual(["nested.gif", "photo1.jpg", "photo2.PNG"]);
  });
});
