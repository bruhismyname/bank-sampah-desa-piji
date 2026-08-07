import { GuideSopSection } from "@/features/guide-sop/components/guide-sop-section";

// URL dokumen SOP bisa diubah admin kapan saja — render selalu segar.
export const dynamic = "force-dynamic";

export default async function Guide() {
  return (
    <main className="bg-background">
      <GuideSopSection />
    </main>
  );
}
