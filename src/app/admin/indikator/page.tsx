import { db } from "@/db";
import { indikator } from "@/db/schema";
import { asc } from "drizzle-orm";
import { IndikatorClient } from "@/features/master-indikator/components/indikator-client";

/**
 * Master Indikator — server component yang mengambil data indikator dari
 * database (Neon via Drizzle) lalu meneruskan ke komponen client
 * `IndikatorClient` untuk form tambah/edit/hapus.
 */
export default async function MasterIndikatorPage() {
  const rows = await db
    .select({
      id: indikator.id,
      nama: indikator.nama,
      kategori: indikator.kategori,
      target: indikator.target,
      tampilkanDiBeranda: indikator.tampilkanDiBeranda,
    })
    .from(indikator)
    .orderBy(asc(indikator.createdAt));

  return (
    <div className="p-6 md:p-8">
      <IndikatorClient initialItems={rows} />
    </div>
  );
}
