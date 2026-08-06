# Fondasi Project Bank Sampah Piji — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun fondasi yang bersih, bisa di-build, dan siap menerima fitur per-fitur — scaffolding Next.js + design system token + struktur feature-based + Drizzle/Neon DB + NextAuth v5 + Kode Pemulihan, dengan verifikasi build.

**Architecture:** Feature-based `src/features/*` dengan `app/` tipis yang hanya import dari features; shared `components/`, `lib/`, dan `db/`. Auth = NextAuth v5 Credentials + middleware proteksi `/admin/*`. DB = Drizzle + Neon (hanya tabel `users` di fondasi). Konten publik bukan bagian fondasi (fitur Kelola Konten).

**Tech Stack:** pnpm, Next.js terbaru (App Router + TS + Tailwind), shadcn/ui, NextAuth v5, Drizzle ORM, Neon Postgres, bcrypt, next/font/google.

> **Catatan git:** commit/push dilakukan oleh **user sendiri**. Tiap Task menyarankan pesan commit yang bisa user pakai, tapi tidak menjalankan git atas nama user kecuali diminta.

---

## Task 1: Scaffold Next.js + trim template

**Files:**
- Generate: seluruh skeleton project via `pnpm create next-app@latest`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Inisialisasi Next.js terbaru**

Run (di `D:\Kuliah Informatika\Semester VI\KKN\Sampah`):
```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --use-pnpm --yes
```
Expected: Skeleton project ter-generate di direktori saat ini (package.json, next.config.ts, tailwind config, src/, dsb.). Jika diminta konfirmasi, gunakan flag `--yes` untuk default.

- [ ] **Step 2: Verifikasi install & versi**

Run:
```bash
pnpm -v && node -v
cat package.json
```
Expected: pnpm v11.x, node v22.x, dan package.json berisi next versi terbaru (16.x atau 15.x) + react.

- [ ] **Step 3: Trim template bawaan**

Modify `src/app/layout.tsx` menjadi minimal (metadata default tetap, font diganti di Task 2). Hapus `src/app/page.tsx` default dan buat placeholder sederhana:

```tsx
export default function Home() {
  return <main className="min-h-screen bg-slate-50"><h1>Bank Sampah Piji</h1></main>;
}
```

- [ ] **Step 4: Verifikasi build awal**

Run:
```bash
pnpm build
```
Expected: Build sukses (output "✓ Compiled successfully").

- [ ] **Step 5: Commit (user)**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js app (TS, Tailwind, App Router, src/)"
```

---

## Task 2: Font Plus Jakarta Sans + Inter

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Wire font ke root layout**

Modify `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Bank Sampah Piji",
  description: "Platform monitoring & evaluasi Bank Sampah Desa Piji",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Tambah CSS variable font ke globals.css**

Modify `src/app/globals.css` — tambahkan di atas direktif Tailwind:

```css
@import "tailwindcss";

:root {
  --font-inter: "Inter", sans-serif;
  --font-plus-jakarta-sans: "Plus Jakarta Sans", sans-serif;
}
```

- [ ] **Step 3: Verifikasi build**

Run: `pnpm build`
Expected: Build sukses, font termuat (tidak ada error fetching font).

- [ ] **Step 4: Commit (user)**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: wire Plus Jakarta Sans + Inter via next/font"
```

---

## Task 3: Design system tokens → Tailwind + shadcn/ui init

**Files:**
- Modify: `src/app/globals.css` (theme)
- Generate: shadcn/ui components ke `src/components/`

- [ ] **Step 1: Inisialisasi shadcn/ui**

Run:
```bash
pnpm dlx shadcn@latest init --yes
```
Expected: Konfigurasi shadcn (components.json, CSS variables) dibuat. Jika shadcn meminta framework/base color, pilih default (neutral/slate).

- [ ] **Step 2: Map token DESIGN.md ke theme**

Modify `src/app/globals.css` — ganti `:root` (dan `.dark` jika ada) agar token mengikuti Eco-Corporate Synthesis. Contoh inti:

```css
:root {
  --background: #f7f9fb;        /* slate-50 */
  --foreground: #191c1e;        /* on-surface */
  --card: #ffffff;
  --card-foreground: #191c1e;
  --primary: #006948;           /* Emerald 600 */
  --primary-foreground: #ffffff;
  --secondary: #0f172a;         /* Slate 900 */
  --secondary-foreground: #ffffff;
  --tertiary: #0058be;          /* Blue 500 */
  --tertiary-foreground: #ffffff;
  --muted: #f2f4f6;
  --muted-foreground: #64748b;  /* Medium Slate */
  --accent: #ecfdf5;            /* emerald-50 (active admin item) */
  --accent-foreground: #006948;
  --border: #f1f5f9;            /* slate-100 */
  --input: #cbd5e1;             /* slate-300 */
  --ring: #006948;
  --radius: 0.5rem;             /* 8px */
  /* success/warning/info chips */
  --success-bg: #dcfce7;  --success-text: #15803d;
  --warning-bg: #fef3c7;  --warning-text: #b45309;
  --info-bg: #dbeafe;     --info-text: #0058be;
}
```

Sesuaikan dengan struktur CSS variables yang dihasilkan shadcn (versi Tailwind v4 memakai `@theme`, v3 memakai CSS vars + config). Pastikan `--radius` 0.5rem (8px) untuk elemen standar.

- [ ] **Step 3: Tambah base components shadcn**

Run:
```bash
pnpm dlx shadcn@latest add button card input label select badge
```
Expected: `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `badge.tsx` terbuat (dan dependensi radix ditambah).

