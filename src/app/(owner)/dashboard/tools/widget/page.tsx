import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { EmbedWidget } from "@/components/server/EmbedWidget";
import { Code, Eye } from "@phosphor-icons/react/dist/ssr";

export default async function WidgetToolsPage() {
  const session = await auth();
  
  await connectToDatabase();
  const ownerIdentifier = session?.user?.id;
  const myServers = await Server.find({ ownerId: ownerIdentifier, moderationStatus: 'APPROVED' }).lean();

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      <header>
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white">Generator Widget Status</h1>
        <p className="text-zinc-400 font-body mt-1 text-sm">Pasang widget jumlah pemain real-time di website atau forum Anda untuk meningkatkan peringkat.</p>
      </header>

      {myServers.length === 0 ? (
        <div className="p-16 border border-zinc-800 bg-zinc-950/60 text-center text-zinc-400 rounded-2xl">
          Anda memerlukan server yang sudah disetujui untuk membuat widget embed.
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {myServers.map((server: any) => (
            <div key={server.slug} className="flex flex-col gap-6 p-6 sm:p-8 bg-zinc-950/70 border border-zinc-800 rounded-2xl shadow-xl">
              <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
                <Code size={24} className="text-zinc-300" />
                {server.name}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Embed Code */}
                <div>
                   <EmbedWidget serverSlug={server.slug} />
                </div>
                
                {/* Right: Preview */}
                <div className="bg-black border border-zinc-800 p-6 flex flex-col items-center justify-center relative overflow-hidden rounded-xl">
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 text-zinc-500">
                    <Eye size={16} /> <span className="text-[10px] font-mono uppercase tracking-widest">Pratinjau Langsung</span>
                  </div>
                  <img src={`/api/widget/${server.slug}`} alt="Widget Preview" className="mt-8 rounded-lg shadow-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
