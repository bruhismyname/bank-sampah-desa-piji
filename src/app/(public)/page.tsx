import { HomePage } from "@/features/beranda/components/home-page";

// Konten beranda bisa diubah admin kapan saja via Kelola Konten — render
// selalu segar dari DB (bukan bake statis saat build).
export const dynamic = "force-dynamic";

export default async function Home() {
  return <HomePage />;
}
