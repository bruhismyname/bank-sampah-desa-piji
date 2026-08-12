"use client";

import { useState } from "react";
import { AlertCircle, Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";

/**
 * Halaman Generate Laporan (/admin/laporan).
 *
 * Dua kartu:
 *  1. Laporan Ringkasan (PDF) — pilih rentang tanggal, lalu unduh. File
 *     di-generate route /admin/laporan/export-pdf?mulai=&akhir= (diproteksi
 *     middleware auth).
 *  2. Backup Data Mentah (Excel) — seluruh isi database, tanpa filter tanggal,
 *     dari /admin/laporan/export-excel.
 *
 * Unduhan dilakukan via fetch → blob → object URL, supaya tombol punya status
 * loading yang jujur dan error bisa ditampilkan (route mengembalikan teks
 * error bila gagal).
 */

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

/** Default rentang: bulan berjalan (mudah diubah admin). */
function defaultMulai(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}
function defaultAkhir(): string {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
}

/** Unduh URL sebagai file dengan nama tertentu (fetch → blob → object URL). */
async function downloadUrl(url: string, filename: string): Promise<string | null> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text();
    return body || "Gagal membuat file. Coba lagi.";
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
  return null;
}

export function LaporanClient() {
  const [mulai, setMulai] = useState(defaultMulai());
  const [akhir, setAkhir] = useState(defaultAkhir());
  const [memprosesPdf, setMemprosesPdf] = useState(false);
  const [memprosesExcel, setMemprosesExcel] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rentangValid = mulai && akhir && mulai <= akhir;

  const handlePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rentangValid) return;
    setMemprosesPdf(true);
    setErrorMsg(null);
    const err = await downloadUrl(
      `/admin/laporan/export-pdf?mulai=${mulai}&akhir=${akhir}`,
      `laporan-monev-${mulai}-sampai-${akhir}.pdf`,
    );
    if (err) setErrorMsg(err);
    setMemprosesPdf(false);
  };

  const handleExcel = async () => {
    setMemprosesExcel(true);
    setErrorMsg(null);
    const today = new Date().toISOString().slice(0, 10);
    const err = await downloadUrl(
      "/admin/laporan/export-excel",
      `backup-database-bank-sampah-piji-${today}.xlsx`,
    );
    if (err) setErrorMsg(err);
    setMemprosesExcel(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Generate Laporan
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Ekspor data monitoring & evaluasi program Bank Sampah Desa Piji ke
          format PDF (ringkasan) atau Excel (backup data mentah).
        </p>
      </div>

      {/* Error Notification */}
      {errorMsg && (
        <div className="max-w-5xl mx-auto flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* Grid 2 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        {/* Kartu Kiri: Export PDF */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between min-h-[440px] hover:shadow-md transition-shadow duration-200">
          <div className="space-y-6">
            {/* Icon & Title */}
            <div className="flex items-start justify-between">
              <div className="h-16 w-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100/50">
                <FileText className="h-9 w-9" />
              </div>
              <span className="bg-red-50 text-red-700 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-red-100">
                PDF Dokumen
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-xl font-extrabold text-slate-900">
                Laporan Ringkasan (PDF)
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Laporan visual satu halaman berisi ringkasan capaian indikator,
                grafik tren, jumlah kendala per status, rata-rata skor evaluasi,
                dan daftar rekomendasi. Rentang tanggal memilih periode yang
                dilaporkan.
              </p>
            </div>

            {/* Date Inputs */}
            <form id="pdf-form" onSubmit={handlePdf} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label
                  htmlFor="mulai"
                  className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide"
                >
                  Tanggal Mulai
                </label>
                <input
                  id="mulai"
                  type="date"
                  required
                  value={mulai}
                  onChange={(e) => {
                    setMulai(e.target.value);
                    setErrorMsg(null);
                  }}
                  className={inputCls}
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="akhir"
                  className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide"
                >
                  Tanggal Akhir
                </label>
                <input
                  id="akhir"
                  type="date"
                  required
                  value={akhir}
                  onChange={(e) => {
                    setAkhir(e.target.value);
                    setErrorMsg(null);
                  }}
                  className={inputCls}
                />
              </div>
              {!rentangValid && (
                <p className="sm:col-span-2 text-xs font-semibold text-red-600">
                  Tanggal mulai tidak boleh setelah tanggal akhir.
                </p>
              )}

              <div className="sm:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={memprosesPdf || !rentangValid}
                  className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 text-white p-3.5 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {memprosesPdf ? (
                    <>
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                      <span>Memproses Laporan...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4.5 w-4.5" />
                      <span>Generate PDF</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Kartu Kanan: Export Excel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between min-h-[440px] hover:shadow-md transition-shadow duration-200">
          <div className="space-y-6">
            {/* Icon & Title */}
            <div className="flex items-start justify-between">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                <FileSpreadsheet className="h-9 w-9" />
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-100">
                Spreadsheet
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-xl font-extrabold text-slate-900">
                Backup Data Mentah (Excel)
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Mengunduh seluruh isi database — satu sheet per tabel — tanpa
                filter tanggal. Digunakan untuk keperluan backup sistem atau
                rekap manual di luar aplikasi.
              </p>
            </div>

            {/* Note box */}
            <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4 text-[11px] text-slate-400 leading-relaxed font-semibold uppercase tracking-wider">
              Peringatan: Simpan file backup di tempat aman — berisi data
              program (capaian, kendala, evaluasi, berita). Data login admin
              tidak ikut diekspor.
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={handleExcel}
              disabled={memprosesExcel}
              className="w-full rounded-lg border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-300 p-3 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {memprosesExcel ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span>Mengunduh Backup...</span>
                </>
              ) : (
                <>
                  <Download className="h-4.5 w-4.5" />
                  <span>Unduh Raw Excel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
