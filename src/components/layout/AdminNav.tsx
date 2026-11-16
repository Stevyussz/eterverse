"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Database, ArrowLeft } from "@phosphor-icons/react";

const LINKS = [
  { href: "/admin", label: "Moderasi", icon: ShieldCheck },
  { href: "/admin/database", label: "Database", icon: Database },
];

/** Vertical in the desktop sidebar, a swipeable tab bar on phones. */
export function AdminNav({ variant }: { variant: "sidebar" | "tabs" }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  if (variant === "tabs") {
    return (
      <nav aria-label="Navigasi admin" className="flex gap-1 overflow-x-auto scrollbar-none px-4">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={`shrink-0 inline-flex items-center gap-2 min-h-[44px] px-3 border-b-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-white ${
              isActive(href) ? "border-white text-white font-semibold" : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Icon size={18} aria-hidden /> {label}
          </Link>
        ))}
        <Link href="/dashboard" className="shrink-0 ml-auto inline-flex items-center gap-2 min-h-[44px] px-3 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft size={16} aria-hidden /> Dashboard
        </Link>
      </nav>
    );
  }

  return (
    <nav aria-label="Navigasi admin" className="flex flex-col gap-1">
      {LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(href) ? "page" : undefined}
          className={`min-h-[44px] flex items-center gap-3 px-4 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-white ${
            isActive(href) ? "bg-white/10 text-white font-semibold" : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Icon size={20} weight={isActive(href) ? "fill" : "regular"} aria-hidden /> {label}
        </Link>
      ))}
    </nav>
  );
}
