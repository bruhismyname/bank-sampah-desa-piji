import { z } from "zod";

/**
 * Schema validasi Kelola Tahapan KKN (fitur `kelola-tahapan`).
 *
 * Tahapan KKN: nama, urutan, status selesai (boolean). Toggle global
 * `tampilkanTahapanKKN` mengontrol visibilitas checklist di dashboard
 * publik /monev (disimpan di tiap baris, disinkronkan ke nilai yang sama).
 */
export const tahapanFormSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama tahapan tidak boleh kosong.")
    .max(300, "Nama tahapan terlalu panjang (maks 300 karakter)."),
});

export type TahapanFormValues = z.infer<typeof tahapanFormSchema>;
