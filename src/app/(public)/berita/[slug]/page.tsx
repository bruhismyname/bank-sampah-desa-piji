import { Metadata } from "next";
import { DetailBerita } from "@/features/berita/components/detail-berita";
import { dummyBerita } from "@/features/berita/components/berita-list-section";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return dummyBerita.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = dummyBerita.find((b) => b.slug === slug);
  const title = article ? article.title : "Detail Bacaan Berita - Bank Sampah Desa Piji";
  const desc = article ? article.excerpt : "Baca selengkapnya mengenai perkembangan Bank Sampah Desa Piji.";

  return {
    title: `${title} - Bank Sampah Desa Piji`,
    description: desc,
  };
}

export default async function DetailBeritaPage({ params }: Props) {
  const { slug } = await params;
  return <DetailBerita slug={slug} />;
}
