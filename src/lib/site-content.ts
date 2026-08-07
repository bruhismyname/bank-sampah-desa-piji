import { db } from "@/db";
import { siteContent } from "@/db/schema";

/**
 * Definisi konten statis halaman publik yang bisa diedit admin.
 *
 * Setiap key = satu baris di tabel `site_content` (key-value). Daftar ini
 * dipakai dua arah:
 *  - Halaman publik: fallback nilai default bila key belum ada di DB.
 *  - Halaman admin /admin/konten: render form per section.
 *
 * `type` mengikuti PRD (text/textarea/image/list/file) untuk memudahkan
 * render tipe data di form admin.
 */

export type SiteContentType =
  | "text"      // satu baris input
  | "textarea"  // paragraf
  | "list"      // daftar (dipisah baris baru)
  | "file"      // URL file (mis. PDF SOP di Vercel Blob)
  | "image"     // URL gambar

export interface SiteContentDef {
  key: string;
  label: string;
  type: SiteContentType;
  group: string;
  defaultValue: string;
}

/** Bagian UI beranda yang bisa diedit admin — hero & 3 stats. */
export const SITE_CONTENT_DEFS: SiteContentDef[] = [
  // ===== Hero Beranda =====
  { key: "hero_headline", label: "Headline (judul besar)", type: "text", group: "Beranda — Hero", defaultValue: "Pilah Sampah, Jaga Bumi, Sejahterakan Desa" },
  { key: "hero_subheadline", label: "Subheadline (penjelasan singkat)", type: "textarea", group: "Beranda — Hero", defaultValue: "Platform monitoring transparan untuk pengelolaan bank sampah desa. Membangun kesadaran warga dan mengukur dampak nyata bagi lingkungan kita." },
  { key: "hero_cta_label", label: "Teks tombol utama (CTA)", type: "text", group: "Beranda — Hero", defaultValue: "Lihat Dashboard" },
  { key: "hero_cta_href", label: "Link tombol utama", type: "text", group: "Beranda — Hero", defaultValue: "/monev" },
  { key: "hero_image", label: "URL gambar utama", type: "image", group: "Beranda — Hero", defaultValue: "" },

  // ===== Statistik Beranda =====
  { key: "stat1_value", label: "Statistik 1 — Angka", type: "text", group: "Beranda — Statistik", defaultValue: "500+" },
  { key: "stat1_label", label: "Statistik 1 — Keterangan", type: "text", group: "Beranda — Statistik", defaultValue: "Nasabah Aktif" },
  { key: "stat2_value", label: "Statistik 2 — Angka", type: "text", group: "Beranda — Statistik", defaultValue: "1.200 Kg" },
  { key: "stat2_label", label: "Statistik 2 — Keterangan", type: "text", group: "Beranda — Statistik", defaultValue: "Sampah Terkelola" },
  { key: "stat3_value", label: "Statistik 3 — Angka", type: "text", group: "Beranda — Statistik", defaultValue: "15+" },
  { key: "stat3_label", label: "Statistik 3 — Keterangan", type: "text", group: "Beranda — Statistik", defaultValue: "Penghargaan Desa" },

  // ===== Value Props Beranda =====
  { key: "value_props_title", label: "Judul section", type: "text", group: "Beranda — Value Props", defaultValue: "Membangun Kesadaran, Menciptakan Dampak." },
  { key: "value_props_subtitle", label: "Subjudul section", type: "textarea", group: "Beranda — Value Props", defaultValue: "Bersama mewujudkan desa yang bersih, sehat, dan berdaya saing melalui pengelolaan sampah yang terstruktur dan terpadu." },
  { key: "value_prop1_title", label: "Value Prop 1 — Judul", type: "text", group: "Beranda — Value Props", defaultValue: "Lingkungan Bersih" },
  { key: "value_prop1_body", label: "Value Prop 1 — Isi", type: "textarea", group: "Beranda — Value Props", defaultValue: "Mengurangi penumpukan sampah liar dan menjaga estetika serta kesehatan lingkungan desa kita tercinta." },
  { key: "value_prop2_title", label: "Value Prop 2 — Judul", type: "text", group: "Beranda — Value Props", defaultValue: "Nilai Ekonomi" },
  { key: "value_prop2_body", label: "Value Prop 2 — Isi", type: "textarea", group: "Beranda — Value Props", defaultValue: "Mengubah sampah bernilai guna menjadi sumber pendapatan tambahan bagi warga dan kas pembangunan desa." },
  { key: "value_prop3_title", label: "Value Prop 3 — Judul", type: "text", group: "Beranda — Value Props", defaultValue: "Data Transparan" },
  { key: "value_prop3_body", label: "Value Prop 3 — Isi", type: "textarea", group: "Beranda — Value Props", defaultValue: "Pencatatan real-time yang dapat diakses oleh semua warga, memastikan pengelolaan berjalan jujur dan akuntabel." },

  // ===== Cara Kerja Beranda =====
  { key: "steps_title", label: "Judul section", type: "text", group: "Beranda — Cara Kerja", defaultValue: "4 Langkah Cara Kerja" },
  { key: "step1_title", label: "Langkah 1 — Judul", type: "text", group: "Beranda — Cara Kerja", defaultValue: "Pilah Sampah" },
  { key: "step1_body", label: "Langkah 1 — Isi", type: "textarea", group: "Beranda — Cara Kerja", defaultValue: "Warga memilah sampah organik dan anorganik dari rumah masing-masing." },
  { key: "step2_title", label: "Langkah 2 — Judul", type: "text", group: "Beranda — Cara Kerja", defaultValue: "Setor ke Bank" },
  { key: "step2_body", label: "Langkah 2 — Isi", type: "textarea", group: "Beranda — Cara Kerja", defaultValue: "Bawa sampah terpilah ke fasilitas Bank Sampah Desa Piji pada jadwal yang ditentukan." },
  { key: "step3_title", label: "Langkah 3 — Judul", type: "text", group: "Beranda — Cara Kerja", defaultValue: "Penimbangan" },
  { key: "step3_body", label: "Langkah 3 — Isi", type: "textarea", group: "Beranda — Cara Kerja", defaultValue: "Petugas menimbang, mencatat jenis, dan memasukkan data ke dalam sistem." },
  { key: "step4_title", label: "Langkah 4 — Judul", type: "text", group: "Beranda — Cara Kerja", defaultValue: "Saldo Bertambah" },
  { key: "step4_body", label: "Langkah 4 — Isi", type: "textarea", group: "Beranda — Cara Kerja", defaultValue: "Nilai rupiah dari sampah otomatis ditambahkan ke saldo akun warga." },

  // ===== Profil =====
  { key: "profil_about", label: "Tentang (paragraf 1)", type: "textarea", group: "Profil", defaultValue: "Bank Sampah Desa Piji lahir dari keprihatinan warga terhadap menumpuknya sampah yang tidak terkelola. Berawal dari inisiatif sederhana mengumpulkan sampah anorganik di balai desa, kini program ini berkembang menjadi pengelolaan sampah terpadu yang melibatkan ratusan nasabah aktif." },
  { key: "profil_vision", label: "Visi (paragraf 2)", type: "textarea", group: "Profil", defaultValue: "Visi kami adalah mewujudkan desa yang bersih, sehat, dan berdaya saing — menjadikan sampah sebagai sumber nilai, bukan sekadar beban lingkungan." },
  { key: "profil_strengths", label: "Keunggulan (satu per baris)", type: "list", group: "Profil", defaultValue: "Pencatatan digital yang transparan dan bisa diakses semua warga\nPendampingan warga dalam memilah sampah dari rumah\nKemitraan dengan bank sampah induk dan pemulung\nPembinaan ekonomi sirkular untuk menambah pendapatan desa" },

  // ===== Kontak =====
  { key: "kontak_alamat", label: "Alamat", type: "textarea", group: "Kontak", defaultValue: "Kantor Kepala Desa Piji, RT 02 / RW 03, Kecamatan Dawe, Kabupaten Kudus, Jawa Tengah, 59353" },
  { key: "kontak_whatsapp", label: "Nomor WhatsApp (62...)", type: "text", group: "Kontak", defaultValue: "6281234567890" },
  { key: "kontak_email", label: "Email", type: "text", group: "Kontak", defaultValue: "banksampah@desapiji.id" },
  { key: "kontak_instagram", label: "Instagram (URL)", type: "text", group: "Kontak", defaultValue: "" },
  { key: "kontak_facebook", label: "Facebook (URL)", type: "text", group: "Kontak", defaultValue: "" },
  { key: "kontak_youtube", label: "YouTube (URL)", type: "text", group: "Kontak", defaultValue: "" },

  // ===== SOP =====
  { key: "guide_sop_url", label: "Dokumen SOP (PDF)", type: "file", group: "SOP Bank Sampah", defaultValue: "" },
];

