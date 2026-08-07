import { z } from "zod";

/**
 * Schema validasi Evaluasi Periodik (fitur `evaluasi-periodik`).
 *
 * Model data (PRD): skor disimpan PER KRITERIA per periode (skala 1-5),
 * rata-rata dihitung otomatis — tidak disimpan sebagai satu angka agregat.
 * Catatan & foto bersifat per-periode (satu sesi evaluasi).
 */

/** Skala skor kriteria (1-5). */
export const SKOR_MIN = 1;
export const SKOR_MAX = 5;

/** Nama kriteria: min 1, maks 200. */
export const kriteriaSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama kriteria tidak boleh kosong.")
    .max(200, "Nama kriteria terlalu panjang (maks 200 karakter)."),
  bobot: z.coerce
    .number({ message: "Bobot harus berupa angka." })
    .min(0.01, "Bobot minimal 0.01.")
    .max(100, "Bobot maksimal 100."),
});

/** Skor satu kriteria pada satu periode. */
export const skorKriteriaSchema = z.object({
  kriteriaId: z.string().min(1, "Kriteria tidak valid."),
  skor: z.coerce
    .number({ message: "Skor harus berupa angka." })
    .int("Skor harus bilangan bulat.")
    .min(SKOR_MIN, `Skor minimal ${SKOR_MIN}.`)
    .max(SKOR_MAX, `Skor maksimal ${SKOR_MAX}.`),
});

/** Sesi evaluasi: periode + daftar skor + catatan + foto. */
export const evaluasiFormSchema = z.object({
  tanggalMulai: z.string().min(1, "Pilih tanggal mulai periode."),
  tanggalAkhir: z.string().min(1, "Pilih tanggal akhir periode."),
  catatan: z.string().max(5000, "Catatan terlalu panjang (maks 5000 karakter).").optional(),
  fotoUrl: z
    .string()
    .max(2000, "URL foto terlalu panjang.")
    .refine((v) => !v || /^https?:\/\/\S+$/i.test(v), "URL foto harus dimulai http:// atau https://.")
    .optional(),
  skor: z.array(skorKriteriaSchema).min(1, "Isi minimal satu skor kriteria."),
});

export type EvaluasiFormValues = z.infer<typeof evaluasiFormSchema>;
