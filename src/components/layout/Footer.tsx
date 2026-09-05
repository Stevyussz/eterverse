"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cube, DiscordLogo, EnvelopeSimple, Heart, ShieldCheck, Sparkle } from "@phosphor-icons/react";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard, admin, and login pages for clean focused workspace
  const isExcludedPage = 
    pathname?.startsWith("/dashboard") || 
    pathname?.startsWith("/admin") || 
    pathname === "/login";

  if (isExcludedPage) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-zinc-800/80 bg-[#09090b] text-zinc-400 font-body text-sm overflow-hidden pb-28 lg:pb-12 pt-16">
      
      {/* Subtle top hair-line light highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-zinc-800/80">
          
          {/* Column 1: Brand & Identity (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/10 transition-colors">
                <Cube weight="duotone" size={18} className="text-zinc-200" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Eter<span className="text-zinc-400">Verse</span>
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-zinc-400 font-body leading-relaxed max-w-sm">
              Platform discovery dan kurasi server Minecraft Indonesia generasi modern. Temukan server impianmu, vote favoritmu, dan bangun komunitas gaming tanpa batas.
            </p>
          </div>

          {/* Column 2: Jelajahi Server */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase text-zinc-200 font-semibold tracking-wider">
              Jelajahi Server
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  Semua Server
                </Link>
              </li>
              <li>
                <Link href="/discover?tag=SMP" className="hover:text-white transition-colors">
                  Survival & SMP
                </Link>
              </li>
              <li>
                <Link href="/discover?tag=PvP" className="hover:text-white transition-colors">
                  PvP & Lifesteal
                </Link>
              </li>
              <li>
                <Link href="/discover?tag=RPG" className="hover:text-white transition-colors">
                  RPG & Economy
                </Link>
              </li>
              <li>
                <Link href="/discover?sort=newest" className="hover:text-white transition-colors">
                  Server Baru Ditambahkan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Pemilik Server */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase text-zinc-200 font-semibold tracking-wider">
              Pemilik Server
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/dashboard/server/new" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Daftarkan Server</span>
                  <span className="text-[9px] font-mono bg-white/10 px-1.5 py-0.2 rounded text-zinc-300">Free</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <Link href="/etershop" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkle size={13} className="text-amber-400" weight="fill" />
                  <span className="text-amber-300 font-medium">EterShop Partner</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/boost" className="hover:text-white transition-colors">
                  Promosi & Boost
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tools/widget" className="hover:text-white transition-colors">
                  Embed Status Widget
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Komunitas & Bantuan */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase text-zinc-200 font-semibold tracking-wider">
              Komunitas & Info
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="mailto:admin@eterverse.com"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <EnvelopeSimple size={14} />
                  <span>Hubungi Kami</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <DiscordLogo size={14} weight="fill" className="text-[#5865F2]" />
                  <span>Discord Community</span>
                </a>
              </li>
              <li>
                <span className="text-zinc-500 text-xs flex items-center gap-1">
                  <ShieldCheck size={14} />
                  Verified Safe Platform
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span>© {currentYear} EterVerse. All rights reserved.</span>
          </div>

          {/* Minecraft EULA Disclaimer */}
          <div className="text-center sm:text-right text-[11px] text-zinc-600 max-w-md font-sans">
            EterVerse bukan layanan resmi Mojang Studios atau Microsoft. Minecraft adalah merek dagang terdaftar milik Mojang AB.
          </div>
        </div>

      </div>
    </footer>
  );
}
