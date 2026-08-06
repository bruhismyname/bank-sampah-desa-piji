"use client";

import { useState } from "react";
import { Plus, ArrowLeft, ArrowRight, Trash2, Tag, Info } from "lucide-react";

interface RekomendasiItem {
  id: number;
  title: string;
  description: string;
  priority: "Tinggi" | "Sedang" | "Rendah";
  status: "Baru" | "Proses" | "Selesai";
}

export default function KanbanRekomendasiPage() {
  const [items, setItems] = useState<RekomendasiItem[]>([
    {
      id: 1,
      title: "Edukasi Door-to-Door",
      description: "Sosialisasi langsung ke rumah warga RT 02 yang belum tertib memilah sampah plastik.",
      priority: "Tinggi",
      status: "Baru",
    },
    {
      id: 2,
      title: "Pembuatan Kompos Organik",
      description: "Pelatihan pengolahan sampah organik basah rumah tangga menjadi pupuk kompos desa.",
      priority: "Sedang",
      status: "Baru",
    },
    {
      id: 3,
      title: "Pengadaan Drop-box Sampah Plastik",
      description: "Menempatkan tempat sampah khusus botol plastik di 5 titik strategis sekitar balai desa.",
      priority: "Tinggi",
      status: "Proses",
    },
    {
      id: 4,
      title: "Sosialisasi Buku Tabungan",
      description: "Pembagian buku rekening nasabah bank sampah perdana kepada warga RT 01 dan RT 02.",
      priority: "Rendah",
      status: "Selesai",
    },
    {
      id: 5,
      title: "Pemasangan Peta Lokasi Google Maps",
      description: "Menghubungkan link peta lokasi Kantor Kepala Desa Piji di homepage website publik.",
      priority: "Sedang",
      status: "Selesai",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"Tinggi" | "Sedang" | "Rendah">("Sedang");

  // Drag and drop state
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: "Baru" | "Proses" | "Selesai") => {
    e.preventDefault();
    const id = draggingId || Number(e.dataTransfer.getData("text/plain"));
    if (id) {
      moveItem(id, targetStatus);
    }
    setDraggingId(null);
  };

  const moveItem = (id: number, newStatus: "Baru" | "Proses" | "Selesai") => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleMoveLeft = (item: RekomendasiItem) => {
    if (item.status === "Proses") moveItem(item.id, "Baru");
    else if (item.status === "Selesai") moveItem(item.id, "Proses");
  };

  const handleMoveRight = (item: RekomendasiItem) => {
    if (item.status === "Baru") moveItem(item.id, "Proses");
    else if (item.status === "Proses") moveItem(item.id, "Selesai");
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus rekomendasi ini?")) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newItem: RekomendasiItem = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      status: "Baru",
    };

    setItems(prev => [...prev, newItem]);
    setNewTitle("");
    setNewDescription("");
    setNewPriority("Sedang");
    setShowAddForm(false);
  };

  const getPriorityBadgeClass = (p: "Tinggi" | "Sedang" | "Rendah") => {
    switch (p) {
      case "Tinggi":
        return "bg-red-50 text-red-700 border-red-100";
      case "Sedang":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Rendah":
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const renderColumn = (status: "Baru" | "Proses" | "Selesai", label: string, accentColor: string, headerBg: string) => {
    const columnItems = items.filter(item => item.status === status);
    
    return (
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
        className="bg-slate-100 rounded-2xl p-4 flex flex-col min-h-[550px] space-y-4 w-80 md:w-auto shrink-0 select-none border border-slate-200/50"
      >
        {/* Header Kolom */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${accentColor}`} />
            <h3 className="font-heading font-extrabold text-slate-800 text-sm md:text-base capitalize">
              {label}
            </h3>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${headerBg}`}>
            {columnItems.length}
          </span>
        </div>

        {/* List Kartu */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {columnItems.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-xs text-slate-400 font-medium">
              Tarik kartu atau tambahkan rekomendasi ke sini.
            </div>
          ) : (
            columnItems.map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                className={`bg-white shadow-sm rounded-xl border border-slate-200 p-4 hover:shadow-md cursor-grab active:cursor-grabbing transition-all space-y-3 relative group ${
                  item.status === "Selesai" ? "bg-slate-50/50" : ""
                }`}
              >
                {/* Priority Tag & Delete */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadgeClass(item.priority)}`}>
                    {item.priority}
                  </span>
                  
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Hapus Rekomendasi"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h4 className={`font-bold text-slate-800 text-sm ${
                    item.status === "Selesai" ? "line-through text-slate-400 decoration-slate-400/70" : ""
                  }`}>
                    {item.title}
                  </h4>
                  <p className={`text-xs text-slate-500 leading-relaxed ${
                    item.status === "Selesai" ? "line-through text-slate-400/80 decoration-slate-400/50" : ""
                  }`}>
                    {item.description}
                  </p>
                </div>

                {/* Navigation Arrows for Mobile Accessibility */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <div className="flex gap-1.5">
                    {status !== "Baru" && (
                      <button
                        onClick={() => handleMoveLeft(item)}
                        className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Geser Kiri"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {status !== "Selesai" && (
                      <button
                        onClick={() => handleMoveRight(item)}
                        className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Geser Kanan"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono">
                    ID-{item.id.toString().slice(-4)}
                  </span>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
            Tindak Lanjut & Rekomendasi
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Kelola alur kerja rekomendasi evaluasi menggunakan sistem Kanban Board interaktif.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Rekomendasi</span>
        </button>
      </div>

      {/* Add Form (Collapsible) */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 max-w-2xl animate-in slide-in-from-top-4 duration-200"
        >
          <h3 className="font-heading text-base font-bold text-slate-900">
            Rekomendasi Tindak Lanjut Baru
          </h3>
          
          <div className="space-y-3">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="title" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Nama / Judul Tugas
              </label>
              <input
                id="title"
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Misal: Pemasangan Spanduk Alur Pemilahan"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="desc" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Detail Deskripsi
              </label>
              <textarea
                id="desc"
                required
                rows={3}
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Jelaskan secara singkat tindak lanjut yang harus dilakukan..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label htmlFor="priority" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Tingkat Prioritas
              </label>
              <select
                id="priority"
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="Tinggi">Tinggi (Merah)</option>
                <option value="Sedang">Sedang (Kuning)</option>
                <option value="Rendah">Rendah (Abu-abu)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
            >
              Simpan Rekomendasi
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

      {/* Info Tips */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-800">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">
          <strong>Tips Navigasi Kanban:</strong> Pada perangkat desktop/laptop, Anda dapat menggeser (drag-and-drop) 
          kartu secara langsung antar kolom. Bagi pengguna HP/Layar Sentuh, gunakan tombol panah kiri-kanan ("&lt;-" dan "-&gt;") 
          di bagian bawah kartu untuk menggeser status dengan cepat.
        </p>
      </div>

      {/* Kanban Board Container (Flex scrollable on mobile, Grid on desktop) */}
      <div className="flex overflow-x-auto pb-4 gap-6 md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0 scrollbar-thin">
        {renderColumn("Baru", "Baru", "bg-blue-500", "bg-blue-100 text-blue-800")}
        {renderColumn("Proses", "Dalam Proses", "bg-amber-500", "bg-amber-100 text-amber-800")}
        {renderColumn("Selesai", "Selesai", "bg-emerald-500", "bg-emerald-100 text-emerald-800")}
      </div>

    </div>
  );
}
