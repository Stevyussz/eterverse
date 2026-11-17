"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PixelIcon, type PixelIconName } from "@/components/pixel/PixelIcon";

const LINKS: { href: string; label: string; icon: PixelIconName }[] = [
  { href: "/admin", label: "Moderasi", icon: "shield" },
  { href: "/admin/database", label: "Database", icon: "database" },
];

/** Vertical in the wooden desktop sidebar, a swipeable slot strip on phones. */
export function AdminNav({ variant }: { variant: "sidebar" | "tabs" }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  if (variant === "tabs") {
    return (
      <nav aria-label="Navigasi admin" className="flex gap-3 overflow-x-auto scrollbar-none px-4 py-2.5">
        {LINKS.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className="px-slot shrink-0 inline-flex items-center gap-2 min-h-[44px] px-3.5 font-pixel text-sm"
          >
            <PixelIcon name={icon} size={14} /> {label}
          </Link>
        ))}
        <Link href="/dashboard" className="shrink-0 ml-auto inline-flex items-center gap-2 min-h-[44px] px-2 font-pixel text-sm text-ink-2 hover:text-ink">
          <PixelIcon name="arrow" size={12} /> Dashboard
        </Link>
      </nav>
    );
  }

  return (
    <nav aria-label="Navigasi admin" className="flex flex-col gap-1.5">
      {LINKS.map(({ href, label, icon }) => (
        <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className="wood-link !justify-start">
          <PixelIcon name={icon} size={16} /> {label}
        </Link>
      ))}
    </nav>
  );
}
