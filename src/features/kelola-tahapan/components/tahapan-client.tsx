"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  createTahapan,
  updateTahapan,
  toggleSelesai,
  moveTahapan,
  deleteTahapan,
  toggleTampilkanTahapanKKN,
  type TahapanState,
} from "../actions";

/** Satu baris tahapan dari DB. */
export interface TahapanRow {
  id: string;
  nama: string;
  urutan: number;
  selesai: boolean;
}

interface TahapanClientProps {
  initialItems: TahapanRow[];
  tampilkanTahapanKKN: boolean;
}

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

export function TahapanClient({ initialItems, tampilkanTahapanKKN }: TahapanClientProps) {
  const router = useRouter();

  // Form tambah
  const [nama, setNama] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  // Edit inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNama, setEditNama] = useState("");

  const [feedback, setFeedback] = useState<TahapanState | null>(null);

  const sorted = [...initialItems].sort((a, b) => a.urutan - b.urutan);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) return;
    const fd = new FormData();
    fd.set("nama", nama);
    const res = await createTahapan(null, fd);
    setFeedback(res);
    if (res.ok) {
      setNama("");
      setShowAdd(false);
      router.refresh();
    }
  }

  function startEdit(row: TahapanRow) {
    setEditingId(row.id);
    setEditNama(row.nama);
  }
  function cancelEdit() {
    setEditingId(null);
  }
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editNama.trim()) return;
    const res = await updateTahapan(editingId, editNama.trim());
    if (!res.ok) setFeedback({ ok: false, error: res.error ?? "Gagal menyimpan." });
    else setFeedback(null);
    if (res.ok) setEditingId(null);
    router.refresh();
  }

  async function handleToggleSelesai(row: TahapanRow) {
    const res = await toggleSelesai(row.id, row.selesai);
    if (!res.ok) setFeedback({ ok: false, error: res.error ?? "Gagal mengubah status." });
    else setFeedback(null);
    router.refresh();
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const res = await moveTahapan(id, direction);
    if (!res.ok) setFeedback({ ok: false, error: res.error ?? "Gagal mengubah urutan." });
    else setFeedback(null);
    router.refresh();
  }

  async function handleDelete(id: string, nama: string) {
    if (!confirm(`Hapus tahapan "${nama}"?`)) return;
    const res = await deleteTahapan(id);
    if (!res.ok) setFeedback({ ok: false, error: res.error ?? "Gagal menghapus." });
    else setFeedback(null);
    router.refresh();
  }

  async function handleToggleTampilkan() {
    const res = await toggleTampilkanTahapanKKN(tampilkanTahapanKKN);
    if (!res.ok) setFeedback({ ok: false, error: res.error ?? "Gagal mengubah tampilan." });
    else setFeedback(null);
    router.refresh();
  }

  function renderFeedback() {
    if (!feedback) return null;
    if (feedback.ok) {
      return (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Kelola Tahapan KKN
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Atur tahapan program kerja KKN Bank Sampah yang tampil di dashboard
          monev publik.
        </p>
      </div>

      {/* Kartu pengaturan global */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <h3 className="font-heading text-base font-bold text-slate-900">
            Tampilkan Tahapan di Halaman Publik
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Jika dinonaktifkan, checklist tahapan KKN disembunyikan dari dashboard
            publik (/monev). Gunakan toggle ini setelah seluruh program kerja KKN
            selesai diarsipkan.
          </p>
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={tampilkanTahapanKKN}
          onClick={handleToggleTampilkan}
          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          style={{ backgroundColor: tampilkanTahapanKKN ? "#059669" : "#cbd5e1" }}
        >
          <span className="sr-only">Toggle Tampilkan Tahapan</span>
          <span
            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            style={{ transform: tampilkanTahapanKKN ? "translateX(20px)" : "translateX(0px)" }}
          />
        </button>
      </div>

      {/* Kartu daftar tahapan */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Daftar Tahapan KKN
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Urutan tahapan diatur dengan tombol panah.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Tahapan</span>
          </button>
        </div>

        {/* Form tambah inline */}
        {showAdd && (
          <form onSubmit={handleAdd} className="p-6 border-b border-slate-100 space-y-3">
            <label htmlFor="nama-tahapan" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Nama Tahapan Baru
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="nama-tahapan"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Misal: Sosialisasi & Edukasi Pemilahan Sampah"
                className={inputCls}
                autoFocus
              />
              <div className="flex gap-2 shrink-0">
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tabel responsif */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6 text-center w-20">Urutan</th>
                <th className="py-4 px-6">Nama Tahapan</th>
                <th className="py-4 px-6 text-center w-36">Status</th>
                <th className="py-4 px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Belum ada tahapan. Klik tombol Tambah Tahapan di atas.
                  </td>
                </tr>
              ) : (
                sorted.map((row, idx) => {
                  if (editingId === row.id) {
                    return (
                      <tr key={row.id} className="bg-emerald-50/30">
                        <td className="py-4 px-6 text-center font-mono font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-6">
                          <form onSubmit={handleEditSubmit} className="flex flex-col sm:flex-row gap-2">
                            <input
                              value={editNama}
                              onChange={(e) => setEditNama(e.target.value)}
                              className={`${inputCls} !py-2`}
                              autoFocus
                            />
                            <div className="flex gap-2 shrink-0">
                              <button
                                type="submit"
                                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                              >
                                Simpan
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                              >
                                Batal
                              </button>
                            </div>
                          </form>
                        </td>
                        <td className="py-4 px-6 text-center">{row.selesai ? "Selesai" : "Belum"}</td>
                        <td className="py-4 px-6 text-center" />
                      </tr>
                    );
                  }

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Urutan */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-mono font-bold text-slate-500">{idx + 1}</span>
                          <div className="flex gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMove(row.id, "up")}
                              disabled={idx === 0}
                              className="p-0.5 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                              title="Naikkan urutan"
                              aria-label={`Naikkan urutan ${row.nama}`}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMove(row.id, "down")}
                              disabled={idx === sorted.length - 1}
                              className="p-0.5 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                              title="Turunkan urutan"
                              aria-label={`Turunkan urutan ${row.nama}`}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Nama */}
                      <td className="py-4 px-6 font-medium text-slate-800">{row.nama}</td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelesai(row)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            row.selesai
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                          title="Klik untuk mengubah status"
                        >
                          {row.selesai ? (
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
                            type="button"
                            onClick={() => startEdit(row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Edit nama tahapan"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row.id, row.nama)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus tahapan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100">{renderFeedback()}</div>
      </div>
    </div>
  );
}
