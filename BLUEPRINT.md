
# 🚀 PROJECT BLUEPRINT: ETERVERSE
**Next-Gen Minecraft Server Discovery, SEO Dominance & Community Platform**

## 1. PROJECT OVERVIEW
**EterVerse** adalah platform *discovery* server Minecraft bergaya modern (Video-First, AI-Powered) yang dirancang untuk menggantikan *server list* tradisional. Platform ini memiliki 2 fungsi rahasia:
1. **B2B Funnel:** Meningkatkan penjualan produk digital/addon dari **EterShop**.
2. **SEO Dominance:** Mendominasi halaman 1 Google untuk SETIAP pencarian nama server Minecraft di Indonesia, menciptakan *loop* promosi timbal balik antara EterVerse dan Server Owner.

### 🎯 Core Objectives:
- **B2C (Player):** Menemukan server instan via Groq AI Matchmaker.
- **B2B (Server Owner):** Mendapatkan trafik organik via ranking #1 Google dari halaman profil server mereka di EterVerse.
- **Business (EterShop):** Memprioritaskan (*boosting*) server klien EterShop, memaksa server lain membeli layanan demi *Verified Badge*.

---

## 2. TECH STACK ARCHITECTURE (SCALEABLE & SEO-FIRST)
Sistem ini menggunakan arsitektur *Serverless Edge* dan fitur native SEO dari Next.js 15.

### Frontend & SEO Engine
- **Framework:** Next.js 15 (App Router, React Server Components).
- **SEO Optimization:** Native `generateMetadata`, Dynamic `sitemap.xml`, dan **JSON-LD Schema Markup** (Agar hasil pencarian Google memunculkan rating dan status server).
- **Styling:** Tailwind CSS **v4** (Native CSS `@theme`).
- **Icons:** Phosphor Icons (Wajib, Dilarang pakai Emoji).

### Backend & Data
- **Database:** MongoDB Atlas (Index khusus pada `slug` untuk query super cepat).
- **Caching & Rate Limiting:** Redis via Upstash.
- **AI Engine:** Groq API (Llama-3-8b-8192) via Vercel AI SDK.
- **Background Jobs:** Upstash QStash (Cron status ping server).

---

## 3. DESIGN SYSTEM: UNIVERSAL PREMIUM AESTHETIC
**Status: STRICT ENFORCEMENT (ANTI-AI SLOP)**

- **Tipografi:** `Outfit` (Heading) + `Plus Jakarta Sans` (Body) + `JetBrains Mono` (Data).
- **Warna:** `#09090B` (Hitam Obsidian) + `rgba(9, 9, 11, 0.75)` (Transparan).
- **Accent:** `Cyber Gold` (`#EAB308`) dan `Neon Cyan` (`#22D3EE`).
- **Komponen UI:** Garis *border* setipis rambut (`border-white/10`), tanpa Drop Shadow besar.

---

## 4. DATABASE SCHEMA (MONGODB) - SEO OPTIMIZED

### Collection: `servers`
```typescript
interface IServer {
  _id: ObjectId;
  name: string;               
  slug: string;               // CRUCIAL FOR SEO: "nusantara-lifesteal-smp" (UNIQUE INDEX)
  description: string;        
  ipAddress: string;          
  port: number;               
  videoUrl: string;           
  tags: string[];             
  
  // FUNNEL LOGIC
  isEterShopPartner: boolean; 
  moderationStatus: 'PENDING' | 'APPROVED' | 'BANNED';
  
  // ANALYTICS & SEO
  metrics: {
    impressions: number;      
    clicks: number;           
    votes: number;            
    rating: number;           // Untuk Rich Snippet Google (e.g., 4.8/5)
  };
  
  liveStatus: {
    isOnline: boolean;
    currentPlayers: number;
    maxPlayers: number;
    lastChecked: Date;
  };
  
  ownerId: ObjectId;          
  createdAt: Date;
}

```

---

## 5. THE SEO "MUTUAL GROWTH" LOOP

Ini adalah rahasia bagaimana EterVerse akan merajai halaman 1 Google tanpa membayar iklan:

1. **Clean Architecture URL:** URL profil server bukan menggunakan ID jelek (`/server/12345`), melainkan menggunakan Slug (`/server/nusantara-lifesteal-smp`). Google SANGAT menyukai ini.
2. **Dynamic Meta Title & Description:** Next.js akan men- *generate* metadata otomatis.
* *Title:* `Nusantara Lifesteal SMP - IP, Ping & Status | EterVerse`
* *Description:* `Main di Nusantara Lifesteal SMP sekarang! Server Minecraft Indonesia terbaik. Copy IP: play.nusantara.net, Online: 145 players. Temukan komunitasmu di EterVerse.`


