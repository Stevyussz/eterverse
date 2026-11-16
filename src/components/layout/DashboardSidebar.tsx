"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  ListPlus,
  Code,
  Lightning,
  Gift,
  CalendarDots,
  Info,
  SignOut,
  List,
  X,
} from "@phosphor-icons/react";
import { signOut } from "next-auth/react";
import { SafeImage } from "@/components/ui/SafeImage";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const NAV = [
  { href: "/dashboard", icon: SquaresFour, label: "Ringkasan" },
  { href: "/dashboard/server/new", icon: ListPlus, label: "Daftarkan Server" },
  { href: "/dashboard/tools/votifier", icon: Gift, label: "Hadiah Vote" },
  { href: "/dashboard/tools/widget", icon: Code, label: "Widget Status" },
  { href: "/dashboard/tools/events", icon: CalendarDots, label: "Jadwal Event", badge: "Segera" },
  { href: "/dashboard/info", icon: Info, label: "Pusat Informasi" },
];

export function DashboardSidebar({ user }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const displayName = user.name || user.email?.split("@")[0] || "Owner";

  const closeSidebar = () => setIsOpen(false);

  // The mobile drawer is a modal surface: Escape closes it and the page behind stops scrolling.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile bar: shows where you are, opens the drawer */}
      <div className="md:hidden fixed top-20 left-0 right-0 h-14 bg-[#09090b] border-b border-zinc-800 z-40 flex items-center px-4">
        <button
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="dashboard-nav"
          className="min-h-[44px] px-2 -ml-2 rounded-md text-zinc-200 hover:text-white flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-white"
        >
          <List size={22} aria-hidden />
          <span className="font-display font-medium text-sm">
            {NAV.find((n) => (n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href)))?.label ?? "Menu Dashboard"}
          </span>
        </button>
      </div>

      {isOpen && <div className="md:hidden fixed inset-0 bg-black/75 z-40" onClick={closeSidebar} aria-hidden />}

      <aside
        id="dashboard-nav"
        aria-label="Navigasi dashboard"
        className={`fixed inset-y-0 left-0 pt-24 pb-8 px-5 bg-[#09090b] md:bg-[#09090b]/95 border-r border-zinc-800 flex flex-col justify-between z-50 transition-transform duration-300 w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-8 mt-12 md:mt-0">
          <button
            onClick={closeSidebar}
            aria-label="Tutup menu"
            className="md:hidden absolute top-24 right-3 w-11 h-11 flex items-center justify-center rounded-md text-zinc-400 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <X size={22} />
          </button>

          <div className="flex items-center gap-3 px-2">
            {/* Initials fallback: the old avatar sent the owner's name to ui-avatars.com. */}
            <SafeImage
              src={user.image || undefined}
              fallbackName={displayName}
              alt={`Avatar ${displayName}`}
              className="w-10 h-10 rounded-lg border border-zinc-700 object-cover text-sm"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-display font-semibold text-white truncate max-w-[140px]">{displayName}</span>
              <span className="text-xs text-zinc-400">Pemilik server</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <SidebarLink key={item.href} {...item} pathname={pathname} onClick={closeSidebar} />
            ))}
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <SidebarLink href="/dashboard/boost" icon={Lightning} label="Partner EterShop" isGold pathname={pathname} onClick={closeSidebar} />
            </div>
          </nav>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="min-h-[44px] flex items-center gap-3 px-4 rounded-lg text-sm font-medium text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors w-full text-left focus-visible:outline-2 focus-visible:outline-white"
        >
          <SignOut size={20} aria-hidden />
          Keluar
        </button>
      </aside>
    </>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  isGold = false,
  badge,
  pathname,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
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
      aria-current={isActive ? "page" : undefined}
      className={`min-h-[44px] flex items-center justify-between px-4 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-white ${
        isGold
          ? isActive
            ? "text-amber-200 bg-amber-500/15 font-semibold"
            : "text-amber-300 hover:bg-amber-500/10"
          : isActive
          ? "bg-white/10 text-white font-semibold"
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={20} weight={isActive ? "fill" : "regular"} aria-hidden />
        {label}
      </span>
      {badge && <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">{badge}</span>}
    </Link>
  );
}
