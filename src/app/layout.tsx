import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";
import { auth } from "@/auth";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eterverse.com"),
  title: {
    default: "EterVerse - Daftar Server Minecraft Indonesia Terbaik (Java & Bedrock)",
    template: "%s | EterVerse",
  },
  description: "Temukan, jelajahi, dan vote server Minecraft Indonesia terbaik. Cek IP address, status online real-time, player count, rating komunitas, dan server SMP/PvP terpopuler.",
  keywords: [
    "server minecraft indonesia",
    "daftar server minecraft",
    "minecraft server list indonesia",
    "server minecraft java bedrock",
    "server minecraft smp",
    "server minecraft lifesteal indonesia",
    "ip server minecraft",
    "eterverse",
    "vote server minecraft",
    "minecraft server terbaik",
  ],
  authors: [{ name: "EterVerse Team", url: "https://eterverse.com" }],
  creator: "EterVerse",
  publisher: "EterVerse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://eterverse.com",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://eterverse.com",
    siteName: "EterVerse",
    title: "EterVerse - Platform Server Minecraft Indonesia Modern",
    description: "Temukan server Minecraft impianmu. Cek IP, live status, player count, rating, dan vote server favoritmu di EterVerse.",
    images: [
      {
        url: "https://eterverse.com/dashboard-bg.png",
        width: 1200,
        height: 630,
        alt: "EterVerse Minecraft Server Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EterVerse - Platform Server Minecraft Indonesia Modern",
    description: "Temukan server Minecraft impianmu. Cek IP, live status, player count, rating, dan vote server favoritmu di EterVerse.",
    images: ["https://eterverse.com/dashboard-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { BackgroundController } from "@/components/layout/BackgroundController";
import { Footer } from "@/components/layout/Footer";
import { WebsiteJsonLd } from "@/components/seo/JsonLdSchema";
import { LanguageProvider } from "@/context/LanguageContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isLoggedIn = !!session;
  
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
  const isAdmin = session?.user?.email ? adminEmails.includes(session.user.email) : false;

  return (
    <html lang="id" className="dark">
      <body
        className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <LanguageProvider>
          <WebsiteJsonLd />
          <BackgroundController />
          <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <Toaster theme="dark" position="bottom-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
