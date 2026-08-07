import { getSiteContentGroups, getSiteContentMap } from "@/lib/site-content";
import { KontenClient } from "@/features/kelola-konten/components/konten-client";

/**
 * Kelola Konten — server component yang membaca semua nilai `site_content`
 * dari DB lalu meneruskan ke komponen client `KontenClient` untuk form
 * edit per section.
 */
export default async function KelolaKontenPage() {
  const [groups, values] = await Promise.all([
    getSiteContentGroups(),
    getSiteContentMap(),
  ]);

  return (
    <div className="p-6 md:p-8">
      <KontenClient groups={groups} initialValues={values} />
    </div>
  );
}
