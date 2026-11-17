# ETERVERSE-DESIGN.md: design system keluarga Eterverse

Dokumen ini adalah **identitas visual bersama** untuk semua project Eterverse.
Semua project memakai prinsip visual Minecraft yang sama, font Pixelify Sans, dan komponen pixel yang sama,
supaya terasa satu keluarga. Yang berbeda antar project hanya **biome** (warna utama + aksen), **motif**, dan isi.

---

## 1. Prinsip visual Minecraft [WAJIB]

- **Dunia blok, terang.** Tema terang hangat (pasir/papan birch), bukan latar hitam atau gelap futuristik. Mode gelap boleh ada sebagai tambahan, bukan bawaan.
- **Pixel tajam.** Radius 0 di mana pun. Gambar pixel memakai `image-rendering: pixelated`, SVG memakai `shape-rendering: crispEdges`. Tidak ada blur, glow, gradien halus, atau glassmorphism.
- **Sudut bertakik.** Panel dibuat "bertakik" dengan `box-shadow` 3px di empat sisi, bukan `border-radius`.
- **Bayangan keras.** Bayangan selalu offset tanpa blur (misalnya `6px 6px 0 var(--ink)`), hanya untuk benda yang mengambang (kartu, modal, toast).
- **Tombol = blok.** Bevel terang di kiri-atas, gelap di kanan-bawah, turun 2px saat ditekan.
- **Pilihan = slot inventory.** Opsi (nominal, kategori, varian, filter) tampil sebagai slot cekung; yang terpilih berbingkai emas.
- **Benda dunia sebagai bahasa.** Peti = hadiah/pesanan, koin emas = harga/hemat, obor = peringatan, diamond = premium, bar XP = progres. Pakai metafora ini secara konsisten, jangan dicampur dengan ikon gaya lain.
- **Motion bertahap.** Semua animasi memakai `steps()` (terasa seperti frame pixel), durasi pendek. Semua animasi mati saat `prefers-reduced-motion: reduce`.

## 2. Tipografi [WAJIB]

| Peran | Font | Aturan |
|---|---|---|
| Judul, tombol, label, nama dunia | **Pixelify Sans** (`--font-pixel`) | Minimal 14px. Tidak untuk paragraf. |
| Isi teks, deskripsi, form | **Plus Jakarta Sans** (`--font-sans`) | Teks panjang selalu font ini. |
| Angka harga, timer, statistik | Plus Jakarta Sans tebal + `tabular-nums` | Angka di font pixel sulit dibaca dan "melompat". |
| Kode, ID pesanan, kode voucher | monospace | |

- Ukuran teks minimum 12px. Label kecil memakai sentence case, bukan HURUF BESAR dengan tracking lebar.
- Di Next.js: muat lewat `next/font/google` (`Pixelify_Sans`, `Plus_Jakarta_Sans`) dan ekspos sebagai variabel CSS.

## 3. Palet [WAJIB untuk netral dan status, PILIH untuk biome]

Aturan 60-30-10 berlaku di semua project:
- **60% permukaan**: netral keluarga (sama di semua project).
- **30% biome utama**: struktur dan aksi utama (header, tombol utama, progres). Dipilih per project.
- **10% aksen**: harga, pilihan aktif, hadiah, ring fokus. Bawaan keluarga: emas.

### Netral keluarga [WAJIB]
| Token | Hex | Peran |
|---|---|---|
| `--cream` | #F2EAD3 | latar halaman |
| `--panel` | #FFFBF0 | panel/kartu |
| `--panel-2` | #F7EFDC | panel sekunder |
| `--slot` | #E6DABD | slot cekung, track bar |
| `--ink` | #2E2216 | teks utama, garis bingkai |
| `--ink-2` | #5E4A33 | teks sekunder |
| `--ink-3` | #7A644A | placeholder, teks redup |
| `--dirt` / `--dirt-d` | #6B4528 / #4E3420 | footer tanah, kayu |
| `--gold` / `--gold-d` / `--gold-l` | #F2B318 / #8A5A00 / (terang) | aksen 10% |

### Status [WAJIB, tidak boleh dipakai untuk hal lain]
- Error: `--redstone` #B8322A (teks putih 6.0:1).
- Info: `--diamond-d` #146B75. Kalau project memakai biome Diamond/Prismarine, info pindah ke Lapis (#1E3F8F) supaya tidak tertukar dengan warna utama.
- Status selalu disertai ikon + teks, tidak hanya warna.

