import { Download, FileText } from "lucide-react";
import { getSiteContent } from "@/lib/site-content";

// ============================================================
// GuideSopSection — server component. Membaca URL dokumen SOP dari
// tabel `site_content` key `guide_sop_url` (diisi admin via Kelola
// Konten). Bila kosong, tampilkan pesan "Dokumen SOP belum tersedia"
// (sesuai PRD).
// ============================================================

export async function GuideSopSection() {
  const sopUrl = await getSiteContent("guide_sop_url");

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
        {sopUrl ? (
          <>
            {/* Area viewer PDF */}
            <div className="flex h-[600px] w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100">
              <iframe
                src={sopUrl}
                title="Dokumen SOP Bank Sampah"
                className="h-full w-full border-0"
              />
            </div>

            {/* Tombol unduh */}
            <div className="mt-4 flex justify-end">
              <a
                href={sopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                <Download className="h-4 w-4" />
                Buka &amp; Unduh PDF
              </a>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-slate-50 px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <p className="font-heading text-base font-bold text-slate-700">
                Dokumen SOP belum tersedia
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Pengurus dapat mengunggah dokumen SOP melalui menu Kelola
                Konten di halaman admin.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
