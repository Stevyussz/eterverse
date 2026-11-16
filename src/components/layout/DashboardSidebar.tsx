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
  X,
  Heart,
  House,
} from "@phosphor-icons/react";
import { signOut } from "next-auth/react";
import { DASHBOARD_MENU_EVENT } from "@/lib/ui-events";
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
  { href: "/dashboard/favorites", icon: Heart, label: "Favorit" },
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

  // Opened by the navbar's Menu button (a separate tree), see lib/ui-events.
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(DASHBOARD_MENU_EVENT, open);
    return () => window.removeEventListener(DASHBOARD_MENU_EVENT, open);
  }, []);

  // Close after navigating, so the drawer never stays over the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setIsOpen(false);
  }

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
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/75 z-[60]" onClick={closeSidebar} aria-hidden />}

      {/* Phones: a full-height drawer above the navbar. Desktop: a column under the 64px navbar. */}
      <aside
        id="dashboard-nav"
        aria-label="Navigasi dashboard"
        className={`fixed top-0 bottom-0 md:top-16 left-0 z-[70] md:z-40 w-[min(18rem,85vw)] md:w-64 pt-4 md:pt-6 pb-6 px-4 bg-[#09090b] border-r border-zinc-800 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-2 md:hidden">
            <span className="px-2 font-display font-semibold text-white">Menu</span>
            <button
              onClick={closeSidebar}
              aria-label="Tutup menu"
              className="w-11 h-11 flex items-center justify-center rounded-md text-zinc-400 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              <X size={22} />
            </button>
          </div>

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
              <span className="text-xs text-zinc-400">Akun EterVerse</span>
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

        <div className="flex flex-col gap-1 pt-6">
        {/* The public menu is hidden on dashboard pages, so the way back lives here. */}
        <Link
          href="/"
          onClick={closeSidebar}
          className="min-h-[44px] flex items-center gap-3 px-4 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-2 focus-visible:outline-white"
        >
          <House size={20} aria-hidden />
          Ke beranda
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="min-h-[44px] flex items-center gap-3 px-4 rounded-lg text-sm font-medium text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors w-full text-left focus-visible:outline-2 focus-visible:outline-white"
        >
          <SignOut size={20} aria-hidden />
          Keluar
        </button>
        </div>
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
