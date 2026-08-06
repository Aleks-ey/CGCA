import JSZip from "jszip";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp)$/i;

/** Extracts image entries from a zip file as browser Files, skipping non-images and macOS metadata folders. */
export async function extractImagesFromZip(zipFile: File): Promise<File[]> {
  const zip = await JSZip.loadAsync(zipFile);
  const entries = Object.values(zip.files).filter(
    (f) => !f.dir && IMAGE_EXT.test(f.name) && !f.name.startsWith("__MACOSX")
  );

  const files: File[] = [];
  for (const entry of entries) {
    const blob = await entry.async("blob");
    const name = entry.name.split("/").pop() ?? entry.name;
    files.push(new File([blob], name, { type: blob.type || "image/*" }));
  }
  return files;
}
