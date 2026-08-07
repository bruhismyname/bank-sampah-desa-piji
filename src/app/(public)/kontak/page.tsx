import { Metadata } from "next";
import { KontakPage } from "@/features/kontak/components/kontak-page";

export const metadata: Metadata = {
  title: "Hubungi Kami - Bank Sampah Desa Piji",
  description: "Hubungi tim pelayanan Bank Sampah Desa Piji melalui alamat kantor, WhatsApp resmi, email, atau sosial media.",
};

// Konten kontak bisa diubah admin kapan saja — render selalu segar.
export const dynamic = "force-dynamic";

export default function KontakRoutePage() {
  return <KontakPage />;
}
