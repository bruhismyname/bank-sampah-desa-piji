"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  ClipboardList,
  ImageIcon,
  Link2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  saveEvaluasi,
  deleteEvaluasi,
  saveKriteria,
  deleteKriteria,
  moveKriteria,
  type EvaluasiState,
} from "../actions";
import { SKOR_MIN, SKOR_MAX } from "../schema";

/** Satu kriteria penilaian (dari DB). */
export interface KriteriaOption {
  id: string;
  nama: string;
  bobot: number;
  urutan: number;
}

/** Satu sesi evaluasi (riwayat, per periode). */
export interface RiwayatEvaluasi {
  periodeId: string;
  periodeNama: string;
  tanggalMulai: string; // ISO
  tanggalAkhir: string; // ISO
  rataRata: number;
  catatan: string | null;
  fotoUrl: string | null;
}

interface EvaluasiClientProps {
  kriterias: KriteriaOption[];
  riwayat: RiwayatEvaluasi[];
}

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

/** Format angka id-ID. */
function formatAngka(n: number) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(n);
}

/** Format tanggal tampilan "6 Agu 2026". */
function formatTanggal(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function EvaluasiClient({ kriterias, riwayat }: EvaluasiClientProps) {
  const router = useRouter();

  // Periode sesi aktif
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  // Skor per kriteria (id → skor)
  const [scores, setScores] = useState<Record<string, number>>({});

  // Catatan & foto
  const [catatan, setCatatan] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  // Tambah kriteria
  const [newKriteria, setNewKriteria] = useState("");
  const [newBobot, setNewBobot] = useState("1");

  // Feedback
  const [feedback, setFeedback] = useState<EvaluasiState | null>(null);

  const sortedKriterias = [...kriterias].sort((a, b) => a.urutan - b.urutan);

  function resetSesi() {
    setTanggalMulai("");
    setTanggalAkhir("");
    setScores({});
    setCatatan("");
    setFotoUrl("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tanggalMulai || !tanggalAkhir) {
      setFeedback({ ok: false, error: "Pilih rentang tanggal periode evaluasi." });
      return;
    }
    if (sortedKriterias.length === 0) {
      setFeedback({ ok: false, error: "Belum ada kriteria. Tambahkan minimal satu kriteria dulu." });
      return;
    }

    const skorLines: string[] = [];
    for (const k of sortedKriterias) {
      const s = scores[k.id];
      if (typeof s === "number" && s >= SKOR_MIN && s <= SKOR_MAX) {
        skorLines.push(`${k.id}:${s}`);
      }
    }
    if (skorLines.length === 0) {
      setFeedback({ ok: false, error: `Isi minimal satu skor kriteria (1–${SKOR_MAX}).` });
      return;
    }

    const fd = new FormData();
    fd.set("tanggalMulai", tanggalMulai);
    fd.set("tanggalAkhir", tanggalAkhir);
    fd.set("catatan", catatan);
    if (fotoUrl) fd.set("fotoUrl", fotoUrl);
    fd.set("skor", skorLines.join("\n"));

    const res = await saveEvaluasi(null, fd);
    setFeedback(res);
    if (res.ok) {
      resetSesi();
      router.refresh();
    }
  }

  async function handleDeleteSesi(periodeId: string, label: string) {
    if (!confirm(`Hapus sesi evaluasi periode ${label}?`)) return;
    const res = await deleteEvaluasi(periodeId);
    if (!res.ok) {
      setFeedback({ ok: false, error: res.error ?? "Gagal menghapus." });
      return;
    }
    setFeedback(null);
    router.refresh();
  }

  async function handleAddKriteria() {
    if (!newKriteria.trim()) {
      setFeedback({ ok: false, error: "Nama kriteria tidak boleh kosong." });
      return;
    }
    const res = await saveKriteria(newKriteria.trim(), Number(newBobot) || 1);
    if (!res.ok) {
      setFeedback({ ok: false, error: res.error ?? "Gagal menambah kriteria." });
      return;
    }
    setNewKriteria("");
    setNewBobot("1");
    setFeedback(null);
    router.refresh();
  }

  async function handleDeleteKriteria(id: string, nama: string) {
    if (!confirm(`Hapus kriteria "${nama}" beserta skor evaluasinya?`)) return;
    const res = await deleteKriteria(id);
    if (!res.ok) {
      setFeedback({ ok: false, error: res.error ?? "Gagal menghapus kriteria." });
      return;
    }
    setFeedback(null);
    router.refresh();
  }

  async function handleMoveKriteria(id: string, direction: "up" | "down") {
    const res = await moveKriteria(id, direction);
    if (!res.ok) {
      setFeedback({ ok: false, error: res.error ?? "Gagal mengubah urutan." });
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
          Evaluasi Periodik
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Beri skor kualitatif (1–5) per kriteria untuk tiap periode. Rata-rata
          dihitung otomatis sebagai ringkasan — tidak perlu menghitung manual.
        </p>
      </div>

      {/* ===== Form Sesi Evaluasi ===== */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm space-y-8 max-w-3xl"
      >
        {/* Periode */}
        <div className="space-y-3">
          <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-50 pb-2">
            Periode Evaluasi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="tgl-mulai" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Tanggal Mulai
              </label>
              <input
                id="tgl-mulai"
                type="date"
                required
                value={tanggalMulai}
                onChange={(e) => { setTanggalMulai(e.target.value); setFeedback(null); }}
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tgl-akhir" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Tanggal Akhir
              </label>
              <input
                id="tgl-akhir"
                type="date"
                required
                value={tanggalAkhir}
                onChange={(e) => { setTanggalAkhir(e.target.value); setFeedback(null); }}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Skor per kriteria */}
        <div className="space-y-4">
          <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-50 pb-2 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-600" />
            Penilaian Kriteria Program
          </h3>

          {sortedKriterias.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
              Belum ada kriteria. Tambahkan di blok “Kelola Kriteria” di bawah.
            </div>
          ) : (
            <div className="space-y-5">
              {sortedKriterias.map((k) => {
                const cur = scores[k.id];
                const isRated = typeof cur === "number" && cur >= SKOR_MIN && cur <= SKOR_MAX;
                return (
                  <div key={k.id} className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-semibold text-slate-700 truncate">
                          {k.nama}
                        </span>
                        {k.bobot !== 1 && (
                          <span className="text-[10px] text-slate-400 bg-slate-50 rounded px-1.5 py-0.5">
                            bobot {formatAngka(k.bobot)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                        {isRated ? `Skor: ${cur} / ${SKOR_MAX}` : "Belum dinilai"}
                      </span>
                    </div>

                    {/* Tombol skor 1-5 */}
                    <div className="flex gap-2">
                      {Array.from({ length: SKOR_MAX - SKOR_MIN + 1 }, (_, i) => SKOR_MIN + i).map((s) => {
                        const selected = cur === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setScores((prev) => ({ ...prev, [k.id]: s }));
                              setFeedback(null);
                            }}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-base cursor-pointer border transition-all duration-150 ${
                              selected
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20 scale-105"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                            aria-label={`Skor ${s} untuk ${k.nama}`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Catatan & Foto */}
        <div className="space-y-4">
          <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-50 pb-2">
            Catatan & Lampiran Bukti
          </h3>

          <div className="space-y-1.5">
            <label htmlFor="catatan" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Catatan Evaluasi
            </label>
            <textarea
              id="catatan"
              rows={4}
              value={catatan}
              onChange={(e) => { setCatatan(e.target.value); setFeedback(null); }}
              placeholder="Ringkasan kualitatif keberhasilan / hambatan penting periode ini..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Foto = URL */}
          <div className="space-y-1.5">
            <label htmlFor="fotoUrl" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Foto Bukti Kegiatan (tautan)
            </label>
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                id="fotoUrl"
                type="url"
                value={fotoUrl}
                onChange={(e) => { setFotoUrl(e.target.value); setFeedback(null); }}
                placeholder="https://... (link foto bukti, opsional)"
                className={inputCls}
              />
            </div>
            {fotoUrl ? (
              <div className="relative mt-2 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoUrl}
                  alt="Pratinjau foto bukti"
                  className="h-40 w-full object-cover rounded-xl border border-slate-100"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setFotoUrl("")}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm text-slate-500 hover:text-red-600 transition-colors"
                  title="Hapus foto"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Camera className="h-3 w-3" />
                Tempel link foto (mis. dari Google Drive/Cloudinary) — foto tidak disimpan di server.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={sortedKriterias.length === 0}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Simpan Evaluasi
          </button>
          {renderFeedback()}
        </div>
      </form>

      {/* ===== Kelola Kriteria ===== */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 max-w-3xl">
        <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-emerald-600" />
          Kelola Kriteria Penilaian
        </h3>

        {/* Tambah kriteria */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={newKriteria}
            onChange={(e) => setNewKriteria(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddKriteria(); } }}
            placeholder="Nama kriteria baru (mis. Partisipasi Warga)"
            className={inputCls}
          />
          <div className="flex gap-2 shrink-0">
            <input
              type="number"
              value={newBobot}
              onChange={(e) => setNewBobot(e.target.value)}
              min="0.01"
              step="0.01"
              className={`${inputCls} w-24`}
              title="Bobot kriteria (default 1)"
            />
            <button
              type="button"
              onClick={handleAddKriteria}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          Bobot opsional — dipakai untuk ringkasan rata-rata berbobot di laporan. Kosongkan untuk bobot 1.
        </p>

        {/* Daftar kriteria */}
        {sortedKriterias.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada kriteria.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedKriterias.map((k, idx) => (
              <div key={k.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-slate-300 font-mono w-5">{idx + 1}.</span>
                  <span className="text-sm font-medium text-slate-700 truncate">{k.nama}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-50 rounded px-1.5 py-0.5">
                    bobot {formatAngka(k.bobot)}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveKriteria(k.id, "up")}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                    title="Naikkan urutan"
                    aria-label={`Naikkan urutan ${k.nama}`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveKriteria(k.id, "down")}
                    disabled={idx === sortedKriterias.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                    title="Turunkan urutan"
                    aria-label={`Turunkan urutan ${k.nama}`}
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteKriteria(k.id, k.nama)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus kriteria"
                    aria-label={`Hapus kriteria ${k.nama}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Riwayat Sesi Evaluasi ===== */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-slate-400" />
          Riwayat Evaluasi
        </h3>

        {riwayat.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
            Belum ada sesi evaluasi yang disimpan.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {riwayat.map((r) => (
                <div
                  key={r.periodeId}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="block text-sm font-semibold text-slate-800">
                      {r.periodeNama}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">
                      {formatTanggal(r.tanggalMulai)} – {formatTanggal(r.tanggalAkhir)}
                    </span>
                    {r.catatan && (
                      <span className="block text-xs text-slate-500 line-clamp-2">
                        {r.catatan}
                      </span>
                    )}
                    {r.fotoUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <ImageIcon className="h-3 w-3" />
                        Ada foto bukti
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/50 rounded-lg px-3 py-1.5 text-sm">
                      {formatAngka(r.rataRata)} / {SKOR_MAX}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSesi(r.periodeId, r.periodeNama)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus sesi evaluasi"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
