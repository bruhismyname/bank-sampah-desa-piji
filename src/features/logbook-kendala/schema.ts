import { z } from "zod";

/**
 * Schema validasi Logbook Kendala (fitur `logbook-kendala`).
 *
 * Status mengikuti enum konsisten Baru/Proses/Selesai (default "Baru") —
 * terminologi sama dengan status Rekomendasi (PRD: keputusan #5).
 */
export const KENDALA_STATUS = ["Baru", "Proses", "Selesai"] as const;
export type KendalaStatus = (typeof KENDALA_STATUS)[number];

export const kendalaFormSchema = z.object({
  deskripsi: z
    .string()
    .min(1, "Jelaskan kendala terlebih dahulu.")
    .max(2000, "Deskripsi terlalu panjang (maks 2000 karakter)."),
  tanggal: z.string().min(1, "Pilih tanggal kendala."),
  status: z.enum(KENDALA_STATUS, {
    message: "Status kendala tidak valid.",
  }),
});

export type KendalaFormValues = z.infer<typeof kendalaFormSchema>;
