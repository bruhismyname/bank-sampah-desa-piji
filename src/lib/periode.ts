import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { periode } from "@/db/schema";

/**
 * Helper bersama untuk tabel `periode` — dipakai fitur Input Capaian dan
 * Evaluasi Periodik. Periode TIDAK dibuat manual oleh admin; sistem mencari
 * rentang tanggal yang sama persis, dan bila belum ada, membuat otomatis.
 */

/** Bulan untuk nama periode otomatis ("1–7 Agustus 2026", dst). */
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** Buat label periode ramah-admin dari rentang tanggal. */
export function labelPeriode(mulai: Date, akhir: Date): string {
  const tgl = (d: Date) => d.getDate();
  const bln = (d: Date) => BULAN[d.getMonth()];
  const thn = (d: Date) => d.getFullYear();

  if (mulai.getMonth() === akhir.getMonth() && mulai.getFullYear() === akhir.getFullYear()) {
    return `${tgl(mulai)}–${tgl(akhir)} ${bln(mulai)} ${thn(mulai)}`;
  }
  return `${tgl(mulai)} ${bln(mulai)} ${thn(mulai)} – ${tgl(akhir)} ${bln(akhir)} ${thn(akhir)}`;
}

/**
 * Cari periode dengan rentang tanggal yang sama persis; bila belum ada,
 * buat otomatis. Return ID periode.
 */
export async function getOrCreatePeriode(mulai: Date, akhir: Date): Promise<string> {
  const existing = await db
    .select({ id: periode.id })
    .from(periode)
    .where(
      and(
        eq(periode.tanggalMulai, mulai),
        eq(periode.tanggalAkhir, akhir),
      ),
    )
    .limit(1);

  if (existing[0]) return existing[0].id;

  const [created] = await db
    .insert(periode)
    .values({
      nama: labelPeriode(mulai, akhir),
      tanggalMulai: mulai,
      tanggalAkhir: akhir,
    })
    .returning({ id: periode.id });

  if (!created) throw new Error("Gagal membuat periode.");
  return created.id;
}
