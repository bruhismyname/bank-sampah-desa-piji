import { BeritaListSection } from "./berita-list-section";

export function DaftarBerita() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page Header (Eco-Corporate Synthesis style) */}
      <section className="bg-gradient-to-b from-accent to-transparent px-4 pb-12 pt-14 text-center md:px-10 md:pt-20">
        <h1 className="font-heading text-4xl font-extrabold text-slate-900 md:text-5xl">
          Berita & Update Terbaru
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-500">
          Ikuti perkembangan terbaru, kegiatan edukasi, dan pencapaian dampak nyata 
          dari Bank Sampah Desa Piji bersama masyarakat.
        </p>
      </section>

      {/* News Grid Area */}
      <div className="mx-auto max-w-[1280px] px-4 pb-24 md:px-10">
        <section className="py-8">
          <BeritaListSection />
        </section>
      </div>
    </main>
  );
}