- [ ] **Step 4: Verifikasi build**

Run: `pnpm build`
Expected: Build sukses, komponen shadcn ter-register.

- [ ] **Step 5: Commit (user)**

```bash
git add .
git commit -m "feat: init shadcn/ui + map Eco-Corporate design tokens"
```

---

## Task 4: Struktur folder feature-based + skeleton halaman publik/admin

**Files:**
- Create: `src/lib/` (utils.ts)
- Create: `src/db/` (placeholder index.ts — diisi Task 5)
- Create: `src/app/(public)/layout.tsx`, `src/app/(public)/page.tsx`
- Modify: `src/app/page.tsx` (pindah ke (public))
- Create: `src/app/login/page.tsx` (placeholder), `src/app/reset-password/page.tsx` (placeholder), `src/app/admin/page.tsx` (skeleton)

- [ ] **Step 1: Buat struktur folder**

Buat folder kosong: `src/features/`, `src/features/*/components/` (placeholder minimal per fitur PRD: master-indikator, input-capaian, logbook-kendala, evaluasi-periodik, rekomendasi, kelola-tahapan, kelola-berita, kelola-konten, panduan-pemakaian).

- [ ] **Step 2: Pindah home ke route group `(public)`**

Modify `src/app/page.tsx` → buat `src/app/(public)/page.tsx` (placeholder Home). Buat `src/app/(public)/layout.tsx` (boleh minimal, langsung render children).

- [ ] **Step 3: Skeleton login & reset-password**

Buat `src/app/login/page.tsx` dan `src/app/reset-password/page.tsx` sebagai placeholder (form minimal belum berfungsi penuh — di-wire di Task 6-8).

- [ ] **Step 4: Skeleton admin**

Buat `src/app/admin/page.tsx` (skeleton menu admin, protected nanti via middleware di Task 6).

- [ ] **Step 5: Verifikasi build & lint**

Run: `pnpm build && pnpm lint`
Expected: Keduanya lolos.

- [ ] **Step 6: Commit (user)**

```bash
git add .
git commit -m "feat: feature-based folder structure + skeleton pages"
```

---

## Task 5: Drizzle + Neon — koneksi & tabel `users`

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/db/schema.ts`
- Create: `src/db/index.ts`
- Create: `.env` (git-ignored) + `.env.example`

- [ ] **Step 1: Install dependensi DB**

Run:
```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

- [ ] **Step 2: Tambah DATABASE_URL**

Buat `.env` (git-ignored, berisi kredensial nyata) dan `.env.example` (placeholder kosong). Pastikan `.gitignore` sudah memuat `.env*` kecuali `.env.example`.

- [ ] **Step 3: Tulis `drizzle.config.ts`**

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 4: Tulis `src/db/schema.ts` (tabel `users`)**

```ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  recoveryCodeHash: text("recovery_code_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

- [ ] **Step 5: Tulis `src/db/index.ts` (client)**

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

- [ ] **Step 6: Generate migration & push ke Neon**

Run:
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit push
```
Expected: Tabel `users` terbuat di Neon (konfirmasi via klien atau query). Jika koneksi gagal, laporkan error (jangan teruskan).

- [ ] **Step 7: Verifikasi**

Run: `pnpm build`
Expected: Build sukses.

- [ ] **Step 8: Commit (user)**

```bash
git add drizzle.config.ts src/db .env.example
git commit -m "feat: add Drizzle + Neon connection and users table"
```

---

## Task 6: NextAuth v5 — auth config, login, middleware

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/auth.ts` (route handler untuk NextAuth)
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts` (proteksi `/admin/*`)
- Modify: `src/app/login/page.tsx` (form login berfungsi)
- Modify: `src/app/admin/page.tsx` (skeleton menu admin, hanya tampil jika session ada)

- [ ] **Step 1: Install NextAuth v5**

Run:
```bash
pnpm add next-auth@beta
pnpm add @auth/core
```
(Atau versi stabil terbaru NextAuth v5 jika tersedia; cek `pnpm view next-auth version`.)

- [ ] **Step 2: Tulis `src/lib/auth.ts`**

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!username || !password) return null;
        const [user] = await db.select().from(users).where(eq(users.username, username));
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.username };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
```

- [ ] **Step 3: Tulis route handler**

Buat `src/app/api/auth/[...nextauth]/route.ts`:
```ts
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

