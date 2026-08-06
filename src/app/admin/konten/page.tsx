"use client";

import { useState, useRef } from "react";
import { Settings, FileText, UploadCloud, CheckCircle2, Eye, HelpCircle } from "lucide-react";

export default function KelolaKontenPage() {
  // Card 1 States (Hero Homepage)
  const [headline, setHeadline] = useState("Monev Bank Sampah Desa Piji");
  const [subheadline, setSubheadline] = useState(
    "Sistem monitoring evaluasi program kerja KKN mahasiswa dalam mengedukasi warga, mendata pencapaian volume sampah bulanan, serta memantau logbook kendala secara real-time."
  );
  const [heroSuccess, setHeroSuccess] = useState<string | null>(null);

  // Card 2 States (SOP Document)
  const [currentSopName, setCurrentSopName] = useState("SOP_BankSampah_v2.pdf");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sopSuccess, setSopSuccess] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !subheadline.trim()) return;

    setHeroSuccess("Konten Hero Homepage berhasil disimpan.");
    setTimeout(() => {
      setHeroSuccess(null);
    }, 5000);
  };

  const handleSopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFile) {
      setCurrentSopName(selectedFile.name);
      setSelectedFile(null);
    }
    
    setSopSuccess("Dokumen SOP Bank Sampah berhasil diperbarui.");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTimeout(() => {
      setSopSuccess(null);
    }, 5000);
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Mohon unggah file dengan format PDF saja!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran berkas melebihi batas maksimal 5MB!");
        return;
      }
      setSelectedFile(file);
      setSopSuccess(null);
    }
  };

  const handleViewCurrentSop = () => {
    alert(`Simulasi: Membuka file ${currentSopName} di tab baru...`);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen pb-24">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Pengaturan Konten Halaman Publik
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Ubah konten statis beranda dan perbarui berkas panduan Standard Operating Procedure (SOP) publik.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Kartu 1: Hero Homepage */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
            <Settings className="h-5 w-5 text-emerald-600" />
            Seksi Hero Beranda (Homepage)
          </h3>

          {heroSuccess && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 animate-in fade-in duration-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold">{heroSuccess}</p>
            </div>
          )}

          <form onSubmit={handleHeroSubmit} className="space-y-4">
            {/* Headline */}
            <div className="space-y-1">
              <label htmlFor="headline" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Headline Beranda
              </label>
              <input
                id="headline"
                type="text"
                required
                value={headline}
                onChange={e => {
                  setHeadline(e.target.value);
                  setHeroSuccess(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Subheadline */}
            <div className="space-y-1">
              <label htmlFor="subheadline" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Subheadline Beranda
              </label>
              <textarea
                id="subheadline"
                required
                rows={4}
                value={subheadline}
                onChange={e => {
                  setSubheadline(e.target.value);
                  setHeroSuccess(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Helper Text */}
            <div className="flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed font-semibold uppercase tracking-wider">
              <HelpCircle className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
              <span>Atur kalimat sambutan yang tampil di halaman depan website.</span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 py-2.5 font-bold text-xs transition-colors"
              >
                Simpan Konten Hero
              </button>
            </div>
          </form>
        </div>

        {/* Kartu 2: Dokumen SOP */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
            <FileText className="h-5 w-5 text-emerald-600" />
            Dokumen SOP Panduan Program
          </h3>

          {sopSuccess && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 animate-in fade-in duration-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold">{sopSuccess}</p>
            </div>
          )}

          <form onSubmit={handleSopSubmit} className="space-y-5">
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Upload PDF SOP Bank Sampah
              </span>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />

              {/* Upload Dropzone */}
              <div
                onClick={handleDropzoneClick}
                className="w-full border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer text-center group"
              >
                <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 text-slate-400 flex items-center justify-center transition-colors">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">
                    {selectedFile ? selectedFile.name : "Pilih file PDF SOP (Max 5MB)"}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {selectedFile 
                      ? `Selected Size: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : "Klik atau seret berkas PDF di sini"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Current Stored File Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200/60 rounded-xl p-4">
              <div className="space-y-0.5">
                <span className="block text-xs text-slate-400 font-bold uppercase tracking-wide">
                  File Saat Ini:
                </span>
                <span className="block text-sm font-semibold text-slate-700">
                  {currentSopName}
                </span>
              </div>

              <button
                type="button"
                onClick={handleViewCurrentSop}
                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 font-bold rounded-lg px-4 py-2 text-xs transition-colors self-start sm:self-auto"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 py-2.5 font-bold text-xs transition-colors"
              >
                Simpan Dokumen SOP
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
