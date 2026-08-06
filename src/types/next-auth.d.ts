import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Perluas tipe Session bawaan supaya `session.user.id` tersedia
   * (dipakai untuk menampilkan identitas admin di dashboard).
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  /**
   * Perluas tipe User bawaan supaya nilai `id` (uuid dari tabel users)
   * ikut terbawa ke token/session.
   */
  interface User {
    id: string;
  }
}

// Catatan: id user disimpan di JWT standar `token.sub`, sehingga tidak perlu
// augmentasi tambahan pada `next-auth/jwt`.
