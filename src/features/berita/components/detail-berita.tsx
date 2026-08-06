import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { dummyBerita } from "./berita-list-section";

export function DetailBerita({ slug }: { slug: string }) {
  const article = dummyBerita.find((b) => b.slug === slug);

  // Artikel tidak ditemukan — tampilkan pesan ramah alih-alih halaman kosong.
  if (!article) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
          <Link
            href="/berita"
            className="group inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Berita
          </Link>
          <div className="mt-16 text-center">
            <h1 className="font-heading text-2xl font-bold text-slate-900">
              Artikel tidak ditemukan
            </h1>
            <p className="mt-2 text-slate-500">
              Berita yang Anda cari mungkin sudah dihapus atau belum tersedia.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const paragraphs = (article.content ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        {/* Tombol kembali ke berita */}
        <Link
          href="/berita"
          className="group inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Berita
        </Link>

        {/* Metadata */}
        <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
          <span>{article.date}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>Oleh: Tim KKN-T IDBU 47 UNDIP</span>
        </div>

        {/* Judul H1 Besar */}
        <h1 className="mt-4 font-heading text-3xl font-extrabold text-slate-900 md:text-4xl leading-tight tracking-tight">
          {article.title}
        </h1>

        {/* Hero Image Landscape */}
        <div className="relative mt-6 aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-md border border-slate-100">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Body Content */}
        <div className="mt-10 max-w-none text-lg leading-loose text-slate-700 space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Tombol sumber asli (jika ada) */}
        {article.externalUrl && (
          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <a
              href={article.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Baca selengkapnya di sumber asli
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
