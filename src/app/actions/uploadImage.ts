"use server";

export async function uploadImageToImgBB(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return { error: "ImgBB API key is missing. Server owner needs to configure IMGBB_API_KEY in .env.local" };
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    const imgbbFormData = new URLSearchParams();
    imgbbFormData.append("key", apiKey);
    imgbbFormData.append("image", base64Data);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: imgbbFormData.toString()
    });

    const data = await response.json();

    if (data.success) {
      return { url: data.data.url };
    } else {
      console.error("ImgBB Error:", data);
      return { error: data.error?.message || "Failed to upload image to ImgBB" };
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return { error: error.message || "An unexpected error occurred during upload" };
  }
}
