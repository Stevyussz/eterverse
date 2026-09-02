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
        <h1 className="text-3xl font-display font-semibold text-eter-starlight">Widget Generator</h1>
        <p className="text-zinc-500 font-body mt-1">Embed your live player count on your website to rank higher.</p>
      </header>

      {myServers.length === 0 ? (
        <div className="p-16 border border-white/5 border-l-2 border-l-eter-cyan bg-[#050505]/60 text-center text-zinc-400 rounded-sm">
          You need an approved server to generate a widget.
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {myServers.map((server: any) => (
            <div key={server.slug} className="flex flex-col gap-6 p-8 bg-[#09090b]/80 border-l-2 border-l-eter-cyan border-y border-r border-white/10 rounded-sm shadow-sm">
              <h2 className="text-xl font-display font-semibold text-eter-starlight flex items-center gap-2">
                <Code size={24} className="text-eter-cyan" />
                {server.name}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Embed Code */}
                <div>
                   <EmbedWidget serverSlug={server.slug} />
                </div>
                
                {/* Right: Preview */}
                <div className="bg-black/80 border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden rounded-sm">
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 text-zinc-600">
                    <Eye size={16} /> <span className="text-[10px] font-mono uppercase tracking-widest">Live Preview</span>
                  </div>
                  <img src={`/api/widget/${server.slug}`} alt="Widget Preview" className="mt-8 rounded-sm shadow-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
