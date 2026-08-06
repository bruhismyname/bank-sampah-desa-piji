"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, LayoutGrid, CheckCircle } from "lucide-react";

interface IndikatorItem {
  id: number;
  name: string;
  category: string;
  target: string;
  showOnHomepage: boolean;
}

export default function MasterIndikatorPage() {
  const [items, setItems] = useState<IndikatorItem[]>([
    {
      id: 1,
      name: "Total Nasabah Aktif",
      category: "Sosial",
      target: "500 Nasabah",
      showOnHomepage: true,
    },
    {
      id: 2,
      name: "Volume Sampah Terkelola",
      category: "Lingkungan",
      target: "1.200 Kg",
      showOnHomepage: true,
    },
    {
      id: 3,
      name: "Omset Penjualan Produk Kreatif",
      category: "Ekonomi",
      target: "Rp 5.000.000",
      showOnHomepage: false,
    },
    {
      id: 4,
      name: "Jumlah Sosialisasi Lingkungan",
      category: "Edukasi",
      target: "10 Kali",
      showOnHomepage: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Lingkungan");
  const [newTarget, setNewTarget] = useState("");
  const [newShowOnHomepage, setNewShowOnHomepage] = useState(false);

  const handleToggleHomepage = (id: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, showOnHomepage: !item.showOnHomepage } : item
      )
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus indikator ini?")) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTarget.trim()) return;

    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newName.trim(),
        category: newCategory,
        target: newTarget.trim(),
        showOnHomepage: newShowOnHomepage,
      },
    ]);

    // Reset form
    setNewName("");
    setNewCategory("Lingkungan");
    setNewTarget("");
    setNewShowOnHomepage(false);
    setShowAddForm(false);
  };

  const handleEdit = (id: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const name = prompt("Ubah Nama Indikator:", item.name);
    if (name === null) return; // Cancelled

    const target = prompt("Ubah Target:", item.target);
    if (target === null) return; // Cancelled

    if (name.trim() && target.trim()) {
      setItems(prev =>
        prev.map(i =>
          i.id === id ? { ...i, name: name.trim(), target: target.trim() } : i
        )
      );
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
            Master Indikator Capaian
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Kelola indikator kinerja utama dan target pengelolaan sampah Desa Piji.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Indikator Baru</span>
        </button>
      </div>

      {/* Add Form Card (Collapsible) */}
      {showAddForm && (
        <form 
          onSubmit={handleAdd}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 max-w-2xl animate-in slide-in-from-top-4 duration-200"
        >
          <h3 className="font-heading text-base font-bold text-slate-900">
            Tambah Indikator Baru
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Indikator */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Nama Indikator
              </label>
              <input
                id="name"
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Misal: Volume Sampah Organik"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Target */}
            <div className="space-y-1">
              <label htmlFor="target" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Target Capaian
              </label>
              <input
                id="target"
                type="text"
                required
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                placeholder="Misal: 1.000 Kg"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-1">
              <label htmlFor="category" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Kategori
              </label>
              <select
                id="category"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="Sosial">Sosial</option>
                <option value="Lingkungan">Lingkungan</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="Edukasi">Edukasi</option>
              </select>
            </div>

            {/* Tampil di Beranda Toggle */}
            <div className="flex items-center justify-between border border-slate-100 rounded-lg p-3 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Tampil di Beranda
              </span>
              <button
                type="button"
                onClick={() => setNewShowOnHomepage(!newShowOnHomepage)}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                style={{ backgroundColor: newShowOnHomepage ? "#059669" : "#cbd5e1" }}
              >
                <span
                  className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  style={{ transform: newShowOnHomepage ? "translateX(20px)" : "translateX(0px)" }}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
            >
              Simpan Indikator
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Horizontal Cards List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
            Belum ada indikator capaian. Klik "+ Indikator Baru" untuk menambahkan.
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Left Column: Title & Category */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading font-extrabold text-slate-900 text-base md:text-lg">
                    {item.name}
                  </h3>
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>ID Indikator: IND-{item.id.toString().slice(-4)}</span>
                </div>
              </div>

              {/* Middle Column: Target & Visibility */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-12 md:mr-6">
                
                {/* Target */}
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Target Capaian
                  </span>
                  <span className="block text-slate-800 text-sm font-semibold mt-0.5">
                    {item.target}
                  </span>
                </div>

                {/* Tampil di Beranda Toggle */}
                <div className="flex items-center gap-3">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Tampil di Beranda
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      {item.showOnHomepage ? "Ditampilkan" : "Disembunyikan"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleHomepage(item.id)}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    style={{ backgroundColor: item.showOnHomepage ? "#059669" : "#cbd5e1" }}
                    title="Klik untuk mengubah visibilitas beranda"
                  >
                    <span
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      style={{ transform: item.showOnHomepage ? "translateX(20px)" : "translateX(0px)" }}
                    />
                  </button>
                </div>

              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 border-t border-slate-50 pt-4 md:pt-0 md:border-t-0 justify-end">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Ubah Indikator"
                >
                  <Pencil className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Hapus Indikator"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
