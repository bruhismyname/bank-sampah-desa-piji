"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { siteContent } from "@/db/schema";
import { SITE_CONTENT_DEFS } from "@/lib/site-content";

/**
 * Server actions Kelola Konten (tabel `site_content`).
 *
 * Mengupdate key-value konten statis halaman publik. Bila key belum ada di
 * DB (mis. konten baru di daftar default), dibuat (upsert) supaya semua
 * key yang dikelola admin selalu tersimpan eksplisit.
 */

export type KontenState =
  | { ok: true; message: string }
  | { ok: false; error: string };

const VALID_KEYS = new Set(SITE_CONTENT_DEFS.map((d) => d.key));

/**
 * Simpan satu atau beberapa key site_content sekaligus.
 * Payload: { key1: value1, key2: value2 }.
 */
export async function saveSiteContent(
  payload: Record<string, string>,
): Promise<KontenState> {
  const entries = Object.entries(payload);

  if (entries.length === 0) {
    return { ok: false, error: "Tidak ada konten yang dikirim." };
  }

  // Hanya terima key yang ada di daftar (cegah injeksi key asing).
  for (const [key] of entries) {
    if (!VALID_KEYS.has(key)) {
      return { ok: false, error: `Key konten tidak dikenal: ${key}` };
    }
  }

  try {
    for (const [key, value] of entries) {
      const existing = await db
        .select({ id: siteContent.id })
        .from(siteContent)
        .where(eq(siteContent.key, key))
        .limit(1);

      if (existing[0]) {
        await db
          .update(siteContent)
          .set({ value, updatedAt: new Date() })
          .where(eq(siteContent.id, existing[0].id));
      } else {
        await db.insert(siteContent).values({ key, value });
      }
    }

    // Revalidate semua halaman publik yang memakai konten ini.
    revalidatePath("/");
    revalidatePath("/profil");
    revalidatePath("/guide");
    revalidatePath("/kontak");
    return { ok: true, message: "Konten berhasil disimpan." };
  } catch (e) {
    console.error("saveSiteContent error:", e);
    return { ok: false, error: "Gagal menyimpan konten. Coba lagi." };
  }
}
