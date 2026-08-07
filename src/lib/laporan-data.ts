import { and, asc, avg, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  capaian,
  evaluasi,
  evaluasiKriteria,
  indikator,
  kendala,
  periode,
  rekomendasi,
} from "@/db/schema";

/**
 * Query bersama untuk Laporan PDF (dipakai route export).
 *
 * Semua query DI-FILTER oleh rentang tanggal yang dipilih admin.
 * `periode` yang overlapping rentang (tanggalMulai <= akhir && tanggalAkhir
 * >= mulai) ikut dimasukkan — konsisten untuk capaian & evaluasi (keduanya
 * terikat ke periode). Kendala & rekomendasi difilter berdasarkan tanggalnya.
 */

export interface LaporanPdfData {
  tanggalMulai: string;
  tanggalAkhir: string;
  capaianPerIndikator: {
    nama: string;
    kategori: string;
    target: number;
    capaianTerakhir: number;
    capaianTotal: number;
  }[];
  tren: { label: string; total: number }[];
  kendala: { status: "Baru" | "Proses" | "Selesai"; jumlah: number }[];
  evaluasiPerKriteria: { nama: string; rataRata: number }[];
  rekomendasi: {
    judul: string;
    prioritas: string;
    status: "Baru" | "Proses" | "Selesai";
  }[];
}

/** Ambil seluruh data untuk laporan PDF dalam rentang tanggal. */
export async function getLaporanPdfData(
  mulai: Date,
  akhir: Date,
): Promise<LaporanPdfData> {
  // ===== Capaian: nilai per indikator dalam rentang periode =====
  const capaianRows = await db
    .select({
      indikatorId: capaian.indikatorId,
      indikatorNama: indikator.nama,
      kategori: indikator.kategori,
      target: indikator.target,
      nilai: capaian.nilai,
      periodeId: capaian.periodeId,
      periodeNama: periode.nama,
      createdAt: capaian.createdAt,
    })
    .from(capaian)
    .innerJoin(indikator, eq(capaian.indikatorId, indikator.id))
    .innerJoin(periode, eq(capaian.periodeId, periode.id))
    .where(
      and(
        sql`${periode.tanggalMulai} <= ${akhir}`,
        sql`${periode.tanggalAkhir} >= ${mulai}`,
      ),
    )
    .orderBy(asc(periode.tanggalMulai), asc(capaian.createdAt));

  // Capaian terakhir per indikator (untuk ringkasan) + total (untuk tren)
  const byIndikator = new Map<
    string,
    { nama: string; kategori: string; target: number; capaianTerakhir: number; capaianTotal: number }
  >();
  const trenMap = new Map<string, { label: string; total: number }>();
  for (const row of capaianRows) {
    const existing = byIndikator.get(row.indikatorId);
    if (existing) {
      existing.capaianTotal += row.nilai;
      existing.capaianTerakhir = row.nilai; // baris terakhir setelah sort = terbaru
    } else {
      byIndikator.set(row.indikatorId, {
        nama: row.indikatorNama,
        kategori: row.kategori,
        target: row.target,
        capaianTerakhir: row.nilai,
        capaianTotal: row.nilai,
      });
    }

    const t = trenMap.get(row.periodeId);
    if (t) t.total += row.nilai;
    else trenMap.set(row.periodeId, { label: row.periodeNama, total: row.nilai });
  }

  const capaianPerIndikator = [...byIndikator.values()];
  const tren = [...trenMap.values()].sort((a, b) => a.label.localeCompare(b.label));

  // ===== Kendala per status (dalam rentang tanggal) =====
  const kendalaRows = await db
    .select({ status: kendala.status, jumlah: count(kendala.id) })
    .from(kendala)
    .where(
      and(
        sql`${kendala.tanggal} >= ${mulai}`,
        sql`${kendala.tanggal} <= ${akhir}`,
      ),
    )
    .groupBy(kendala.status);

  // ===== Rata-rata skor evaluasi per kriteria (dalam rentang periode) =====
  const evaluasiRows = await db
    .select({
      kriteriaNama: evaluasiKriteria.nama,
      rataRata: avg(evaluasi.skor).mapWith(Number),
    })
    .from(evaluasi)
    .innerJoin(periode, eq(evaluasi.periodeId, periode.id))
    .innerJoin(evaluasiKriteria, eq(evaluasi.kriteriaId, evaluasiKriteria.id))
    .where(
      and(
        sql`${periode.tanggalMulai} <= ${akhir}`,
        sql`${periode.tanggalAkhir} >= ${mulai}`,
      ),
    )
    .groupBy(evaluasiKriteria.id)
    .orderBy(asc(evaluasiKriteria.urutan));

  // ===== Rekomendasi (semua — sesuai PRD, daftar + status kanban) =====
  const rekomendasiRows = await db
    .select({
      judul: rekomendasi.judul,
      prioritas: rekomendasi.prioritas,
      status: rekomendasi.status,
    })
    .from(rekomendasi)
    .orderBy(desc(rekomendasi.createdAt));

  return {
    tanggalMulai: mulai.toISOString(),
    tanggalAkhir: akhir.toISOString(),
    capaianPerIndikator,
    tren,
    kendala: kendalaRows.map((r) => ({
      status: r.status as "Baru" | "Proses" | "Selesai",
      jumlah: r.jumlah,
    })),
    evaluasiPerKriteria: evaluasiRows.map((r) => ({ nama: r.kriteriaNama, rataRata: r.rataRata })),
    rekomendasi: rekomendasiRows.map((r) => ({
      judul: r.judul,
      prioritas: r.prioritas,
      status: r.status as "Baru" | "Proses" | "Selesai",
    })),
  };
}
