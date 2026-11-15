"use server";

import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const UPLOADS_PER_HOUR = 40;

export async function uploadImageToImgBB(formData: FormData): Promise<{ url?: string; error?: string }> {
  // Server actions are public endpoints: without this, anyone could host files on our
  // ImgBB key and burn its quota.
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: "Sesi login habis. Muat ulang halaman lalu masuk lagi." };
  }

  const limit = await rateLimit(`imgup:${userId}`, UPLOADS_PER_HOUR, 3600);
  if (!limit.ok) {
    return { error: "Terlalu banyak upload dalam satu jam. Coba lagi nanti." };
  }

  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "File tidak ditemukan." };
    }
    // The client checks too, but only the server's check counts.
    if (!ALLOWED_TYPES.has(file.type)) {
      return { error: "Format harus PNG, JPG, WEBP, atau GIF." };
    }
    if (file.size > MAX_BYTES) {
      return { error: "Ukuran gambar maksimal 4MB." };
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error("IMGBB_API_KEY is not configured");
      return { error: "Upload gambar sedang tidak tersedia. Hubungi admin." };
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append("key", apiKey);
    imgbbFormData.append("image", file);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbFormData,
      signal: AbortSignal.timeout(30_000),
    });

    const data = await response.json().catch(() => null);
    if (data?.success && typeof data.data?.url === "string") {
      return { url: data.data.url };
    }
    console.error("ImgBB Error:", data);
    return { error: "Gagal mengunggah ke penyimpanan gambar. Coba lagi." };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Koneksi ke penyimpanan gambar terputus. Coba lagi." };
  }
}
