import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { isAdminEmail } from "@/lib/admin-guard";
import { AdminNav } from "@/components/layout/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Fail closed: the old check let everyone in whenever ADMIN_EMAILS was unset or empty.
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen pt-20 relative z-10">
      {/* Phones: tab bar under the site navbar. The fixed 256px sidebar used to squeeze
          the admin pages to a sliver on mobile. */}
      <div className="md:hidden sticky top-[68px] z-30 bg-[#09090b] border-b border-zinc-800">
        <AdminNav variant="tabs" />
      </div>

      <aside className="hidden md:flex w-64 fixed inset-y-0 left-0 pt-24 pb-8 px-5 bg-[#09090b]/95 border-r border-zinc-800 flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-lg border border-rose-500/30 bg-rose-500/10 flex items-center justify-center">
              <ShieldCheck size={22} className="text-rose-300" weight="fill" aria-hidden />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-display font-semibold text-white">Panel Admin</span>
              <span className="text-xs text-zinc-400 truncate max-w-[140px]">{session?.user?.email}</span>
            </div>
          </div>
          <AdminNav variant="sidebar" />
        </div>

        <Link
          href="/dashboard"
          className="min-h-[44px] flex items-center gap-3 px-4 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-2 focus-visible:outline-white"
        >
          <ArrowLeft size={18} aria-hidden /> Kembali ke dashboard
        </Link>
      </aside>

      <main className="md:ml-64 px-6 py-6 md:p-8 min-w-0">{children}</main>
    </div>
  );
}
