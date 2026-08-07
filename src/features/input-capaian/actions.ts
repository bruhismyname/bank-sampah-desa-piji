"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { capaian } from "@/db/schema";
import { getOrCreatePeriode } from "@/lib/periode";
import { capaianFormSchema } from "./schema";

/**
 * Server actions Input Capaian.
 *
 * Alur simpan:
 *  1. Validasi FormData dengan Zod.
 *  2. Cari periode yang sudah ada dengan rentang tanggal yang sama
 *     (tanggalMulai..tanggalAkhir). Bila belum ada, buat otomatis.
 *     (helper bersama di `@/lib/periode`).
 *  3. Insert baris capaian baru (boleh berulang dalam satu periode —
 *     riwayat dipertahankan).
 */

export type CapaianState =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Simpan satu baris capaian (nilai) untuk indikator pada periode tertentu. */
export async function saveCapaian(
  _prevState: CapaianState | null,
  formData: FormData,
): Promise<CapaianState> {
  const parsed = capaianFormSchema.safeParse({
    indikatorId: formData.get("indikatorId"),
    tanggalMulai: formData.get("tanggalMulai"),
    tanggalAkhir: formData.get("tanggalAkhir"),
    nilai: formData.get("nilai"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }

  const { indikatorId, tanggalMulai, tanggalAkhir, nilai } = parsed.data;

  // Validasi rentang tanggal: mulai tidak boleh setelah akhir.
  const mulai = new Date(tanggalMulai);
  const akhir = new Date(tanggalAkhir);
  if (isNaN(mulai.getTime()) || isNaN(akhir.getTime())) {
    return { ok: false, error: "Tanggal periode tidak valid." };
  }
  if (mulai > akhir) {
    return { ok: false, error: "Tanggal mulai tidak boleh setelah tanggal akhir." };
  }

  try {
    const periodeId = await getOrCreatePeriode(mulai, akhir);

    await db.insert(capaian).values({
      indikatorId,
      periodeId,
      nilai,
    });

    revalidatePath("/admin/capaian");
    revalidatePath("/monev");
    revalidatePath("/");
    return { ok: true, message: "Capaian berhasil disimpan." };
  } catch (e) {
    console.error("saveCapaian error:", e);
    return { ok: false, error: "Gagal menyimpan capaian. Coba lagi." };
  }
}

/** Hapus satu baris riwayat capaian. */
export async function deleteCapaian(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID capaian tidak ditemukan." };

  await db.delete(capaian).where(eq(capaian.id, id));

  revalidatePath("/admin/capaian");
  revalidatePath("/monev");
  revalidatePath("/");
  return { ok: true };
}
