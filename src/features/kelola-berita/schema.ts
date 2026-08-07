import { z } from "zod";

/**
 * Schema validasi form Berita (/admin/berita).
 *
 * Konten artikel adalah HTML hasil editor Tiptap — DIVALIDASI terbatas di
 * sini (bukan parse HTML penuh), lalu DI-SANITASI dengan DOMPurify di server
 * action sebelum disimpan ke DB (anti-XSS). Sanitasi adalah lapisan keamanan
 * utama; schema ini memastikan bentuk data benar.
 */

/** Status artikel: draft (belum tampil) atau published (tampil publik). */
export const BERITA_STATUS = ["draft", "published"] as const;
export type BeritaStatus = (typeof BERITA_STATUS)[number];

/** Pola URL cover: http(s) atau path lokal (mis. /berita/foto.jpeg). */
const urlOrPath = z
  .string()
  .trim()
  .min(1, "Link cover wajib diisi.")
  .refine(
    (v) => /^(https?:\/\/|\/)/i.test(v),
    "Link cover harus berupa URL (https://…) atau path (/…).",
  );

/** Form untuk menulis/mengedit artikel. */
export const beritaFormSchema = z.object({
  judul: z
    .string()
    .trim()
    .min(1, "Judul artikel wajib diisi.")
    .max(200, "Judul maksimal 200 karakter."),
  konten: z
    .string()
    .min(1, "Isi artikel masih kosong.")
    .max(100_000, "Isi artikel terlalu panjang."),
  coverUrl: urlOrPath,
  status: z.enum(BERITA_STATUS).default("draft"),
});

export type BeritaFormValues = z.infer<typeof beritaFormSchema>;
