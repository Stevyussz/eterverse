import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <div className="bg-vignette"></div>
        <picture>
          <source media="(max-width: 768px)" srcSet="/wallpaper-mobile.png" />
          <img src="/wallpaper.png" className="bg-wallpaper" alt="EterVerse Wallpaper" />
        </picture>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
