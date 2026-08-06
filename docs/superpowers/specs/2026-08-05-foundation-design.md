# Fondasi Project Bank Sampah Piji — Design Spec

- **Tanggal:** 2026-08-05
- **Status:** Disetujui user untuk implementasi (bagian 1–4 disetujui; user menyatakan mengikuti rekomendasi)
- **Acuan:** `docs/PRD.md` (final), `docs/DESIGN.md` (design system)

## 1. Tujuan

Membangun **fondasi** (bukan fitur) untuk platform SIMONEV Bank Sampah Piji: baseline yang bersih,
bisa di-build, dan siap menerima fitur per-fitur. Fondasi menyediakan scaffolding Next.js, token
design system, struktur folder feature-based, koneksi DB (Drizzle + Neon), auth (NextAuth v5 +
Kode Pemulihan), dan verifikasi build.

## 2. Keputusan Tooling (disetujui)

| Item | Keputusan |
|---|---|
| Package manager | **pnpm** (terpasang v11.5.1) |
| Framework | **Next.js terbaru** (App Router, TypeScript, Tailwind, `src/`) |
| Cakupan dependensi | **Inti + per-fitur**: stack berat (Tiptap, @dnd-kit, @react-pdf, exceljs, MDX, Tremor, @vercel/blob) dipasang saat fitur dikerjakan, bukan di scaffold |
| Scaffold approach | **Pendekatan 1** — official `create-next-app` + incremental setup (bukan create-t3-app, bukan manual) |
| Auth | **NextAuth v5 (Auth.js)** — Credentials, 1 role admin, middleware proteksi `/admin/*` |
| Hash | **bcrypt** untuk password & recovery code |
| DB | Neon Postgres + Drizzle ORM (`drizzle-orm/neon-http` + `@neondatabase/serverless`) |

## 3. Lingkup Fondasi

### 3.1 Scaffold & Design System
- Next.js terbaru via `pnpm create next-app@latest` (TS, Tailwind, App Router, ESLint, `src/`), template di-trim
- Font **Plus Jakarta Sans** (headline) + **Inter** (body) via `next/font/google`, di-wire ke root layout
- Token design system dari DESIGN.md di-map ke theme Tailwind (warna, radius, shadow, tipografi)
- shadcn/ui di-initialize; base components: button, card, input, label, select, dsb.

### 3.2 Struktur Folder (feature-based)
```
src/
  app/
    (public)/ layout.tsx + page.tsx   # placeholder home (konten = fitur Kelola Konten nanti)
    (admin)/ ...                      # route admin (protected) — skeleton menyusul
    login/page.tsx                    # halaman login minimal
    admin/page.tsx                    # skeleton menu admin (protected)
    reset-password/page.tsx           # minimal (kode pemulihan → set password baru → tampil kode baru)
    globals.css
    layout.tsx                        # root layout (font + metadata)
  components/                         # shared UI (shadcn)
  features/                           # kosong dulu — isi per fitur nanti
  lib/                                # auth.ts, recovery-code.ts, utils.ts
  db/                                 # schema.ts, index.ts (client)
```

### 3.3 Database (Drizzle + Neon)
- `drizzle.config.ts` + client di `src/db/`
- **Tabel hanya `users`** untuk fondasi:
  | Kolom | Tipe | Keterangan |
  |---|---|---|
  | `id` | uuid pk default gen | — |
  | `username` | text unique not null | kredensial login |
  | `passwordHash` | text not null | bcrypt |
  | `recoveryCodeHash` | text not null | hash kode pemulihan |
  | `createdAt` | timestamptz default now | — |
- Tabel lain PRD menyusul per fitur
- `DATABASE_URL` di `.env` (ter-gitignore); `.env.example` sebagai template
- Verifikasi: `pnpm drizzle-kit push` ke Neon berhasil

### 3.4 Auth & Kode Pemulihan
- NextAuth v5 (Auth.js) + Credentials; satu akun admin (`admin`)
- Middleware melindungi `/admin/*`, redirect ke `/login`; `/login` mengalir balik ke `/admin`
- Kolom `recoveryCodeHash` di `users`
- `src/lib/recovery-code.ts`: `generateRecoveryCode()`, `hashRecoveryCode()`, `verifyRecoveryCode()`, `rotateRecoveryCode()`
- Alur: seed membuat admin + mencetak kode pemulihan 12 karakter sekali (hanya hash disimpan) → `/reset-password` verifikasi kode → set password baru → **sistem generate kode baru otomatis & tampilkan sekali** → hash kode baru disimpan menggantikan yang lama
- `pnpm db:seed` mencetak kode; alur reset bisa diuji di runtime

### 3.5 Verifikasi
- `pnpm build` dan `pnpm lint` lolos

## 4. Di Luar Lingkup (menyusul per fitur)

- Tabel & fitur: `tahapan_kkn`, `indikator`, `periode`, `capaian`, `kendala`, `evaluasi_kriteria`, `evaluasi`, `rekomendasi`, `profil_program`, `berita`, `site_content`
- Dashboard `/monev`, halaman publik penuh, kanban, export, berita (Tiptap+DOMPurify), MDX panduan
- Halaman admin lengkap (sidebar, dsb.)

## 5. Catatan Keamanan

- Kredensial DB nyata hanya di `.env` (git-ignored), tidak pernah di commit
- `.env.example` menyimpan placeholder saja
- Recovery code tidak disimpan plaintext; hanya hash

## 6. Risiko & Asumsi

- **Risiko:** `drizzle-kit push` membutuhkan koneksi ke Neon yang berfungsi; jika Neon terblokir/offline, langkah ditunda dan dilaporkan
- **Asumsi:** Next.js terbaru kompatibel dengan NextAuth v5 + Drizzle; pnpm lockfile deterministic
- **Risiko:** versi Tailwind v4 (jika Next.js terbaru membawanya) perlu penyesuaian token shadcn — ditangani selama scaffold
