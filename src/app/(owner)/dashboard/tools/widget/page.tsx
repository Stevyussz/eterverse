import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { EmbedWidget } from "@/components/server/EmbedWidget";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { DashHeader } from "@/components/dashboard/DashHeader";
import { Sprite } from "@/components/pixel/PixelArt";
import Link from "next/link";

export default async function WidgetToolsPage() {
  const session = await auth();
  
  await connectToDatabase();
  const ownerIdentifier = session?.user?.id;
  const myServers = await Server.find({ ownerId: ownerIdentifier, moderationStatus: 'APPROVED' }).lean();

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 px-pop pb-20">
      <DashHeader title="Widget status" sprite="monitor">
        Pasang kartu status live servermu (online, jumlah pemain) di website, forum, atau Discord.
      </DashHeader>

      {myServers.length === 0 ? (
        <div className="px-panel p-10 text-center flex flex-col items-center gap-3">
          <Sprite name="monitor" size={56} />
          <p className="text-ink-2">Widget tersedia setelah server kamu disetujui admin.</p>
          <Link href="/dashboard" className="px-btn px-btn-cream">Ke dashboard</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {myServers.map((server: any) => (
            <div key={server.slug} className="px-panel p-5 sm:p-8 flex flex-col gap-6">
              <h2 className="px-title text-2xl text-ink">{server.name}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EmbedWidget serverSlug={server.slug} />
                <div className="px-slot p-6 flex flex-col items-center justify-center gap-4">
                  <span className="self-start px-chip">
                    <PixelIcon name="eye" size={12} /> Pratinjau langsung
                  </span>
                  <img src={`/api/widget/${server.slug}`} alt={`Widget status ${server.name}`} className="max-w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
