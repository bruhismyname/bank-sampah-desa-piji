import { getLaporanExcelWorkbook } from "@/lib/laporan-excel";

export const dynamic = "force-dynamic";

/**
 * Route export Backup Data Mentah (Excel).
 *
 * Mengunduh seluruh isi database (semua tabel) tanpa filter tanggal —
 * dipakai untuk backup sistem / rekap manual. Satu sheet per tabel.
 *
 * Terproteksi oleh middleware auth (seluruh /admin/*).
 */
export async function GET() {
  try {
    const wb = await getLaporanExcelWorkbook();
    const buffer = await wb.xlsx.writeBuffer();

    const fileName = `backup-database-bank-sampah-piji-${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Excel export error:", e);
    return new Response("Gagal membuat file Excel. Coba lagi.", {
      status: 500,
    });
  }
}