### Biome [PILIH satu per project]
Setiap biome punya tiga tingkat: `-d` (gelap, untuk teks putih dan tombol utama), tengah (permukaan besar), `-l` (terang, hanya dengan teks ink).
Kontras di bawah sudah dihitung (WCAG 2.1):

| Biome | `-d` | tengah | `-l` | Putih di `-d` | Putih di tengah | Ink di `-l` | Catatan |
|---|---|---|---|---|---|---|---|
| **Grass** (EterShop) | #2D6914 | #3F8A1F | #6DBA3A | 6.7 | 4.3 ✗ | 6.4 | Toko, umum |
| **Diamond** | #0E6670 | #1C8C96 | #5FD3DC | 6.7 | 4.0 ✗ | 8.7 | Premium, teknologi |
| **Lapis** | #1E3F8F | #2D56B8 | #7FA3F0 | 9.7 | 6.7 | 6.2 | Komunitas, info, belajar |
| **Amethyst** | #5B2D8E | #7A44B5 | #B98BE8 | 9.5 | 6.3 | 5.8 | Kreatif, event, musik |
| **Prismarine** | #1D5E57 | #2E8077 | #77C9BC | 7.5 | 4.7 | 8.0 | Server, tenang |
| **Copper** | #8A3F1C | #B5592A | #E89A6A | 7.5 | 4.7 | 6.8 | Pakai aksen Prismarine #3FB8AF (ink 6.4), bukan emas |

Aturan biome:
- Teks putih **hanya** di `-d` (dan di tengah kalau kolom "Putih di tengah" ≥ 4.5). ✗ = dilarang untuk teks.
- `-l` hanya untuk latar sorotan dengan teks `--ink`.
- Header situs = biome `-d` atau tengah dengan tepi bawah "tetesan pixel"; footer = tanah (`--dirt-d`). Ini motif keluarga Eterverse.
- Biome baru boleh ditambahkan di tabel ini, dengan kontras dihitung dulu (jangan dikira-kira).

## 4. Komponen kanonik [WAJIB]

Nama dan perilaku sama di semua project, supaya kode bisa dipindah:

| Komponen | Kelas/komponen | Perilaku |
|---|---|---|
| Panel | `.px-panel`, `.px-flat`, `.px-frame` | Panel bertakik; flat tanpa bayangan; frame bingkai saja |
| Tombol | `.px-btn` + `-gold` `-cream` `-red` `-dirt`, `-sm`, `-icon` | Blok berbevel, turun 2px saat ditekan, min tinggi 44px (`-sm` 36px, hanya di toolbar) |
| Slot | `.px-slot` | Cekung; terpilih via `aria-pressed`/`aria-current`/`.is-selected` = bingkai emas |
| Input | `.px-input` | Putih, bingkai ink, fokus = garis putus emas; `aria-invalid` = merah |
| Bar progres | `.px-bar` (`.px-bar-gold`) | Terisi bertahap; dipakai untuk XP/langkah/stok/timer |
| Chip | `.px-chip` | Label kecil (kategori, status) |
| Judul | `.px-title`, `.px-title-shadow` | Pixelify + bayangan keras opsional |
| Ikon | `PixelIcon` (grid 12x12, `currentColor`) | Bukan Lucide/Heroicons. Ikon baru digambar di grid 12x12. |
| Sprite | `Sprite` (`chest`, `chestOpen`, `chestGold`, `gold`, `diamond`, `torch`, `grassBlock`, `pickaxe`, ...) | Benda dunia untuk empty state, hadiah, ilustrasi |
| Dialog | `PixelDialog` | Modal bertakik, fokus terkunci, Esc menutup |
| Toast | `AchievementToast` / `achievement({ title, detail, sprite })` | Gaya "Achievement get!" untuk kejadian nyata |
| Cover | `PixelCover` | Box art dari tile blok + sprite ketika produk/konten tidak punya gambar |

Efek (semua `steps()`, semua mati saat reduced motion):
`px-pop` (muncul), `px-shake` (input salah), `px-coin` + `px-burst-chest` (hadiah/hemat), `px-slam` (angka hemat), `px-star-pop` + `px-sparkle` (rating), `px-flame`/`px-on-fire` (flash sale), `px-urgent` (stok tipis), `px-scan` (QR menunggu), `px-grow-x` (bar terisi), `px-blink`.

## 5. Gamifikasi jujur [WAJIB]

