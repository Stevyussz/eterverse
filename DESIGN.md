
# ✦ UI/UX DESIGN SYSTEM: ETERVERSE
**Theme: UNIVERSAL PREMIUM GAMING & TECH AESTHETIC (Anti-AI Slop)**

## 🚫 1. THE "ANTI-AI SLOP" MANIFESTO
UI ini harus terlihat dirancang oleh desainer senior, bukan hasil *generate* algoritma. AI Agent/Developer **DILARANG KERAS** menggunakan pola desain generik berikut:

- ❌ **NO Emojis:** DILARANG menggunakan emoji (🟢, ✨, 🔥, dll) di dalam UI. Semua ikon WAJIB menggunakan Phosphor Icons.
- ❌ **NO Heavy Frosted Glass:** Dilarang menggunakan `backdrop-blur` tebal dengan *background* putih/abu-abu terang.
- ❌ **NO Pastel/Rainbow Gradients:** Dilarang menggunakan gradien warna-warni yang mencolok.
- ❌ **NO Excessive Rounding:** Dilarang menggunakan `rounded-3xl` atau `rounded-full` pada *card*.
- ❌ **NO Floating 3D/Clay Assets.**

**✅ THE ETERVERSE AESTHETIC:**
- **Sharp, Clean, & Smooth:** UI terasa elegan namun tegas. Kombinasi garis 1px (`border-white/10`) dengan transisi yang sangat *fluid*.
- **Iconography-Led:** Mengandalkan Phosphor Icons untuk memperkuat hierarki visual tanpa terlihat kekanak-kanakan.
- **High-Contrast Typography:** Teks terang di atas ruang gelap yang bernapas (*whitespace* luas).

---

## 🔠 2. TYPOGRAPHY SYSTEM
Gunakan font modern yang universal, variaif, sangat bersih, namun tetap memiliki karakter *tech/gaming/estetik* premium. Setup via `next/font`.

1. **HEADING & DISPLAY: `Outfit` atau `Space Grotesk`**
   - *Fungsi:* Judul Hero, Nama Server, Call to Action (CTA).
   - *Karakteristik:* Modern, geometris, elegan, sangat cocok untuk platform digital masa depan tanpa terasa terlalu "fantasi".
   - *Styling:* Gunakan *weight* Medium (500) atau SemiBold (600) dengan *tracking-tight*.

2. **BODY & UI TEXT: `Plus Jakarta Sans` atau `Inter`**
   - *Fungsi:* Deskripsi, navigasi, *tags*.
   - *Karakteristik:* Sangat bersih, rasio tinggi (X-height), mudah dibaca di layar HP maupun desktop.

3. **TECHNICAL DATA: `JetBrains Mono`**
   - *Fungsi:* IP Server, Port, Jumlah Player Online.

---

## 🔶 3. ICONOGRAPHY SYSTEM (PHOSPHOR ICONS STRICT)
**WAJIB menggunakan `phosphor-icons` (via `@phosphor-icons/react` atau webfonts).**
- **Konsistensi Ketebalan (Weight):** 
  - Gunakan `weight="regular"` atau `weight="light"` untuk UI umum (navigasi, deskripsi).
  - Gunakan `weight="fill"` atau `weight="duotone"` HANYA untuk *state* aktif (misalnya tombol "Copy IP" yang berhasil diklik, atau bintang rating).
- **Contoh Penggunaan (Tanpa Emoji):**
  - Online Status: Gunakan ikon `<Circle weight="fill" className="text-eter-cyan" />`
  - Copy IP: Gunakan ikon `<Copy weight="duotone" />`
  - Badge EterShop: Gunakan ikon `<Diamond weight="fill" className="text-eter-gold" />`

---

## 🎨 4. COLOR PALETTE (PREMIUM DARK MODE)
Palet warna ini dirancang untuk menyatu dengan *background wallpaper* universal (entah itu pemandangan alam, kota malam, atau ilustrasi elegan).

- **Background (Obsidian):** `#09090B` (Hitam solid premium).
- **Surface (Translucent):** `rgba(9, 9, 11, 0.75)` (Gelap transparan tanpa blur berlebihan).
- **Borders (Hairline):** `rgba(255, 255, 255, 0.1)` (Garis batas super tipis).
- **Text Primary:** `#FAFAFA` (Putih terang).
- **Text Muted:** `#A1A1AA` (Zinc 400 - abu-abu elegan).
- **BRAND ACCENT (EterShop Identity):** 
  - 👑 **Cyber Gold:** `#EAB308` (Untuk elemen VIP, Partner EterShop).
  - 💠 **Neon Cyan:** `#22D3EE` (Untuk status *Online*, notifikasi sukses).
  - 🛑 **Crimson Red:** `#F43F5E` (Untuk status *Offline*/Error).

