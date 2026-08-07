import { z } from "zod";

/**
 * Schema form Edit Profil Program (`profil_program` — single-row).
 *
 * Kolom di tabel sudah dari PRD. Field bersifat opsional kecuali `nama`
 * (organisasi). URL media dibebaskan — bisa diisi format apa saja (link atau
 * username), admin orang awam tidak dipaksa mengikuti format URL penuh.
 */

export const profilProgramSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, "Nama organisasi wajib diisi.")
    .max(200, "Nama maksimal 200 karakter."),
  deskripsi: z
    .string()
    .trim()
    .max(5_000, "Deskripsi maksimal 5.000 karakter.")
    .default(""),
  struktur: z
    .string()
    .trim()
    .max(5_000, "Daftar pengurus maksimal 5.000 karakter.")
    .default(""),
  alamat: z
    .string()
    .trim()
    .max(500, "Alamat maksimal 500 karakter.")
    .default(""),
  telepon: z
    .string()
    .trim()
    .max(50, "Nomor telepon maksimal 50 karakter.")
    .default(""),
  email: z
    .string()
    .trim()
    .max(200, "Email maksimal 200 karakter.")
    .default(""),
  instagram: z
    .string()
    .trim()
    .max(300, "Link Instagram maksimal 300 karakter.")
    .default(""),
  facebook: z
    .string()
    .trim()
    .max(300, "Link Facebook maksimal 300 karakter.")
    .default(""),
  youtube: z
    .string()
    .trim()
    .max(300, "Link YouTube maksimal 300 karakter.")
    .default(""),
});

export type ProfilProgramInput = z.infer<typeof profilProgramSchema>;