- Achievement, toast, dan efek hadiah **hanya untuk kejadian nyata**: pembayaran diterima, voucher valid, ulasan terkirim, barang masuk keranjang.
- Notifikasi "baru saja dibeli" hanya dari transaksi asli; tanpa nama pembeli; kalau tidak ada data, tidak tampil.
- Dilarang: XP/level/poin akun yang tidak ada di backend, angka statistik tanpa sumber, nama/ulasan karangan, countdown palsu, stok "tinggal 1" palsu.
- Ulasan hanya dari pembeli terverifikasi.

## 6. Tata letak dan aksesibilitas [WAJIB]

- Target sentuh minimal 44x44px. Di mobile, navigasi utama boleh berupa **hotbar** tetap di bawah (maks 5 slot).
- Fokus keyboard selalu terlihat (garis putus emas). Semua kontrol bisa dipakai dengan keyboard.
- Kontras teks minimal 4.5:1 (3:1 untuk teks ≥ 24px). Hitung, jangan dikira.
- Ikon tanpa teks wajib `aria-label`. Gambar dekoratif `aria-hidden`.
- Layout mobile dulu; tanpa scroll horizontal di 360px.
- Admin/panel internal memakai tema terang yang sama (sidebar kayu, top bar biome).

## 7. Dilarang [WAJIB]

- `border-radius` (kecuali ujung bar data 4px di grafik), blur, glow, glassmorphism, gradien halus.
- Font lain untuk judul selain Pixelify Sans; Pixelify untuk paragraf.
- Ikon set lain (Lucide, Font Awesome) di UI publik.
- Latar gelap sebagai tema utama.
- Warna status (redstone/diamond-d) dipakai untuk dekorasi.
- Gamifikasi palsu (lihat bagian 5).

## 8. Sumber kode (acuan, repo EterShop)

| Yang disalin | Lokasi |
|---|---|
| Token warna, font, kelas `px-*`, keyframes | `src/app/globals.css` (bagian `@theme inline`, `:root`, `@layer components`, keyframes `px-*`) |
| Font | `src/app/layout.tsx` (`Pixelify_Sans`, `Plus_Jakarta_Sans`) |
| Ikon | `src/components/pixel/PixelIcon.tsx` |
| Sprite dan tile | `src/components/pixel/PixelArt.tsx` |
| Dialog, toast, hero, cover | `src/components/pixel/PixelDialog.tsx`, `AchievementToast.tsx`, `PageHero.tsx`, `PixelCover.tsx` |
| Toast store | `src/lib/toastStore.ts` |
| Bintang rating pixel | `src/components/review/Stars.tsx` |

Setelah disalin: ganti token biome (`--grass*` → nama biome project, misalnya `--lapis*`) dan sesuaikan header/tombol utama. Netral, status, emas, dan kelas `px-*` tidak diubah.

---

## Template: Profil project [PILIH]

Salin ke `DESIGN.md` project baru dan isi:

```md
# DESIGN.md: <Nama project> (keluarga Eterverse)

Mengikuti ETERVERSE-DESIGN.md. Hanya bagian di bawah yang khusus project ini.

## Identitas
- Produk: <apa, untuk siapa>
- Kepribadian: <3-4 kata>
- Motif: <metafora Minecraft khusus project ini, misalnya "potongan tanah", "perpustakaan enchanting", "portal">

## Biome
- Utama (30%): <biome dari tabel>  · Aksen (10%): <emas / lainnya>
- Info status: <diamond-d / lapis kalau biome-nya Diamond atau Prismarine>

## Dial
ENERGY <1-5> / RHYTHM <1-5> / MOTION <1-5>

## Gamifikasi nyata project ini
- <kejadian nyata apa saja yang memicu achievement>

## Pengecualian (kalau ada) dan alasannya
```

## Contoh: EterShop

- Identitas: toko digital pelajar dan gamer; Top Up & PPOB otomatis, plus produk/jasa Minecraft yang dibayar QRIS di web. Kepribadian akrab, iseng, gamer, jujur.
- Motif: **potongan tanah** (header rumput dengan tetesan pixel, konten di permukaan pasir, footer tanah).
- Biome: **Grass** + aksen emas. Info: diamond-d.
- Dial: ENERGY 3 / RHYTHM 2 / MOTION 2.
- Gamifikasi: checkout sebagai quest 3 langkah dengan bar XP dari data yang benar-benar diisi, achievement voucher/keranjang/pembayaran/ulasan, lacak pesanan sebagai quest log, efek flash sale dan stok tipis dari data asli.
- Detail lengkap: `DESIGN.md` di repo EterShop.
