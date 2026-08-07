"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  LayoutGrid,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  createIndikator,
  updateIndikator,
  deleteIndikator,
  toggleTampilkanDiBeranda,
  type IndikatorState,
} from "../actions";
import { kategoriIndikator } from "../schema";

/**
 * Tipe baris indikator hasil query server component.
 * `target` bertipe number (numeric mode 'number' di Drizzle).
 */
export interface IndikatorRow {
  id: string;
  nama: string;
  kategori: string;
  target: number;
  tampilkanDiBeranda: boolean;
}

interface IndikatorClientProps {
  initialItems: IndikatorRow[];
}

/** Format angka ribuan (contoh: 1.200) + satuan pilihan. */
function formatTarget(target: number) {
  return new Intl.NumberFormat("id-ID").format(target);
}

export function IndikatorClient({ initialItems }: IndikatorClientProps) {
  const router = useRouter();
  // Catatan: daftar tidak disimpan di state lokal. Setiap CRUD memanggil
  // `router.refresh()` sehingga server component re-render dan mengirimkan
  // `initialItems` terbaru — daftar selalu sinkron dengan database.

  const [showAddForm, setShowAddForm] = useState(false);
  // Form tambah
  const [addForm, setAddForm] = useState({
    nama: "",
    kategori: "Lingkungan",
    target: "",
    tampilkanDiBeranda: false,
  });
  const [addFeedback, setAddFeedback] = useState<IndikatorState | null>(null);

  // Form edit (id null = mode tambah)
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    nama: "",
    kategori: "Lingkungan" as string,
    target: "",
    tampilkanDiBeranda: false,
  });
  const [editFeedback, setEditFeedback] = useState<IndikatorState | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("nama", addForm.nama);
    fd.set("kategori", addForm.kategori);
    fd.set("target", addForm.target);
    fd.set("tampilkanDiBeranda", addForm.tampilkanDiBeranda ? "on" : "off");
    const res = await createIndikator(null, fd);
    setAddFeedback(res);
    if (res.ok) {
      setAddForm({ nama: "", kategori: "Lingkungan", target: "", tampilkanDiBeranda: false });
      setShowAddForm(false);
      router.refresh();
    }
  }

  function openEdit(item: IndikatorRow) {
    setEditId(item.id);
    setEditForm({
      nama: item.nama,
      kategori: item.kategori,
      target: String(item.target),
      tampilkanDiBeranda: item.tampilkanDiBeranda,
    });
    setEditFeedback(null);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    const fd = new FormData();
    fd.set("id", editId);
    fd.set("nama", editForm.nama);
    fd.set("kategori", editForm.kategori);
    fd.set("target", editForm.target);
    fd.set("tampilkanDiBeranda", editForm.tampilkanDiBeranda ? "on" : "off");
    const res = await updateIndikator(null, fd);
    setEditFeedback(res);
    if (res.ok) {
      setEditId(null);
      router.refresh();
    }
  }

  async function handleToggle(item: IndikatorRow) {
    await toggleTampilkanDiBeranda(item.id, item.tampilkanDiBeranda);
    router.refresh();
  }

  async function handleDelete(item: IndikatorRow) {
    if (!confirm(`Hapus indikator "${item.nama}"? Data capaian terkait juga ikut terhapus.`)) {
      return;
    }
    await deleteIndikator(item.id);
    router.refresh();
  }

  function renderFeedback(feedback: IndikatorState | null) {
    if (!feedback) return null;
    if (feedback.ok) {
      return (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
          <CheckCircle className="h-3.5 w-3.5" />
          {feedback.message}
        </p>
      );
    }
    return (
      <p className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
        <AlertCircle className="h-3.5 w-3.5" />
        {feedback.error}
      </p>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  return (
    <div className="space-y-8">
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

      {/* Add Form Card */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 max-w-2xl"
        >
          <h3 className="font-heading text-base font-bold text-slate-900">
            Tambah Indikator Baru
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Nama Indikator
              </label>
              <input
                id="name"
                type="text"
                required
                value={addForm.nama}
                onChange={(e) => setAddForm({ ...addForm, nama: e.target.value })}
                placeholder="Misal: Volume Sampah Organik"
                className={inputCls}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="target" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Target Capaian
              </label>
              <input
                id="target"
                type="number"
                required
                step="0.01"
                min="0"
                value={addForm.target}
                onChange={(e) => setAddForm({ ...addForm, target: e.target.value })}
                placeholder="Contoh: 1000"
                className={inputCls}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="category" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Kategori
              </label>
              <select
                id="category"
                value={addForm.kategori}
                onChange={(e) => setAddForm({ ...addForm, kategori: e.target.value })}
                className={inputCls}
              >
                {kategoriIndikator.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between border border-slate-100 rounded-lg p-3 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Tampil di Beranda
              </span>
              <button
                type="button"
                onClick={() => setAddForm({ ...addForm, tampilkanDiBeranda: !addForm.tampilkanDiBeranda })}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                style={{ backgroundColor: addForm.tampilkanDiBeranda ? "#059669" : "#cbd5e1" }}
                aria-label="Tampilkan di beranda"
              >
                <span
                  className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200"
                  style={{ transform: addForm.tampilkanDiBeranda ? "translateX(20px)" : "translateX(0px)" }}
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
          {renderFeedback(addFeedback)}
        </form>
      )}

      {/* Edit Form Card (replaces list while editing) */}
      {editId && (
        <form
          onSubmit={handleEdit}
          className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm space-y-4 max-w-2xl"
        >
          <h3 className="font-heading text-base font-bold text-slate-900">
            Ubah Indikator
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="edit-name" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Nama Indikator
              </label>
              <input
                id="edit-name"
                type="text"
                required
                value={editForm.nama}
                onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                className={inputCls}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="edit-target" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Target Capaian
              </label>
              <input
                id="edit-target"
                type="number"
                required
                step="0.01"
                min="0"
                value={editForm.target}
                onChange={(e) => setEditForm({ ...editForm, target: e.target.value })}
                className={inputCls}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="edit-category" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Kategori
              </label>
              <select
                id="edit-category"
                value={editForm.kategori}
                onChange={(e) => setEditForm({ ...editForm, kategori: e.target.value })}
                className={inputCls}
              >
                {kategoriIndikator.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between border border-slate-100 rounded-lg p-3 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Tampil di Beranda
              </span>
              <button
                type="button"
                onClick={() => setEditForm({ ...editForm, tampilkanDiBeranda: !editForm.tampilkanDiBeranda })}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                style={{ backgroundColor: editForm.tampilkanDiBeranda ? "#059669" : "#cbd5e1" }}
                aria-label="Tampilkan di beranda"
              >
                <span
                  className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200"
                  style={{ transform: editForm.tampilkanDiBeranda ? "translateX(20px)" : "translateX(0px)" }}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={() => setEditId(null)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Batal
            </button>
          </div>
          {renderFeedback(editFeedback)}
        </form>
      )}

      {/* List */}
      <div className="space-y-4">
        {initialItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
            Belum ada indikator capaian. Klik &quot;+ Indikator Baru&quot; untuk menambahkan.
          </div>
        ) : (
          initialItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Left Column */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading font-extrabold text-slate-900 text-base md:text-lg">
                    {item.nama}
                  </h3>
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    {item.kategori}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>ID Indikator: {item.id.slice(0, 8)}</span>
                </div>
              </div>

              {/* Middle Column */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-12 md:mr-6">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Target Capaian
                  </span>
                  <span className="block text-slate-800 text-sm font-semibold mt-0.5">
                    {formatTarget(item.target)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Tampil di Beranda
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      {item.tampilkanDiBeranda ? "Ditampilkan" : "Disembunyikan"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle(item)}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    style={{ backgroundColor: item.tampilkanDiBeranda ? "#059669" : "#cbd5e1" }}
                    title="Klik untuk mengubah visibilitas beranda"
                    aria-label="Ubah visibilitas beranda"
                  >
                    <span
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200"
                      style={{ transform: item.tampilkanDiBeranda ? "translateX(20px)" : "translateX(0px)" }}
                    />
                  </button>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 border-t border-slate-50 pt-4 md:pt-0 md:border-t-0 justify-end">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Ubah Indikator"
                >
                  <Pencil className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
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
