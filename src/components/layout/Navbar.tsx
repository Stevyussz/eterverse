"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cube, DiscordLogo, List, X, Sparkle, PlusCircle, SignOut } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

export function Navbar({ isLoggedIn = false, isAdmin = false }: { isLoggedIn?: boolean; isAdmin?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isDashboardOrAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/discover", label: "Discover" },
    { href: "/etershop", label: "EterShop", isGold: true },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-smooth ${
        scrolled || mobileOpen
          ? "bg-[#09090b]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group z-50">
          <div className="w-9 h-9 rounded-lg bg-eter-cyan/10 border border-eter-cyan/30 flex items-center justify-center group-hover:border-eter-cyan group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300">
            <Cube 
              weight="duotone" 
              size={22} 
              className="text-eter-cyan group-hover:rotate-12 transition-transform duration-300" 
            />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-eter-starlight">
            Eter<span className="text-eter-cyan">Verse</span>
          </span>
        </Link>

        {/* Desktop Links */}
        {!isDashboardOrAdmin && (
          <div className="hidden md:flex items-center gap-1 bg-black/40 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs font-mono px-3.5 py-1 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? link.isGold
                        ? "text-eter-gold bg-eter-gold/15 font-semibold shadow-[0_0_12px_rgba(234,179,8,0.3)]"
                        : "text-eter-cyan bg-eter-cyan/15 font-semibold shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                      : link.isGold
                      ? "text-zinc-400 hover:text-eter-gold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.isGold && <Sparkle size={12} weight="fill" className="text-eter-gold" />}
                  {link.label}
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full ${
                        link.isGold ? "bg-eter-gold" : "bg-eter-cyan"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Auth / Action Area */}
        <div className="flex items-center gap-3">
          {!isDashboardOrAdmin && (
            <Link
              href="/dashboard/server/new"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono font-medium text-eter-starlight hover:text-eter-cyan transition-colors px-3 py-1.5 rounded-md hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <PlusCircle size={15} />
              Submit Server
            </Link>
          )}
          
          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 bg-eter-gold/10 hover:bg-eter-gold/20 border border-eter-gold/30 text-eter-gold text-xs font-mono font-semibold px-3 py-2 rounded-md transition-all shadow-[0_0_12px_rgba(234,179,8,0.15)]"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-eter-cyan/10 hover:bg-eter-cyan/20 border border-eter-cyan/30 text-eter-cyan text-xs font-mono font-semibold px-3.5 py-2 rounded-md transition-all shadow-[0_0_12px_rgba(34,211,238,0.15)]"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 bg-white/5 hover:bg-eter-red/20 border border-white/10 hover:border-eter-red/30 text-zinc-400 hover:text-eter-red text-xs font-mono px-3 py-2 rounded-md transition-all"
                title="Log Out"
              >
                <SignOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-[#5865F2]/20 border border-white/10 hover:border-[#5865F2]/40 text-eter-starlight text-xs font-mono px-4 py-2 rounded-md transition-all duration-300"
            >
              <DiscordLogo weight="fill" size={16} className="text-[#5865F2]" />
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 rounded-md text-zinc-300 hover:text-white bg-white/5 border border-white/10 transition-colors"
          >
            {mobileOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#09090b]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
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
                        ? "bg-eter-gold/15 text-eter-gold border border-eter-gold/30 font-semibold"
                        : "bg-eter-cyan/15 text-eter-cyan border border-eter-cyan/30 font-semibold"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.isGold && <Sparkle size={16} weight="fill" className="text-eter-gold" />}
                    {link.label}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-eter-cyan" />}
                </Link>
              );
            })}
            <Link
              href="/dashboard/server/new"
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <PlusCircle size={18} className="text-eter-cyan" />
              Submit Server
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-2 bg-eter-gold/10 border border-eter-gold/30 text-eter-gold font-mono text-sm py-2.5 rounded-lg font-semibold"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 bg-eter-cyan/15 border border-eter-cyan/30 text-eter-cyan font-mono text-sm py-2.5 rounded-lg font-semibold"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-zinc-400 hover:text-eter-red font-mono text-sm py-2.5 rounded-lg"
                >
                  <SignOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 bg-[#5865F2]/20 border border-[#5865F2]/40 text-white font-mono text-sm py-2.5 rounded-lg font-semibold"
              >
                <DiscordLogo weight="fill" size={18} className="text-[#5865F2]" />
                Sign In with Discord
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

