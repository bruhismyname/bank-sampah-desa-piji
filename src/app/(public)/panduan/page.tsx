import { Metadata } from "next";
import { PanduanPage } from "@/features/panduan-pemakaian/components/panduan-page";

export const metadata: Metadata = {
  title: "Panduan Pemakaian - Bank Sampah Desa Piji",
  description: "Tutorial langkah demi langkah tata cara penggunaan panel admin, penginputan capaian mingguan, dan pencetakan laporan untuk pengurus Bank Sampah.",
};

export default function PanduanRoutePage() {
  return <PanduanPage />;
}
