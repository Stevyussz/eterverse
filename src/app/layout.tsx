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
  title: "EterVerse | Premium Minecraft Server Discovery",
  description: "Temukan server Minecraft terbaik di EterVerse.",
};

import { BackgroundController } from "@/components/layout/BackgroundController";
import { Footer } from "@/components/layout/Footer";

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
        <BackgroundController />
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
