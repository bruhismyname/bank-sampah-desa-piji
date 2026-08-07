"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { kendala } from "@/db/schema";
import { kendalaFormSchema, type KendalaStatus } from "./schema";

/**
 * Server actions Logbook Kendala.
 *
 * Alur:
 *  - createKendala: validasi FormData + insert baris kendala baru.
 *  - updateStatusKendala: ubah status (Baru/Proses/Selesai) tanpa reload.
 *  - deleteKendala: hapus satu catatan kendala.
 *
 * Status memakai enum konsisten Baru/Proses/Selesai (sama dengan
 * rekomendasi) — terminologi seragam di seluruh admin panel.
 */

export type KendalaState =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Catat kendala baru. */
export async function createKendala(
  _prevState: KendalaState | null,
  formData: FormData,
): Promise<KendalaState> {
  const parsed = kendalaFormSchema.safeParse({
    deskripsi: formData.get("deskripsi"),
    tanggal: formData.get("tanggal"),
    status: formData.get("status") || "Baru",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }

  const { deskripsi, tanggal, status } = parsed.data;

  const tgl = new Date(`${tanggal}T00:00:00`);
  if (isNaN(tgl.getTime())) {
    return { ok: false, error: "Tanggal kendala tidak valid." };
  }

  try {
    await db.insert(kendala).values({
      deskripsi: deskripsi.trim(),
      tanggal: tgl,
      status,
    });

    revalidatePath("/admin/kendala");
    return { ok: true, message: "Kendala berhasil dicatat." };
  } catch (e) {
    console.error("createKendala error:", e);
    return { ok: false, error: "Gagal menyimpan kendala. Coba lagi." };
  }
}

/** Ubah status satu kendala (Baru → Proses → Selesai, dst). */
export async function updateStatusKendala(
  id: string,
  status: KendalaStatus,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID kendala tidak ditemukan." };

  const valid = kendalaFormSchema.shape.status.safeParse(status);
  if (!valid.success) {
    return { ok: false, error: "Status kendala tidak valid." };
  }

  await db
    .update(kendala)
    .set({ status: valid.data })
    .where(eq(kendala.id, id));

  revalidatePath("/admin/kendala");
  return { ok: true };
}

/** Hapus satu catatan kendala. */
export async function deleteKendala(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID kendala tidak ditemukan." };

  await db.delete(kendala).where(eq(kendala.id, id));

  revalidatePath("/admin/kendala");
  return { ok: true };
}
