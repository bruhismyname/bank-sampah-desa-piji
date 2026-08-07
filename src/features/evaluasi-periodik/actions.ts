"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { evaluasi, evaluasiKriteria } from "@/db/schema";
import { getOrCreatePeriode } from "@/lib/periode";
import { kriteriaSchema, evaluasiFormSchema } from "./schema";

/**
 * Server actions Evaluasi Periodik.
 *
 *  - saveEvaluasi: simpan satu sesi evaluasi (skor per kriteria + catatan +
 *    foto URL) untuk satu periode. Periode dicari/dibuat otomatis dari
 *    rentang tanggal (helper `@/lib/periode`). Baris evaluasi yang sudah ada
 *    untuk periode+kriteria yang sama ditimpa (satu sesi per periode).
 *  - deleteEvaluasi: hapus seluruh sesi evaluasi sebuah periode.
 *  - Kriteria dikelola inline (bukan halaman terpisah): saveKriteria,
 *    deleteKriteria, reorderKriteria.
 */

export type EvaluasiState =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Konversi tanggal input (YYYY-MM-DD) → Date valid, throw bila tidak. */
function parseTanggal(value: string): Date {
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d.getTime())) throw new Error("Tanggal tidak valid.");
  return d;
}

/** Simpan satu sesi evaluasi (skor per kriteria + catatan + foto). */
export async function saveEvaluasi(
  _prevState: EvaluasiState | null,
  formData: FormData,
): Promise<EvaluasiState> {
  // Skor dikirim sebagai JSON ("kriteriaId:skor" dipisah \n).
  const skorRaw = String(formData.get("skor") ?? "");

  const skor = skorRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [kriteriaId, skorVal] = line.split(":");
      return { kriteriaId, skor: skorVal };
    });

  const parsed = evaluasiFormSchema.safeParse({
    tanggalMulai: formData.get("tanggalMulai"),
    tanggalAkhir: formData.get("tanggalAkhir"),
    catatan: formData.get("catatan") || undefined,
    fotoUrl: formData.get("fotoUrl") || undefined,
    skor,
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }

  const { tanggalMulai, tanggalAkhir, catatan, fotoUrl, skor: skorList } = parsed.data;

  // Validasi rentang: mulai tidak boleh setelah akhir.
  const mulai = parseTanggal(tanggalMulai);
  const akhir = parseTanggal(tanggalAkhir);
  if (mulai > akhir) {
    return { ok: false, error: "Tanggal mulai tidak boleh setelah tanggal akhir." };
  }

  try {
    const periodeId = await getOrCreatePeriode(mulai, akhir);

    // Upsert per kriteria: timpa baris periode+kriteria yang sudah ada.
    // Catatan: driver neon-http TIDAK mendukung transaction — pakai loop
    // langsung. Satu admin, risiko race minimal.
    for (const s of skorList) {
      const existing = await db
        .select({ id: evaluasi.id })
        .from(evaluasi)
        .where(
          and(
            eq(evaluasi.kriteriaId, s.kriteriaId),
            eq(evaluasi.periodeId, periodeId),
          ),
        )
        .limit(1);

      if (existing[0]) {
        await db
          .update(evaluasi)
          .set({ skor: s.skor, catatan, fotoUrl })
          .where(eq(evaluasi.id, existing[0].id));
      } else {
        await db.insert(evaluasi).values({
          kriteriaId: s.kriteriaId,
          periodeId,
          skor: s.skor,
          catatan,
          fotoUrl,
        });
      }
    }

    revalidatePath("/admin/evaluasi");
    return { ok: true, message: "Evaluasi berhasil disimpan." };
  } catch (e) {
    console.error("saveEvaluasi error:", e);
    return { ok: false, error: "Gagal menyimpan evaluasi. Coba lagi." };
  }
}

/** Hapus seluruh sesi evaluasi sebuah periode. */
export async function deleteEvaluasi(
  periodeId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!periodeId) return { ok: false, error: "ID periode tidak ditemukan." };

  await db.delete(evaluasi).where(eq(evaluasi.periodeId, periodeId));

  revalidatePath("/admin/evaluasi");
  return { ok: true };
}

/** Tambah kriteria penilaian (inline). */
export async function saveKriteria(
  nama: string,
  bobot: number,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = kriteriaSchema.safeParse({ nama, bobot });
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data kriteria tidak valid." };
  }

  // Urutan = jumlah kriteria sekarang (ditaruh di bawah).
  const [count] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(evaluasiKriteria);

  await db.insert(evaluasiKriteria).values({
    nama: parsed.data.nama.trim(),
    bobot: parsed.data.bobot,
    urutan: count?.total ?? 0,
  });

  revalidatePath("/admin/evaluasi");
  return { ok: true };
}

/** Hapus kriteria beserta skor evaluasinya (cascade). */
export async function deleteKriteria(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID kriteria tidak ditemukan." };

  await db.delete(evaluasiKriteria).where(eq(evaluasiKriteria.id, id));

  revalidatePath("/admin/evaluasi");
  return { ok: true };
}

/** Ubah urutan kriteria (naik/turun satu). */
export async function moveKriteria(
  id: string,
  direction: "up" | "down",
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID kriteria tidak ditemukan." };

  const kriterias = await db
    .select({ id: evaluasiKriteria.id, urutan: evaluasiKriteria.urutan })
    .from(evaluasiKriteria)
    .orderBy(evaluasiKriteria.urutan);

  const idx = kriterias.findIndex((k) => k.id === id);
  if (idx < 0) return { ok: false, error: "Kriteria tidak ditemukan." };

  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= kriterias.length) {
    return { ok: true }; // sudah paling atas/bawah — tidak ada yang diubah
  }

  const cur = kriterias[idx];
  const target = kriterias[targetIdx];

  // neon-http tanpa transaction — dua update terpisah (satu admin).
  await db
    .update(evaluasiKriteria)
    .set({ urutan: target.urutan })
    .where(eq(evaluasiKriteria.id, cur.id));
  await db
    .update(evaluasiKriteria)
    .set({ urutan: cur.urutan })
    .where(eq(evaluasiKriteria.id, target.id));

  revalidatePath("/admin/evaluasi");
  return { ok: true };
}
