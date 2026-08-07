"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import { db } from "@/db";
import { berita } from "@/db/schema";
import { beritaFormSchema, type BeritaStatus } from "./schema";

/**
 * Server actions Kelola Berita.
 *
 *  - createBerita: tulis artikel baru (judul, konten HTML, cover, status).
 *  - updateBerita: edit artikel yang sudah ada.
 *  - deleteBerita: hapus artikel.
 *  - setBeritaStatus: ubah draft ↔ published (tanpa reload).
 *
 * KEAMANAN (anti-XSS): konten artikel adalah HTML dari editor Tiptap. Sebelum
 * disimpan, HTML DI-SANITASI dengan DOMPurify (isomorphic-dompurify) — tag &
 * atribut berbahaya (script, iframe, on*, dst) dibuang. Ini wajib karena
 * konten dirender ulang di halaman publik /berita/[slug].
 *
 * Slug dibuat dari judul (dibersihkan) — dibaca/diedit hanya di sini, admin
 * tidak perlu mengisi manual.
 */

export type BeritaState =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Konversi tanggal publish (YYMMDD + random) → format ISO UTC aman. */
function makeSlug(judul: string): string {
  const base = judul
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // buang aksen (é→e, dsb)
    .replace(/[^a-z0-9\s-]/g, "") // buang simbol
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${base || "artikel"}-${Date.now().toString(36).slice(-6)}`;
}

/**
 * Sanitasi HTML konten sebelum disimpan. DOMPurify di server memakai
 * implementasi jsdom — tag markup Tiptap (p, strong, em, ul/ol/li, a, h2,
 * blockquote, img, dsb) dipertahankan; script & event handler dibuang.
 */
function sanitizeKonten(html: string): string {
  return DOMPurify.sanitize(html, {
    // Tiptap menghasilkan <p> kosong (<p></p>) di awal — biarkan (rendering
    // publik memakai prose, tidak tampak).
    ADD_TAGS: [], // tidak perlu tag tambahan — Tiptap starter-kit sudah cukup
    // Izinkan atribut penting untuk konten: class (hasil Tiptap), src/alt
    // untuk gambar, href/target/rel untuk tautan.
    ADD_ATTR: ["class"],
  });
}

/** Tulis artikel baru. */
export async function createBerita(
  _prevState: BeritaState | null,
  formData: FormData,
): Promise<BeritaState> {
  const parsed = beritaFormSchema.safeParse({
    judul: formData.get("judul"),
    konten: formData.get("konten"),
    coverUrl: formData.get("coverUrl"),
    status: formData.get("status") || "draft",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }

  const { judul, coverUrl, status } = parsed.data;
  const konten = sanitizeKonten(parsed.data.konten);

  if (!konten.trim()) {
    return { ok: false, error: "Isi artikel masih kosong." };
  }

  try {
    const slug = makeSlug(judul);

    await db.insert(berita).values({
      judul: judul.trim(),
      slug,
      konten,
      coverUrl: coverUrl.trim(),
      status,
      // Hanya diisi ketika di-publish (tanggal terbit dipakai publik).
      tanggalPublish: status === "published" ? new Date() : null,
    });

    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath("/");
    return { ok: true, message: "Artikel berhasil disimpan." };
  } catch (e) {
    console.error("createBerita error:", e);
    return { ok: false, error: "Gagal menyimpan artikel. Coba lagi." };
  }
}

/** Edit artikel yang sudah ada. */
export async function updateBerita(
  _prevState: BeritaState | null,
  formData: FormData,
): Promise<BeritaState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "ID artikel tidak ditemukan." };

  const parsed = beritaFormSchema.safeParse({
    judul: formData.get("judul"),
    konten: formData.get("konten"),
    coverUrl: formData.get("coverUrl"),
    status: formData.get("status") || "draft",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }

  const { judul, coverUrl, status } = parsed.data;
  const konten = sanitizeKonten(parsed.data.konten);

  if (!konten.trim()) {
    return { ok: false, error: "Isi artikel masih kosong." };
  }

  try {
    // Ambil baris lama untuk tahu status sebelum update (perlu bedakan
    // tanggal_publish: saat pindah draft→published, tanggal terbit baru).
    const existing = await db
      .select({ status: berita.status })
      .from(berita)
      .where(eq(berita.id, id))
      .limit(1);

    const wasPublished = existing[0]?.status === "published";

    // Slug tetap (jika sudah ada) — mengganti judul TIDAK mengubah URL.
    await db
      .update(berita)
      .set({
        judul: judul.trim(),
        konten,
        coverUrl: coverUrl.trim(),
        status,
        tanggalPublish:
          status === "published" && !wasPublished ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(berita.id, id));

    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath("/");
    return { ok: true, message: "Artikel berhasil diperbarui." };
  } catch (e) {
    console.error("updateBerita error:", e);
    return { ok: false, error: "Gagal memperbarui artikel. Coba lagi." };
  }
}

/** Ubah status draft ↔ published (dari tombol di daftar). */
export async function setBeritaStatus(
  id: string,
  status: BeritaStatus,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID artikel tidak ditemukan." };

  const valid = beritaFormSchema.shape.status.safeParse(status);
  if (!valid.success) return { ok: false, error: "Status artikel tidak valid." };

  await db
    .update(berita)
    .set({
      status: valid.data,
      tanggalPublish: valid.data === "published" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(berita.id, id));

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidatePath("/");
  return { ok: true };
}

/** Hapus artikel. */
export async function deleteBerita(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID artikel tidak ditemukan." };

  await db.delete(berita).where(eq(berita.id, id));

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidatePath("/");
  return { ok: true };
}

/** Daftar semua artikel (admin) — draft & published, terbaru dulu. */
export async function listBeritaAdmin() {
  return db
    .select({
      id: berita.id,
      judul: berita.judul,
      slug: berita.slug,
      coverUrl: berita.coverUrl,
      status: berita.status,
      tanggalPublish: berita.tanggalPublish,
      createdAt: berita.createdAt,
      updatedAt: berita.updatedAt,
    })
    .from(berita)
    .orderBy(desc(berita.createdAt));
}
