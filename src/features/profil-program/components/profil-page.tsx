import { ProfilOrganisasiSection } from "@/features/profil-program/components/profil-organisasi-section";
import { getProfilProgram } from "../actions";

function Avatar({ nama }: { nama: string }) {
  const inisial = nama
    .split(" ")
    .map((kata) => kata[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-700 font-heading text-xl font-extrabold text-primary-foreground">
      {inisial}
    </div>
  );
}

/**
 * Halaman Profil Publik.
 *
 * Bagian "Tentang" diambil dari `site_content` (diedit admin via Kelola
 * Konten). Susunan pengurus diambil dari `profil_program.struktur` — teks
 * "Nama - Jabatan" per baris, diedit admin via Edit Profil.
 */
export async function ProfilPage() {
  const profil = await getProfilProgram();

  // Parse "Nama - Jabatan" per baris. Baris tanpa pemisah dianggap hanya nama.
  const pengurus = (profil?.struktur ?? "")
    .split("\n")
    .map((baris) => baris.trim())
    .filter(Boolean)
    .map((baris) => {
      const idx = baris.indexOf("-");
      if (idx === -1) return { nama: baris, jabatan: "Pengurus" };
      return {
        nama: baris.slice(0, idx).trim(),
        jabatan: baris.slice(idx + 1).trim(),
      };
    });

  return (
    <main className="bg-background">
      <ProfilOrganisasiSection />

      {/* ===== Struktur Pengurus (grid lengkap) ===== */}
      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        <section className="py-8">
          <h2 className="mb-10 text-center font-heading text-2xl font-bold text-foreground md:text-3xl">
            Susunan Pengurus Utama
          </h2>

          {pengurus.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Susunan pengurus akan ditampilkan setelah diisi melalui menu Edit
              Profil di halaman admin.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pengurus.map((p) => (
                <div
                  key={p.nama}
                  className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1"
                >
                  <Avatar nama={p.nama} />
                  <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                    {p.nama}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.jabatan}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
