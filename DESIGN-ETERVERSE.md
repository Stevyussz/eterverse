# DESIGN-ETERVERSE.md: EterVerse (keluarga Eterverse)

Mengikuti `DESIGN.md` (aturan keluarga). Dokumen ini hanya berisi yang khusus EterVerse.
Kalau ada yang bertentangan, `DESIGN.md` menang, kecuali tercatat di bagian "Pengecualian".

---

## 1. Identitas

- **Produk:** server list Minecraft Indonesia yang *video-first*. Pemain menonton trailer gameplay dulu, lalu menyalin IP atau menekan Main Langsung. Owner server mendaftarkan server, menyambungkan hadiah vote, dan memantau statistik.
- **Dua pengguna:** pemain (sering di HP murah, butuh cepat) dan owner server (butuh alasan untuk mendaftar dan kembali).
- **Kepribadian:** ramah, gamer, jujur, praktis.
- **Motif utama: layar Multiplayer Minecraft.** Setiap server tampil seperti entri di daftar Multiplayer: ikon server di kiri, nama, baris info, sinyal ping, jumlah pemain.
- **Motif pendukung:**
  - **Portal prismarine** = logo dan pusat adegan beranda ("pintu ke dunia lain").
  - **Layar trailer** (`.px-screen`) = monitor gelap berbingkai tinta tempat video diputar.
  - **Chip IP** (`.ip-chip`) = alamat ditulis seperti diketik di game: mono, latar tinta, caret `>` emas.

## 2. Biome dan palet

