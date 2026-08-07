"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ClipboardList,
  Settings2,
  Trash2,
} from "lucide-react";
import {
  createKendala,
  updateStatusKendala,
  deleteKendala,
  type KendalaState,
} from "../actions";
import { KENDALA_STATUS, type KendalaStatus } from "../schema";

/** Satu baris kendala dari DB. */
export interface KendalaRow {
  id: string;
  deskripsi: string;
  tanggal: string; // ISO string
  status: KendalaStatus;
}

interface KendalaClientProps {
  initialItems: KendalaRow[];
}

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

/** Tanggal input <input type="date"> → string YYYY-MM-DD lokal (bukan UTC). */
function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Tanggal ISO DB → tampilan "6 Agu 2026". */
function formatTanggal(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Warna chip status — semantik: Baru=amber, Proses=blue, Selesai=green. */
function statusBadgeClass(status: KendalaStatus): string {
  switch (status) {
    case "Selesai":
      return "bg-green-100 text-green-700";
    case "Proses":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export function KendalaClient({ initialItems }: KendalaClientProps) {
  const router = useRouter();

  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState(toDateInputValue(new Date()));
  const [status, setStatus] = useState<KendalaStatus>("Baru");
  const [feedback, setFeedback] = useState<KendalaState | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("deskripsi", deskripsi);
    fd.set("tanggal", tanggal);
    fd.set("status", status);
    const res = await createKendala(null, fd);
    setFeedback(res);
    if (res.ok) {
      setDeskripsi("");
      setTanggal(toDateInputValue(new Date()));
      setStatus("Baru");
      router.refresh();
    }
  }

  async function handleStatusChange(id: string, next: KendalaStatus) {
    const res = await updateStatusKendala(id, next);
    if (!res.ok) {
      setFeedback({ ok: false, error: res.error ?? "Gagal ubah status." });
      return;
    }
    setFeedback(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus catatan kendala ini dari logbook?")) return;
    const res = await deleteKendala(id);
    if (!res.ok) {
      setFeedback({ ok: false, error: res.error ?? "Gagal menghapus." });
      return;
    }
    setFeedback(null);
    router.refresh();
  }

  function renderFeedback() {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Logbook Kendala KKN
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Catat hambatan operasional dan pantau progres penyelesaian masalah
          di lapangan.
        </p>
      </div>

      {/* Grid: form (kiri) + daftar (kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ===== Form Catat Kendala ===== */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
            <AlertCircle className="h-5 w-5 text-emerald-600" />
            Catat Kendala Baru
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label htmlFor="deskripsi" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Deskripsi Kendala
              </label>
              <textarea
                id="deskripsi"
                required
                rows={4}
                value={deskripsi}
                onChange={(e) => {
                  setDeskripsi(e.target.value);
                  setFeedback(null);
                }}
                placeholder="Jelaskan kendala secara rinci (misal: alat rusak, koordinasi warga, kekurangan berkas)..."
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Tanggal */}
            <div className="space-y-1.5">
              <label htmlFor="tanggal" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Tanggal Kendala
              </label>
              <input
                id="tanggal"
                type="date"
                required
                value={tanggal}
                onChange={(e) => {
                  setTanggal(e.target.value);
                  setFeedback(null);
                }}
                className={inputCls}
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label htmlFor="status" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Status Awal
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as KendalaStatus);
                  setFeedback(null);
                }}
                className={`${inputCls} cursor-pointer`}
              >
                {KENDALA_STATUS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
              >
                Simpan Kendala
              </button>
              {renderFeedback()}
            </div>
          </form>
        </div>

        {/* ===== Daftar Kendala ===== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-slate-400" />
              Daftar Kendala
            </h3>
            <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              {initialItems.length} Catatan
            </span>
          </div>

          {initialItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
              Tidak ada kendala aktif saat ini. Semua sistem berjalan lancar!
            </div>
          ) : (
            <div className="space-y-4">
              {initialItems.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm group hover:shadow-md transition-shadow duration-200"
                >
                  {/* Badge status pojok kanan atas */}
                  <span className={`absolute top-5 right-5 text-xs font-semibold rounded-full px-2.5 py-0.5 ${statusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>

                  <div className="space-y-3 pr-20">
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>{formatTanggal(item.tanggal)}</span>
                    </div>
                    <p className="text-slate-800 text-sm leading-relaxed font-medium">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* Status cepat + hapus */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Settings2 className="h-3 w-3" />
                        Status Cepat:
                      </span>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as KendalaStatus)}
                        className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium text-slate-700 transition-colors"
                      >
                        {KENDALA_STATUS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Hapus Kendala"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