3. **The Widget Backlink Strategy (The Nuke):**
* Pemilik server akan diberikan kode HTML/Markdown untuk memajang **"EterVerse Live Status Widget"** di website atau Discord mereka.
* Widget ini mengandung *backlink* (Dofollow) ke EterVerse.
* Ratusan server memasang widget ini = Domain Authority (DA) EterVerse meroket tak terbendung. Google akan menganggap EterVerse sebagai direktori Minecraft nomor 1 di Indonesia.



---

## 6. CORE ALGORITHMS & SEO MECHANISMS

### A. JSON-LD Schema (Google Rich Snippets)

Setiap halaman `/server/[slug]` WAJIB me- *render* tag `<script type="application/ld+json">` yang berisi skema `VideoGame` atau `SoftwareApplication`. Ini membuat hasil pencarian Google menampilkan bintang rating (⭐⭐⭐⭐⭐) dan jumlah *player online* langsung di halaman pencarian.

### B. The Groq Matchmaker (AI Speed)

1. Input -> Vercel AI SDK -> **Groq API**.
2. *Redis Caching:* Simpan respons (Semantic Cache) agar kecepatan tetap < 200ms.

### C. The EterShop Boosting Logic

1. `isEterShopPartner: true` (Ranking 1 - Mendapat badge & Prioritas sitemap)
2. `liveStatus.currentPlayers` (Ranking 2)
3. `metrics.votes` (Ranking 3)

---

## 7. IMPLEMENTATION ROADMAP (FOR DEVELOPERS / AI AGENTS)

* [ ] **Phase 1: Environment & Architecture**
* Setup Next.js 15, Tailwind v4 (@theme), Phosphor Icons.


* [ ] **Phase 2: Database & Auth**
* Setup Mongoose Schema. **PENTING:** Buat *middleware* atau utilitas untuk memvalidasi `slug` saat server didaftarkan agar URL *SEO-friendly*.
* Integrasikan NextAuth (Discord).


* [ ] **Phase 3: Core UI & EterShop Funnel**
* Bangun `ServerCard` (Video Hover Logic) dan Halaman Profil Server.


* [ ] **Phase 4: THE SEO ENGINE (CRITICAL)**
* Implementasikan fungsi `generateMetadata` di `app/server/[slug]/page.tsx`.
* Buat komponen `JsonLdSchema.tsx` untuk menyuntikkan *Structured Data* ke Google.
* Bangun dinamis `app/sitemap.ts` yang me- *looping* seluruh server berstatus `APPROVED`.
* Bangun fitur "Embed Widget" di dashboard Owner (Menghasilkan script iframe backlink).


* [ ] **Phase 5: AI & Background Jobs**
* Setup Groq API (AI Matchmaker).
* Setup Upstash QStash *Cron Job* (Ping status otomatis tiap 5 menit).


* [ ] **Phase 6: Deployment**
* Deploy ke Vercel. Submit `sitemap.xml` ke Google Search Console.

## 8. APP ROUTER STRUCTURE (PAGES)
Struktur direktori Next.js App Router (di dalam folder `src/app`) harus mematuhi hierarki berikut:

- `(public)`
  - `/` (Home - AI Matchmaker & Feed)
  - `/explore` (Manual Filter Catalog)
  - `/server/[slug]` (SEO Server Profile + JSON-LD)
  - `/login` (Discord OAuth Auth page)
- `(player)`
  - `/profile` (Player stats, EterCoins, Bookmarks)
- `(owner)` -> Terproteksi Middleware (Role: OWNER)
  - `/dashboard` (Analytics Overview)
  - `/dashboard/server/new` (Submission Form)
  - `/dashboard/server/[id]` (Edit Data)
  - `/dashboard/tools/widget` (Embed Widget Generator)
  - `/dashboard/boost` (EterShop Upsell Page)
- `(admin)` -> Terproteksi Middleware (Role: ADMIN)
  - `/admin` (Moderation Queue: Pending -> Approved)
  - `/admin/partners` (Toggle `isEterShopPartner` flag)

---

> **Developer Note:** Proyek ini BUKAN sekadar website, ini adalah Mesin Akuisisi. Kecepatan load (Core Web Vitals), struktur heading (H1, H2), dan optimasi JSON-LD adalah prioritas utama untuk merajai SEO. *Build it clean, make it fast, conquer Google.* 🚀

```

