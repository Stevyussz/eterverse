import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  // Only authenticated owners can generate an upload signature
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);

  // These params MUST match exactly what the client sends to Cloudinary
  // Cloudinary will verify the signature against these params
  const paramsToSign = {
    timestamp,
    folder: "eterverse/trailers",
    // Transformation: f_auto + q_auto + limit width to 720px for card UX
    // eager transformations bake the optimized version at upload time
    eager: "c_limit,w_750,f_auto,q_auto",
    eager_async: "true",
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    folder: "eterverse/trailers",
    eager: "c_limit,w_720,f_auto,q_auto",
    eager_async: "true",
  });
}
