# Bank Sampah Piji

Platform Monitoring & Evaluasi (Monev) untuk program pembentukan organisasi **Bank Sampah** Desa Piji — bagian dari KKNT-47 UNDIP. Website ini diserahterimakan sepenuhnya ke pengurus desa setelah KKN, sehingga dirancang agar tetap berjalan tanpa campur tangan developer.

## Teknologi

- **Framework:** Next.js (App Router) + TypeScript
- **Database:** Neon (Postgres serverless) + Drizzle ORM
- **Auth:** NextAuth.js v5 (Credentials) + Kode Pemulihan (reset password tanpa email)
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Hosting:** Vercel

## Persiapan Lokal

1. **Install dependensi**

   ```bash
   pnpm install
   ```

2. **Siapkan variabel lingkungan**

   Salin `.env.example` menjadi `.env` lalu isi kredensial:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — koneksi Neon Postgres
   - `AUTH_SECRET` — kunci rahasia untuk sesi login (generate acak, mis. `openssl rand -base64 32`)

3. **Buat tabel database**

   ```bash
   pnpm drizzle-kit push
   ```

4. **Buat akun admin pertama**

   ```bash
   pnpm db:seed
   ```

   Perintah ini membuat akun `admin`, lalu **mencetak sekali di layar**:
   - Password login sementara
   - **Kode Pemulihan** (untuk reset password bila lupa)

   Catat kode pemulihan dan simpan di tempat aman — hanya muncul sekali.

5. **Jalankan server dev**

   ```bash
   pnpm dev
   ```

   Buka `http://localhost:3000`.

## Akun Admin

- Login di `/login` (username `admin`).
- Reset password tanpa email di `/reset-password` memakai **Kode Pemulihan**.
- Kode pemulihan **sekali pakai**: setelah reset berhasil, sistem membuat kode baru otomatis.

## Script

| Perintah | Fungsi |
|---|---|
| `pnpm dev` | Jalankan server pengembangan |
| `pnpm build` | Build produksi |
| `pnpm start` | Jalankan hasil build |
| `pnpm lint` | Cek lint |
| `pnpm db:seed` | Seed/reset akun admin + cetak kode pemulihan |
| `pnpm drizzle-kit push` | Terapkan skema database |

## Struktur Proyek

Struktur berbasis fitur — setiap fitur punya folder sendiri di `src/features/`:

```
src/
  app/          # route (tipis — hanya import dari features)
  components/   # komponen UI bersama (shadcn/ui)
  features/     # logic per fitur (components, actions, schema)
  lib/          # util bersama (auth, recovery-code)
  db/           # schema + koneksi Drizzle
```

Dokumentasi lengkap: `docs/PRD.md` (spesifikasi) dan `docs/DESIGN.md` (design system).
