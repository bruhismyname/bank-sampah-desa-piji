"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";

interface TahapanItem {
  id: number;
  step: number;
  name: string;
  status: "Selesai" | "Belum";
}

export default function KelolaTahapanPage() {
  const [showPublic, setShowPublic] = useState(true);
  const [items, setItems] = useState<TahapanItem[]>([
    { id: 1, step: 1, name: "Sosialisasi & Edukasi Pemilahan Sampah Rumah Tangga", status: "Selesai" },
    { id: 2, step: 2, name: "Penyediaan Buku Rekening Nasabah & Timbangan Digital", status: "Selesai" },
    { id: 3, step: 3, name: "Uji Coba Penimbangan Perdana & Pembagian Saldo Tabungan", status: "Belum" },
  ]);

  const handleToggleStatus = (id: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === "Selesai" ? "Belum" : "Selesai" }
          : item
      )
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus tahapan ini?")) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAdd = () => {
    const name = prompt("Masukkan nama tahapan baru:");
    if (name && name.trim()) {
      setItems(prev => [
        ...prev,
        {
          id: Date.now(),
          step: prev.length > 0 ? Math.max(...prev.map(i => i.step)) + 1 : 1,
          name: name.trim(),
          status: "Belum"
        }
      ]);
    }
  };

  const handleEdit = (id: number, currentName: string) => {
    const name = prompt("Ubah nama tahapan:", currentName);
    if (name && name.trim() && name.trim() !== currentName) {
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, name: name.trim() } : item
        )
      );
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Kelola Tahapan KKN
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Atur tahapan program kerja KKN Bank Sampah yang tampil di halaman depan website.
        </p>
      </div>

      {/* Kartu Pengaturan Global */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <h3 className="font-heading text-base font-bold text-slate-900">
            Tampilkan Tahapan di Halaman Publik
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Jika dinonaktifkan, section progress alur kerja KKN di homepage (`/`) akan disembunyikan. 
            Gunakan toggle ini setelah seluruh program kerja KKN selesai diarsipkan.
          </p>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => setShowPublic(!showPublic)}
          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          style={{ backgroundColor: showPublic ? "#059669" : "#cbd5e1" }}
        >
          <span className="sr-only">Toggle Tampilkan Tahapan</span>
          <span
            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            style={{ transform: showPublic ? "translateX(20px)" : "translateX(0px)" }}
          />
        </button>
      </div>

      {/* Kartu Tabel Data */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Daftar Tahapan KKN
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Urutan tahapan ditentukan berdasarkan angka urutan penambahan.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Tahapan</span>
          </button>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6 text-center w-20">Urutan</th>
                <th className="py-4 px-6">Nama Tahapan</th>
                <th className="py-4 px-6 text-center w-36">Status</th>
                <th className="py-4 px-6 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Belum ada tahapan. Klik tombol Tambah Tahapan di atas.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Urutan */}
                    <td className="py-4 px-6 text-center font-mono font-bold text-slate-500">
                      {item.step}
                    </td>

                    {/* Nama Tahapan */}
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {item.name}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          item.status === "Selesai"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                        title="Klik untuk mengubah status"
                      >
                        {item.status === "Selesai" ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Selesai</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-slate-400" />
                            <span>Belum</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item.id, item.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit nama tahapan"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus tahapan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
