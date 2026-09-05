"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  SquaresFour, 
  ListPlus, 
  Code, 
  Lightning,
  Sparkle,
  SignOut,
  List,
  X
} from "@phosphor-icons/react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardSidebar({ user }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header & Hamburger */}
      <div className="md:hidden fixed top-20 left-0 right-0 h-14 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800 z-40 flex items-center px-6">
        <button onClick={toggleSidebar} className="text-zinc-300 hover:text-white flex items-center gap-2">
          <List size={24} />
          <span className="font-display font-medium text-sm">Menu Dashboard</span>
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 pt-24 md:pt-24 pb-8 px-6 bg-[#09090b] md:bg-[#09090b]/90 backdrop-blur-md border-r border-zinc-800 flex flex-col justify-between z-50 transition-transform duration-300 w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        <div className="flex flex-col gap-8 mt-12 md:mt-0">
          
          {/* Mobile Close Button */}
          <button 
            onClick={closeSidebar} 
            className="md:hidden absolute top-6 right-6 text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 px-2">
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-lg border border-zinc-700 object-cover"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-display font-semibold text-white truncate max-w-[130px]">{user.name}</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Pemilik Server</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <SidebarLink href="/dashboard" icon={<SquaresFour size={20} />} label="Ringkasan" pathname={pathname} onClick={closeSidebar} />
            <SidebarLink href="/dashboard/server/new" icon={<ListPlus size={20} />} label="Daftarkan Server" pathname={pathname} onClick={closeSidebar} />
            <SidebarLink href="/dashboard/tools/widget" icon={<Code size={20} />} label="Alat Widget Status" pathname={pathname} onClick={closeSidebar} />
            <SidebarLink 
              href="/dashboard/tools/votifier" 
              icon={<Sparkle size={20} weight="fill" className="text-cyan-400" />} 
              label="Reward Votifier" 
              badge="SOON"
              pathname={pathname} 
              onClick={closeSidebar} 
            />
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <SidebarLink href="/dashboard/boost" icon={<Lightning size={20} weight="fill" />} label="Promosi EterShop" isGold pathname={pathname} onClick={closeSidebar} />
            </div>
          </nav>
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent w-full text-left"
        >
          <SignOut size={20} />
          Keluar
        </button>
      </aside>
    </>
  );
}

function SidebarLink({ 
  href, 
  icon, 
  label, 
  isGold = false, 
  badge,
  pathname, 
  onClick 
}: { 
  href: string;
  icon: React.ReactNode; 
  label: string; 
  isGold?: boolean; 
  badge?: string;
  pathname: string; 
  onClick: () => void;
}) {
  const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname === href || pathname.startsWith(`${href}/`);
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
        isGold 
          ? isActive
            ? 'text-amber-300 bg-amber-500/15 border-amber-500/30 font-semibold'
            : 'text-amber-400 hover:bg-amber-500/10 border-transparent hover:border-amber-500/25' 
          : isActive
            ? 'bg-white/10 text-white border-white/15 font-semibold'
            : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 tracking-wider">
          {badge}
        </span>
      )}
    </Link>
  );
}
