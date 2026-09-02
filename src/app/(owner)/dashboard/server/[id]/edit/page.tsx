import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { redirect, notFound } from "next/navigation";
import { ServerEditForm } from "./ServerEditForm";
import mongoose from "mongoose";

type Props = { params: Promise<{ id: string }> };

export default async function EditServerPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  
  // Validate the id is a valid ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  await connectToDatabase();
  const server = await Server.findOne({ _id: id, ownerId: session?.user?.id }).lean() as any;

  if (!server) notFound(); // Also handles unauthorized (server belongs to someone else)

  async function updateServer(formData: FormData) {
    "use server";
    const session = await auth();
    const ownerIdentifier = session?.user?.id;
    if (!ownerIdentifier) throw new Error("Unauthorized");

    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid server ID");

    await connectToDatabase();

    // Ensure ownership before allowing update
    const existing = await Server.findOne({ _id: id, ownerId: ownerIdentifier });
    if (!existing) throw new Error("Server not found or unauthorized");

    const name = formData.get("name") as string;
    const ipAddress = formData.get("ipAddress") as string;
    const port = parseInt(formData.get("port") as string) || 25565;
    const description = formData.get("description") as string;
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];
    const videoUrl = formData.get("videoUrl") as string;
    const logoUrl = formData.get("logoUrl") as string || existing.logoUrl || "";
    const bannerUrl = formData.get("bannerUrl") as string || existing.bannerUrl || "";

    const galleryUrlsRaw = formData.get("galleryUrls") as string;
    const galleryUrls = galleryUrlsRaw
      ? galleryUrlsRaw.split(",").map(u => u.trim()).filter(Boolean)
      : existing.galleryUrls || [];

    await Server.findByIdAndUpdate(id, {
      name,
      ipAddress,
      port,
      description,
      tags,
      videoUrl,
      logoUrl,
      bannerUrl,
      galleryUrls,
      socialLinks: {
        discord: (formData.get("discordUrl") as string) || "",
        whatsapp: (formData.get("whatsappUrl") as string) || "",
        telegram: (formData.get("telegramUrl") as string) || "",
        website: (formData.get("websiteUrl") as string) || "",
      },
      // Reset to PENDING so admin can re-review significant changes
      moderationStatus: 'PENDING',
    });

    redirect("/dashboard");
  }

  // Serialize for client component
  const serializedServer = {
    ...server,
    _id: server._id.toString(),
    ownerId: server.ownerId?.toString(),
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      <header>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-3">
          <a href="/dashboard" className="hover:text-eter-cyan transition-colors">Dashboard</a>
          <span>/</span>
          <span className="text-zinc-400">Edit Server</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-eter-starlight">Edit Server</h1>
        <p className="text-zinc-500 font-body mt-1 text-sm">
          Updating your server will reset it to <span className="text-yellow-400 font-semibold">PENDING</span> for re-review.
        </p>
      </header>
      
      <div className="bg-[#050505]/60 backdrop-blur-sm border border-white/5 border-l-2 border-l-eter-cyan p-6 md:p-8 shadow-xl rounded-sm">
        <ServerEditForm action={updateServer} server={serializedServer} />
      </div>
    </div>
  );
}