- [ ] **Step 4: Tulis middleware**

Buat `middleware.ts` (di root project):
```ts
import { auth } from "@/lib/auth";
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
```
Catatan: gunakan pola yang tepat untuk Auth.js v5 — jika perlu, export default `auth` dan gunakan `authMiddleware`. Sesuaikan dengan dokumentasi v5 saat implementasi.

- [ ] **Step 5: Login form berfungsi**

Modify `src/app/login/page.tsx` — form dengan username + password, memakai `signIn` dari NextAuth (server action atau `signIn` client). On sukses redirect ke `/admin`.

- [ ] **Step 6: Verifikasi**

Run: `pnpm build && pnpm lint`
Expected: Build & lint lolos. Cek runtime: akses `/admin` tanpa login → redirect ke `/login`; login sukses → redirect `/admin`.

- [ ] **Step 7: Commit (user)**

```bash
git add src/lib/auth.ts src/auth.ts src/app/api/auth src/app/login middleware.ts
git commit -m "feat: add NextAuth v5 credentials auth + middleware"
```

---

## Task 7: Kode Pemulihan + seed admin

**Files:**
- Create: `src/lib/recovery-code.ts`
- Create: `scripts/seed.ts` (atau `src/scripts/seed.ts` dengan tsx)
- Create: `src/app/reset-password/page.tsx` (form reset berfungsi)
- Modify: `package.json` (script `db:seed`)

- [ ] **Step 1: Tulis `src/lib/recovery-code.ts`**

```ts
import bcrypt from "bcryptjs";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

export function generateRecoveryCode(length = 12): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export async function hashRecoveryCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifyRecoveryCode(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

export async function rotateRecoveryCode(currentHash: string) {
  const code = generateRecoveryCode();
  const newHash = await hashRecoveryCode(code);
  return { code, newHash };
}
```

- [ ] **Step 2: Tulis seed admin**

Buat `src/scripts/seed.ts` — buat/upsert user `admin`, hash password default `admin123` (atau password acak dicetak), dan generate recovery code pertama, cetak sekali di terminal. Jangan simpan plaintext.

- [ ] **Step 3: Tambah script `db:seed`**

Modify `package.json` scripts:
```json
"db:seed": "tsx src/scripts/seed.ts"
```
(pastikan `tsx` terpasang: `pnpm add -D tsx`.)

- [ ] **Step 4: Reset password flow**

Modify `src/app/reset-password/page.tsx` — alur: input kode → verify hash → form set password baru → on sukses, `rotateRecoveryCode()` → tampilkan kode baru sekali di layar + instruksi.

- [ ] **Step 5: Verifikasi**

Run: `pnpm db:seed`
Expected: Kode pemulihan 12 karakter dicetak sekali. Cek di Neon bahwa `recovery_code_hash` terisi (bukan plaintext). Build & lint lolos.

- [ ] **Step 6: Commit (user)**

```bash
git add src/lib/recovery-code.ts src/scripts src/app/reset-password package.json
git commit -m "feat: add recovery code flow + admin seed"
```

---

## Task 8: Verifikasi akhir fondasi

**Files:** (tidak ada file baru — verifikasi)

- [ ] **Step 1: Full build**

Run: `pnpm build`
Expected: Build sukses, tanpa warning blokir.

- [ ] **Step 2: Full lint**

Run: `pnpm lint`
Expected: Tidak ada error.

- [ ] **Step 3: Smoke test runtime**

Run: `pnpm dev` → buka `/`, `/login`, `/admin` (redirect), `/reset-password`.
Expected: Halaman render; `/admin` redirect ke `/login` saat belum login; login sukses mengalir ke `/admin`.

- [ ] **Step 4: Dokumentasi singkat**

Buat `README.md` ringkas (cara setup: `pnpm install`, `.env`, `pnpm db:seed`, `pnpm dev`).

- [ ] **Step 5: Commit (user)**

```bash
git add README.md
git commit -m "docs: add setup README"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- Scaffold + font (spec 3.1) → Task 1–2 ✅
- Design tokens + shadcn (spec 3.1) → Task 3 ✅
- Struktur folder feature-based (spec 3.2) → Task 4 ✅
- Drizzle + Neon + tabel users (spec 3.3) → Task 5 ✅
- Auth NextAuth v5 + middleware (spec 3.4) → Task 6 ✅
- Kode Pemulihan + seed (spec 3.4) → Task 7 ✅
- Verifikasi build/lint (spec 3.5) → Task 1–8 ✅

**2. Placeholder scan:** Tidak ada TBD/TODO. Semua langkah punya kode/command nyata. ✅

**3. Type consistency:** `src/lib/recovery-code.ts` (Task 7) dipakai di seed & reset-password (sama nama fungsi). `auth` di `src/lib/auth.ts` (Task 6) dipakai di middleware & route handler (sama). Konsisten. ✅
