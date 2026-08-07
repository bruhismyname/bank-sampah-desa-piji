"use server";

import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { tahapanKkn } from "@/db/schema";
import { tahapanFormSchema } from "./schema";

/**
 * Server actions Kelola Tahapan KKN.
 *
 *  - createTahapan: tambah tahapan baru (urutan = maks+1).
 *  - updateTahapan: ubah nama tahapan.
 *  - toggleSelesai: ubah status selesai (belum ↔ selesai).
 *  - moveTahapan: tukar urutan dua tahapan berdekatan (naik/turun).
 *  - deleteTahapan: hapus tahapan.
 *  - toggleTampilkanTahapanKKN: visibilitas global section di /monev.
 *    `tampilkanTahapanKKN` disimpan di tiap baris — saat di-toggle, semua
 *    baris disinkronkan ke nilai yang sama (dibaca /monev dari baris pertama).
 */

export type TahapanState =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Tambah tahapan baru. */
export async function createTahapan(
  _prevState: TahapanState | null,
  formData: FormData,
): Promise<TahapanState> {
  const parsed = tahapanFormSchema.safeParse({
    nama: formData.get("nama"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }

  try {
    // Urutan = jumlah baris sekarang (ditaruh paling bawah).
    const [count] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(tahapanKkn);

    await db.insert(tahapanKkn).values({
      nama: parsed.data.nama.trim(),
      urutan: count?.total ?? 0,
      selesai: false,
    });

    revalidatePath("/admin/tahapan");
    revalidatePath("/monev");
    revalidatePath("/");
    return { ok: true, message: "Tahapan berhasil ditambahkan." };
  } catch (e) {
    console.error("createTahapan error:", e);
    return { ok: false, error: "Gagal menambahkan tahapan. Coba lagi." };
  }
}

/** Ubah nama tahapan. */
export async function updateTahapan(
  id: string,
  nama: string,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = tahapanFormSchema.safeParse({ nama });
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }

  await db
    .update(tahapanKkn)
    .set({ nama: parsed.data.nama.trim() })
    .where(eq(tahapanKkn.id, id));

  revalidatePath("/admin/tahapan");
  revalidatePath("/monev");
  revalidatePath("/");
  return { ok: true };
}

/** Toggle status selesai (belum ↔ selesai). */
export async function toggleSelesai(
  id: string,
  current: boolean,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID tahapan tidak ditemukan." };

  await db
    .update(tahapanKkn)
    .set({ selesai: !current })
    .where(eq(tahapanKkn.id, id));

  revalidatePath("/admin/tahapan");
  revalidatePath("/monev");
  revalidatePath("/");
  return { ok: true };
}

/** Tukar urutan dengan baris atas/bawah (reorder). */
export async function moveTahapan(
  id: string,
  direction: "up" | "down",
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID tahapan tidak ditemukan." };

  const rows = await db
    .select({ id: tahapanKkn.id, urutan: tahapanKkn.urutan })
    .from(tahapanKkn)
    .orderBy(asc(tahapanKkn.urutan));

  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return { ok: false, error: "Tahapan tidak ditemukan." };

  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= rows.length) {
    return { ok: true }; // sudah paling atas/bawah
  }

  const cur = rows[idx];
  const target = rows[targetIdx];

  // neon-http tanpa transaction — dua update terpisah (satu admin).
  await db.update(tahapanKkn).set({ urutan: target.urutan }).where(eq(tahapanKkn.id, cur.id));
  await db.update(tahapanKkn).set({ urutan: cur.urutan }).where(eq(tahapanKkn.id, target.id));

  revalidatePath("/admin/tahapan");
  revalidatePath("/monev");
  revalidatePath("/");
  return { ok: true };
}

/** Hapus tahapan. */
export async function deleteTahapan(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID tahapan tidak ditemukan." };

  await db.delete(tahapanKkn).where(eq(tahapanKkn.id, id));

  revalidatePath("/admin/tahapan");
  revalidatePath("/monev");
  revalidatePath("/");
  return { ok: true };
}

/**
 * Toggle visibilitas global section tahapan di /monev.
 * `tampilkanTahapanKKN` disimpan di tiap baris — sinkronkan semua baris.
 */
export async function toggleTampilkanTahapanKKN(
  current: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const next = !current;

  // Tanpa .where() → update semua baris ke nilai yang sama.
  await db.update(tahapanKkn).set({ tampilkanTahapanKKN: next });

  revalidatePath("/admin/tahapan");
  revalidatePath("/monev");
  revalidatePath("/");
  return { ok: true };
}
