import { desc } from "drizzle-orm";
import { db } from "@/db";
import { kendala } from "@/db/schema";
import { KendalaClient } from "@/features/logbook-kendala/components/kendala-client";

// Status logbook bisa diubah admin kapan saja — render selalu segar.
export const dynamic = "force-dynamic";

/** Data logbook: daftar kendala terbaru di atas, tanggal disimpan lokal. */
export default async function AdminKendalaPage() {
  const rows = await db
    .select({
      id: kendala.id,
      deskripsi: kendala.deskripsi,
      tanggal: kendala.tanggal,
      status: kendala.status,
    })
    .from(kendala)
    .orderBy(desc(kendala.tanggal));

  const initialItems = rows.map((r) => ({
    id: r.id,
    deskripsi: r.deskripsi,
    tanggal: r.tanggal.toISOString(),
    status: r.status,
  }));

  return (
    <div className="p-6 md:p-8">
      <KendalaClient initialItems={initialItems} />
    </div>
  );
}
