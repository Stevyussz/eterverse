"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cube, DiscordLogo, List, X, Sparkle, PlusCircle, SignOut } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

interface NavbarProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export function Navbar({ isLoggedIn, isAdmin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isOver = window.scrollY > 20;
          setScrolled((prev) => (prev !== isOver ? isOver : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isDashboardOrAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/discover", label: t("nav.discover") },
    { href: "/etershop", label: t("nav.etershop"), isGold: true },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-smooth ${
        scrolled || mobileOpen
          ? "bg-[#09090b] sm:bg-[#09090b]/90 sm:backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group z-50">
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/25 group-hover:bg-white/10 transition-all duration-300">
            <Cube 
              weight="duotone" 
              size={20} 
              className="text-zinc-200 group-hover:rotate-12 transition-transform duration-300" 
            />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Eter<span className="text-zinc-400">Verse</span>
          </span>
        </Link>

        {/* Desktop Links */}
        {!isDashboardOrAdmin && (
          <div className="hidden md:flex items-center gap-1 bg-zinc-900/60 border border-zinc-800 rounded-full px-3 py-1 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs font-mono px-3.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? link.isGold
                        ? "text-amber-300 bg-amber-500/10 font-semibold"
                        : "text-white bg-white/10 font-semibold"
                      : link.isGold
                      ? "text-zinc-400 hover:text-amber-300"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.isGold && <Sparkle size={12} weight="fill" className="text-amber-400" />}
                  {link.label}
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full ${
                        link.isGold ? "bg-amber-400" : "bg-white"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Auth / Action Area */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher on Desktop */}
          <div className="hidden sm:flex items-center">
            <LanguageSwitcher />
          </div>

          {!isDashboardOrAdmin && (
            <Link
              href="/dashboard/server/new"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-zinc-800"
            >
              <PlusCircle size={15} />
              {t("nav.submitServer")}
            </Link>
          )}
          
          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-mono font-semibold px-3 py-2 rounded-lg transition-all"
                >
                  {t("nav.admin")}
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-mono font-semibold px-3.5 py-2 rounded-lg transition-all shadow-sm"
              >
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 bg-zinc-900/60 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/30 text-zinc-400 hover:text-red-400 text-xs font-mono px-3 py-2 rounded-lg transition-all"
                title={t("nav.signOut")}
              >
                <SignOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-[#5865F2]/15 border border-white/10 hover:border-[#5865F2]/30 text-white text-xs font-mono px-4 py-2 rounded-lg transition-all"
            >
              <DiscordLogo weight="fill" size={16} className="text-[#5865F2]" />
              {t("nav.signIn")}
            </Link>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            className="md:hidden p-2 rounded-md text-zinc-300 hover:text-white bg-white/5 border border-white/10 transition-colors"
          >
            {mobileOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#09090b]/95 backdrop-blur-2xl border-b border-zinc-800 px-6 py-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
          {/* Mobile Language Switcher Row */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Bahasa / Language</span>
            <LanguageSwitcher showIcon />
          </div>

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? link.isGold
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/25 font-semibold"
                        : "bg-white/10 text-white border border-white/15 font-semibold"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.isGold && <Sparkle size={16} weight="fill" className="text-amber-400" />}
                    {link.label}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </Link>
              );
            })}
            <Link
              href="/dashboard/server/new"
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <PlusCircle size={18} className="text-zinc-400" />
              {t("nav.submitServer")}
            </Link>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-sm py-2.5 rounded-lg font-medium"
                  >
                    {t("nav.admin")}
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 bg-white text-zinc-950 font-mono text-sm py-2.5 rounded-lg font-semibold"
                >
                  {t("nav.dashboard")}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-2 bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-red-400 font-mono text-sm py-2.5 rounded-lg"
                >
                  <SignOut size={16} /> {t("nav.signOut")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 bg-[#5865F2]/15 border border-[#5865F2]/30 text-white font-mono text-sm py-2.5 rounded-lg font-semibold"
              >
                <DiscordLogo weight="fill" size={18} className="text-[#5865F2]" />
                {t("nav.signInDiscord")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

