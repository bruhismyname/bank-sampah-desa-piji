import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { berita } from "@/db/schema";
import type { Berita } from "./berita-list-section";

/** Ambil satu artikel terbit berdasarkan slug (untuk halaman detail). */
export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  const row = await db
    .select({
      judul: berita.judul,
      slug: berita.slug,
      konten: berita.konten,
      coverUrl: berita.coverUrl,
      status: berita.status,
      tanggalPublish: berita.tanggalPublish,
    })
    .from(berita)
    .where(eq(berita.slug, slug))
    .limit(1);

  if (!row[0] || row[0].status !== "published") return null;
  const r = row[0];

  return {
    slug: r.slug,
    title: r.judul,
    excerpt: "",
    date: r.tanggalPublish
      ? new Date(r.tanggalPublish).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "",
    imageUrl: r.coverUrl,
    content: r.konten,
  };
}

export async function DetailBerita({ slug }: { slug: string }) {
  const article = await getBeritaBySlug(slug);

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

        {/* Body Content — HTML dari WYSIWYG, sudah di-sanitize DOMPurify
            saat disimpan. `prose` memberi gaya tipografi rapi. */}
        <div
          className="prose prose-slate prose-lg max-w-none mt-10 leading-loose text-slate-700"
          dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
        />
      </div>
    </main>
  );
}
