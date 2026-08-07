import { asc } from "drizzle-orm";
import { db } from "@/db";
import { tahapanKkn } from "@/db/schema";
import { TahapanClient } from "@/features/kelola-tahapan/components/tahapan-client";

// Tahapan bisa diubah admin kapan saja — render selalu segar.
export const dynamic = "force-dynamic";

/** Data tahapan: urutan naik; visibilitas global dibaca dari baris pertama. */
export default async function AdminTahapanPage() {
  const rows = await db
    .select({
      id: tahapanKkn.id,
      nama: tahapanKkn.nama,
      urutan: tahapanKkn.urutan,
      selesai: tahapanKkn.selesai,
      tampilkanTahapanKKN: tahapanKkn.tampilkanTahapanKKN,
    })
    .from(tahapanKkn)
    .orderBy(asc(tahapanKkn.urutan));

  const initialItems = rows.map((r) => ({
    id: r.id,
    nama: r.nama,
    urutan: r.urutan,
    selesai: r.selesai,
  }));

  return (
    <div className="p-6 md:p-8">
      <TahapanClient
        initialItems={initialItems}
        tampilkanTahapanKKN={rows[0]?.tampilkanTahapanKKN ?? true}
      />
    </div>
  );
}
