"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { indikator } from "@/db/schema";
import { indikatorFormSchema } from "./schema";

/**
 * Server actions Master Indikator.
 *
 * Pola umum yang dipakai di semua fitur CRUD:
 *  - terima FormData, parse + validasi dengan Zod (pesan error bahasa sehari-hari)
 *  - jalankan query DB via Drizzle
 *  - `revalidatePath` supaya data terbaru tampil di halaman server component
 *  - kembalikan `{ ok, error? }` untuk ditampilkan form (useActionState)
 */

export type IndikatorState =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Helper: validasi FormData terhadap schema Zod. */
async function parseForm(formData: FormData): Promise<
  | { ok: true; data: z.infer<typeof indikatorFormSchema> }
  | { ok: false; error: string }
> {
  const parsed = indikatorFormSchema.safeParse({
    nama: formData.get("nama"),
    kategori: formData.get("kategori"),
    target: formData.get("target"),
    tampilkanDiBeranda: formData.get("tampilkanDiBeranda") === "on",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }
  return { ok: true, data: parsed.data };
}

/** Tambah indikator baru. */
export async function createIndikator(
  _prevState: IndikatorState | null,
  formData: FormData,
): Promise<IndikatorState> {
  const parsed = await parseForm(formData);
  if (!parsed.ok) return parsed;

  await db.insert(indikator).values({
    nama: parsed.data.nama,
    kategori: parsed.data.kategori,
    target: parsed.data.target,
    tampilkanDiBeranda: parsed.data.tampilkanDiBeranda,
  });

  revalidatePath("/admin/indikator");
  revalidatePath("/");
  return { ok: true, message: "Indikator berhasil ditambahkan." };
}

/** Ubah nama/kategori/target indikator. */
export async function updateIndikator(
  _prevState: IndikatorState | null,
  formData: FormData,
): Promise<IndikatorState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { ok: false, error: "ID indikator tidak ditemukan." };
  }

  const parsed = await parseForm(formData);
  if (!parsed.ok) return parsed;

  await db
    .update(indikator)
    .set({
      nama: parsed.data.nama,
      kategori: parsed.data.kategori,
      target: parsed.data.target,
      tampilkanDiBeranda: parsed.data.tampilkanDiBeranda,
    })
    .where(eq(indikator.id, id));

  revalidatePath("/admin/indikator");
  revalidatePath("/");
  return { ok: true, message: "Indikator berhasil diperbarui." };
}

/** Toggle flag "Tampil di Beranda" tanpa membuka form edit. */
export async function toggleTampilkanDiBeranda(
  id: string,
  current: boolean,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID indikator tidak ditemukan." };

  await db
    .update(indikator)
    .set({ tampilkanDiBeranda: !current })
    .where(eq(indikator.id, id));

  revalidatePath("/admin/indikator");
  revalidatePath("/");
  return { ok: true };
}

/** Hapus indikator (capaian terkait ikut terhapus via onDelete cascade). */
export async function deleteIndikator(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID indikator tidak ditemukan." };

  await db.delete(indikator).where(eq(indikator.id, id));

  revalidatePath("/admin/indikator");
  revalidatePath("/");
  return { ok: true };
}
