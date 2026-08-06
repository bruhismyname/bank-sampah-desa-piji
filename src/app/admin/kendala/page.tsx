"use client";

import { useState } from "react";
import { AlertCircle, Plus, Calendar, Settings2, Trash2 } from "lucide-react";

interface KendalaItem {
  id: number;
  date: string;
  description: string;
  status: "Baru" | "Proses" | "Selesai";
}

export default function LogbookKendalaPage() {
  const [items, setItems] = useState<KendalaItem[]>([
    {
      id: 1,
      date: "05 Agu 2026",
      description: "Timbangan digital di pos penimbangan RW 03 mengalami gangguan baterai/mati total sehingga data penimbangan dialihkan manual.",
      status: "Proses",
    },
    {
      id: 2,
      date: "04 Agu 2026",
      description: "Beberapa warga belum memilah sampah plastik secara benar dari sampah dapur organik, sehingga memperlambat proses sortasi.",
      status: "Baru",
    },
    {
      id: 3,
      date: "01 Agu 2026",
      description: "Kekurangan buku rekening cetak untuk nasabah baru karena pendaftar melonjak di luar target KKN awal.",
      status: "Selesai",
    },
  ]);

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Baru" | "Proses" | "Selesai">("Baru");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Get current date string (e.g. "06 Agu 2026")
    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const formattedDate = `${today.getDate().toString().padStart(2, "0")} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const newItem: KendalaItem = {
      id: Date.now(),
      date: formattedDate,
      description: description.trim(),
      status: status,
    };

    setItems(prev => [newItem, ...prev]);
    setDescription("");
    setStatus("Baru");
  };

  const handleStatusChange = (id: number, newStatus: "Baru" | "Proses" | "Selesai") => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kendala ini dari logbook?")) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const getStatusBadgeClass = (s: "Baru" | "Proses" | "Selesai") => {
    switch (s) {
      case "Baru":
        return "bg-blue-100 text-blue-700";
      case "Proses":
        return "bg-amber-100 text-amber-700";
      case "Selesai":
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Logbook Kendala KKN
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Catat hambatan operasional dan pantau progres penyelesaian masalah di lapangan.
        </p>
      </div>

      {/* Grid Split 2 Kolom di Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Kolom Kiri: Form Catat Kendala (5/12 width) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
            <AlertCircle className="h-5 w-5 text-emerald-600" />
            Catat Kendala Baru
          </h3>

          <form onSubmit={handleAdd} className="space-y-4">
            
            {/* Deskripsi Kendala (Textarea) */}
            <div className="space-y-1.5">
              <label htmlFor="desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Deskripsi Kendala
              </label>
              <textarea
                id="desc"
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Jelaskan kendala secara rinci (misal: alat rusak, koordinasi warga, kekurangan berkas)..."
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Status Kendala (Select) */}
            <div className="space-y-1.5">
              <label htmlFor="status" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Status Awal
              </label>
              <select
                id="status"
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="Baru">Baru</option>
                <option value="Proses">Proses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 p-3 text-xs font-bold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              Simpan Kendala
            </button>

          </form>
        </div>

        {/* Kolom Kanan: Daftar Kendala Aktif (7/12 width) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900">
              Daftar Kendala Aktif
            </h3>
            <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              {items.length} Masalah
            </span>
          </div>

          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
                Tidak ada kendala aktif saat ini. Semua sistem berjalan lancar!
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm relative group hover:shadow-md transition-shadow duration-200"
                >
                  {/* Badge Status (Pojok Kanan Atas) */}
                  <span className={`absolute top-5 right-5 text-xs font-semibold rounded-full px-2.5 py-0.5 ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>

                  <div className="space-y-3 pr-20">
                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-800 text-sm leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>

                  {/* Status Switcher & Delete Row */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Settings2 className="h-3 w-3" />
                        Status Cepat:
                      </span>
                      <select
                        value={item.status}
                        onChange={e => handleStatusChange(item.id, e.target.value as any)}
                        className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium text-slate-700 transition-colors"
                      >
                        <option value="Baru">Baru</option>
                        <option value="Proses">Proses</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Hapus Kendala"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
