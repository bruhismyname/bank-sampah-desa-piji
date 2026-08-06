"use client";

import { useState } from "react";
import { FileText, FileSpreadsheet, Download, RefreshCw, CheckCircle2 } from "lucide-react";

export default function LaporanExportPage() {
  // Default date ranges for the current month
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-31");
  
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: "pdf" | "excel"; text: string } | null>(null);

  const handleGeneratePdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setGeneratingPdf(true);
    setAlertMsg(null);

    // Simulate PDF generation delay (1.5s)
    setTimeout(() => {
      setGeneratingPdf(false);
      setAlertMsg({
        type: "pdf",
        text: `Berhasil mengunduh Laporan Ringkasan (PDF) periode ${formatDate(startDate)} s.d. ${formatDate(endDate)}.`,
      });
    }, 1500);
  };

  const handleDownloadExcel = () => {
    setDownloadingExcel(true);
    setAlertMsg(null);

    // Simulate Excel generation delay (1.2s)
    setTimeout(() => {
      setDownloadingExcel(false);
      setAlertMsg({
        type: "excel",
        text: "Berhasil mengunduh Backup Data Mentah (Excel) berisi seluruh tabel database.",
      });
    }, 1200);
  };

  // Helper to format date strings for readability (e.g. "01 Agu 2026")
  const formatDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const year = parts[0];
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parts[2];
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Generate Laporan
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Ekspor data pencapaian monev program Bank Sampah Desa Piji ke format PDF atau Excel.
        </p>
      </div>

      {/* Success Notification */}
      {alertMsg && (
        <div className="max-w-5xl mx-auto flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 animate-in fade-in duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold leading-relaxed">
            {alertMsg.text}
          </p>
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
                Menghasilkan laporan visual meliputi grafik tren penimbangan, status capaian program KKN, 
                logbook kendala, evaluasi bulanan, dan rekomendasi tindak lanjut.
              </p>
            </div>

            {/* Date Inputs */}
            <form onSubmit={handleGeneratePdf} id="pdf-form" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label htmlFor="startDate" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Tanggal Mulai
                </label>
                <input
                  id="startDate"
                  type="date"
                  required
                  value={startDate}
                  onChange={e => {
                    setStartDate(e.target.value);
                    setAlertMsg(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-950 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="endDate" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Tanggal Akhir
                </label>
                <input
                  id="endDate"
                  type="date"
                  required
                  value={endDate}
                  onChange={e => {
                    setEndDate(e.target.value);
                    setAlertMsg(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-950 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-xs font-semibold"
                />
              </div>
            </form>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              form="pdf-form"
              disabled={generatingPdf}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 text-white p-3.5 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {generatingPdf ? (
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
                Mengunduh seluruh isi database (semua tabel logbook penimbangan sampah, capaian target, kendala, 
                dan daftar nasabah) tanpa filter tanggal. Digunakan untuk keperluan backup sistem atau rekap manual.
              </p>
            </div>

            {/* Note box placeholder for layout balance */}
            <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4 text-[11px] text-slate-400 leading-relaxed font-semibold uppercase tracking-wider">
              Peringatan: Selalu simpan file backup excel di tempat yang aman karena memuat data sensitif warga.
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={handleDownloadExcel}
              disabled={downloadingExcel}
              className="w-full rounded-lg border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-300 p-3 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {downloadingExcel ? (
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
