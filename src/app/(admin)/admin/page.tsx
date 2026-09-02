import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { CheckCircle, XCircle, Shield, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminModerationPage() {
  await connectToDatabase();
  
  const pendingServers = await Server.find({ moderationStatus: 'PENDING' }).lean();
  const approvedServers = await Server.find({ moderationStatus: 'APPROVED' }).lean();
  const rejectedServers = await Server.find({ moderationStatus: { $in: ['REJECTED', 'BANNED'] as any } }).lean();

  async function approveServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    await connectToDatabase();
    await Server.findByIdAndUpdate(serverId, { moderationStatus: 'APPROVED' });
    revalidatePath("/admin");
  }

  async function rejectServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    await connectToDatabase();
    await Server.findByIdAndUpdate(serverId, { moderationStatus: 'REJECTED' });
    revalidatePath("/admin");
  }

  async function banServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    await connectToDatabase();
    await Server.findByIdAndUpdate(serverId, { moderationStatus: 'BANNED' });
    revalidatePath("/admin");
  }

  const renderServerRow = (server: any, actions: React.ReactNode) => (
    <div key={server._id} className="bg-[#09090b]/80 border-l-2 border-l-eter-cyan border-y border-r border-white/10 p-6 flex flex-col md:flex-row justify-between gap-6 rounded-sm shadow-sm">
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-xl font-display font-semibold text-eter-starlight">{server.name}</h3>
          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
            server.moderationStatus === 'APPROVED' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
            server.moderationStatus === 'REJECTED' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
            server.moderationStatus === 'BANNED' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
            'text-zinc-400 border-white/20 bg-white/5'
          }`}>{server.moderationStatus}</span>
        </div>
        <span className="text-sm font-mono text-eter-cyan">{server.ipAddress}</span>
        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{server.description}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {server.tags?.map((tag: string) => (
            <span key={tag} className="text-[10px] font-mono px-2 py-0.5 border border-white/10 text-zinc-300">{tag}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-2 justify-start border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 shrink-0">
        {server.slug && (
          <Link href={`/server/${server.slug}`} target="_blank" className="flex items-center gap-2 bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 px-3 py-2 rounded-sm text-sm font-medium transition-colors w-full justify-center">
            <ArrowSquareOut size={16} /> View
          </Link>
        )}
        {actions}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 animate-fade-in pb-20">
      
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: pendingServers.length, color: "text-yellow-400" },
          { label: "Approved", value: approvedServers.length, color: "text-green-400" },
          { label: "Rejected/Banned", value: rejectedServers.length, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#09090b]/80 border border-white/10 rounded-sm p-4 text-center">
            <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Queue */}
      <section className="flex flex-col gap-4">
        <header>
          <h1 className="text-2xl font-display font-semibold text-eter-starlight">Moderation Queue</h1>
          <p className="text-zinc-500 font-body mt-1 text-sm">Review and approve new server submissions.</p>
        </header>

        {pendingServers.length === 0 ? (
          <div className="p-12 border border-white/5 border-l-2 border-l-eter-cyan bg-[#050505]/60 text-center text-zinc-400 rounded-sm text-sm">
            ✓ No pending servers. Queue is clear.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pendingServers.map((server: any) => renderServerRow(server, (
              <>
                <form action={approveServer}>
                  <input type="hidden" name="serverId" value={server._id.toString()} />
                  <button type="submit" className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 px-3 py-2 rounded-sm text-sm font-semibold transition-colors w-full justify-center">
                    <CheckCircle size={18} /> Approve
                  </button>
                </form>
                <form action={rejectServer}>
                  <input type="hidden" name="serverId" value={server._id.toString()} />
                  <button type="submit" className="flex items-center gap-2 bg-eter-red/10 text-eter-red border border-eter-red/20 hover:bg-eter-red/20 px-3 py-2 rounded-sm text-sm font-semibold transition-colors w-full justify-center">
                    <XCircle size={18} /> Reject
                  </button>
                </form>
              </>
            )))}
          </div>
        )}
      </section>

      {/* Approved — with Ban action */}
      {approvedServers.length > 0 && (
        <section className="flex flex-col gap-4">
          <header>
            <h2 className="text-xl font-display font-semibold text-eter-starlight">Approved Servers</h2>
            <p className="text-zinc-500 font-body mt-1 text-sm">Live servers. You can ban any server that violates the rules.</p>
          </header>
          <div className="flex flex-col gap-4">
            {approvedServers.map((server: any) => renderServerRow(server, (
              <form action={banServer}>
                <input type="hidden" name="serverId" value={server._id.toString()} />
                <button type="submit" className="flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 px-3 py-2 rounded-sm text-sm font-semibold transition-colors w-full justify-center">
                  <Shield size={18} /> Ban
                </button>
              </form>
            )))}
          </div>
        </section>
      )}

    </div>
  );
}
