import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getLaporanPdfData } from "@/lib/laporan-data";
import { LaporanPdfDocument } from "@/features/laporan-export/pdf-document";

export const dynamic = "force-dynamic";

/**
 * Route export Laporan Ringkasan (PDF).
 *
 * Dipanggil dari form /admin/laporan (submission GET dengan query ?mulai= &
 * ?akhir=). Render dokumen PDF via @react-pdf/renderer di sisi server, lalu
 * kirim sebagai attachment.
 *
 * Terproteksi oleh middleware auth (seluruh /admin/*).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mulaiRaw = searchParams.get("mulai");
  const akhirRaw = searchParams.get("akhir");

  // Validasi tanggal: wajib, format YYYY-MM-DD, mulai <= akhir.
  if (!mulaiRaw || !akhirRaw) {
    return new Response("Parameter tanggal tidak lengkap.", { status: 400 });
  }

  const mulai = new Date(`${mulaiRaw}T00:00:00`);
  const akhir = new Date(`${akhirRaw}T00:00:00`);

  if (isNaN(mulai.getTime()) || isNaN(akhir.getTime())) {
    return new Response("Format tanggal tidak valid. Gunakan YYYY-MM-DD.", { status: 400 });
  }
  if (mulai > akhir) {
    return new Response("Tanggal mulai tidak boleh setelah tanggal akhir.", { status: 400 });
  }

  try {
    const data = await getLaporanPdfData(mulai, akhir);

    const buffer = await renderToBuffer(
      <LaporanPdfDocument data={data} />,
    );

    // Salin ke Uint8Array baru — Buffer Node tidak langsung diterima sebagai
    // BodyInit pada tipe Response.
    const pdfBytes = Uint8Array.from(buffer);

    const fileName = `laporan-monev-${mulaiRaw}-sampai-${akhirRaw}.pdf`;

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("PDF export error:", e);
    return new Response(
      "Gagal membuat laporan PDF. Coba lagi, atau gunakan rentang tanggal yang lebih pendek.",
      { status: 500 },
    );
  }
}
