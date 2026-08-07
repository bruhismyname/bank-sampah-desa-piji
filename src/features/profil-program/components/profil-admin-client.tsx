"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Save,
  Users,
  XCircle,
} from "lucide-react";
import { saveProfilProgram, type ProfilProgramRecord } from "../actions";

/**
 * Edit Profil Program (/admin/profil).
 *
 * Form single-row untuk tabel `profil_program` — info organisasi, struktur
 * pengurus, dan kontak. Semua field diedit langsung; `struktur` berupa teks
 * "Nama - Jabatan" (satu per baris) supaya admin awam mudah mengisi.
 *
 * Dipanggil server action `saveProfilProgram`; setelah sukses `router.refresh()`.
 */

interface ProfilAdminClientProps {
  initial: ProfilProgramRecord | null;
}

type Feedback =
  | { ok: true; message: string }
  | { ok: false; error: string }
  | null;

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
const labelCls =
  "block text-xs font-bold text-slate-400 uppercase tracking-wide";

export function ProfilAdminClient({ initial }: ProfilAdminClientProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    nama: initial?.nama ?? "",
    deskripsi: initial?.deskripsi ?? "",
    struktur: initial?.struktur ?? "",
    alamat: initial?.alamat ?? "",
    telepon: initial?.telepon ?? "",
    email: initial?.email ?? "",
    instagram: initial?.instagram ?? "",
    facebook: initial?.facebook ?? "",
    youtube: initial?.youtube ?? "",
  });
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (feedback) setFeedback(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim()) {
      setFeedback({ ok: false, error: "Nama organisasi wajib diisi." });
      return;
    }
    setBusy(true);
    setFeedback(null);

    const fd = new FormData();
    for (const [k, v] of Object.entries(form)) fd.set(k, v);

    const res = await saveProfilProgram(null, fd);
    setBusy(false);
    setFeedback(res);
    if (res.ok) router.refresh();
  }

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen pb-28 relative">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Pengaturan Profil Publik
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Kelola informasi organisasi, susunan pengurus, dan kontak yang tampil
          di halaman Profil dan Beranda.
        </p>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`max-w-4xl mx-auto flex items-start gap-3 rounded-xl border p-4 animate-in fade-in duration-300 ${
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
          <p className="text-sm font-semibold leading-relaxed">
            {feedback.ok ? feedback.message : feedback.error}
          </p>
          {!feedback.ok && (
            <button
              onClick={() => setFeedback(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        {/* Seksi 1: Informasi Umum */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-50 pb-3">
            Informasi Umum
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="profil-nama" className={labelCls}>
                Nama Organisasi
              </label>
              <input
                id="profil-nama"
                type="text"
                required
                value={form.nama}
                onChange={(e) => set("nama", e.target.value)}
                placeholder="Misal: Bank Sampah Desa Piji"
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="profil-deskripsi" className={labelCls}>
                Deskripsi Singkat
              </label>
              <textarea
                id="profil-deskripsi"
                rows={4}
                value={form.deskripsi}
                onChange={(e) => set("deskripsi", e.target.value)}
                placeholder="Ceritakan singkat tentang organisasi…"
                className={`${inputCls} resize-none`}
              />
              <p className="text-[11px] text-slate-400">
                Tampil di bagian atas halaman Profil.
              </p>
            </div>
          </div>
        </section>

        {/* Seksi 2: Susunan Pengurus */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
            <Users className="h-5 w-5 text-emerald-600" />
            Susunan Pengurus
          </h3>
          <div className="space-y-1">
            <label htmlFor="profil-struktur" className={labelCls}>
              Daftar Pengurus
            </label>
            <textarea
              id="profil-struktur"
              rows={6}
              value={form.struktur}
              onChange={(e) => set("struktur", e.target.value)}
              placeholder={"Contoh:\nBudi Santoso - Ketua Pengurus\nSiti Rahayu - Sekretaris"}
              className={`${inputCls} resize-none font-mono text-xs leading-relaxed`}
            />
            <p className="text-[11px] text-slate-400">
              Satu pengurus per baris, format: <b>Nama - Jabatan</b>.
            </p>
          </div>
        </section>

        {/* Seksi 3: Kontak */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
            <Globe className="h-5 w-5 text-emerald-600" />
            Kontak
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="profil-alamat" className={labelCls}>
                Alamat Kantor
              </label>
              <textarea
                id="profil-alamat"
                rows={2}
                value={form.alamat}
                onChange={(e) => set("alamat", e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="profil-telepon" className={labelCls}>
                Nomor WhatsApp
              </label>
              <input
                id="profil-telepon"
                type="text"
                value={form.telepon}
                onChange={(e) => set("telepon", e.target.value)}
                placeholder="6281234567890 (pakai 62, tanpa +)"
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="profil-email" className={labelCls}>
                Email
              </label>
              <input
                id="profil-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="banksampah@desapiji.id"
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="profil-instagram" className={labelCls}>
                Instagram
              </label>
              <input
                id="profil-instagram"
                type="text"
                value={form.instagram}
                onChange={(e) => set("instagram", e.target.value)}
                placeholder="https://instagram.com/…"
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="profil-facebook" className={labelCls}>
                Facebook
              </label>
              <input
                id="profil-facebook"
                type="text"
                value={form.facebook}
                onChange={(e) => set("facebook", e.target.value)}
                placeholder="https://facebook.com/…"
                className={inputCls}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="profil-youtube" className={labelCls}>
                YouTube
              </label>
              <input
                id="profil-youtube"
                type="text"
                value={form.youtube}
                onChange={(e) => set("youtube", e.target.value)}
                placeholder="https://youtube.com/@…"
                className={inputCls}
              />
            </div>
          </div>
        </section>

        {/* Tombol simpan — sticky di bawah kanan (mobile-first) */}
        <div className="flex items-center gap-3 pt-2 sticky bottom-6 justify-end">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>{busy ? "Menyimpan…" : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
