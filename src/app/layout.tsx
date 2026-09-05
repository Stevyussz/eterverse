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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eterverse.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EterVerse - Platform Server Minecraft Indonesia Terbaik (Java & Bedrock)",
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
  authors: [{ name: "EterVerse Team", url: SITE_URL }],
  creator: "EterVerse",
  publisher: "EterVerse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "EterVerse",
    title: "EterVerse - Platform Server Minecraft Indonesia Modern",
    description: "Temukan server Minecraft impianmu. Cek IP, live status, player count, rating, dan vote server favoritmu di EterVerse.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        secureUrl: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "EterVerse Minecraft Server Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EterVerse - Platform Server Minecraft Indonesia Modern",
    description: "Temukan server Minecraft impianmu. Cek IP, live status, player count, rating, dan vote server favoritmu di EterVerse.",
    images: [`${SITE_URL}/og-image.jpg`],
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
      <head>
        <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
        <meta property="og:image:secure_url" content={`${SITE_URL}/og-image.jpg`} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="EterVerse - Platform Server Minecraft Indonesia" />
        <link rel="image_src" href={`${SITE_URL}/og-image.jpg`} />
      </head>
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
