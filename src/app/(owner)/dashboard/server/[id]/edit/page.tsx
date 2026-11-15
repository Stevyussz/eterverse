import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { redirect, notFound } from "next/navigation";
import { ServerEditForm } from "./ServerEditForm";
import { invalidateServerLists } from "@/lib/server-queries";
import { parseServerForm } from "@/lib/server-form";
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

  async function updateServer(formData: FormData): Promise<{ error: string } | void> {
    "use server";
    const session = await auth();
    const ownerIdentifier = session?.user?.id;
    if (!ownerIdentifier) return { error: "Sesi login habis. Masuk lagi lalu simpan ulang." };

    if (!mongoose.Types.ObjectId.isValid(id)) return { error: "Server tidak ditemukan." };

    await connectToDatabase();

    // Ensure ownership before allowing update
    const existing = await Server.findOne({ _id: id, ownerId: ownerIdentifier });
    if (!existing) return { error: "Server tidak ditemukan atau bukan milikmu." };

    const parsed = parseServerForm(formData, existing);
    if (!parsed.ok) return { error: parsed.error };

    // The slug is kept on edit: renaming must not break links already shared or indexed.
    await Server.findByIdAndUpdate(id, {
      ...parsed.data,
      // Reset to PENDING so admin can re-review significant changes
      moderationStatus: 'PENDING',
    });

    // Back to PENDING means it must leave the cached public lists now.
    invalidateServerLists();
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
          <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
          <span>/</span>
          <span className="text-zinc-400">Edit Server</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-white">Edit Server</h1>
        <p className="text-zinc-400 font-body mt-1 text-sm">
          Memperbarui rincian server akan mengembalikan status ke <span className="text-amber-400 font-semibold">MENUNGGU</span> untuk ditinjau ulang oleh tim kurasi.
        </p>
      </header>
      
      <div className="bg-zinc-950/70 border border-zinc-800 p-6 md:p-8 shadow-xl rounded-2xl">
        <ServerEditForm action={updateServer} server={serializedServer} />
      </div>
    </div>
  );
}
