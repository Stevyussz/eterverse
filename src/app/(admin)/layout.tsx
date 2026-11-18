import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { isAdminEmail } from "@/lib/admin-guard";
import { AdminNav } from "@/components/layout/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Fail closed: the old check let everyone in whenever ADMIN_EMAILS was unset or empty.
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/dashboard");
  }

  return (
    // pt-16 / top-16 match the fixed 64px app navbar, so the tabs sit flush under it
    // (top-[68px] against an 80px navbar hid the tabs' top edge behind it).
    <div className="min-h-screen pt-16 relative">
      <div className="md:hidden sticky top-16 z-30 bg-panel-2 border-b-[3px] border-frame pt-3">
        <AdminNav variant="tabs" />
      </div>

      <aside className="wood on-dark hidden md:flex w-64 fixed top-16 bottom-0 left-0 pt-8 pb-6 px-3 border-r-[3px] border-frame flex-col justify-between overflow-y-auto">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-1">
            <div className="w-11 h-11 px-frame bg-gold flex items-center justify-center text-[#2E2216]">
              <PixelIcon name="shield" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-pixel text-base">Panel Admin</span>
              <span className="text-xs text-bone/80 truncate max-w-[150px]">{session?.user?.email}</span>
            </div>
          </div>
          <AdminNav variant="sidebar" />
        </div>

        <Link href="/dashboard" className="wood-link !justify-start">
          <PixelIcon name="arrow" size={14} /> Kembali ke dashboard
        </Link>
      </aside>

      <main className="md:ml-64 px-4 py-6 sm:px-6 md:p-8 min-w-0">{children}</main>
    </div>
  );
}
