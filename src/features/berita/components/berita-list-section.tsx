import Image from "next/image";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { berita } from "@/db/schema";

export interface Berita {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  /** Jika ada, tombol "Baca selengkapnya" mengarah ke URL eksternal. */
  externalUrl?: string;
  /** Konten penuh artikel (HTML hasil WYSIWYG, sudah di-sanitize). */
  content?: string;
}

/**
 * Query artikel terbit dari DB. Hanya status `published` yang tampil publik.
 * Urut: tanggal terbit terbaru dulu.
 */
export async function getBeritaPublished(): Promise<Berita[]> {
  const rows = await db
    .select({
      judul: berita.judul,
      slug: berita.slug,
      konten: berita.konten,
      coverUrl: berita.coverUrl,
      tanggalPublish: berita.tanggalPublish,
    })
    .from(berita)
    .where(eq(berita.status, "published"))
    .orderBy(desc(berita.tanggalPublish), desc(berita.createdAt));

  return rows.map((row) => {
    // Ringkasan: potong paragraf pertama HTML → teks polos.
    const teks = row.konten
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      slug: row.slug,
      title: row.judul,
      excerpt: teks.slice(0, 160) + (teks.length > 160 ? "…" : ""),
      date: formatTanggal(row.tanggalPublish),
      imageUrl: row.coverUrl,
      content: row.konten,
    };
  });
}

/** Format tanggal ISO → "6 Agustus 2026" (id-ID). */
function formatTanggal(d: Date | string | null): string {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Kartu berita SELALU menuju halaman detail internal `/berita/[slug]`. */
function readUrl(item: Berita) {
  return `/berita/${item.slug}`;
}

interface BeritaListSectionProps {
  limit?: number;
}

export async function BeritaListSection({ limit }: BeritaListSectionProps) {
  const all = await getBeritaPublished();
  const displayed = limit ? all.slice(0, limit) : all;

  if (displayed.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
        Belum ada berita. Admin akan segera menambahkan kabar terbaru.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {displayed.map((item) => {
        const url = readUrl(item);
        return (
          <article
            key={item.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Bagian Atas: Gambar cover aspect ratio 16:9 */}
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
              />
            </div>

            {/* Bagian Bawah: p-6 */}
            <div className="flex flex-1 flex-col p-6">
              <span className="text-xs font-medium text-slate-400">
                {item.date}
              </span>
              <h3 className="mt-2 font-heading text-lg font-bold text-slate-900 line-clamp-2 hover:text-emerald-600 transition-colors">
                <Link href={url}>{item.title}</Link>
              </h3>
              <p className="mt-2 flex-1 text-sm text-slate-500 line-clamp-2">
                {item.excerpt}
              </p>
              <div className="mt-4 pt-2">
                <Link
                  href={url}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Baca selengkapnya{" "}
                  <span className="transition-transform group-hover:translate-x-1">
                    -&gt;
                  </span>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
