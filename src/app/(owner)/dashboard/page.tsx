import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import Link from "next/link";
import { ChartLineUp, Users, CursorClick } from "@phosphor-icons/react/dist/ssr";

export default async function DashboardOverview() {
  const session = await auth();
  
  await connectToDatabase();
  // We use email as the ownerId identifier for now
  const ownerIdentifier = session?.user?.email || session?.user?.id;
  const myServers = await Server.find({ ownerId: ownerIdentifier }).lean();

  const hasServers = myServers.length > 0;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-fade-in">
      
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-eter-starlight">Dashboard Overview</h1>
          <p className="text-zinc-500 font-body mt-1">Manage your Minecraft servers and monitor growth.</p>
        </div>
        
        {hasServers && (
          <Link href="/dashboard/server/new" className="bg-eter-cyan text-black px-4 py-2 rounded-sm font-semibold text-sm hover:bg-cyan-300 transition-colors border-l-2 border-l-white border-y border-r border-transparent">
            + Add Another Server
          </Link>
        )}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Mock Metrics for MVP */}
           <MetricCard title="Total Impressions" value="0" icon={<CursorClick size={24} className="text-eter-cyan" />} />
           <MetricCard title="Total Player Clicks" value="0" icon={<Users size={24} className="text-eter-cyan" />} />
           <MetricCard title="Active Servers" value={myServers.length.toString()} icon={<ChartLineUp size={24} className="text-eter-cyan" />} />
        </div>
      )}

    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[#09090b]/80 backdrop-blur-sm border-l-2 border-l-eter-cyan border-y border-r border-white/10 p-6 shadow-sm rounded-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-widest">{title}</h3>
        {icon}
      </div>
      <span className="text-3xl font-display font-semibold text-eter-starlight">{value}</span>
    </div>
  );
}
