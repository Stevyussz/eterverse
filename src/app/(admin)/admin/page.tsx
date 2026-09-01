import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr";
import { revalidatePath } from "next/cache";

export default async function AdminModerationPage() {
  await connectToDatabase();
  
  const pendingServers = await Server.find({ moderationStatus: 'PENDING' }).lean();

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

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-display font-semibold text-eter-starlight">Moderation Queue</h1>
        <p className="text-zinc-500 font-body mt-1">Review and approve new server submissions.</p>
      </header>

      {pendingServers.length === 0 ? (
        <div className="p-16 border border-white/5 border-l-2 border-l-eter-cyan bg-[#050505]/60 text-center text-zinc-400 rounded-sm">
          No pending servers in the queue.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pendingServers.map((server: any) => (
            <div key={server._id} className="bg-[#09090b]/80 border-l-2 border-l-eter-cyan border-y border-r border-white/10 p-6 flex flex-col md:flex-row justify-between gap-6 rounded-sm shadow-sm">
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-xl font-display font-semibold text-eter-starlight">{server.name}</h3>
                <span className="text-sm font-mono text-eter-cyan">{server.ipAddress}</span>
                <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{server.description}</p>
                <div className="flex items-center gap-2 mt-2">
                   {server.tags.map((tag: string) => (
                     <span key={tag} className="text-[10px] font-mono px-2 py-0.5 border border-white/10 text-zinc-300">{tag}</span>
                   ))}
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 shrink-0">
                <form action={approveServer}>
                  <input type="hidden" name="serverId" value={server._id.toString()} />
                  <button type="submit" className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 px-4 py-2 rounded-sm text-sm font-semibold transition-colors w-full justify-center">
                    <CheckCircle size={20} /> Approve
                  </button>
                </form>
                <form action={rejectServer}>
                  <input type="hidden" name="serverId" value={server._id.toString()} />
                  <button type="submit" className="flex items-center gap-2 bg-eter-red/10 text-eter-red border border-eter-red/20 hover:bg-eter-red/20 px-4 py-2 rounded-sm text-sm font-semibold transition-colors w-full justify-center">
                    <XCircle size={20} /> Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
