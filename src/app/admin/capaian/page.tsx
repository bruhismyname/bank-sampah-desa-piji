"use client";

import { useState } from "react";
import { ClipboardPlus, History, Calendar, CheckCircle2 } from "lucide-react";

interface HistoryItem {
  id: number;
  indicator: string;
  value: string;
  date: string;
}

const indicatorsList = [
  { id: "volume", label: "Volume Sampah Terkelola", unit: "Kg" },
  { id: "nasabah", label: "Total Nasabah Aktif", unit: "Nasabah" },
  { id: "omset", label: "Omset Penjualan Produk Kreatif", unit: "Rupiah" },
  { id: "sosialisasi", label: "Jumlah Sosialisasi Lingkungan", unit: "Kali" },
];

const periodsList = [
  { id: "m1-agu", label: "Minggu 1 Agustus 2026" },
  { id: "m2-agu", label: "Minggu 2 Agustus 2026" },
  { id: "m3-agu", label: "Minggu 3 Agustus 2026" },
  { id: "m4-agu", label: "Minggu 4 Agustus 2026" },
];

export default function InputCapaianPage() {
  const [selectedIndicatorId, setSelectedIndicatorId] = useState("volume");
  const [selectedPeriodId, setSelectedPeriodId] = useState("m1-agu");
  const [value, setValue] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 1,
      indicator: "Volume Sampah Terkelola",
      value: "240 Kg",
      date: "05 Agu 2026",
    },
    {
      id: 2,
      indicator: "Total Nasabah Aktif",
      value: "480 Nasabah",
      date: "04 Agu 2026",
    },
    {
      id: 3,
      indicator: "Jumlah Sosialisasi Lingkungan",
      value: "8 Kali",
      date: "01 Agu 2026",
    },
  ]);

  const activeIndicator = indicatorsList.find(ind => ind.id === selectedIndicatorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || isNaN(Number(value))) return;

    const selectedIndicator = indicatorsList.find(i => i.id === selectedIndicatorId);
    const selectedPeriod = periodsList.find(p => p.id === selectedPeriodId);
    
    if (!selectedIndicator || !selectedPeriod) return;

    // Format the value with unit
    let formattedVal = "";
    if (selectedIndicator.id === "omset") {
      formattedVal = `Rp ${Number(value).toLocaleString("id-ID")}`;
    } else {
      formattedVal = `${value} ${selectedIndicator.unit}`;
    }

    // Get current date string (e.g. "06 Agu 2026")
    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const formattedDate = `${today.getDate().toString().padStart(2, "0")} ${months[today.getMonth()]} ${today.getFullYear()}`;

    // Add to history list
    const newItem: HistoryItem = {
      id: Date.now(),
      indicator: selectedIndicator.label,
      value: formattedVal,
      date: formattedDate,
    };

    setHistory(prev => [newItem, ...prev.slice(0, 4)]); // Keep top 5
    setValue("");
    setSuccessMsg(`Berhasil menyimpan data ${selectedIndicator.label} sebesar ${formattedVal} untuk ${selectedPeriod.label}.`);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
            Input Capaian Baru
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Masukkan angka pencapaian kinerja program Bank Sampah secara berkala di sini.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 animate-in fade-in duration-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">
              {successMsg}
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input 1: Pilih Indikator */}
            <div className="space-y-2">
              <label htmlFor="indicator" className="block text-sm font-bold text-slate-700">
                Pilih Indikator Capaian
              </label>
              <select
                id="indicator"
                value={selectedIndicatorId}
                onChange={e => {
                  setSelectedIndicatorId(e.target.value);
                  setSuccessMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3.5 text-slate-950 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm md:text-base cursor-pointer"
              >
                {indicatorsList.map(ind => (
                  <option key={ind.id} value={ind.id}>
                    {ind.label} ({ind.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Input 2: Pilih Periode */}
            <div className="space-y-2">
              <label htmlFor="period" className="block text-sm font-bold text-slate-700">
                Pilih Periode Penginputan
              </label>
              <select
                id="period"
                value={selectedPeriodId}
                onChange={e => {
                  setSelectedPeriodId(e.target.value);
                  setSuccessMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3.5 text-slate-950 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm md:text-base cursor-pointer"
              >
                {periodsList.map(per => (
                  <option key={per.id} value={per.id}>
                    {per.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Input 3: Nilai Capaian */}
            <div className="space-y-2">
              <label htmlFor="capaianValue" className="block text-sm font-bold text-slate-700">
                Nilai Capaian ({activeIndicator?.unit})
              </label>
              <div className="relative">
                <input
                  id="capaianValue"
                  type="number"
                  required
                  min="0"
                  step="any"
                  placeholder="0"
                  value={value}
                  onChange={e => {
                    setValue(e.target.value);
                    setSuccessMsg(null);
                  }}
                  className="w-full text-center font-mono text-3xl font-extrabold rounded-lg border border-slate-300 p-4 text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                {activeIndicator && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded">
                    {activeIndicator.unit}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 p-4 text-sm font-bold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              Simpan Data Capaian
            </button>

          </form>
        </div>

        {/* Kartu Riwayat Terakhir */}
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-400" />
            Riwayat Terakhir Diinput
          </h3>
          
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {history.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      {item.indicator}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                      <Calendar className="h-3 w-3" />
                      Diinput: {item.date}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/50 rounded-lg px-3 py-1.5 text-sm">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
