import { ProfilPage } from "@/features/profil-program/components/profil-page";

// Konten profil bisa diubah admin kapan saja — render selalu segar.
export const dynamic = "force-dynamic";

export default async function Profile() {
  return <ProfilPage />;
}
