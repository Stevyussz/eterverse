"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "id" | "en";

export const translations = {
  // Navigation
  "nav.home": { id: "Beranda", en: "Home" },
  "nav.discover": { id: "Jelajah", en: "Discover" },
  "nav.etershop": { id: "EterShop", en: "EterShop" },
  "nav.submitServer": { id: "Daftarkan Server", en: "Submit Server" },
  "nav.signIn": { id: "Masuk", en: "Sign In" },
  "nav.signOut": { id: "Keluar", en: "Sign Out" },
  "nav.admin": { id: "Panel Admin", en: "Admin Panel" },
  "nav.dashboard": { id: "Dashboard", en: "Dashboard" },
  "nav.signInDiscord": { id: "Masuk dengan Discord", en: "Sign In with Discord" },

  // Homepage Hero & Slider
  "home.heroTitle": { id: "Temukan Server Minecraft Impianmu.", en: "Discover Your Next Minecraft Server." },
  "home.heroSubtitle": {
    id: "Direktori terkurasi server Minecraft terbaik (Java & Bedrock). Pantau status online real-time, vote server favorit, dan temukan komunitas barumu.",
    en: "Curated directory of the finest Minecraft servers (Java & Bedrock). Track real-time player counts, vote for your favorites, and join new communities."
  },
  "home.featuredServer": { id: "SERVER REKOMENDASI", en: "FEATURED SERVER" },
  "home.exploreServer": { id: "Jelajahi Server", en: "Explore Server" },
  "home.trendingNow": { id: "Sedang Tren Pekan Ini", en: "Trending This Week" },
  "home.topRated": { id: "Server Rating Tertinggi", en: "Top Rated Servers" },
  "home.newlyAdded": { id: "Server Baru Ditambahkan", en: "Recently Added" },
  "home.viewAll": { id: "Lihat Semua Server →", en: "View All Servers →" },
  "home.noServers": { id: "Belum ada server yang terdaftar di database.", en: "No servers listed in the database yet." },

  // AI Matchmaker
  "ai.badge": { id: "AI Server Matchmaker", en: "AI Server Matchmaker" },
  "ai.title": { id: "Cari server idaman dengan bahasa bebas.", en: "Find your ideal server using natural search." },
  "ai.desc": {
    id: "Ketik preferensi bermainmu, biarkan AI mencocokkan server terbaik untukmu.",
    en: "Describe your ideal playstyle and let AI recommend the perfect servers."
  },
  "ai.placeholder": {
    id: "Contoh: 'Cari server survival santai dengan sistem ekonomi dan anti grief'",
    en: "E.g. 'Chill survival server with custom economy and anti-grief'"
  },
  "ai.finding": { id: "Mencari server terbaik...", en: "Matching servers..." },
  "ai.findButton": { id: "Cari Rekomendasi", en: "Get Recommendations" },
  "ai.resultsTitle": { id: "Hasil Rekomendasi AI", en: "AI Recommended Servers" },
  "ai.closeResults": { id: "Tutup Hasil Rekomendasi", en: "Close Recommendations" },
  "ai.emptyQuery": { id: "Ketik deskripsi server yang kamu cari terlebih dahulu!", en: "Please enter your search description first!" },

  // Server Profile & Tabs
  "server.overview": { id: "Overview", en: "Overview" },
  "server.trailer": { id: "Trailer & Reels", en: "Trailer & Reels" },
  "server.gallery": { id: "Galeri", en: "Gallery" },
  "server.about": { id: "Tentang Server", en: "About Server" },
  "server.reviews": { id: "Rating & Komunitas", en: "Rating & Community" },
  "server.copyIp": { id: "Salin IP", en: "Copy IP" },
  "server.copyRealm": { id: "Salin Kode Realm", en: "Copy Realm Code" },
  "server.directPlay": { id: "Main Langsung", en: "Direct Play" },
  "server.joinRealm": { id: "Masuk Realm", en: "Join Realm" },
  "server.copied": { id: "Tersalin!", en: "Copied!" },
  "server.vote": { id: "Vote", en: "Vote" },
  "server.voted": { id: "Sudah Vote!", en: "Voted!" },
  "server.partner": { id: "Partner", en: "Partner" },
  "server.serverStatus": { id: "Status Server", en: "Server Status" },
  "server.onlinePlayers": { id: "Pemain Online", en: "Online Players" },
  "server.totalVote": { id: "Total Vote", en: "Total Votes" },
  "server.starRating": { id: "Rating Bintang", en: "Star Rating" },
  "server.serverAddress": { id: "Alamat Server Minecraft", en: "Minecraft Server Address" },
  "server.realmAddress": { id: "Kode Undangan Realm", en: "Realm Invite Code" },
  "server.serverSubtext": {
    id: "Mendukung Java & Bedrock Edition · Klik tombol untuk menyalin IP",
    en: "Supports Java & Bedrock Edition · Click button to copy IP"
  },
  "server.realmSubtext": {
    id: "Klik tombol untuk langsung bergabung ke Realm di Minecraft.",
    en: "Click button to join the Realm directly in Minecraft."
  },
  "server.summaryTitle": { id: "Ringkasan Server", en: "Server Overview" },
  "server.readFull": { id: "Baca Informasi & Aturan Selengkapnya →", en: "Read Full Information & Rules →" },
  "server.officialTrailer": { id: "Trailer Resmi", en: "Official Trailer" },
  "server.comingSoon": { id: "Coming Soon", en: "Coming Soon" },
  "server.clipsSubtitle": {
    id: "Fitur Reels vertikal untuk cuplikan gameplay PvP, build timelapse, dan momen seru server ini.",
    en: "Vertical Reels feature for PvP gameplay highlights, building timelapses, and community moments."
  },
  "server.noTrailer": { id: "Belum ada video trailer resmi", en: "No official trailer video available" },
  "server.noTrailerDesc": { id: "Owner server belum menambahkan video trailer untuk server ini.", en: "The server owner has not added a trailer video yet." },
  "server.noGallery": { id: "Belum ada foto galeri", en: "No gallery screenshots yet" },
  "server.noGalleryDesc": { id: "Owner server belum menambahkan screenshot galeri untuk server ini.", en: "The server owner has not uploaded any screenshots yet." },
  "server.rateTitle": { id: "Beri Penilaian untuk", en: "Leave a Rating for" },
  "server.rateDesc": {
    id: "Bantu komunitas mengetahui kualitas gameplay dan pelayanan server ini.",
    en: "Help the community learn about gameplay quality and moderation on this server."
  },
  "server.loginToRate": { id: "Masuk untuk memberi rating server ini", en: "Sign in to rate this server" },
  "server.yourRating": { id: "Rating Anda:", en: "Your rating:" },
  "server.clickToRate": { id: "Klik bintang untuk memberi rating", en: "Click a star to rate" },
  "server.officialCommunity": { id: "Hub Komunitas Resmi", en: "Official Community Hub" },
  "server.communitySubtitle": {
    id: "Gabung ke grup resmi untuk pengumuman event, update server, dan interaksi komunitas.",
    en: "Join the official server groups for event announcements, updates, and community chats."
  },
  "server.joinDiscord": { id: "Gabung Discord Resmi", en: "Join Official Discord" },
  "server.whatsappGroup": { id: "Grup WhatsApp Komunitas", en: "WhatsApp Community Group" },
  "server.telegramGroup": { id: "Channel / Grup Telegram", en: "Telegram Channel / Group" },
  "server.officialWebsite": { id: "Kunjungi Website Resmi", en: "Visit Official Website" },

  // Discover Page
  "discover.title": { id: "Jelajahi Server", en: "Discover Servers" },
  "discover.subtitle": { id: "server Minecraft aktif di EterVerse.", en: "active Minecraft servers on EterVerse." },
  "discover.searchPlaceholder": { id: "Cari berdasarkan nama, IP, atau deskripsi...", en: "Search by name, IP, or description..." },
  "discover.searchButton": { id: "Cari Server", en: "Search Servers" },
  "discover.sortVotes": { id: "Vote Terbanyak", en: "Most Votes" },
  "discover.sortRating": { id: "Rating Tertinggi", en: "Highest Rated" },
  "discover.sortNewest": { id: "Terbaru", en: "Newest" },
  "discover.sortPlayers": { id: "Pemain Terbanyak", en: "Most Players" },
  "discover.category": { id: "Kategori:", en: "Category:" },
  "discover.all": { id: "Semua", en: "All" },
  "discover.empty": { id: "Tidak ada server yang ditemukan. Coba kata kunci lain.", en: "No servers found. Try another search keyword." },

  // Footer
  "footer.tagline": {
    id: "Platform discovery dan kurasi server Minecraft generasi modern. Temukan server impianmu, vote favoritmu, dan bangun komunitas gaming tanpa batas.",
    en: "Modern Minecraft server discovery and curation platform. Find your dream server, vote for favorites, and build your gaming community."
  },
  "footer.explore": { id: "Jelajahi Server", en: "Explore Servers" },
  "footer.allServers": { id: "Semua Server", en: "All Servers" },
  "footer.newServers": { id: "Server Baru Ditambahkan", en: "Recently Added" },
  "footer.owners": { id: "Pemilik Server", en: "Server Owners" },
  "footer.submitServer": { id: "Daftarkan Server", en: "Submit Server" },
  "footer.free": { id: "Gratis", en: "Free" },
  "footer.dashboard": { id: "Dashboard Server", en: "Owner Dashboard" },
  "footer.partner": { id: "EterShop Partner", en: "EterShop Partner" },
  "footer.boost": { id: "Promosi & Boost", en: "Promote & Boost" },
  "footer.widget": { id: "Embed Status Widget", en: "Embed Status Widget" },
  "footer.community": { id: "Komunitas & Info", en: "Community & Info" },
  "footer.contact": { id: "Hubungi Kami", en: "Contact Us" },
  "footer.discord": { id: "Komunitas Discord", en: "Discord Community" },
  "footer.safe": { id: "Platform Aman & Terverifikasi", en: "Verified Safe Platform" },
  "footer.rights": { id: "Hak cipta dilindungi.", en: "All rights reserved." },
  "footer.disclaimer": {
    id: "EterVerse bukan layanan resmi Mojang Studios atau Microsoft. Minecraft adalah merek dagang terdaftar milik Mojang AB.",
    en: "EterVerse is not an official Minecraft service and is not affiliated with Mojang Studios or Microsoft. Minecraft is a trademark of Mojang AB."
  },
} as const;

export type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "id",
  setLang: () => {},
  t: (key) => translations[key]?.id || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("eterverse_lang") as Language | null;
      if (savedLang === "id" || savedLang === "en") {
        setLangState(savedLang);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("eterverse_lang", newLang);
    } catch {
      // ignore
    }
  };

  const t = (key: TranslationKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.id || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
