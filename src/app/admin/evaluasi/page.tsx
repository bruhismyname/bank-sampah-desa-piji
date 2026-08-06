"use client";

import { useState, useRef } from "react";
import { Camera, CheckSquare, UploadCloud, X, AlertCircle } from "lucide-react";

interface KriteriaRating {
  id: string;
  name: string;
  score: number;
}

export default function EvaluasiPeriodikPage() {
  const [period, setPeriod] = useState("agt-2026");
  const [ratings, setRatings] = useState<KriteriaRating[]>([
    { id: "partisipasi", name: "Partisipasi Warga", score: 3 },
    { id: "administrasi", name: "Kerapian Administrasi", score: 4 },
    { id: "inovasi", name: "Inovasi Program", score: 3 },
  ]);
  const [note, setNote] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScoreChange = (id: string, score: number) => {
    setRatings(prev =>
      prev.map(item => (item.id === id ? { ...item, score } : item))
    );
    setSuccessMsg(null);
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 4.5 * 1024 * 1024) {
        alert("Ukuran berkas melebihi batas 4.5MB!");
        return;
      }
      setSelectedFile(file);
      setSuccessMsg(null);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening file picker
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate successful API submission
    setSuccessMsg("Evaluasi bulanan berhasil disimpan dan diarsipkan ke sistem.");
    
    // Reset form states
    setRatings(prev => prev.map(item => ({ ...item, score: 3 })));
    setNote("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clear alert after 5 seconds
    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
            Form Evaluasi Bulanan
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Berikan penilaian kualitatif dan kuantitatif program kerja Bank Sampah Desa Piji.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 animate-in fade-in duration-300">
            <CheckSquare className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">
              {successMsg}
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Input 1: Pilih Periode */}
            <div className="space-y-2">
              <label htmlFor="period" className="block text-sm font-bold text-slate-700">
                Pilih Periode Evaluasi
              </label>
              <select
                id="period"
                value={period}
                onChange={e => {
                  setPeriod(e.target.value);
                  setSuccessMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3.5 text-slate-950 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm md:text-base cursor-pointer"
              >
                <option value="jul-2026">Bulan Juli 2026</option>
                <option value="agt-2026">Bulan Agustus 2026</option>
                <option value="sep-2026">Bulan September 2026</option>
              </select>
            </div>

            {/* Input 2: Blok Skor Kriteria */}
            <div className="space-y-6">
              <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-50 pb-2 flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-emerald-600" />
                Penilaian Kriteria Program
              </h3>

              <div className="space-y-6">
                {ratings.map(criterion => (
                  <div key={criterion.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        {criterion.name}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Skor: {criterion.score} / 5
                      </span>
                    </div>

                    {/* Radio Button Grid (1-5) */}
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map(score => {
                        const isSelected = criterion.score === score;
                        return (
                          <button
                            key={score}
                            type="button"
                            onClick={() => handleScoreChange(criterion.id, score)}
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-bold text-base cursor-pointer border transition-all duration-150 ${
                              isSelected
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20 scale-105"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                            aria-label={`Skor ${score} untuk ${criterion.name}`}
                          >
                            {score}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input 3: Blok Catatan & Upload */}
            <div className="space-y-6">
              <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-50 pb-2">
                Catatan & Lampiran Bukti
              </h3>

              {/* Catatan Textarea */}
              <div className="space-y-2">
                <label htmlFor="note" className="block text-sm font-bold text-slate-700">
                  Catatan Evaluasi Keseluruhan
                </label>
                <textarea
                  id="note"
                  required
                  rows={4}
                  value={note}
                  onChange={e => {
                    setNote(e.target.value);
                    setSuccessMsg(null);
                  }}
                  placeholder="Berikan ringkasan kualitatif mengenai keberhasilan maupun hambatan penting dari program di periode ini..."
                  className="w-full rounded-lg border border-slate-300 p-3.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Upload Foto Box */}
              <div className="space-y-2">
                <span className="block text-sm font-bold text-slate-700">
                  Foto Bukti Kegiatan
                </span>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={handleUploadAreaClick}
                  className="w-full border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer text-center relative overflow-hidden group"
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <Camera className="h-6 w-6" />
                      </div>
                      <div className="text-slate-800 text-sm font-semibold truncate max-w-md mx-auto">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold mt-1 bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <X className="h-3 w-3" />
                        <span>Hapus File</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 text-slate-400 flex items-center justify-center transition-colors">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700">
                          Tap untuk Upload Foto Bukti
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Maksimal ukuran berkas 4.5MB (Format: JPG, PNG)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 p-4 text-sm font-bold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              Kirim Hasil Evaluasi
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
