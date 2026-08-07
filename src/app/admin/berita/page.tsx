import { desc } from "drizzle-orm";
import { db } from "@/db";
import { berita } from "@/db/schema";
import { BeritaClient } from "@/features/kelola-berita/components/berita-client";

// Artikel bisa berubah kapan saja (draft ↔ published) — render selalu segar.
export const dynamic = "force-dynamic";

/** Kelola Berita: daftar semua artikel (draft + terbit), terbaru dulu. */
export default async function AdminBeritaPage() {
  const rows = await db
    .select({
      id: berita.id,
      judul: berita.judul,
      slug: berita.slug,
      konten: berita.konten,
      coverUrl: berita.coverUrl,
      status: berita.status,
      tanggalPublish: berita.tanggalPublish,
      createdAt: berita.createdAt,
    })
    .from(berita)
    .orderBy(desc(berita.createdAt));

  const initialItems = rows.map((r) => ({
    id: r.id,
    judul: r.judul,
    slug: r.slug,
    konten: r.konten,
    coverUrl: r.coverUrl,
    status: r.status,
    tanggalPublish: r.tanggalPublish,
    createdAt: r.createdAt,
  }));

  return <BeritaClient initialItems={initialItems} />;
}
