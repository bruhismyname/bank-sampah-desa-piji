import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Konfigurasi NextAuth (v5) yang dipakai bersama oleh:
 *  - instance NextAuth utama (Node runtime) di `src/lib/auth.ts`
 *  - proxy proteksi `/admin/*` di `proxy.ts` (Node runtime di Next.js 16)
 *
 * Catatan runtime:
 *  - Next.js 16 menjalankan Proxy dengan Node.js runtime secara default,
 *    sehingga import `@/db` (neon-http, fetch-based) dan `bcryptjs` (pure JS)
 *    aman dipakai di sini.
 *  - Callback `authorize` HANYA dieksekusi saat `signIn("credentials", ...)`
 *    dipanggil dari server action / route handler — tidak pernah berjalan
 *    saat Proxy hanya membaca JWT dari cookie.
 *
 * Backward-compat: bila suatu saat project berjalan di Edge runtime, cukup
 * pindahkan `authorize` ke `src/lib/auth.ts` dan kosongkan `providers` di sini.
 */

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Guard untuk mencegah runtime error bila field kosong/tidak sesuai.
        const username = typeof credentials?.username === "string" ? credentials.username : undefined;
        const password = typeof credentials?.password === "string" ? credentials.password : undefined;
        if (!username || !password) {
          return null;
        }

        try {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

          if (!user) {
            return null;
          }

          const passwordValid = await bcrypt.compare(password, user.passwordHash);
          if (!passwordValid) {
            return null;
          }

          return { id: user.id, name: user.username };
        } catch (error) {
          // Jangan bocorkan detail error teknis. Login gagal ditampilkan
          // sebagai pesan umum di halaman login.
          console.error("[auth] Gagal memeriksa kredensial:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // Diperlukan agar NextAuth v5 menerima host non-default (mis. localhost:3000
  // saat dev, atau domain Vercel saat produksi). Aman untuk serverless.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      // Saat login pertama kali, simpan id user ke dalam token (JWT `sub`).
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // Ekspos id user ke session supaya tersedia di server component.
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    authorized({ auth, request }) {
      // Proteksi /admin/*: hanya user yang sudah login boleh masuk.
      const isLoggedIn = !!auth?.user;
      const isAdminArea = request.nextUrl.pathname.startsWith("/admin");

      if (isAdminArea && !isLoggedIn) {
        const loginUrl = new URL("/login", request.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
