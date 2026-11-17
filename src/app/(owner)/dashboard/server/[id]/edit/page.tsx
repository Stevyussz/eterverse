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
    <div className="max-w-3xl mx-auto flex flex-col gap-8 px-pop pb-20">
      <header>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink-2 mb-3">
          <a href="/dashboard" className="hover:text-ink underline-offset-4 hover:underline">Dashboard</a>
          <span aria-hidden>/</span>
          <span className="text-ink">Edit server</span>
        </nav>
        <h1 className="px-title px-title-shadow text-3xl md:text-4xl text-ink">Edit server</h1>
        <p className="text-ink-2 mt-2 text-sm">
          Menyimpan perubahan mengembalikan status ke <span className="px-chip px-chip-gold !text-xs">Menunggu review</span> untuk ditinjau ulang admin.
        </p>
      </header>

      <div className="px-panel p-5 md:p-8">
        <ServerEditForm action={updateServer} server={serializedServer} />
      </div>
    </div>
  );
}
