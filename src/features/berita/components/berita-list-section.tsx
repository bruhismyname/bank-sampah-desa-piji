import Image from "next/image";
import Link from "next/link";

export interface Berita {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  /** Jika ada, tombol "Baca selengkapnya" mengarah ke URL eksternal (mis. sumber berita asli). */
  externalUrl?: string;
  /** Konten penuh artikel, dipisah tiap paragraf dengan baris kosong. */
  content?: string;
}

// ponytail: sementara masih hardcoded (belum terhubung DB). Saat fitur Kelola
// Berita di-wire ke tabel `berita`, data di bawah diganti query DB.
export const dummyBerita: Berita[] = [
  {
    slug: "kkn-t-idbu-47-undip-perkuat-pengelolaan-sampah-desa-piji",
    title:
      "KKN-T IDBU 47 UNDIP Perkuat Pengelolaan Sampah Desa Piji melalui Edukasi dan Pembentukan Bank Sampah",
    excerpt:
      "Tim KKN Tematik IDBU 47 Universitas Diponegoro menggelar edukasi dan pembentukan Bank Sampah di Desa Piji pada 25 Juli 2026, diikuti 29 warga, sebagai langkah awal membangun budaya pemilahan sampah yang berkelanjutan.",
    date: "25 Juli 2026",
    imageUrl: "/berita/foto.jpeg",
    externalUrl:
      "https://jatengku.com/kkn-t-idbu-47-undip-perkuat-pengelolaan-sampah-desa-piji-melalui-edukasi-dan-pembentukan-bank-sampah/",
    content: `Sebagai upaya meningkatkan kesadaran masyarakat terhadap pentingnya pengelolaan sampah yang berkelanjutan, Tim Kuliah Kerja Nyata Tematik (KKNT) IDBU 47 Universitas Diponegoro menyelenggarakan kegiatan bertajuk "Optimalisasi Bank Sampah melalui Edukasi Pemilahan Sampah dalam Mendukung SDGs Desa Piji" pada Sabtu, 25 Juli 2026, bertempat di Aula Balai Desa Piji, Kecamatan Dawe, Kabupaten Kudus. Kegiatan yang diikuti oleh 29 masyarakat Desa Piji ini menjadi langkah awal dalam memperkuat kelembagaan Bank Sampah sekaligus membangun budaya pemilahan sampah di tingkat masyarakat.

Berangkat dari permasalahan pengelolaan sampah yang belum optimal di Desa Piji, Tim KKN-T IDBU 47 Universitas Diponegoro menginisiasi kegiatan edukasi dan pembentukan Bank Sampah sebagai langkah pemberdayaan masyarakat. Meskipun desa memiliki potensi sumber daya alam dan kelompok masyarakat yang aktif, pengelolaan sampah rumah tangga, khususnya sampah anorganik, masih menghadapi berbagai kendala, seperti rendahnya kesadaran masyarakat dalam memilah sampah serta belum optimalnya pemanfaatan bank sampah sebagai sarana pengelolaan dan peningkatan nilai ekonomi sampah. Kondisi tersebut mendorong Tim KKN-T IDBU 47 Universitas Diponegoro untuk menghadirkan program edukasi dan penguatan kelembagaan sebagai solusi yang diharapkan mampu meningkatkan partisipasi masyarakat dalam mewujudkan lingkungan yang lebih bersih dan berkelanjutan.

Melalui kegiatan ini, Tim KKN-T IDBU 47 Universitas Diponegoro berupaya membentuk kepengurusan Bank Sampah Desa Piji, menyerahkan pengelolaan Bank Sampah kepada calon pengurus, serta memberikan edukasi mengenai pentingnya pemilahan sampah dan optimalisasi fungsi Bank Sampah. Program ini diharapkan dapat menumbuhkan perilaku masyarakat yang lebih peduli terhadap lingkungan, meningkatkan nilai ekonomis sampah melalui proses pemilahan, serta mendukung pencapaian Tujuan Pembangunan Berkelanjutan (Sustainable Development Goals/SDGs) poin 11, yakni sustainable cities and communities dan juga poin 12 terkait responsible consumption and production di Desa Piji melalui pengelolaan sampah yang lebih efektif dan berkelanjutan.`,
  },
];

/**
 * Kartu berita SELALU menuju halaman detail internal `/berita/[slug]`.
 * Redirect ke sumber eksternal (jika ada) dilakukan dari halaman detail
 * melalui tombol "Baca selengkapnya", bukan langsung dari kartu.
 */
function readUrl(item: Berita) {
  return `/berita/${item.slug}`;
}

interface BeritaListSectionProps {
  limit?: number;
}

export function BeritaListSection({ limit }: BeritaListSectionProps) {
  const displayedBerita = limit ? dummyBerita.slice(0, limit) : dummyBerita;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {displayedBerita.map((item) => {
        const url = readUrl(item);
        return (
          <article
            key={item.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Bagian Atas: Gambar cover aspect ratio 16:9 */}
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
              />
            </div>

            {/* Bagian Bawah: p-6 */}
            <div className="flex flex-1 flex-col p-6">
              <span className="text-xs font-medium text-slate-400">
                {item.date}
              </span>
              <h3 className="mt-2 font-heading text-lg font-bold text-slate-900 line-clamp-2 hover:text-emerald-600 transition-colors">
                <Link href={url}>
                  {item.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-sm text-slate-500 line-clamp-2">
                {item.excerpt}
              </p>
              <div className="mt-4 pt-2">
                <Link
                  href={url}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Baca selengkapnya{" "}
                  <span className="transition-transform group-hover:translate-x-1">
                    -&gt;
                  </span>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
