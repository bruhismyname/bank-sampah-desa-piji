import { z } from "zod";

/**
 * Schema validasi Input Capaian (fitur `input-capaian`).
 *
 * Periode tidak dibuat manual oleh admin — admin memilih rentang tanggal
 * (tanggal mulai & akhir), sistem mencari periode yang sudah ada dengan
 * rentang yang sama, dan bila belum ada, membuatnya otomatis. Ini sesuai
 * keputusan PRD #2: "Periode dibuat otomatis dari rentang tanggal".
 */
export const capaianFormSchema = z.object({
  indikatorId: z.string().min(1, "Pilih indikator capaian."),
  tanggalMulai: z.string().min(1, "Pilih tanggal mulai periode."),
  tanggalAkhir: z.string().min(1, "Pilih tanggal akhir periode."),
  nilai: z.coerce
    .number({ message: "Nilai capaian harus berupa angka." })
    .nonnegative("Nilai capaian tidak boleh negatif.")
    .max(9999999999.99, "Nilai capaian terlalu besar."),
});

export type CapaianFormValues = z.infer<typeof capaianFormSchema>;