const DEFAULT_MAP: Record<string, string> = Object.fromEntries(
  SITE_CONTENT_DEFS.map((d) => [d.key, d.defaultValue]),
);

/** Baca semua baris site_content dari DB → Record<key, value>. */
async function readSiteContentRows(): Promise<Record<string, string>> {
  const rows = await db
    .select({ key: siteContent.key, value: siteContent.value })
    .from(siteContent);

  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

/**
 * Ambil seluruh konten statis (sudah digabung default fallback untuk key
 * yang belum ada di DB). Dipanggil dari server component halaman publik.
 */
export async function getSiteContentMap(): Promise<Record<string, string>> {
  const rows = await readSiteContentRows();
  return { ...DEFAULT_MAP, ...rows };
}

/** Ambil nilai satu key dengan default bila belum ada di DB. */
export async function getSiteContent(key: string): Promise<string> {
  const map = await getSiteContentMap();
  return map[key] ?? "";
}

/** Kelompokkan defs berdasarkan group (untuk render form admin per section). */
export function getSiteContentGroups(): { group: string; items: SiteContentDef[] }[] {
  const groups: { group: string; items: SiteContentDef[] }[] = [];
  for (const def of SITE_CONTENT_DEFS) {
    const existing = groups.find((g) => g.group === def.group);
    if (existing) existing.items.push(def);
    else groups.push({ group: def.group, items: [def] });
  }
  return groups;
}
