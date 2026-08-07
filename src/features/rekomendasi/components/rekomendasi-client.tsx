"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  createRekomendasi,
  updateRekomendasi,
  moveRekomendasiStatus,
  deleteRekomendasi,
} from "../actions";
import { PRIORITAS, type KendalaStatus, type Prioritas } from "../schema";

/** Satu kartu rekomendasi dari DB. */
export interface RekomendasiCard {
  id: string;
  judul: string;
  deskripsi: string | null;
  prioritas: Prioritas;
  status: KendalaStatus;
}

interface RekomendasiClientProps {
  initialItems: RekomendasiCard[];
}

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

const KOLOM: { status: KendalaStatus; label: string; dot: string; headerBg: string }[] = [
  { status: "Baru", label: "Baru", dot: "bg-amber-500", headerBg: "bg-amber-100 text-amber-800" },
  { status: "Proses", label: "Dalam Proses", dot: "bg-blue-500", headerBg: "bg-blue-100 text-blue-800" },
  { status: "Selesai", label: "Selesai", dot: "bg-emerald-500", headerBg: "bg-emerald-100 text-emerald-800" },
];

function priorityBadgeClass(p: Prioritas): string {
  switch (p) {
    case "Tinggi": return "bg-red-50 text-red-700 border-red-100";
    case "Sedang": return "bg-amber-50 text-amber-700 border-amber-100";
    default: return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export function RekomendasiClient({ initialItems }: RekomendasiClientProps) {
  const router = useRouter();

  // Form tambah
  const [showAddForm, setShowAddForm] = useState(false);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [prioritas, setPrioritas] = useState<Prioritas>("Sedang");

  // Edit inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editJudul, setEditJudul] = useState("");
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [editPrioritas, setEditPrioritas] = useState<Prioritas>("Sedang");

  // Drag state
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Feedback
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!judul.trim()) return;
    const fd = new FormData();
    fd.set("judul", judul);
    fd.set("deskripsi", deskripsi);
    fd.set("prioritas", prioritas);
    const res = await createRekomendasi(null, fd);
    setFeedback({ ok: res.ok, message: res.ok ? res.message : res.error });
    if (res.ok) {
      setJudul("");
      setDeskripsi("");
      setPrioritas("Sedang");
      setShowAddForm(false);
      router.refresh();
    }
  }

  function startEdit(card: RekomendasiCard) {
    setEditingId(card.id);
    setEditJudul(card.judul);
    setEditDeskripsi(card.deskripsi ?? "");
    setEditPrioritas(card.prioritas);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    const res = await updateRekomendasi(editingId, {
      judul: editJudul,
      deskripsi: editDeskripsi,
      prioritas: editPrioritas,
    });
    setFeedback({ ok: res.ok, message: res.ok ? "Perubahan disimpan." : (res.error ?? "Gagal.") });
    if (res.ok) {
      setEditingId(null);
      router.refresh();
    }
  }

  async function moveTo(id: string, status: KendalaStatus) {
    const res = await moveRekomendasiStatus(id, status);
    if (!res.ok) setFeedback({ ok: false, message: res.error ?? "Gagal menggeser kartu." });
    else setFeedback(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus rekomendasi ini?")) return;
    const res = await deleteRekomendasi(id);
    if (!res.ok) setFeedback({ ok: false, message: res.error ?? "Gagal menghapus." });
    else setFeedback(null);
    router.refresh();
  }

  // --- drag handlers ---
  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  function handleDrop(e: React.DragEvent, targetStatus: KendalaStatus) {
    e.preventDefault();
    const id = draggingId ?? e.dataTransfer.getData("text/plain");
    if (id) moveTo(id, targetStatus);
    setDraggingId(null);
  }

  function renderCard(card: RekomendasiCard, status: KendalaStatus) {
    const isEditing = editingId === card.id;

    if (isEditing) {
      return (
        <form
          key={card.id}
          onSubmit={handleEditSubmit}
          className="bg-white shadow-sm rounded-xl border border-emerald-300 p-4 space-y-2.5"
        >
          <input
            value={editJudul}
            onChange={(e) => setEditJudul(e.target.value)}
            placeholder="Judul"
            required
            className={`${inputCls} !py-2`}
          />
          <textarea
            value={editDeskripsi}
            onChange={(e) => setEditDeskripsi(e.target.value)}
            placeholder="Deskripsi (opsional)"
            rows={2}
            className={`${inputCls} !py-2 resize-none`}
          />
          <select
            value={editPrioritas}
            onChange={(e) => setEditPrioritas(e.target.value as Prioritas)}
            className={`${inputCls} !py-2 cursor-pointer`}
          >
            {PRIORITAS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
          </div>
        </form>
      );
    }

    return (
      <div
        key={card.id}
        draggable
        onDragStart={(e) => handleDragStart(e, card.id)}
        className={`bg-white shadow-sm rounded-xl border border-slate-200 p-4 hover:shadow-md cursor-grab active:cursor-grabbing transition-all space-y-3 relative group ${
          card.status === "Selesai" ? "bg-slate-50/50" : ""
        }`}
      >
        {/* Priority tag + actions */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityBadgeClass(card.prioritas)}`}>
            {card.prioritas}
          </span>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => startEdit(card)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Ubah rekomendasi"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(card.id)}
              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Hapus Rekomendasi"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title & description */}
        <div className="space-y-1">
          <h4 className={`font-bold text-slate-800 text-sm ${
            card.status === "Selesai" ? "line-through text-slate-400 decoration-slate-400/70" : ""
          }`}>
            {card.judul}
          </h4>
          {card.deskripsi && (
            <p className={`text-xs text-slate-500 leading-relaxed ${
              card.status === "Selesai" ? "line-through text-slate-400/80 decoration-slate-400/50" : ""
            }`}>
              {card.deskripsi}
            </p>
          )}
        </div>

        {/* Mobile navigation arrows */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <div className="flex gap-1.5">
            {status !== "Baru" && (
              <button
                type="button"
                onClick={() => moveTo(card.id, status === "Selesai" ? "Proses" : "Baru")}
                className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                title="Geser ke kolom sebelumnya"
                aria-label="Geser ke kolom sebelumnya"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            )}
            {status !== "Selesai" && (
              <button
                type="button"
                onClick={() => moveTo(card.id, status === "Baru" ? "Proses" : "Selesai")}
                className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                title="Geser ke kolom berikutnya"
                aria-label="Geser ke kolom berikutnya"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
            Tindak Lanjut & Rekomendasi
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Kelola alur kerja rekomendasi evaluasi dengan papan kanban. Geser kartu
            antar kolom, atau gunakan tombol panah di ponsel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 self-start sm:self-auto"
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{showAddForm ? "Tutup Form" : "Tambah Rekomendasi"}</span>
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${
          feedback.ok
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Add form (collapsible) */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 max-w-2xl"
        >
          <h3 className="font-heading text-base font-bold text-slate-900">
            Rekomendasi Tindak Lanjut Baru
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="judul" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Nama / Judul Tugas
              </label>
              <input
                id="judul"
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Misal: Pemasangan Spanduk Alur Pemilahan"
                className={inputCls}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="deskripsi" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Detail Deskripsi (opsional)
              </label>
              <textarea
                id="deskripsi"
                rows={3}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan secara singkat tindak lanjut yang harus dilakukan..."
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="prioritas" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Tingkat Prioritas
              </label>
              <select
                id="prioritas"
                value={prioritas}
                onChange={(e) => setPrioritas(e.target.value as Prioritas)}
                className={`${inputCls} cursor-pointer`}
              >
                {PRIORITAS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
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

      {/* Info tips */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-800">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">
          <strong>Tips Navigasi Kanban:</strong> Pada desktop/laptop, geser (drag-and-drop)
          kartu langsung antar kolom. Di HP/layar sentuh, gunakan tombol panah kiri-kanan di
          bagian bawah kartu untuk menggeser status.
        </p>
      </div>

      {/* Kanban board */}
      <div className="flex overflow-x-auto pb-4 gap-6 md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0">
        {KOLOM.map((col) => {
          const columnItems = initialItems.filter((i) => i.status === col.status);
          return (
            <div
              key={col.status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.status)}
              className="bg-slate-100 rounded-2xl p-4 flex flex-col min-h-[400px] space-y-4 w-80 md:w-auto shrink-0 border border-slate-200/50"
            >
              {/* Header kolom */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                  <h3 className="font-heading font-extrabold text-slate-800 text-sm md:text-base capitalize">
                    {col.label}
                  </h3>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.headerBg}`}>
                  {columnItems.length}
                </span>
              </div>

              {/* Kartu */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {columnItems.length === 0 ? (
                  <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-xs text-slate-400 font-medium">
                    Tarik kartu atau tambahkan rekomendasi ke sini.
                  </div>
                ) : (
                  columnItems.map((card) => renderCard(card, col.status))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
