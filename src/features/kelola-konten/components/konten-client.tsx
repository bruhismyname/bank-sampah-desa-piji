"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  CheckCircle,
  AlertCircle,
  Save,
  Eye,
} from "lucide-react";
import type { SiteContentDef } from "@/lib/site-content";
import { saveSiteContent } from "../actions";

/** Satu group konten berisi beberapa key. */
export interface KontenGroup {
  group: string;
  items: SiteContentDef[];
}

interface KontenClientProps {
  groups: KontenGroup[];
  /** Nilai saat ini dari DB, keyed by site_content key. */
  initialValues: Record<string, string>;
}

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

const textareaCls = `${inputCls} resize-none min-h-[96px] leading-relaxed`;

/** Bagian hero beranda yang ingin ditampilkan langsung (pratinjau). */
const PREVIEW_KEYS = ["hero_headline", "hero_subheadline"];

export function KontenClient({ groups, initialValues }: KontenClientProps) {
  const router = useRouter();
  // Form state per key, inisialisasi dari DB.
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [feedback, setFeedback] = useState<
    { ok: true; message: string } | { ok: false; error: string } | null
  >(null);

  function setValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await saveSiteContent(values);
    setFeedback(res);
    if (res.ok) {
      router.refresh();
    }
  }

  function renderField(item: SiteContentDef) {
    const value = values[item.key] ?? item.defaultValue ?? "";

    // Tipe file: input URL (SOP PDF). Admin menempel link PDF; publik
    // menampilkannya. Upgrade ke upload Vercel Blob menyusul bila diperlukan.
    if (item.type === "file") {
      return (
        <div className="space-y-1.5">
          <label
            htmlFor={`field-${item.key}`}
            className="block text-xs font-bold text-slate-400 uppercase tracking-wide"
          >
            {item.label}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id={`field-${item.key}`}
              type="url"
              value={value}
              onChange={(e) => setValue(item.key, e.target.value)}
              placeholder="https://…/dokumen-sop.pdf"
              className={inputCls}
            />
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                <Eye className="h-4 w-4" />
                Lihat
              </a>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Tempel link file PDF. Bila kosong, halaman SOP menampilkan
            &quot;Dokumen SOP belum tersedia&quot;.
          </p>
        </div>
      );
    }

    if (item.type === "textarea" || item.type === "list") {
      return (
        <div className="space-y-1.5">
          <label
            htmlFor={`field-${item.key}`}
            className="block text-xs font-bold text-slate-400 uppercase tracking-wide"
          >
            {item.label}
          </label>
          <textarea
            id={`field-${item.key}`}
            value={value}
            onChange={(e) => setValue(item.key, e.target.value)}
            className={textareaCls}
            rows={item.type === "list" ? 6 : 4}
          />
          {item.type === "list" && (
            <p className="text-[11px] text-slate-400">
              Tulis satu item per baris.
            </p>
          )}
        </div>
      );
    }

    // text / image → input satu baris
    return (
      <div className="space-y-1.5">
        <label
          htmlFor={`field-${item.key}`}
          className="block text-xs font-bold text-slate-400 uppercase tracking-wide"
        >
          {item.label}
        </label>
        <input
          id={`field-${item.key}`}
          type={item.type === "image" ? "url" : "text"}
          value={value}
          onChange={(e) => setValue(item.key, e.target.value)}
          placeholder=""
          className={inputCls}
        />
      </div>
    );
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header + tombol simpan global */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
            Kelola Konten Halaman Publik
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Ubah teks yang tampil di halaman depan, profil, kontak, dan SOP.
            Perubahan langsung terlihat di website.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
        >
          <Save className="h-4 w-4" />
          Simpan Semua Perubahan
        </button>
      </div>

      {renderFeedback()}

      {/* Pratinjau hero beranda */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 border-b border-slate-50 pb-3 font-heading text-base font-bold text-slate-900">
          <Eye className="h-5 w-5 text-emerald-600" />
          Pratinjau Beranda (Hero)
        </h3>
        <div className="rounded-xl bg-slate-50 p-6">
          <p className="font-heading text-2xl font-extrabold text-slate-900">
            {values["hero_headline"] || "…"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {values["hero_subheadline"] || "…"}
          </p>
        </div>
        {PREVIEW_KEYS.every((k) => !values[k]) && (
          <p className="mt-2 text-xs text-slate-400">
            Isi headline/subheadline untuk melihat pratinjau.
          </p>
        )}
      </div>

      {/* Form per group */}
      {groups.map((g) => (
        <div
          key={g.group}
          className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm space-y-5"
        >
          <h3 className="flex items-center gap-2 border-b border-slate-50 pb-3 font-heading text-base font-bold text-slate-900">
            <Settings className="h-5 w-5 text-emerald-600" />
            {g.group}
          </h3>
          {g.items.map((item) => (
            <div key={item.key}>{renderField(item)}</div>
          ))}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
        >
          <Save className="h-4 w-4" />
          Simpan Semua Perubahan
        </button>
      </div>
    </form>
  );
}
