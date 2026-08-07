import { getProfilProgram } from "@/features/profil-program/actions";
import { ProfilAdminClient } from "@/features/profil-program/components/profil-admin-client";

/**
 * Edit Profil Program — server component. Membaca baris `profil_program`
 * (single-row) lalu meneruskan ke form client. Konten selalu segar karena
 * admin bisa mengubah kapan saja.
 */
export const dynamic = "force-dynamic";

export default async function EditProfilPage() {
  const profil = await getProfilProgram();
  return <ProfilAdminClient initial={profil} />;
}
