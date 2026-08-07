"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { rekomendasi } from "@/db/schema";
import { rekomendasiFormSchema, type KendalaStatus } from "./schema";

/**
 * Server actions Rekomendasi & Tindak Lanjut (kanban).
 *
 *  - createRekomendasi: tambah kartu baru (status default Baru).
 *  - updateRekomendasi: ubah judul/deskripsi/prioritas kartu.
 *  - moveRekomendasiStatus: geser kartu antar kolom kanban (Baru/Proses/
 *    Selesai) — dipakai drag-and-drop & tombol panah.
 *  - deleteRekomendasi: hapus kartu.
 */

export type RekomendasiState =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Tambah kartu rekomendasi baru. */
export async function createRekomendasi(
  _prevState: RekomendasiState | null,
  formData: FormData,
): Promise<RekomendasiState> {
  const parsed = rekomendasiFormSchema.safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi") || undefined,
    prioritas: formData.get("prioritas") || "Sedang",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }

  const { judul, deskripsi, prioritas } = parsed.data;

  try {
    await db.insert(rekomendasi).values({
      judul: judul.trim(),
      deskripsi: deskripsi?.trim() || null,
      prioritas,
      status: "Baru",
    });

    revalidatePath("/admin/rekomendasi");
    return { ok: true, message: "Rekomendasi berhasil ditambahkan." };
  } catch (e) {
    console.error("createRekomendasi error:", e);
    return { ok: false, error: "Gagal menambahkan rekomendasi. Coba lagi." };
  }
}

/** Ubah judul/deskripsi/prioritas kartu. */
export async function updateRekomendasi(
  id: string,
  data: { judul: string; deskripsi?: string; prioritas: string },
): Promise<{ ok: boolean; error?: string }> {
  const parsed = rekomendasiFormSchema.safeParse({
    judul: data.judul,
    deskripsi: data.deskripsi || undefined,
    prioritas: data.prioritas,
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }

  const { judul, deskripsi, prioritas } = parsed.data;

  await db
    .update(rekomendasi)
    .set({
      judul: judul.trim(),
      deskripsi: deskripsi?.trim() || null,
      prioritas,
      updatedAt: new Date(),
    })
    .where(eq(rekomendasi.id, id));

  revalidatePath("/admin/rekomendasi");
  return { ok: true };
}

/** Geser kartu ke status lain (drag-and-drop / tombol panah). */
export async function moveRekomendasiStatus(
  id: string,
  status: KendalaStatus,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID rekomendasi tidak ditemukan." };

  const valid = ["Baru", "Proses", "Selesai"].includes(status);
  if (!valid) return { ok: false, error: "Status rekomendasi tidak valid." };

  await db
    .update(rekomendasi)
    .set({ status, updatedAt: new Date() })
    .where(eq(rekomendasi.id, id));

  revalidatePath("/admin/rekomendasi");
  return { ok: true };
}

/** Hapus kartu rekomendasi. */
export async function deleteRekomendasi(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID rekomendasi tidak ditemukan." };

  await db.delete(rekomendasi).where(eq(rekomendasi.id, id));

  revalidatePath("/admin/rekomendasi");
  return { ok: true };
}
