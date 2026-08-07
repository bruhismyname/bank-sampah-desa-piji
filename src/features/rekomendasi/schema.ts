import { z } from "zod";

/**
 * Schema validasi Rekomendasi & Tindak Lanjut (fitur `rekomendasi`).
 *
 * Status memakai enum konsisten Baru/Proses/Selesai (default "Baru") — sama
 * dengan Logbook Kendala, untuk konsistensi terminologi di seluruh admin
 * panel (PRD keputusan #6). Prioritas: Tinggi/Sedang/Rendah.
 */
export const KENDALA_STATUS = ["Baru", "Proses", "Selesai"] as const;
export type KendalaStatus = (typeof KENDALA_STATUS)[number];

export const PRIORITAS = ["Tinggi", "Sedang", "Rendah"] as const;
export type Prioritas = (typeof PRIORITAS)[number];

export const rekomendasiFormSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul rekomendasi tidak boleh kosong.")
    .max(300, "Judul terlalu panjang (maks 300 karakter)."),
  deskripsi: z
    .string()
    .max(2000, "Deskripsi terlalu panjang (maks 2000 karakter).")
    .optional(),
  prioritas: z.enum(PRIORITAS, {
    message: "Prioritas tidak valid.",
  }),
});

export type RekomendasiFormValues = z.infer<typeof rekomendasiFormSchema>;