---

## 🖼️ 5. BACKGROUND INTEGRATION (THE VIGNETTE EFFECT)
Untuk menjaga agar UI tetap estetik dan tulisan terbaca jelas di atas *background* (gambar), gunakan teknik *Dark Vignette Overlay*.

**Aturan CSS (Global):**
```css
/* Background utama (Gambar dari user) */
.bg-wallpaper {
  position: fixed;
  inset: 0;
  z-index: -2;
  object-fit: cover;
  filter: contrast(105%) brightness(90%);
}

/* Vignette gelap di sekeliling layar dan bagian bawah */
.bg-vignette {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: 
    linear-gradient(to top, #09090B 15%, rgba(9,9,11,0.85) 40%, rgba(9,9,11,0.2) 100%),
    radial-gradient(circle at center, transparent 30%, rgba(9,9,11,0.75) 100%);
}

```

---

## 🏗️ 6. UI COMPONENTS ARCHITECTURE

### A. The "Video-First" Server Card

* **Rasio:** Vertikal (9:16).
* **Border:** `border border-white/10`.
* **Corner:** `rounded-lg` (8px).
* **Media:** Video otomatis *play* (tanpa suara) saat *hover*.
* **Content Overlay:** Gradasi linier `from-[#09090B] to-transparent` di bagian bawah.
* **Data Stat (Menggunakan Phosphor):**
`<div className="flex items-center gap-1.5 font-mono text-sm">`
`<Users weight="bold" className="text-eter-cyan" /> 240/500`
`</div>`

### B. The Elegant CTA Button

* **Style:** Latar belakang *Solid White* dengan teks Hitam (`bg-white text-black`).
* **Typography:** `font-semibold tracking-wide px-6 py-2.5 rounded-md`.
* **Hover:** *Background* berubah menjadi `bg-zinc-200`, dilengkapi animasi geser ikon (`translate-x-1` pada ikon panah Phosphor `<ArrowRight />`).

### C. Search Input (AI Matchmaker)

* **Container:** `bg-black/50 border border-white/20 focus-within:border-eter-cyan transition-colors rounded-xl px-4 py-3 flex items-center gap-3`.
* **Icon:** `<MagnifyingGlass weight="bold" className="text-zinc-400" />`.
* **Shortcut Badge:** `<kbd className="font-mono text-xs border border-white/20 rounded px-2 py-1 text-zinc-500">Ctrl K</kbd>`.

---

## ✨ 7. MICRO-INTERACTIONS

* **Rule of Thumb:** Animasi harus cepat, stabil dan *snappy* (tidak *sluggish*).
* **Duration & Easing:** Gunakan durasi `300ms` dengan kurva `cubic-bezier(0.4, 0, 0.2, 1)`.
* **Hover States:** Hampir semua elemen interaktif harus memiliki transisi warna *border* (dari `white/10` menjadi `white/30` atau `eter-cyan`) dengan stabil.

---

## 🛠️ 8. TAILWIND CSS v4 CONFIGURATION

Sesuai standar terbaru Tailwind v4, TIDAK ADA lagi `tailwind.config.ts`. Masukkan konfigurasi langsung ke `globals.css` menggunakan direktif `@theme`.

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-eter-abyss: #09090B;
  --color-eter-surface: rgba(9, 9, 11, 0.75);
  --color-eter-starlight: #FAFAFA;
  --color-eter-gold: #EAB308;
  --color-eter-cyan: #22D3EE;
  --color-eter-red: #F43F5E;
  
  /* Fonts (Asumsikan variabel dari next/font) */
  --font-display: var(--font-outfit), sans-serif;
  --font-body: var(--font-plus-jakarta), sans-serif;
  --font-mono: var(--font-jetbrains-mono), monospace;

  /* Custom Transitions */
  --transition-property-smooth: all;
  --transition-timing-function-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --transition-duration-smooth: 300ms;
}

@layer base {
  body {
    background-color: var(--color-eter-abyss);
    color: var(--color-eter-starlight);
    font-family: var(--font-body);
    /* Mencegah scrollbar jelek merusak UI */
    scrollbar-color: var(--color-eter-surface) var(--color-eter-abyss); 
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
  }
}

```

```

***