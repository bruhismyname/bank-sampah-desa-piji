import { Download } from "lucide-react";

// ============================================================
// ponytail: viewer masih placeholder. Nanti di-wire ke tabel
// `site_content` key `guide_sop_url` (upload PDF ke Vercel Blob
// via Kelola Konten); jika kosong tampilkan "Dokumen SOP belum
// tersedia" (PRD).
// ============================================================

export function GuideSopSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-10">
      {/* Judul */}
      <h1 className="font-heading text-3xl font-extrabold text-foreground md:text-4xl">
        Panduan SOP Bank Sampah
      </h1>
      <p className="mt-2 text-muted-foreground">
        Standar operasional prosedur pengelolaan Bank Sampah Desa Piji.
        Dokumen dapat dibaca langsung atau diunduh.
      </p>

      {/* Card utama viewer */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        {/* Area viewer PDF */}
        <div className="flex h-[600px] w-full items-center justify-center rounded-lg bg-slate-200">
          <p className="text-slate-500">PDF Viewer Placeholder</p>
        </div>

        {/* Tombol unduh */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
          >
            <Download className="h-4 w-4" />
            Unduh PDF
          </button>
        </div>
      </div>
    </section>
  );
}
