import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { CheckCircle, XCircle, Shield, ArrowSquareOut, WhatsappLogo, Trash, Star, PencilSimple, Sparkle } from "@phosphor-icons/react/dist/ssr";
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
    await Server.findByIdAndUpdate(serverId, { moderationStatus: 'APPROVED', rejectionReason: "" });
    revalidatePath("/admin");
  }

  async function rejectServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    const rejectionReason = formData.get("rejectionReason") as string || "Tidak memenuhi standar kualifikasi EterVerse.";
    await connectToDatabase();
    await Server.findByIdAndUpdate(serverId, { moderationStatus: 'REJECTED', rejectionReason });
    revalidatePath("/admin");
  }

  async function banServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    await connectToDatabase();
    await Server.findByIdAndUpdate(serverId, { moderationStatus: 'BANNED' });
    revalidatePath("/admin");
  }

  async function unbanServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    await connectToDatabase();
    await Server.findByIdAndUpdate(serverId, { moderationStatus: 'APPROVED', rejectionReason: "" });
    revalidatePath("/admin");
  }

  async function deleteServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    await connectToDatabase();
    await Server.findByIdAndDelete(serverId);
    revalidatePath("/admin");
  }

  async function togglePartner(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    const isPartner = formData.get("isPartner") === "true";
    await connectToDatabase();
    await Server.findByIdAndUpdate(serverId, { isEterShopPartner: !isPartner });
    revalidatePath("/admin");
    revalidatePath("/"); // Revalidate homepage as it affects hero slider
  }

  const renderServerRow = (server: any, actions: React.ReactNode) => (
    <div key={server._id} className={`bg-[#09090b]/80 border-l-2 border-y border-r border-white/10 p-5 sm:p-6 flex flex-col md:flex-row justify-between gap-6 rounded-sm shadow-sm ${server.isEterShopPartner ? 'border-l-eter-gold' : 'border-l-eter-cyan'}`}>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-xl font-display font-semibold text-eter-starlight">{server.name}</h3>
          
          <div className="flex gap-2 items-center">
            <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
              server.moderationStatus === 'APPROVED' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
              server.moderationStatus === 'REJECTED' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
              server.moderationStatus === 'BANNED' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
              'text-zinc-400 border-white/20 bg-white/5'
            }`}>{server.moderationStatus}</span>
            
            {server.isEterShopPartner && (
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border text-eter-gold border-eter-gold/30 bg-eter-gold/10 flex items-center gap-1">
                <Star weight="fill" /> Partner
              </span>
            )}
          </div>
        </div>
        <span className="text-sm font-mono text-eter-cyan break-all">{server.ipAddress}</span>
        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{server.description}</p>
      </div>

      <div className="flex flex-col gap-2 justify-start border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 shrink-0 w-full md:w-48">
        <div className="grid grid-cols-2 gap-2 mb-2">
          {server.slug && (
            <Link href={`/server/${server.slug}`} target="_blank" className="flex items-center gap-1.5 bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 px-2 py-1.5 rounded-sm text-[11px] font-medium transition-colors w-full justify-center">
              <ArrowSquareOut size={14} /> View
            </Link>
          )}
          {server.ownerWhatsApp && (
            <a href={`https://wa.me/${server.ownerWhatsApp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 px-2 py-1.5 rounded-sm text-[11px] font-medium transition-colors w-full justify-center">
              <WhatsappLogo size={14} weight="fill" /> Chat
            </a>
          )}
        </div>
        {actions}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 animate-fade-in pb-20">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pending", value: pendingServers.length, color: "text-yellow-400" },
          { label: "Approved", value: approvedServers.length, color: "text-green-400" },
          { label: "Rejected / Banned", value: rejectedServers.length, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#09090b]/80 border border-white/10 rounded-sm p-4 text-center shadow-md">
            <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* EterReward Feature Roadmap for Admin */}
      <div className="bg-gradient-to-r from-cyan-950/30 via-[#09090b] to-[#09090b] border border-cyan-500/30 p-5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkle size={20} weight="fill" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Fitur Eksklusif • Segera Hadir
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold uppercase">
                EterReward™
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-0.5">EterReward™: In-Game Real-Time Sync Engine</p>
            <p className="text-xs text-zinc-400 font-body">Protokol TCP socket &amp; RSA 2048-bit encryption untuk reward pemain in-game.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/tools/votifier" 
          className="text-xs font-mono text-cyan-300 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-2 rounded-sm flex items-center gap-1.5 shrink-0 transition-colors whitespace-nowrap"
        >
          <span>Buka Panduan &amp; Syarat</span>
          <ArrowSquareOut size={13} />
        </Link>
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
                  <button type="submit" className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 px-3 py-2 rounded-sm text-xs font-semibold transition-colors w-full justify-center">
                    <CheckCircle size={16} /> Approve
                  </button>
                </form>
                <form action={rejectServer} className="flex flex-col gap-2 w-full mt-1">
                  <input type="hidden" name="serverId" value={server._id.toString()} />
                  <input type="text" name="rejectionReason" placeholder="Alasan penolakan (opsional)..." className="bg-black/50 border border-white/10 rounded-sm px-3 py-1.5 text-xs text-eter-starlight focus:border-eter-red focus:outline-none transition-colors w-full" />
                  <button type="submit" className="flex items-center gap-2 bg-eter-red/10 text-eter-red border border-eter-red/20 hover:bg-eter-red/20 px-3 py-2 rounded-sm text-xs font-semibold transition-colors w-full justify-center">
                    <XCircle size={16} /> Reject
                  </button>
                </form>
                <form action={deleteServer} className="mt-1">
                  <input type="hidden" name="serverId" value={server._id.toString()} />
                  <button type="submit" className="flex items-center gap-2 bg-zinc-800/50 text-zinc-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 px-3 py-2 rounded-sm text-xs font-semibold transition-colors w-full justify-center">
                    <Trash size={16} /> Hard Delete
                  </button>
                </form>
              </>
            )))}
          </div>
        )}
      </section>

      {/* Approved Servers */}
      {approvedServers.length > 0 && (
        <section className="flex flex-col gap-4">
          <header>
            <h2 className="text-xl font-display font-semibold text-eter-starlight">Approved Servers</h2>
            <p className="text-zinc-500 font-body mt-1 text-sm">Live servers. Manage partnerships or issue bans.</p>
          </header>
          <div className="flex flex-col gap-4">
            {approvedServers.map((server: any) => renderServerRow(server, (
              <div className="flex flex-col gap-2">
                <form action={togglePartner}>
                  <input type="hidden" name="serverId" value={server._id.toString()} />
                  <input type="hidden" name="isPartner" value={server.isEterShopPartner ? "true" : "false"} />
                  <button type="submit" className={`flex items-center gap-2 border px-3 py-2 rounded-sm text-xs font-semibold transition-colors w-full justify-center ${server.isEterShopPartner ? 'bg-zinc-800/50 text-zinc-400 hover:text-white border-white/10' : 'bg-eter-gold/10 text-eter-gold hover:bg-eter-gold/20 border-eter-gold/30'}`}>
                    <Star size={16} weight={server.isEterShopPartner ? "regular" : "fill"} /> 
                    {server.isEterShopPartner ? 'Revoke Partner' : 'Make Partner'}
                  </button>
                </form>
                <form action={banServer}>
                  <input type="hidden" name="serverId" value={server._id.toString()} />
                  <button type="submit" className="flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 px-3 py-2 rounded-sm text-xs font-semibold transition-colors w-full justify-center">
                    <Shield size={16} /> Ban Server
                  </button>
                </form>
              </div>
            )))}
          </div>
        </section>
      )}

      {/* Rejected / Banned Servers */}
      {rejectedServers.length > 0 && (
        <section className="flex flex-col gap-4">
          <header>
            <h2 className="text-xl font-display font-semibold text-eter-starlight">Rejected & Banned</h2>
            <p className="text-zinc-500 font-body mt-1 text-sm">Servers that have been blocked. You can unban them or delete them permanently.</p>
          </header>
          <div className="flex flex-col gap-4">
            {rejectedServers.map((server: any) => renderServerRow(server, (
              <div className="flex flex-col gap-2">
                <form action={unbanServer}>
                  <input type="hidden" name="serverId" value={server._id.toString()} />
                  <button type="submit" className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 px-3 py-2 rounded-sm text-xs font-semibold transition-colors w-full justify-center">
                    <CheckCircle size={16} /> Unban / Approve
                  </button>
                </form>
                <form action={deleteServer}>
                  <input type="hidden" name="serverId" value={server._id.toString()} />
                  <button type="submit" className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-3 py-2 rounded-sm text-xs font-semibold transition-colors w-full justify-center">
                    <Trash size={16} /> Hard Delete
                  </button>
                </form>
              </div>
            )))}
          </div>
        </section>
      )}

    </div>
  );
}

