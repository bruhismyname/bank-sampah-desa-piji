import { db } from "@/db";
import { capaian, indikator, periode, tahapanKkn } from "@/db/schema";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { MonevPage } from "@/features/monev-dashboard/components/monev-page";

// Dashboard monev harus selalu menampilkan data terbaru dari DB —
// bukan hasil render statis saat build. Data berubah setiap kali
// admin menginput capaian.
export const dynamic = "force-dynamic";

type StepStatus = "Selesai" | "Proses" | "Menunggu";
type KpiTone = "success" | "info" | "warning";

export interface TahapanMonev {
  label: string;
  status: StepStatus;
}

export interface KpiMonev {
  name: string;
  value: string;
  detail: string;
  progress: number;
  badge: string;
  tone: KpiTone;
}

/** Format angka id-ID (1.234,56). */
function formatAngka(n: number) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(n);
}

/**
 * Dashboard Monev publik (/monev) — server component.
 * HANYA data agregat (sesuai PRD): checklist tahapan, kartu KPI
 * (indikator ber-flag `tampilkanDiBeranda`, capaian terakhir vs target),
 * dan grafik tren total capaian per periode.
 */
export default async function Monev() {
  // ===== Tahapan KKN =====
  const tahapanRows = await db
    .select()
    .from(tahapanKkn)
    .orderBy(asc(tahapanKkn.urutan));
  const showTahapan =
    tahapanRows.length > 0 && tahapanRows[0].tampilkanTahapanKKN;

  let tahapan: TahapanMonev[] = [];
  if (showTahapan) {
    const firstOpen = tahapanRows.findIndex((t) => !t.selesai);
    tahapan = tahapanRows.map((t, i) => ({
      label: t.nama,
      status: t.selesai
        ? "Selesai"
        : firstOpen === -1 || i === firstOpen
          ? "Proses"
          : "Menunggu",
    }));
  }

  // ===== Indikator ber-flag "Tampil di Beranda" =====
  const flagged = await db
    .select({ id: indikator.id, nama: indikator.nama, target: indikator.target })
    .from(indikator)
    .where(eq(indikator.tampilkanDiBeranda, true))
    .orderBy(asc(indikator.nama));
  const flaggedIds = flagged.map((f) => f.id);

  // ===== Capaian indikator ber-flag (untuk KPI + tren) =====
  // Diambil semua, diproses di JS — skala data desa kecil, lebih sederhana
  // daripada SQL agregasi. Urut terbaru dulu untuk KPI (ambit per indikator
  // yang pertama = nilai terakhir).
  const capaianRows =
    flaggedIds.length > 0
      ? await db
          .select({
            id: capaian.id,
            indikatorId: capaian.indikatorId,
            nilai: capaian.nilai,
            periodeId: capaian.periodeId,
            periodeNama: periode.nama,
            tanggalMulai: periode.tanggalMulai,
            createdAt: capaian.createdAt,
          })
          .from(capaian)
          .innerJoin(indikator, eq(capaian.indikatorId, indikator.id))
          .innerJoin(periode, eq(capaian.periodeId, periode.id))
          .where(inArray(capaian.indikatorId, flaggedIds))
          .orderBy(desc(periode.tanggalMulai), desc(capaian.createdAt))
      : [];

  // ===== KPI: capaian terakhir per indikator =====
  const latestByIndikator = new Map<string, (typeof capaianRows)[number]>();
  for (const row of capaianRows) {
    if (!latestByIndikator.has(row.indikatorId)) {
      latestByIndikator.set(row.indikatorId, row);
    }
  }

  const kpis: KpiMonev[] = flagged.map((f) => {
    const latest = latestByIndikator.get(f.id);
    const capaianValue = latest?.nilai ?? 0;
    const progress =
      f.target > 0 ? Math.round((capaianValue / f.target) * 100) : 0;

    let badge: string;
    let tone: KpiTone;
    if (progress >= 100) {
      badge = "Selesai";
      tone = "success";
    } else if (progress >= 50) {
      badge = "Proses";
      tone = "info";
    } else {
      badge = "Menunggu";
      tone = "warning";
    }

    return {
      name: f.nama,
      value: formatAngka(capaianValue),
      detail: `dari target ${formatAngka(f.target)}`,
      progress: Math.min(progress, 100),
      badge,
      tone,
    };
  });

  // ===== Tren: total capaian per periode (urutan waktu naik) =====
  const trenMap = new Map<string, { nama: string; tanggalMulai: Date; total: number }>();
  for (const row of capaianRows) {
    const existing = trenMap.get(row.periodeId);
    if (existing) {
      existing.total += row.nilai;
    } else {
      trenMap.set(row.periodeId, {
        nama: row.periodeNama,
        tanggalMulai: row.tanggalMulai,
        total: row.nilai,
      });
    }
  }
  const trenRows = [...trenMap.values()].sort(
    (a, b) => a.tanggalMulai.getTime() - b.tanggalMulai.getTime(),
  );

  return (
    <MonevPage
      tahapan={showTahapan ? tahapan : null}
      kpis={kpis}
      trenLabels={trenRows.map((t) => t.nama)}
      trenValues={trenRows.map((t) => t.total)}
    />
  );
}
