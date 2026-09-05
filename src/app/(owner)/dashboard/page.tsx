import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import Link from "next/link";
import { ChartLineUp, Users, CursorClick, Clock, CheckCircle, Eye, PencilSimple, WarningCircle, Sparkle, ArrowRight, CalendarDots, Info } from "@phosphor-icons/react/dist/ssr";
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
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-white">Ringkasan Dashboard</h1>
          <p className="text-zinc-500 font-body mt-1 text-sm">Kelola server Minecraft milikmu dan pantau perkembangannya.</p>
        </div>
        
        <Link href="/dashboard/server/new" className="bg-white text-zinc-950 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors shrink-0 shadow-sm">
          + Daftarkan Server
        </Link>
      </header>

      {/* Coming Soon: EterReward Teaser Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/40 via-zinc-950 to-zinc-950 border border-cyan-500/30 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <Sparkle size={22} weight="fill" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Fitur Eksklusif Segera Hadir
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                EterReward™
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-display font-semibold text-white">
              EterReward™: In-Game Vote Reward Otomatis
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-body max-w-2xl">
              Beri hadiah otomatis (Crate Key, Diamond, Koin) langsung di dalam game setiap kali pemain melakukan vote di EterVerse. Pelajari syarat dan cara menyiapkan servermu lebih awal.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/tools/votifier"
          className="bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0 transition-all active:scale-95 whitespace-nowrap"
        >
          <span>Pelajari &amp; Cek Syarat</span>
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>

      {/* Quick Access Highlights (Event Hub & Information Center) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/tools/events"
          className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <CalendarDots size={18} weight="fill" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Kalender Acara &amp; Reset Season
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">SOON</span>
              </div>
              <span className="text-[11px] text-zinc-400 font-body">Promosikan turnamen PvP, giveaway, &amp; season baru dengan countdown.</span>
            </div>
          </div>
          <ArrowRight size={14} className="text-zinc-500 group-hover:text-amber-300 transition-colors shrink-0" />
        </Link>

        <Link
          href="/dashboard/info"
          className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Info size={18} weight="fill" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                Pusat Informasi &amp; Panduan Server
              </span>
              <span className="text-[11px] text-zinc-400 font-body">Standar moderasi, konfigurasi port, panduan Realms, &amp; FAQ lengkap.</span>
            </div>
          </div>
          <ArrowRight size={14} className="text-zinc-500 group-hover:text-indigo-300 transition-colors shrink-0" />
        </Link>
      </div>

      {!hasServers ? (
        <div className="flex flex-col items-center justify-center p-16 mt-10 bg-zinc-950/60 border border-zinc-800 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-xl flex items-center justify-center mb-6 border border-zinc-800 text-zinc-300">
            <ChartLineUp size={32} />
          </div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Belum Ada Server</h2>
          <p className="text-zinc-400 font-body mb-8 max-w-md text-sm">
            Kamu belum menambahkan server ke EterVerse. Daftarkan server pertamamu untuk mulai mendapatkan pemain baru!
          </p>
          <Link href="/dashboard/server/new" className="bg-white text-zinc-950 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 transition-colors shadow-sm">
            Daftarkan Server Pertamamu
          </Link>
        </div>
      ) : (
        <>
          {/* Real Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Total Impresi" value={totalImpressions.toLocaleString()} icon={<Eye size={22} className="text-zinc-400" />} />
            <MetricCard title="Total Klik" value={totalClicks.toLocaleString()} icon={<CursorClick size={22} className="text-zinc-400" />} />
            <MetricCard title="Server Disetujui" value={approvedCount.toString()} icon={<CheckCircle size={22} className="text-emerald-400" />} />
            <MetricCard title="Menunggu Review" value={pendingCount.toString()} icon={<Clock size={22} className="text-amber-400" />} />
          </div>

          {/* Server List */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-display font-semibold text-white border-b border-zinc-800 pb-3">Daftar Server Kamu</h2>
            {myServers.map((server: any) => (
              <div key={server._id.toString()} className="flex flex-col gap-2">
                <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-semibold text-white truncate">{server.name}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        server.moderationStatus === 'APPROVED' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                        server.moderationStatus === 'REJECTED' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                        server.moderationStatus === 'BANNED' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
                        'text-amber-400 border-amber-500/30 bg-amber-500/10'
                      }`}>{server.moderationStatus === 'APPROVED' ? 'DISETUJUI' : server.moderationStatus === 'REJECTED' ? 'DITOLAK' : server.moderationStatus === 'BANNED' ? 'DIBEKUKAN' : 'MENUNGGU'}</span>
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
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <PencilSimple size={14} /> Edit
                    </Link>
                    <DeleteServerButton serverId={server._id.toString()} deleteAction={deleteMyServer} />
                    {server.moderationStatus === 'APPROVED' && (
                      <Link 
                        href={`/server/${server.slug}`}
                        target="_blank"
                        className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye size={14} /> Lihat
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
    <div className="bg-zinc-950/70 border border-zinc-800 p-4 shadow-sm rounded-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-tight">{title}</h3>
        {icon}
      </div>
      <span className="text-2xl font-display font-semibold text-white">{value}</span>
    </div>
  );
}
