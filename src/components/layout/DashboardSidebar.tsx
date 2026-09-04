"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  SquaresFour, 
  ListPlus, 
  Code, 
  Lightning,
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
      <div className="md:hidden fixed top-20 left-0 right-0 h-14 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 z-40 flex items-center px-6">
        <button onClick={toggleSidebar} className="text-zinc-400 hover:text-eter-starlight flex items-center gap-2">
          <List size={24} />
          <span className="font-display font-medium text-sm">Dashboard Menu</span>
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 pt-24 md:pt-24 pb-8 px-6 bg-[#050505]/95 md:bg-[#050505]/80 backdrop-blur-md border-r border-white/5 flex flex-col justify-between z-50 transition-transform duration-300 w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        <div className="flex flex-col gap-8 mt-12 md:mt-0">
          
          {/* Mobile Close Button */}
          <button 
            onClick={closeSidebar} 
            className="md:hidden absolute top-6 right-6 text-zinc-500 hover:text-eter-starlight"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 px-2">
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-sm border-l-2 border-l-eter-cyan border-y border-r border-y-white/10 border-r-white/10"
            />
            <div className="flex flex-col">
              <span className="text-sm font-display font-medium text-eter-starlight truncate w-32">{user.name}</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Server Owner</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarLink href="/dashboard" icon={<SquaresFour size={20} />} label="Overview" pathname={pathname} onClick={closeSidebar} />
            <SidebarLink href="/dashboard/server/new" icon={<ListPlus size={20} />} label="Submit Server" pathname={pathname} onClick={closeSidebar} />
            <SidebarLink href="/dashboard/tools/widget" icon={<Code size={20} />} label="Widget Tools" pathname={pathname} onClick={closeSidebar} />
            <div className="mt-4">
              <SidebarLink href="/dashboard/boost" icon={<Lightning size={20} weight="fill" />} label="EterShop Boost" isGold pathname={pathname} onClick={closeSidebar} />
            </div>
          </nav>
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium text-zinc-500 hover:text-eter-red hover:bg-eter-red/10 transition-colors duration-smooth border border-transparent w-full text-left"
        >
          <SignOut size={20} />
          Sign Out
        </button>
      </aside>
    </>
  );
}

function SidebarLink({ href, icon, label, isGold = false, pathname, onClick }: { href: string, icon: React.ReactNode, label: string, isGold?: boolean, pathname: string, onClick: () => void }) {
  const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname === href || pathname.startsWith(`${href}/`);
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors duration-smooth border border-transparent
        ${isGold 
          ? 'text-eter-gold hover:bg-eter-gold/10 hover:border-eter-gold/30' 
          : isActive
            ? 'bg-eter-cyan/10 text-eter-cyan border-l-2 border-l-eter-cyan border-y border-r border-y-eter-cyan/20 border-r-eter-cyan/20'
            : 'text-zinc-400 hover:text-eter-starlight hover:bg-white/5 hover:border-white/10'
        }
      `}
    >
      {icon}
      {label}
    </Link>
  );
}
