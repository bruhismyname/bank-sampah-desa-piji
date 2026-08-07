import ExcelJS from "exceljs";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import {
  berita,
  capaian,
  evaluasi,
  evaluasiKriteria,
  indikator,
  kendala,
  periode,
  profilProgram,
  rekomendasi,
  siteContent,
  tahapanKkn,
} from "@/db/schema";

/**
 * Laporan Excel — Backup Data Mentah.
 *
 * Sesuai PRD: mengunduh SELURUH isi database (semua tabel) TANPA filter
 * tanggal — dipakai untuk backup sistem / rekap manual. Satu sheet per tabel,
 * nama sheet = nama tabel DB (snake_case).
 *
 * Tabel `users` (login admin) TIDAK ikut — berisi hash password & kode
 * pemulihan, tidak pantas masuk file backup yang bisa dibagikan.
 *
 * Format tanggal dikonversi ke ISO string (bukan serial Excel) supaya mudah
 * dibaca saat buka file.
 */

const emerald = "FF006948";
const white = "FFFFFFFF";

/** Konversi nilai kolom → tipe yang aman untuk sel Excel. */
function cellValue(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "bigint") return value.toString();
  return value as string | number | boolean;
}

/** Isi satu worksheet dari baris-baris hasil query. */
function addSheet<T extends Record<string, unknown>>(
  wb: ExcelJS.Workbook,
  name: string,
  rows: T[],
) {
  const ws = wb.addWorksheet(name);

  if (rows.length === 0) {
    ws.addRow(["Data kosong"]);
    ws.getRow(1).font = { italic: true };
    return;
  }

  const headers = Object.keys(rows[0]);
  ws.addRow(headers);
  for (const row of rows) {
    ws.addRow(headers.map((h) => cellValue(row[h])));
  }

  // Header emerald + teks putih, autofit kolom.
  ws.getRow(1).font = { bold: true, color: { argb: white } };
  ws.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: emerald },
  };
  ws.getRow(1).height = 18;
  ws.views = [{ state: "frozen", ySplit: 1 }];

  ws.columns.forEach((col, idx) => {
    if (!col) return;
    let maxLen = headers[idx]?.length ?? 8;
    for (const v of col.values ?? []) {
      if (v !== null && v !== undefined) {
        maxLen = Math.max(maxLen, String(v).length);
      }
    }
    col.width = Math.min(48, maxLen + 2);
  });
}

/** Susun seluruh tabel DB menjadi satu workbook Excel (1 sheet/tabel). */
export async function getLaporanExcelWorkbook(): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Bank Sampah Desa Piji";

  // Urutan tabel: yang sering dilihat monev lebih dulu.
  const [indikatorRows, periodeRows, capaianRows, kendalaRows, kriteriaRows, evaluasiRows, rekomendasiRows, tahapanRows, profilRows, beritaRows, kontenRows] =
    await Promise.all([
      db.select().from(indikator).orderBy(asc(indikator.createdAt)),
      db.select().from(periode).orderBy(asc(periode.tanggalMulai)),
      db.select().from(capaian).orderBy(asc(capaian.createdAt)),
      db.select().from(kendala).orderBy(desc(kendala.createdAt)),
      db.select().from(evaluasiKriteria).orderBy(asc(evaluasiKriteria.urutan)),
      db.select().from(evaluasi).orderBy(asc(evaluasi.createdAt)),
      db.select().from(rekomendasi).orderBy(asc(rekomendasi.urutan)),
      db.select().from(tahapanKkn).orderBy(asc(tahapanKkn.urutan)),
      db.select().from(profilProgram),
      db.select().from(berita).orderBy(desc(berita.createdAt)),
      db.select().from(siteContent).orderBy(asc(siteContent.key)),
    ]);

  addSheet(wb, "indikator", indikatorRows);
  addSheet(wb, "periode", periodeRows);
  addSheet(wb, "capaian", capaianRows);
  addSheet(wb, "kendala", kendalaRows);
  addSheet(wb, "evaluasi_kriteria", kriteriaRows);
  addSheet(wb, "evaluasi", evaluasiRows);
  addSheet(wb, "rekomendasi", rekomendasiRows);
  addSheet(wb, "tahapan_kkn", tahapanRows);
  addSheet(wb, "profil_program", profilRows);
  addSheet(wb, "berita", beritaRows);
  addSheet(wb, "site_content", kontenRows);

  return wb;
}
