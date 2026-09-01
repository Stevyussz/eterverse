import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { Trophy, Prohibit, Trash } from "@phosphor-icons/react/dist/ssr";
import { revalidatePath } from "next/cache";

export default async function AdminDatabasePage() {
  await connectToDatabase();
  
  const allServers = await Server.find({}).sort({ createdAt: -1 }).lean();

  async function togglePartner(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    const currentStatus = formData.get("currentStatus") === "true";
    await connectToDatabase();
    await Server.findByIdAndUpdate(serverId, { isEterShopPartner: !currentStatus });
    revalidatePath("/admin/database");
    revalidatePath("/");
  }

  async function banServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    await connectToDatabase();
    await Server.findByIdAndUpdate(serverId, { moderationStatus: 'BANNED' });
    revalidatePath("/admin/database");
    revalidatePath("/");
  }

  async function deleteServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    await connectToDatabase();
    await Server.findByIdAndDelete(serverId);
    revalidatePath("/admin/database");
    revalidatePath("/");
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-display font-semibold text-eter-starlight">Server Database</h1>
        <p className="text-zinc-500 font-body mt-1">Full God Mode control over all EterVerse entities.</p>
      </header>

      <div className="bg-[#050505]/60 border border-white/5 rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-black/50 text-xs uppercase font-mono text-zinc-500 border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Server Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4 text-center">Partner</th>
              <th className="px-6 py-4 text-right">God Mode Actions</th>
            </tr>
          </thead>
          <tbody>
            {allServers.map((server: any) => (
              <tr key={server._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-display font-medium text-eter-starlight">
                  {server.name}
                  {server.isEterShopPartner && <Trophy className="inline ml-2 text-eter-gold" size={14} weight="fill" />}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-mono rounded-sm border ${
                    server.moderationStatus === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    server.moderationStatus === 'BANNED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                  }`}>
                    {server.moderationStatus}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{server.ipAddress}</td>
                
                <td className="px-6 py-4">
                  <form action={togglePartner} className="flex justify-center">
                    <input type="hidden" name="serverId" value={server._id.toString()} />
                    <input type="hidden" name="currentStatus" value={server.isEterShopPartner.toString()} />
                    <button type="submit" className={`p-2 rounded-sm border transition-colors ${
                      server.isEterShopPartner 
                        ? 'bg-eter-gold/10 border-eter-gold/30 text-eter-gold hover:bg-eter-gold/20' 
                        : 'bg-white/5 border-white/10 text-zinc-500 hover:text-eter-gold hover:border-eter-gold/30'
                    }`}>
                      <Trophy size={16} weight={server.isEterShopPartner ? "fill" : "regular"} />
                    </button>
                  </form>
                </td>

                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <form action={banServer}>
                    <input type="hidden" name="serverId" value={server._id.toString()} />
                    <button type="submit" title="Ban Server" disabled={server.moderationStatus === 'BANNED'} className="p-2 bg-white/5 border border-white/10 text-zinc-400 rounded-sm hover:text-orange-400 hover:bg-orange-400/10 hover:border-orange-400/30 transition-colors disabled:opacity-50">
                      <Prohibit size={16} />
                    </button>
                  </form>
                  <form action={deleteServer}>
                    <input type="hidden" name="serverId" value={server._id.toString()} />
                    <button type="submit" title="Delete Database Entry" className="p-2 bg-white/5 border border-white/10 text-zinc-400 rounded-sm hover:text-eter-red hover:bg-eter-red/10 hover:border-eter-red/30 transition-colors">
                      <Trash size={16} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            
            {allServers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  Database is totally empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
