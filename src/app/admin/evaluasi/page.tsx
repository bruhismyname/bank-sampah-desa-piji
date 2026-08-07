import { asc, avg, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { evaluasi, evaluasiKriteria, periode } from "@/db/schema";
import { EvaluasiClient } from "@/features/evaluasi-periodik/components/evaluasi-client";

// Skor evaluasi bisa diubah admin kapan saja — render selalu segar.
export const dynamic = "force-dynamic";

/**
 * Halaman Evaluasi Periodik — data:
 *  - `kriterias`: semua kriteria penilaian (urutan naik).
 *  - `riwayat`: per periode, jumlah rata-rata skor + catatan/foto dari
 *    baris pertama. Periode yang belum dievaluasi tidak muncul.
 */
export default async function AdminEvaluasiPage() {
  const kriterias = await db
    .select({
      id: evaluasiKriteria.id,
      nama: evaluasiKriteria.nama,
      bobot: evaluasiKriteria.bobot,
      urutan: evaluasiKriteria.urutan,
    })
    .from(evaluasiKriteria)
    .orderBy(asc(evaluasiKriteria.urutan));

  const rows = await db
    .select({
      periodeId: periode.id,
      periodeNama: periode.nama,
      tanggalMulai: periode.tanggalMulai,
      tanggalAkhir: periode.tanggalAkhir,
      rataRata: avg(evaluasi.skor).mapWith(Number),
      total: count(evaluasi.id),
    })
    .from(evaluasi)
    .innerJoin(periode, eq(evaluasi.periodeId, periode.id))
    .groupBy(periode.id)
    .orderBy(asc(periode.tanggalMulai));

  // catatan & foto bersifat per-periode — baca dari baris pertama tiap periode.
  const firstRows = await db
    .select({
      periodeId: evaluasi.periodeId,
      catatan: evaluasi.catatan,
      fotoUrl: evaluasi.fotoUrl,
    })
    .from(evaluasi)
    .orderBy(asc(evaluasi.createdAt));

  const firstByPeriode = new Map<string, { catatan: string | null; fotoUrl: string | null }>();
  for (const r of firstRows) {
    if (!firstByPeriode.has(r.periodeId)) {
      firstByPeriode.set(r.periodeId, { catatan: r.catatan, fotoUrl: r.fotoUrl });
    }
  }

  const riwayat = rows.map((r) => ({
    periodeId: r.periodeId,
    periodeNama: r.periodeNama,
    tanggalMulai: r.tanggalMulai.toISOString(),
    tanggalAkhir: r.tanggalAkhir.toISOString(),
    rataRata: r.rataRata ?? 0,
    catatan: firstByPeriode.get(r.periodeId)?.catatan ?? null,
    fotoUrl: firstByPeriode.get(r.periodeId)?.fotoUrl ?? null,
  }));

  return (
    <div className="p-6 md:p-8">
      <EvaluasiClient kriterias={kriterias} riwayat={riwayat} />
    </div>
  );
}
