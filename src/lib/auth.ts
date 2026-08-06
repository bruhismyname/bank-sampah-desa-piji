import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Instance NextAuth v5 — hanya boleh di-import dari kode sisi server
 * (server action, server component, route handler). JANGAN di-import
 * dari komponen "use client" atau proxy.
 *
 * `authorize` untuk Credentials provider didefinisikan di `authConfig`
 * (file yang dipakai bersama proxy). Karena Proxy di Next.js 16 berjalan
 * di Node.js runtime, import DB/bcryptjs di sana aman.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
