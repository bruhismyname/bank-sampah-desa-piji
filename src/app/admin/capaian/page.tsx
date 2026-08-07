import { db } from "@/db";
import { capaian, indikator, periode } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { CapaianClient } from "@/features/input-capaian/components/capaian-client";

/**
 * Input Capaian — server component yang mengambil data indikator, periode,
 * dan riwayat capaian (join) dari database, lalu meneruskan ke komponen
 * client `CapaianClient`.
 */
export default async function InputCapaianPage() {
  const indikatorList = await db
    .select({
      id: indikator.id,
      nama: indikator.nama,
      target: indikator.target,
    })
    .from(indikator)
    .orderBy(asc(indikator.nama));

  const periodeList = await db
    .select({
      id: periode.id,
      nama: periode.nama,
      tanggalMulai: periode.tanggalMulai,
      tanggalAkhir: periode.tanggalAkhir,
    })
    .from(periode)
    .orderBy(desc(periode.tanggalMulai));

  const riwayat = await db
    .select({
      id: capaian.id,
      indikatorNama: indikator.nama,
      periodeNama: periode.nama,
      nilai: capaian.nilai,
      createdAt: capaian.createdAt,
    })
    .from(capaian)
    .innerJoin(indikator, eq(capaian.indikatorId, indikator.id))
    .innerJoin(periode, eq(capaian.periodeId, periode.id))
    .orderBy(desc(capaian.createdAt))
    .limit(50);

  return (
    <div className="p-6 md:p-8">
      <CapaianClient
        indikatorList={indikatorList}
        periodeList={periodeList.map((p) => ({
          ...p,
          tanggalMulai: p.tanggalMulai.toISOString().slice(0, 10),
          tanggalAkhir: p.tanggalAkhir.toISOString().slice(0, 10),
        }))}
        riwayat={riwayat.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
