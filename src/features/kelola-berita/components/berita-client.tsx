"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  createBerita,
  updateBerita,
  setBeritaStatus,
  deleteBerita,
} from "../actions";
import { BeritaEditor } from "./berita-editor";

/**
 * Kelola Berita (/admin/berita).
 *
 * Pola: daftar artikel + editor inline (bukan halaman terpisah). Editor Tiptap
 * dipakai untuk konten; cover adalah input URL (konsisten dengan foto evaluasi
 * — upgrade ke upload Vercel Blob menyusul bila perlu).
 *
 * Server actions dipanggil langsung dari client; setelah sukses `router.refresh()`
 * supaya daftar (render server) ikut terbarui.
 */

export interface BeritaRow {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  coverUrl: string;
  status: "draft" | "published";
  tanggalPublish: Date | string | null;
  createdAt: Date | string;
}

interface BeritaClientProps {
  initialItems: BeritaRow[];
}

type Feedback =
  | { ok: true; message: string }
  | { ok: false; error: string }
  | null;

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

export function BeritaClient({ initialItems }: BeritaClientProps) {
  const router = useRouter();
  const [showEditor, setShowEditor] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);

  const isEditing = editId !== null;

  function openNew() {
    setEditId(null);
    setJudul("");
    setKonten("");
    setCoverUrl("");
    setStatus("draft");
    setFeedback(null);
    setShowEditor(true);
  }

  function openEdit(item: BeritaRow) {
    setEditId(item.id);
    setJudul(item.judul);
    setKonten(item.konten);
    setCoverUrl(item.coverUrl);
    setStatus(item.status);
    setFeedback(null);
    setShowEditor(true);
  }

  /** Form submit — create atau update tergantung editId. */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!judul.trim() || !konten.trim() || !coverUrl.trim()) {
      setFeedback({ ok: false, error: "Judul, isi artikel, dan link cover wajib diisi." });
      return;
    }
    setBusy(true);
    setFeedback(null);

    const fd = new FormData();
    fd.set("judul", judul);
    fd.set("konten", konten);
    fd.set("coverUrl", coverUrl);
    fd.set("status", status);

    const res = isEditing ? await updateBerita(null, fd) : await createBerita(null, fd);
    setBusy(false);
    setFeedback(res);

    if (res.ok) {
      router.refresh();
      setShowEditor(false);
      setEditId(null);
    }
  }

  /** Toggle draft ↔ published dari tombol di daftar. */
  async function handleToggleStatus(item: BeritaRow) {
    const next = item.status === "published" ? "draft" : "published";
    const res = await setBeritaStatus(item.id, next);
    if (res.ok) {
      setFeedback({ ok: true, message: next === "published" ? "Artikel diterbitkan." : "Artikel dikembalikan ke draft." });
      router.refresh();
    } else {
      setFeedback({ ok: false, error: res.error ?? "Gagal mengubah status." });
    }
  }

  async function handleDelete(item: BeritaRow) {
    if (!window.confirm(`Hapus artikel "${item.judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    const res = await deleteBerita(item.id);
    setFeedback(res.ok ? { ok: true, message: "Artikel berhasil dihapus." } : { ok: false, error: res.error ?? "Gagal menghapus artikel." });
    if (res.ok) router.refresh();
  }

  /** Ringkas tanggal publish ramah admin. */
  function formatTanggal(d: Date | string | null): string {
    if (!d) return "—";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
            Kelola Berita & Update
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Tulis, edit, dan publikasikan artikel edukasi serta kabar terbaru
            seputar Bank Sampah Desa Piji.
          </p>
        </div>
        {!showEditor && (
          <button
            onClick={openNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Tulis Artikel</span>
          </button>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 animate-in fade-in duration-300 ${
            feedback.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-semibold leading-relaxed">{feedback.ok ? feedback.message : feedback.error}</p>
          {!feedback.ok && (
            <button onClick={() => setFeedback(null)} className="ml-auto text-red-400 hover:text-red-600">
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Daftar Artikel */}
      <div className="space-y-4">
        <h3 className="font-heading text-base font-bold text-slate-900">
          Daftar Artikel {initialItems.length > 0 && `(${initialItems.length})`}
        </h3>

        {initialItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
            Belum ada artikel. Klik &quot;Tulis Artikel&quot; untuk membuat yang pertama.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {initialItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 md:p-6 flex items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Kiri: Thumbnail & info */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-16 h-12 md:w-20 md:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200/60 bg-slate-50">
                      {item.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-300 text-xs font-bold">
                          No Cover
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <span
                        className={`inline-flex text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                          item.status === "published"
                            ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                            : "text-slate-500 bg-slate-100 border-slate-200"
                        }`}
                      >
                        {item.status === "published" ? "Terbit" : "Draft"}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm md:text-base truncate">
                        {item.judul}
                      </h4>
                      <span className="block text-xs text-slate-400 font-medium">
                        {item.status === "published"
                          ? `Terbit: ${formatTanggal(item.tanggalPublish)}`
                          : "Belum diterbitkan"}
                      </span>
                    </div>
                  </div>

                  {/* Kanan: Aksi */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`/berita/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Lihat di situs publik"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </a>
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors"
                      title={item.status === "published" ? "Jadikan draft" : "Terbitkan"}
                    >
                      {item.status === "published" ? "→ Draft" : "Terbitkan →"}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Edit Artikel"
                    >
                      <Pencil className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus Artikel"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editor (collapsible) */}
      {showEditor && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6 max-w-4xl mx-auto animate-in slide-in-from-top-6 duration-300">
          <div className="border-b border-slate-50 pb-3 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-slate-900">
              {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h3>
            <button
              onClick={() => setShowEditor(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Tutup Editor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Judul */}
            <div className="space-y-1">
              <label htmlFor="berita-judul" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Judul Artikel
              </label>
              <input
                id="berita-judul"
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Tuliskan judul artikel yang menarik..."
                className={inputCls}
              />
            </div>

            {/* Cover URL */}
            <div className="space-y-1.5">
              <label htmlFor="berita-cover" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Link Gambar Sampul (Cover)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="berita-cover"
                  type="url"
                  required
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://…/foto-cover.jpg"
                  className={inputCls}
                />
                {coverUrl && (
                  <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverUrl} alt="Pratinjau cover" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Tempel link gambar (upload ke Vercel Blob menyusul). Bila kosong
                pratinjau tidak tampil.
              </p>
            </div>

            {/* Konten */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Isi Artikel
              </label>
              {/* key memastikan editor di-reset saat ganti artikel (remount). */}
              <BeritaEditor key={editId ?? "new"} initialHtml={konten} onChange={setKonten} />
              <p className="text-[11px] text-slate-400">
                Tulis isi artikel di sini. Gunakan tombol di atas untuk tebal,
                miring, daftar, dan sub-judul.
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between max-w-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="space-y-0.5">
                <span className="block text-sm font-bold text-slate-800">
                  Publikasikan Artikel
                </span>
                <span className="block text-[11px] text-slate-400 font-medium leading-relaxed">
                  Langsung tampil di halaman Berita publik.
                </span>
              </div>
              <select
                aria-label="Status publikasi"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="published">Terbit</option>
              </select>
            </div>

            {/* Aksi */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 px-5 py-2.5 text-sm font-bold text-white transition-colors"
              >
                {busy ? "Menyimpan..." : "Simpan Artikel"}
              </button>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
