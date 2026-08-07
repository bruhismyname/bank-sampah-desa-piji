import { z } from "zod";

/**
 * Schema validasi Master Indikator (fitur `master-indikator`).
 *
 * Kategori memakai predefined options (dropdown) — sesuai prinsip PRD:
 * "Dropdown/select/predefined options di atas free text untuk form admin",
 * supaya data yang masuk konsisten (typo, format tidak konsisten, dst).
 * Bila kategori baru diperlukan nanti, cukup tambahkan ke enum di sini
 * (atau ke tabel terpisah bila sudah kompleks).
 */
export const kategoriIndikator = [
  "Sosial",
  "Lingkungan",
  "Ekonomi",
  "Edukasi",
] as const;

export const indikatorFormSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama indikator wajib diisi.")
    .max(200, "Nama indikator terlalu panjang (maksimal 200 karakter)."),
  kategori: z.enum(kategoriIndikator, {
    message: "Pilih kategori yang tersedia.",
  }),
  target: z.coerce
    .number({ message: "Target harus berupa angka." })
    .nonnegative("Target tidak boleh negatif.")
    .max(9999999999.99, "Target terlalu besar."),
  tampilkanDiBeranda: z.boolean().default(false),
});

export type IndikatorFormValues = z.infer<typeof indikatorFormSchema>;
