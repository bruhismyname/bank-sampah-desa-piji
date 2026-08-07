import Link from "next/link";
import { ArrowUpRight, Check, Recycle } from "lucide-react";
import { getSiteContent } from "@/lib/site-content";

// ============================================================
// ProfilOrganisasiSection — server component. Teks tentang, visi, dan
// keunggulan diambil dari tabel `site_content` (diedit admin via
// Kelola Konten), bukan hardcode.
// ============================================================

export async function ProfilOrganisasiSection({
  showPengurusButton = false,
}: {
  showPengurusButton?: boolean;
}) {
  const [tentang, visi, strengthsRaw] = await Promise.all([
    getSiteContent("profil_about"),
    getSiteContent("profil_vision"),
    getSiteContent("profil_strengths"),
  ]);

  const keunggulan = strengthsRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      {/* Page header (gradient tipis) */}
      <section className="bg-gradient-to-b from-accent to-transparent px-4 pb-10 pt-14 text-center md:px-10 md:pt-20">
        <h1 className="font-heading text-4xl font-extrabold text-foreground md:text-5xl">
          Profil Organisasi
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Mengenal lebih dekat Bank Sampah Desa Piji — visi, perjalanan, dan
          orang-orang di balik pengelolaan sampah desa yang lestari.
        </p>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        {/* About */}
        <section className="grid items-center gap-10 py-14 md:grid-cols-2 md:gap-12">
          <div className="space-y-5">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Tentang Bank Sampah Desa Piji
            </h2>
            {tentang && (
              <p className="text-base leading-relaxed text-muted-foreground">{tentang}</p>
            )}
            {visi && (
              <p className="text-base leading-relaxed text-muted-foreground">{visi}</p>
            )}
            {!tentang && !visi && (
              <p className="text-base leading-relaxed text-muted-foreground">
                Profil Bank Sampah Desa Piji dapat diisi pengurus melalui menu
                Kelola Konten di halaman admin.
              </p>
            )}
            <ul className="space-y-3 pt-2">
              {keunggulan.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-bg">
                    <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent to-surface-container-low shadow-sm">
            <Recycle className="h-16 w-16 text-primary/40" strokeWidth={1.25} />
            <p className="px-6 text-center text-sm text-muted-foreground">
              Foto kegiatan Bank Sampah Desa Piji
              <br />
              (menyusul — di-upload admin via Kelola Konten)
            </p>
          </div>
        </section>

        {/* Tombol Susunan Pengurus -> /profil (opsional, untuk homepage) */}
        {showPengurusButton && (
          <section className="py-8 text-center">
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Susunan Pengurus Utama
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </section>
        )}
      </div>
    </>
  );
}
