// Phone photos are often 3-8MB. Shrinking them in the browser before upload keeps them under
// the server action body limit and makes uploads usable on a slow mobile connection.

const MAX_EDGE = 1920;
const SKIP_BELOW_BYTES = 900 * 1024;

export async function compressImage(file: File): Promise<File> {
  // GIFs would lose animation through canvas; small files are not worth re-encoding.
  if (file.type === "image/gif" || file.size <= SKIP_BELOW_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    // PNGs with transparency (logos) stay PNG; everything else becomes WebP.
    const keepPng = file.type === "image/png" && width * height <= 1024 * 1024;
    const type = keepPng ? "image/png" : "image/webp";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + (keepPng ? ".png" : ".webp");
    return new File([blob], name, { type });
  } catch {
    // Unsupported decoder (old browser, HEIC): send the original and let the size check speak.
    return file;
  }
}
