import { Metadata } from "next";
import { DaftarBerita } from "@/features/berita/components/daftar-berita";

export const metadata: Metadata = {
  title: "Berita & Update Terbaru - Bank Sampah Desa Piji",
  description: "Ikuti kabar terbaru, aktivitas sosialisasi, dan dampak positif pengelolaan bank sampah di Desa Piji.",
};

// Daftar berita selalu segar — artikel baru terbit admin langsung tampil.
export const dynamic = "force-dynamic";

export default function BeritaPage() {
  return <DaftarBerita />;
}
