"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { DASHBOARD_MENU_EVENT } from "@/lib/ui-events";
import { PixelIcon, type PixelIconName } from "@/components/pixel/PixelIcon";
import { Logo } from "@/components/pixel/Logo";

interface NavbarProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

// One solid prismarine bar on every page, 64px tall, with the family's pixel drips under it.
// Solid instead of a transparent-then-blurred bar: no backdrop-filter repaint while scrolling.
export function Navbar({ isLoggedIn, isAdmin }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const pathname = usePathname();
  const { t } = useLanguage();

  // Close the drawer on navigation (render-time update, no effect needed).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  const isDashboardOrAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
  const isDashboard = pathname?.startsWith("/dashboard");

  const navLinks: { href: string; label: string; icon: PixelIconName; isGold?: boolean }[] = [
    { href: "/", label: t("nav.home"), icon: "home" },
    { href: "/discover", label: t("nav.discover"), icon: "map" },
    { href: "/leaderboard", label: t("nav.leaderboard"), icon: "trophy" },
    { href: "/etershop", label: t("nav.etershop"), icon: "sparkle", isGold: true },
  ];

  return (
    <nav className="prism-top fixed top-0 inset-x-0 z-50 h-16 text-white on-dark" aria-label="Navigasi utama">
      <div className="w-full max-w-7xl h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        <Link href="/" className="hover-bob flex items-center shrink-0 min-h-[44px]" aria-label="EterVerse, ke beranda">
          <span className="bob-target inline-flex">
            <Logo size={30} tone="dark" />
          </span>
        </Link>

        {!isDashboardOrAdmin && (
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex items-center gap-2 min-h-[44px] px-3 font-pixel text-[15px] transition-colors ${
                      isActive ? "text-white" : link.isGold ? "text-gold-l hover:text-white" : "text-white/85 hover:text-white"
                    }`}
                  >
                    <PixelIcon name={link.icon} size={14} className={link.isGold ? "text-gold" : ""} />
                    {link.label}
                    {isActive && <span className="absolute left-3 right-3 bottom-1 h-[3px] bg-gold" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center">
            <LanguageSwitcher />
          </div>

          {!isDashboardOrAdmin && (
            <Link href="/dashboard/server/new" className="px-btn px-btn-gold px-btn-sm hidden lg:inline-flex">
              <PixelIcon name="plus" size={12} />
              {t("nav.submitServer")}
            </Link>
          )}

          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-3">
              {isAdmin && (
                <Link href="/admin" className="px-btn px-btn-dirt px-btn-sm">
                  <PixelIcon name="shield" size={12} />
                  {t("nav.admin")}
                </Link>
              )}
              {!isDashboard && (
                <Link href="/dashboard" className="px-btn px-btn-cream px-btn-sm">
                  {t("nav.dashboard")}
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="px-btn px-btn-cream px-btn-sm px-btn-icon !min-h-[36px] !min-w-[36px]"
                aria-label={t("nav.signOut")}
                title={t("nav.signOut")}
              >
                <PixelIcon name="logout" size={14} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-btn px-btn-cream px-btn-sm hidden sm:inline-flex">
              <PixelIcon name="user" size={12} />
              {t("nav.signIn")}
            </Link>
          )}

          {/* One menu button on phones. Dashboard pages open the dashboard drawer; admin
              pages have their own tab strip and need none. */}
          {isDashboard ? (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent(DASHBOARD_MENU_EVENT))}
              aria-controls="dashboard-nav"
              className="md:hidden px-btn px-btn-cream px-btn-sm !min-h-[44px]"
            >
              <PixelIcon name="menu" size={14} />
              Menu
            </button>
          ) : !isDashboardOrAdmin ? (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileOpen}
              aria-controls="public-nav"
              className="md:hidden px-btn px-btn-cream px-btn-icon"
            >
              <PixelIcon name={mobileOpen ? "close" : "menu"} size={16} />
            </button>
          ) : null}
        </div>
      </div>

      {mobileOpen && !isDashboardOrAdmin && (
        <div id="public-nav" className="md:hidden absolute top-[76px] inset-x-3 px-panel p-4 flex flex-col gap-4 px-pop text-ink max-h-[calc(100dvh-90px)] overflow-y-auto">
          <ul className="grid grid-cols-2 gap-3">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className="px-slot flex items-center gap-2.5 min-h-[52px] px-3 font-pixel text-base"
                  >
                    <PixelIcon name={link.icon} size={16} className={link.isGold ? "text-gold-d" : "text-prism-d"} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link href="/dashboard/server/new" className="px-btn px-btn-gold px-btn-block">
            <PixelIcon name="plus" size={12} />
            {t("nav.submitServer")}
          </Link>

          <div className="flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="px-btn px-btn-block">
                  {t("nav.dashboard")}
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="px-btn px-btn-dirt px-btn-block">
                    <PixelIcon name="shield" size={12} />
                    {t("nav.admin")}
                  </Link>
                )}
                <button onClick={() => signOut()} className="px-btn px-btn-cream px-btn-block">
                  <PixelIcon name="logout" size={14} /> {t("nav.signOut")}
                </button>
              </>
            ) : (
              <Link href="/login" className="px-btn px-btn-block">
                <PixelIcon name="user" size={12} />
                {t("nav.signIn")}
              </Link>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-ink/20">
            <span className="text-sm text-ink-2">Bahasa / Language</span>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}
