import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import Link from "next/link";
import { ChartLineUp, Users, CursorClick, Clock, CheckCircle, Eye, PencilSimple, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { revalidatePath } from "next/cache";
import { DeleteServerButton } from "@/components/dashboard/DeleteServerButton";

export default async function DashboardOverview() {
  const session = await auth();
  
  await connectToDatabase();
  const ownerIdentifier = session?.user?.id;
  const myServers = await Server.find({ ownerId: ownerIdentifier }).lean();

  const hasServers = myServers.length > 0;

  // Aggregate real metrics from DB
  const totalImpressions = myServers.reduce((acc, s) => acc + (s.metrics?.impressions || 0), 0);
  const totalClicks = myServers.reduce((acc, s) => acc + (s.metrics?.clicks || 0), 0);
  const approvedCount = myServers.filter(s => s.moderationStatus === 'APPROVED').length;
  const pendingCount = myServers.filter(s => s.moderationStatus === 'PENDING').length;

  async function deleteMyServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await connectToDatabase();
    // Only delete if the user owns it
    await Server.findOneAndDelete({ _id: serverId, ownerId: session.user.id });
    revalidatePath("/dashboard");
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-eter-starlight">Dashboard Overview</h1>
          <p className="text-zinc-500 font-body mt-1 text-sm">Manage your Minecraft servers and monitor growth.</p>
        </div>
        
        <Link href="/dashboard/server/new" className="bg-eter-cyan text-black px-4 py-2 rounded-sm font-semibold text-sm hover:bg-cyan-300 transition-colors border-l-2 border-l-white border-y border-r border-transparent shrink-0">
          + Submit Server
        </Link>
      </header>

      {!hasServers ? (
        <div className="flex flex-col items-center justify-center p-16 mt-10 bg-[#050505]/60 border border-white/5 border-l-2 border-l-eter-cyan rounded-sm shadow-xl text-center">
          <div className="w-16 h-16 bg-eter-cyan/10 rounded-sm flex items-center justify-center mb-6 border border-eter-cyan/20">
            <ChartLineUp size={32} className="text-eter-cyan" />
          </div>
          <h2 className="text-2xl font-display font-medium text-eter-starlight mb-2">No Servers Yet</h2>
          <p className="text-zinc-400 font-body mb-8 max-w-md">
            You haven't added any servers to EterVerse yet. Submit your first server to start getting players!
          </p>
          <Link href="/dashboard/server/new" className="bg-eter-cyan text-black px-6 py-3 rounded-sm font-semibold hover:bg-cyan-300 transition-colors border-l-2 border-l-white border-y border-r border-transparent">
            Submit Your First Server
          </Link>
        </div>
      ) : (
        <>
          {/* Real Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Total Impressions" value={totalImpressions.toLocaleString()} icon={<Eye size={22} className="text-eter-cyan" />} />
            <MetricCard title="Total Clicks" value={totalClicks.toLocaleString()} icon={<CursorClick size={22} className="text-eter-cyan" />} />
            <MetricCard title="Live Servers" value={approvedCount.toString()} icon={<CheckCircle size={22} className="text-green-400" />} />
            <MetricCard title="Pending Review" value={pendingCount.toString()} icon={<Clock size={22} className="text-yellow-400" />} />
          </div>

          {/* Server List */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-display font-semibold text-eter-starlight border-b border-white/5 pb-3">Your Servers</h2>
            {myServers.map((server: any) => (
              <div key={server._id.toString()} className="flex flex-col gap-2">
                <div className="bg-[#09090b]/80 border border-white/10 rounded-sm p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-semibold text-eter-starlight truncate">{server.name}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        server.moderationStatus === 'APPROVED' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                        server.moderationStatus === 'REJECTED' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                        server.moderationStatus === 'BANNED' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
                        'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                      }`}>{server.moderationStatus}</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{server.ipAddress}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-zinc-400">
                      <span><Eye size={12} className="inline mr-1" />{server.metrics?.impressions || 0}</span>
                      <span><CursorClick size={12} className="inline mr-1" />{server.metrics?.clicks || 0}</span>
                      <span><Users size={12} className="inline mr-1" />{server.liveStatus?.currentPlayers || 0}</span>
                    </div>
                    <Link 
                      href={`/dashboard/server/${server._id.toString()}/edit`}
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-eter-cyan border border-white/10 hover:border-eter-cyan/30 px-3 py-1.5 rounded-sm transition-colors"
                    >
                      <PencilSimple size={14} /> Edit
                    </Link>
                    <DeleteServerButton serverId={server._id.toString()} deleteAction={deleteMyServer} />
                    {server.moderationStatus === 'APPROVED' && (
                      <Link 
                        href={`/server/${server.slug}`}
                        target="_blank"
                        className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-eter-starlight border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-sm transition-colors"
                      >
                        <Eye size={14} /> View
                      </Link>
                    )}
                  </div>
                </div>
                {server.moderationStatus === 'REJECTED' && server.rejectionReason && (
                  <div className="bg-red-500/5 border border-red-500/20 px-4 py-3 rounded-sm flex items-start gap-3">
                    <WarningCircle className="text-red-400 mt-0.5 shrink-0" size={16} weight="fill" />
                    <div>
                      <p className="text-xs font-semibold text-red-400 mb-0.5">Penolakan Admin</p>
                      <p className="text-xs text-red-300/80 leading-relaxed">{server.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        </>
      )}

    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[#09090b]/80 backdrop-blur-sm border-l-2 border-l-eter-cyan border-y border-r border-white/10 p-4 shadow-sm rounded-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-tight">{title}</h3>
        {icon}
      </div>
      <span className="text-2xl font-display font-semibold text-eter-starlight">{value}</span>
    </div>
  );
}
