"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PixelIcon, type PixelIconName } from "@/components/pixel/PixelIcon";
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

const NAV: { href: string; icon: PixelIconName; label: string; badge?: string }[] = [
  { href: "/dashboard", icon: "grid", label: "Ringkasan" },
  { href: "/dashboard/favorites", icon: "heart", label: "Favorit" },
  { href: "/dashboard/server/new", icon: "plus", label: "Daftarkan Server" },
  { href: "/dashboard/tools/votifier", icon: "gift", label: "Hadiah Vote" },
  { href: "/dashboard/tools/widget", icon: "monitor", label: "Widget Status" },
  { href: "/dashboard/tools/events", icon: "calendar", label: "Jadwal Event", badge: "Segera" },
  { href: "/dashboard/info", icon: "scroll", label: "Pusat Informasi" },
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
      {isOpen && <div className="md:hidden fixed inset-0 bg-[#2E2216]/70 z-[60]" onClick={closeSidebar} aria-hidden />}

      {/* Phones: a full-height drawer above the navbar. Desktop: a wooden column under the 64px navbar. */}
      <aside
        id="dashboard-nav"
        aria-label="Navigasi dashboard"
        className={`wood on-dark fixed top-0 bottom-0 md:top-16 left-0 z-[70] md:z-40 w-[min(18rem,85vw)] md:w-64 pt-4 md:pt-8 pb-6 px-3 border-r-[3px] border-ink flex flex-col justify-between overflow-y-auto transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-2 md:hidden px-1">
            <span className="font-pixel text-lg">Menu</span>
            <button onClick={closeSidebar} aria-label="Tutup menu" className="px-btn px-btn-cream px-btn-icon">
              <PixelIcon name="close" size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3 px-1">
            {/* Initials fallback: the old avatar sent the owner's name to ui-avatars.com. */}
            <SafeImage
              src={user.image || undefined}
              fallbackName={displayName}
              alt={`Avatar ${displayName}`}
              className="w-11 h-11 px-frame object-cover text-sm"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-pixel text-base truncate max-w-[150px]">{displayName}</span>
              <span className="text-xs text-cream/80">Akun EterVerse</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {NAV.map((item) => (
              <SidebarLink key={item.href} {...item} pathname={pathname} onClick={closeSidebar} />
            ))}
            <div className="mt-3 pt-3 border-t-2 border-dashed border-cream/20">
              <SidebarLink href="/dashboard/boost" icon="sparkle" label="Partner EterShop" isGold pathname={pathname} onClick={closeSidebar} />
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-1.5 pt-6">
          {/* The public menu is hidden on dashboard pages, so the way back lives here. */}
          <Link href="/" onClick={closeSidebar} className="wood-link !justify-start">
            <PixelIcon name="home" size={16} />
            Ke beranda
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="wood-link !justify-start w-full text-left">
            <PixelIcon name="logout" size={16} />
            Keluar
          </button>
        </div>
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
  onClick,
}: {
  href: string;
  icon: PixelIconName;
  label: string;
  isGold?: boolean;
  badge?: string;
  pathname: string;
  onClick: () => void;
}) {
  const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} onClick={onClick} aria-current={isActive ? "page" : undefined} className="wood-link">
      <span className="flex items-center gap-3">
        <PixelIcon name={icon} size={16} className={isGold && !isActive ? "text-gold" : ""} />
        {label}
      </span>
      {badge && <span className="px-chip !text-xs !py-0">{badge}</span>}
    </Link>
  );
}
