import { Metadata } from "next";
import { DetailBerita, getBeritaBySlug } from "@/features/berita/components/detail-berita";

type Props = {
  params: Promise<{ slug: string }>;
};

// Halaman dynamic — artikel bisa terbit/draft/dihapus kapan saja oleh admin,
// jadi slug tidak boleh di-pre-render statis (artikel baru setelah deploy
// tetap harus bisa diakses).
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBeritaBySlug(slug);
  const title = article ? article.title : "Detail Bacaan Berita - Bank Sampah Desa Piji";
  const desc = article?.excerpt || "Baca selengkapnya mengenai perkembangan Bank Sampah Desa Piji.";

  return {
    title: `${title} - Bank Sampah Desa Piji`,
    description: desc,
  };
}

export default async function DetailBeritaPage({ params }: Props) {
  const { slug } = await params;
  return <DetailBerita slug={slug} />;
}
