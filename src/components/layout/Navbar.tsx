"use client";

import Link from "next/link";
import { Cube, DiscordLogo } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-smooth ${
        scrolled
          ? "bg-eter-surface/80 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Cube 
            weight="duotone" 
            size={28} 
            className="text-eter-cyan group-hover:rotate-12 transition-transform duration-smooth" 
          />
          <span className="font-display font-semibold text-xl tracking-tight text-eter-starlight">
            EterVerse
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-eter-starlight transition-colors duration-smooth">
            Home
          </Link>
          <Link href="/discover" className="text-sm font-medium text-zinc-400 hover:text-eter-starlight transition-colors duration-smooth">
            Discover
          </Link>
          <Link href="/etershop" className="text-sm font-medium flex items-center gap-1.5 text-zinc-400 hover:text-eter-gold transition-colors duration-smooth">
            EterShop
          </Link>
        </div>

        {/* Auth / CTA */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/server/new" className="hidden sm:block text-sm font-medium text-eter-starlight hover:text-eter-cyan transition-colors duration-smooth">
            Submit Server
          </Link>
          
          {isLoggedIn ? (
            <Link href="/dashboard" className="flex items-center gap-2 bg-eter-cyan/10 hover:bg-eter-cyan/20 border border-eter-cyan/30 text-eter-cyan text-sm font-medium px-4 py-2 rounded-md transition-all duration-smooth">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-eter-starlight text-sm font-medium px-4 py-2 rounded-md transition-all duration-smooth">
              Sign In
            </Link>
          )}
        </div>
        
      </div>
    </nav>
  );
}
