import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { rekomendasi } from "@/db/schema";
import { RekomendasiClient } from "@/features/rekomendasi/components/rekomendasi-client";

// Status kanban bisa diubah admin kapan saja — render selalu segar.
export const dynamic = "force-dynamic";

/** Data kanban: semua kartu rekomendasi, terbaru di atas. */
export default async function AdminRekomendasiPage() {
  const rows = await db
    .select({
      id: rekomendasi.id,
      judul: rekomendasi.judul,
      deskripsi: rekomendasi.deskripsi,
      prioritas: rekomendasi.prioritas,
      status: rekomendasi.status,
    })
    .from(rekomendasi)
    .orderBy(asc(rekomendasi.status), desc(rekomendasi.createdAt));

  const initialItems = rows.map((r) => ({
    id: r.id,
    judul: r.judul,
    deskripsi: r.deskripsi,
    prioritas: r.prioritas as "Tinggi" | "Sedang" | "Rendah",
    status: r.status as "Baru" | "Proses" | "Selesai",
  }));

  return (
    <div className="p-6 md:p-8">
      <RekomendasiClient initialItems={initialItems} />
    </div>
  );
}