- **Utama (30%): Prismarine.** Tabel keluarga menandainya "Server, tenang".
- **Aksen (10%): emas.** Dipakai untuk aksi utama pemain (Salin IP), pilihan aktif, dan hadiah.
- **Info:** Lapis (`--color-lapis` #1E3F8F), karena biome-nya prismarine (aturan keluarga).

| Token (Tailwind) | Hex | Peran |
|---|---|---|
| `cream` | #F2EAD3 | latar halaman |
| `panel` / `panel-2` | #FFFBF0 / #F7EFDC | panel, kartu |
| `slot` | #E6DABD | slot cekung, skeleton |
| `ink` / `ink-2` / `ink-3` | #2E2216 / #5E4A33 / #7A644A | teks, bingkai |
| `prism-d` / `prism` / `prism-l` | #1D5E57 / #2E8077 / #77C9BC | header, tombol utama, chip platform |
| `gold` / `gold-d` / `gold-l` | #F2B318 / #8A5A00 / #FFF1C2 | aksen 10% |
| `dirt` / `dirt-d` | #6B4528 / #4E3420 | footer tanah, sidebar kayu |
| `online` / `online-d` | #2F8F1F / #226B14 | **status online saja**: ikon sinyal / teks |
| `redstone` / `redstone-l` | #B8322A / #FBE3DF | error, ditolak, dibekukan |
| `lapis` / `lapis-l` | #1E3F8F / #E3EAFB | info |
| `screen` | #1B1510 | latar video |

### Kontras yang dipakai (WCAG 2.1, dihitung)

| Pasangan | Rasio |
|---|---|
| Putih di `prism-d` (navbar, tombol) | 7.52 |
| `gold-l` di `prism-d` (link navbar EterShop) | 6.67 |
| `ink` di cream / panel | 13+ |
| `ink-2` di panel / cream | 8.11 / 6.98 |
| `ink-3` di cream (placeholder) | 4.66 |
| `online-d` di panel / cream | 6.38 / 5.50 |
| Ikon `online` di panel (grafis, butuh 3:1) | 4.01 |
| Cream di `dirt-d` (footer, sidebar) | 9.52 |
| `cream/75` di `dirt-d` | 6.12 |
| Emas di `dirt-d` (judul footer) | 6.12 |
| Ink di `gold` (tombol emas) | 8.28 |
| Ink di `prism-l` (chip platform) | 8.01 |
| Ink di langit hero #CDE8F4 | 12+ |

`prism` (#2E8077) **tidak boleh** jadi latar teks putih kecil (4.7, lolos hanya tipis). Pakai `prism-d`.

## 3. Tipografi

Sesuai keluarga: **Pixelify Sans** (`font-pixel`, juga `font-display`) untuk judul, tombol, label, tab; **Plus Jakarta Sans** untuk paragraf dan form; angka statistik pakai Jakarta tebal + `tabular`.

Khusus EterVerse: **JetBrains Mono** hanya untuk alamat server (IP, port, kode Realm, kode embed). Variabel font dipasang di `<html>`, bukan `<body>`, karena token `@theme` dibaca di `:root`.

## 4. Komponen

### Dari keluarga (nama dan perilaku sama dengan EterShop)
Tersedia di `src/app/globals.css`: `.px-panel`, `.px-flat`, `.px-frame`, `.px-btn` (+ `-gold`, `-cream`, `-red`, `-dirt`, `-sm`, `-icon`, `-block`), `.px-slot`, `.px-input`, `.px-bar` (+ `-gold`), `.px-chip`, `.px-title`, `.px-title-shadow`, `.sand-band`, `.ground`.

Komponen React: `PixelIcon` (grid 12x12) dan `Sprite`, keduanya di `src/components/pixel/`.

### Khusus EterVerse

| Kelas / komponen | Lokasi | Kapan dipakai |
|---|---|---|
| `.prism-top` | globals.css | navbar: prismarine dengan tetesan pixel |
| `.prism-bricks` | globals.css | blok CTA owner, banner server tanpa gambar |
| `.wood` / `.wood-link` | globals.css | sidebar dashboard dan admin (aturan keluarga "sidebar kayu") |
| `.px-screen` | globals.css | wadah semua video, trailer, galeri |
| `.ip-chip` + `.ip-chip-caret` | globals.css | setiap alamat server (caret berkedip saat kartu di-hover) |
| `.px-note` (+ `-error`, `-info`, `-gold`) | globals.css | pemberitahuan; selalu ikon + teks |
| `.px-btn-discord` | globals.css | tombol login Discord |
| `LiveIcon` | components/ui | status server = **bar ping Minecraft**: 4 bar hijau saat online, bar datar + X saat offline |
| `Logo` | components/pixel | sprite portal + wordmark "EterVerse" |
| `VerseScene` | components/pixel | adegan hero beranda dan login: dunia blok dengan portal di tengah |
| `PageHero` | components/pixel | header halaman publik (pita sandstone) |
| `DashHeader` | components/dashboard | header halaman dashboard/admin |
| `ListingTypePicker` | components/dashboard | pilih tipe & platform listing (slot inventory) |
| `ServerCard` | components/server | entri ala Multiplayer: layar trailer, ikon server, nama, chip IP, pemain/vote/rating |

### Sprite EterVerse (ditambahkan ke `PixelArt.tsx`)
`portal` (logo), `emerald` (vote), `goldBlock` (partner, peringkat), `book` (info), `bell` (event), `map` (jelajah). Favicon `src/app/icon.svg` digambar dari grid `portal`.

`SPRITES` memakai `satisfies`, jadi nama sprite yang salah ketik gagal di `tsc`, bukan crash saat render.

### Ikon pixel EterVerse (ditambahkan ke `PixelIcon.tsx`)
`users`, `user`, `star`, `starOutline`, `trophy`, `signal`, `signalOff`, `upload`, `eye`, `pencil`, `play`, `send`, `link`, `image`, `filter`, `globe`, `logout`, `database`, `external`, `ban`, `block`, `sparkle`, `monitor`, `calendar`. Ikon baru digambar di grid 12x12; jangan menambah set ikon lain.

## 5. Bahasa benda dunia (konsisten di semua halaman)

| Benda | Arti di EterVerse |
|---|---|
| Emerald | vote (mata uang yang pemain "berikan" ke server) |
| Bar ping hijau | server online |
| Peti emas / peti terbuka | hadiah vote, email terkirim |
| Blok emas | Partner EterShop, juara 1 |
| Emas / besi / tembaga | podium peringkat 1 / 2 / 3 |
| Obor | peringatan, aksi berbahaya, halaman error |
| Bar XP | progres nyata (kelengkapan listing, upload video) |
| Slot hotbar bernomor | pilihan slide hero, langkah setup |
| Peti kosong / blok rumput | empty state |
| Tanah | footer; kayu = panel internal |

Jangan pakai emas untuk dekorasi biasa, dan jangan pakai hijau `online` untuk apa pun selain status online.

## 6. Tata letak

- **Navbar:** 64px tetap, `prism-top`, tetesan 12px di bawahnya. Konten halaman mulai di `pt-16`; elemen sticky di bawah navbar pakai `top-[76px]`.
- **Halaman publik:** `PageHero` (sandstone) lalu konten di `max-w-7xl px-4 sm:px-6 lg:px-8`.
- **Beranda:** hero langit + `VerseScene`, lalu Server unggulan (slider), grid server, lalu blok CTA owner.
- **Halaman server:** banner (atau `prism-bricks`) → kartu profil `px-panel` yang naik menimpa banner → uptime → tab slot. Di HP, **hotbar bawah** (`MobileStickyActionBar`) berisi Vote, Main, Salin IP.
- **Dashboard/admin:** sidebar kayu 256px di desktop, drawer di HP (dibuka tombol Menu di navbar); admin di HP memakai strip tab slot.
- **Grid kartu:** 1 / 2 / 3-4 kolom, jarak minimal 24px (bayangan keras 6x9px butuh ruang).
- Target sentuh 44px (`px-btn-sm` 36px hanya di toolbar dan baris aksi panel). Tidak ada scroll horizontal di 360px.

## 7. Dial

**ENERGY 3 / RHYTHM 2 / MOTION 2**

- ENERGY 3: dunia blok dan sprite memberi rasa main, tapi daftar server tetap tenang dan mudah dipindai.
- MOTION 2: semua animasi `steps()`, pendek, dan mati saat `prefers-reduced-motion`. Tidak ada animasi berulang yang jalan terus kecuali caret IP saat hover.

Animasi yang ada:
- `px-pop`: panel muncul.
- `px-lift`: kartu naik 2px saat hover.
- `hover-bob`: logo dan CTA.
- `px-spin`: loading.
- `px-shake`: input salah.
- `px-blink`: caret IP.
- `px-emerald-up`: emerald terbang setelah vote berhasil.
- `px-bar` mengisi bertahap.
- Reveal saat scroll juga bertahap. RevealController mematikannya di HP low-end.

## 8. Gamifikasi nyata (hanya kejadian sungguhan)

- **Emerald terbang:** hanya setelah server menerima vote (`submitVote` mengembalikan `voted`).
- **Bar XP "Lengkapi listing":** dihitung dari field yang benar-benar diisi owner.
- **Bar upload video:** progres XHR asli.
- **Podium peringkat:** dari tabel `VoteMonthly`, reset tiap tanggal 1 (WIB).
- **"Ada hadiah in-game" di tombol vote:** hanya kalau owner mengaktifkan Votifier.

Dilarang: hitungan pemain atau statistik karangan, "slot partner tinggal sedikit", klaim waktu review, fitur "segera hadir" yang ditulis seolah sudah ada. Halaman Jadwal Event diberi label "Segera hadir" dan menyebut isinya sebagai rencana.

## 9. Performa (HP kentang)

- Tidak ada `backdrop-filter`, blur, glow, atau gradien halus. Wallpaper layar penuh (dan file-nya) sudah dihapus.
- Navbar solid: tidak ada repaint saat scroll.
- Tekstur (tetesan, bata prismarine, tanah, kayu, pasir) berupa SVG data-URI kecil yang di-tile dengan `image-rendering: pixelated`.
- Sprite dan adegan adalah SVG inline tanpa request jaringan; `VerseScene` memakai `<pattern>` per jenis blok.
- Video di kartu tetap mengikuti `scroll-perf` (autoplay di zona fokus, mati di HP low-end).

## 10. Pengecualian dan alasannya

1. **Logo merek pihak ketiga** (Discord, WhatsApp, Telegram) tetap memakai bentuk resmi dari Phosphor. Mengganti logo merek dengan gambar pixel buatan sendiri akan menyesatkan. Semua ikon lain wajib `PixelIcon`.
2. **Ikon toolbar editor deskripsi** memakai huruf Pixelify (B, I, S, 1., “) agar mirip buku-dan-pena Minecraft, tanpa set ikon tambahan.
3. **Gambar OG dan widget** (`/api/og`, `/api/widget`) memakai font sans bawaan Satori, karena Pixelify tidak dimuat di renderer gambar. Warna, bingkai tinta, header prismarine, dan bar ping tetap sama dengan situs.
4. **Video dan gambar owner** tidak di-pixelate. Itu konten milik owner, ditampilkan apa adanya di dalam `.px-screen`.

## 11. Checklist sebelum merge UI baru

- [ ] Hanya token di tabel bagian 2. Tidak ada `zinc-*`, `white/xx`, `rounded-*`, blur, atau gradien halus.
- [ ] Warna teks baru sudah dihitung kontrasnya dan ditambahkan ke tabel bagian 2.
- [ ] Status selalu ikon + teks; hijau `online` hanya untuk online.
- [ ] Animasi baru pakai `steps()` dan mati saat reduced motion.
- [ ] Target sentuh 44px; dicek di 360px tanpa scroll horizontal.
- [ ] Klaim di copy bisa dibuktikan oleh kode atau data.
- [ ] `npx tsc --noEmit`, `npm test`, dan `npm run build` lolos.
