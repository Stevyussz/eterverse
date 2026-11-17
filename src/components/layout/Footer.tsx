"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Logo } from "@/components/pixel/Logo";
import { PixelIcon } from "@/components/pixel/PixelIcon";

// Footer = the ground under the world: grass lip, then dirt. Cream text on dirt-d is 9.5:1.
export function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  const year = new Date().getFullYear();
  const linkCls = "inline-flex min-h-[32px] items-center gap-1.5 hover:text-gold transition-colors";

  return (
    <footer className="ground on-dark mt-16 text-cream text-sm pt-16 pb-28 lg:pb-12">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-10 border-b-2 border-dashed border-cream/20">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="w-fit" aria-label="EterVerse, ke beranda">
              <Logo size={30} tone="dark" />
            </Link>
            <p className="text-cream/85 leading-relaxed max-w-sm">{t("footer.tagline")}</p>
            <LanguageSwitcher showIcon className="text-cream" />
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-pixel text-base text-gold">{t("footer.explore")}</h2>
            <ul className="flex flex-col gap-1">
              <li><Link href="/discover" className={linkCls}>{t("footer.allServers")}</Link></li>
              <li><Link href="/discover?tag=SMP" className={linkCls}>Survival & SMP</Link></li>
              <li><Link href="/discover?tag=PvP" className={linkCls}>PvP & Lifesteal</Link></li>
              <li><Link href="/discover?tag=RPG" className={linkCls}>RPG & Economy</Link></li>
              <li><Link href="/leaderboard" className={linkCls}>{t("nav.leaderboard")}</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-pixel text-base text-gold">{t("footer.owners")}</h2>
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/dashboard/server/new" className={linkCls}>
                  {t("footer.submitServer")}
                  <span className="px-chip px-chip-gold !text-xs">{t("footer.free")}</span>
                </Link>
              </li>
              <li><Link href="/dashboard" className={linkCls}>{t("footer.dashboard")}</Link></li>
              <li><Link href="/dashboard/tools/votifier" className={linkCls}>Hadiah Vote (NuVotifier)</Link></li>
              <li><Link href="/dashboard/tools/widget" className={linkCls}>{t("footer.widget")}</Link></li>
              <li>
                <Link href="/etershop" className={linkCls}>
                  <PixelIcon name="sparkle" size={12} className="text-gold" />
                  {t("footer.partner")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-pixel text-base text-gold">{t("footer.community")}</h2>
            <ul className="flex flex-col gap-1">
              <li>
                <a href="mailto:admin@eterverse.com" className={linkCls}>
                  <PixelIcon name="mail" size={12} />
                  {t("footer.contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/75">
          <span>© {year} EterVerse. {t("footer.rights")}</span>
          <span className="text-center sm:text-right max-w-md">{t("footer.disclaimer")}</span>
        </div>
      </div>
    </footer>
  );
}
