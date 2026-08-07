import { LaporanClient } from "@/features/laporan-export/components/laporan-client";

/**
 * Generate Laporan (/admin/laporan).
 *
 * Halaman tipis — UI & logika unduhan ada di LaporanClient. Tidak membaca DB
 * langsung (export terjadi di route /export-pdf & /export-excel), jadi tidak
 * butuh force-dynamic.
 */
export default function AdminLaporanPage() {
  return <LaporanClient />;
}
