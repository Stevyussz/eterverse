import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, Database, SignOut } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Basic admin protection check
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : [];
  if (adminEmails.length > 0 && (!session?.user?.email || !adminEmails.includes(session.user.email))) {
    redirect("/dashboard"); // Redirect non-admins to normal dashboard
  }

  return (
    <div className="flex min-h-screen pt-20 relative z-10">
      
      {/* Admin Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 pt-24 pb-8 px-6 bg-[#090000]/90 backdrop-blur-md border-r border-eter-red/10 flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-sm border-l-2 border-l-eter-red border-y border-r border-y-white/10 border-r-white/10 flex items-center justify-center bg-eter-red/10">
               <ShieldCheck size={24} className="text-eter-red" weight="fill" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-display font-medium text-eter-starlight truncate w-32">Admin Panel</span>
              <span className="text-[10px] font-mono text-eter-red uppercase tracking-widest">System</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarLink href="/admin" icon={<Database size={20} />} label="Moderation Queue" />
          </nav>
        </div>

        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium text-zinc-500 hover:text-eter-starlight transition-colors duration-smooth border border-transparent">
          Return to Dashboard
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {children}
      </main>
      
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors duration-smooth border border-transparent text-zinc-400 hover:text-eter-starlight hover:bg-white/5 hover:border-white/10"
    >
      {icon}
      {label}
    </Link>
  );
}
