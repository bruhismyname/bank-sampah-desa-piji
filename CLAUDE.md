# Bank Sampah Piji — Instruksi Implementasi

Proyek: Website **Bank Sampah Piji** (Desa Piji | KKNT-47 UNDIP) — platform website utuh
(Web Application / Sistem Informasi), lebih spesifik **Sistem Informasi Monitoring dan
Evaluasi (SIMONEV) berbasis web**, dilengkapi halaman publik (Home, Profil, Guide, Berita,
Kontak) di samping dashboard monev admin.

Setelah KKN selesai, website **diserahterimakan sepenuhnya ke pengurus desa** dan tidak lagi
dimaintain oleh mahasiswa/developer.

---

## ⚠️ WAJIB BACA SEBELUM MENGERJAKAN APA PUN

Sebelum mengimplementasikan atau mengubah fitur apa pun, **baca sepenuhnya SEMUA dokumen
berikut lebih dulu**:

1. **`docs/PRD.md`** — acuan implementasi **final** (dinyatakan "Siap untuk Implementasi").
   Berisi: kategori sistem, tabel fitur, daftar halaman + route, cakupan data publik, konten
   laporan PDF/Excel, skema data (entitas + relasi), keputusan yang sudah diambil, dan
   operasional pasca serah-terima. Detail kolom per tabel ditentukan langsung di file
   migration Drizzle saat implementasi (by design — tidak didokumentasikan ulang di PRD).
2. **`docs/design.md`** — design system / gaya visual ("Eco-Corporate Synthesis"). Berisi
   token warna (Emerald/Slate/Blue), tipografi (Plus Jakarta Sans + Inter), spacing, radius,
   shadow, elevasi, dan komponen. **Semua frontend wajib mengikuti token ini.**
3. Dokumen lain di `docs/` yang relevan dengan tugas (jika bertambah).

> Jangan mulai coding sebelum memahami kedua dokumen di atas. Bila ada konflik, yang lebih
> spesifik menang: `PRD.md` untuk perilaku/fitur/bisnis, `design.md` untuk visual/UI.

---

## Konteks Singkat

- **Target user admin** = orang awam teknologi (pengurus desa). UI, label, dan pesan error
  ditulis dengan **bahasa sehari-hari**, hindari jargon teknis.
- **Mobile-first** — mayoritas admin akses dari HP.
- Website harus **tetap hidup tanpa developer** setelah KKN: tanpa email/SMTP, tanpa
  maintenance manual, konten bisa diubah admin sendiri.
- **Role cukup 1 (admin)**; publik view-only. Tidak ada RBAC/permission berlapis.

## Tech Stack (wajib, dari PRD)

| Kebutuhan | Pilihan |
|---|---|
| Fondasi | Next.js (App Router) + TypeScript; server actions untuk form admin (hindari API route terpisah) |
| Hosting / DB | Vercel (serverless) + Neon (Postgres) + Drizzle ORM |
| Auth | NextAuth.js (Credentials) + middleware proteksi `/admin/*` |
| UI | Tailwind CSS + shadcn/ui + react-hook-form + Zod |
| Dashboard/chart | Tremor |
| Upload file | Vercel Blob — client upload via `@vercel/blob/client` + `handleUpload` (foto evaluasi, cover berita, PDF SOP) |
| Export Excel | exceljs |
| Export PDF | @react-pdf/renderer (HINDARI Puppeteer/Playwright — berat, rawan timeout serverless) |
| Kanban | @dnd-kit/core |
| Berita WYSIWYG | Tiptap + **isomorphic-dompurify** (sanitasi HTML sebelum simpan ke DB, anti-XSS) |
| Panduan | MDX (@next/mdx) |

## Struktur Folder (WAJIB DIIKUTI)

**Feature-based**, bukan layer-based. Setiap fitur punya folder sendiri di `src/features/`
berisi komponen, server action, schema, dan logic spesifik fitur itu:

```
src/
  features/
    master-indikator/     # components/, actions.ts, schema.ts
    input-capaian/
    logbook-kendala/
    evaluasi-periodik/
    rekomendasi/
    kelola-tahapan/
    kelola-berita/
    kelola-konten/
    panduan-pemakaian/
  components/             # shared UI (shadcn/ui, dsb)
  lib/                    # db client, auth config, utils shared
  app/                    # App Router routes — tipis, hanya import dari features/
```

- Jangan taruh logic fitur langsung di `app/` atau shared `components/`/`lib/` kecuali
  benar-benar reusable lintas fitur.
- `app/` hanya route yang meng-import dari `features/`.

## Aturan Implementasi Kunci

1. **Baca PRD + design dulu** (lihat bagian atas) — jangan mulai tanpa itu.
2. **Dropdown/select/predefined options** di atas free text untuk form admin, kecuali field
   yang memang butuh teks bebas (mis. catatan/deskripsi).
3. **Konten halaman publik TIDAK di-hardcode** di React — simpan di tabel `site_content`
   (key-value), supaya admin bisa ubah tanpa developer.
4. **Kode pemulihan**: hash bcrypt/argon2 (sama seperti password), **sekali pakai**, jangan
   simpan plaintext di DB/.env, tampilkan sekali di layar saat generate; setelah reset, sistem
   generate kode baru otomatis.
5. **Status kanban rekomendasi = status logbook kendala** (`Baru` / `Proses` / `Selesai`,
   default `Baru`) — konsistensi terminologi di seluruh admin panel.
6. **Skema DB pakai snake_case** (contoh: `tampilkanTahapanKKN`, `tampilkanDiBeranda`,
   `recoveryCodeHash`, `guide_sop_url`).
7. **Migrasi Drizzle** dijalankan otomatis di Vercel Build Command (syarat pasca serah-terima).
8. **Perhatikan limit free tier** Vercel (bandwidth, function execution) & Neon (compute
   hours, storage) — website berjalan tanpa dipantau developer.
9. **Publik vs admin**: dashboard `/monev` publik HANYA data agregat; detail kendala,
   evaluasi, dan rekomendasi admin-only.

## Design System (ringkas — detail token di `docs/design.md`)

- **Warna**: primary Emerald `#006948`, secondary Dark Slate `#0f172a`, tertiary Blue
  `#0058be`, background Slate-50 `#f7f9fb`, body text Medium Slate `#64748b`.
- **Tipografi**: Plus Jakarta Sans untuk headline (hero pakai `font-extrabold`, keyword
  di-highlight emerald); Inter untuk body/form/label/data.
- **Radius**: 8px (0.5rem) elemen standar, 16px (1rem) card/container.
- **Shadow**: soft & tinted (low-opacity navy/slate), bukan hitam pekat. Card = white,
  border slate-100, `shadow-sm`.
- **Form input**: touch target 48px, border slate-300, focus ring emerald 2px.
- **Layout**: grid 12 kolom (collapse jadi 1 kolom di mobile <768px), container max 1280px,
  sidebar admin fixed 280px di desktop.
- **Semantic status**: Success = green, Warning = amber, Info = blue; chip pill-shaped.

## Catatan untuk Developer

- Developer proyek ini fullstack (Next.js/TS) — kode boleh diasumsikan teknis, tapi **semua
  yang dilihat/dipakai admin (UI, copy, pesan error) harus disederhanakan untuk orang awam**.
- Konten/skema menyusul mengikuti PRD final; bila ada ketidakjelasan, rujuk ke `docs/PRD.md`
  sebelum bertanya.
