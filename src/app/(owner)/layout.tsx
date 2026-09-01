import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { 
  SquaresFour, 
  ListPlus, 
  Code, 
  Lightning,
  SignOut
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Middleware also protects this, but just to be safe:
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen pt-20 relative z-10">
      
      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 pt-24 pb-8 px-6 bg-[#050505]/80 backdrop-blur-md border-r border-white/5 flex flex-col justify-between">
        
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <img 
              src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-sm border-l-2 border-l-eter-cyan border-y border-r border-y-white/10 border-r-white/10"
            />
            <div className="flex flex-col">
              <span className="text-sm font-display font-medium text-eter-starlight truncate w-32">{session.user.name}</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Server Owner</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarLink href="/dashboard" icon={<SquaresFour size={20} />} label="Overview" />
            <SidebarLink href="/dashboard/server/new" icon={<ListPlus size={20} />} label="Submit Server" />
            <SidebarLink href="/dashboard/tools/widget" icon={<Code size={20} />} label="Widget Tools" />
            <div className="mt-4">
              <SidebarLink href="/dashboard/boost" icon={<Lightning size={20} weight="fill" />} label="EterShop Boost" isGold />
            </div>
          </nav>
        </div>

        <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium text-zinc-500 hover:text-eter-red hover:bg-eter-red/10 transition-colors duration-smooth border border-transparent">
          <SignOut size={20} />
          Sign Out
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {children}
      </main>
      
    </div>
  );
}

function SidebarLink({ href, icon, label, isGold = false }: { href: string, icon: React.ReactNode, label: string, isGold?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors duration-smooth border border-transparent
        ${isGold 
          ? 'text-eter-gold hover:bg-eter-gold/10 hover:border-eter-gold/30' 
          : 'text-zinc-400 hover:text-eter-starlight hover:bg-white/5 hover:border-white/10'
        }
      `}
    >
      {icon}
      {label}
    </Link>
  );
}
