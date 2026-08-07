import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  boolean,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

// ============================================================
// Enum — status konsisten Baru/Proses/Selesai (kendala & rekomendasi)
// ============================================================
export const statusEnum = pgEnum("status_enum", ["Baru", "Proses", "Selesai"]);

// Status berita: draf vs terbit
export const beritaStatusEnum = pgEnum("berita_status_enum", [
  "draft",
  "published",
]);

// ============================================================
// users — satu baris admin (kredensial login + kode pemulihan)
// ============================================================
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  recoveryCodeHash: text("recovery_code_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// tahapan_kkn — checklist tahapan KKN + toggle visibilitas di /monev
// ============================================================
export const tahapanKkn = pgTable("tahapan_kkn", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  urutan: integer("urutan").notNull().default(0),
  selesai: boolean("selesai").notNull().default(false),
  // Toggle global: bila false, section checklist tahapan disembunyikan dari
  // dashboard publik /monev. Disimpan di tiap baris; saat di-toggle di
  // /admin/tahapan, semua baris disinkronkan ke nilai yang sama.
  tampilkanTahapanKKN: boolean("tampilkan_tahapan_kkn").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// indikator — master indikator + target + flag tampil di beranda
// ============================================================
export const indikator = pgTable("indikator", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  kategori: text("kategori").notNull(),
  // precision 12, scale 2 — cukup untuk kg/persen/jumlah orang dan aman untuk
  // nilai Rupiah hingga milyaran dengan 2 desimal. mode 'number' membuat kolom
  // ter-infer sebagai number di TypeScript (tanpa Number() manual).
  target: numeric("target", { precision: 12, scale: 2, mode: "number" })
    .notNull()
    .default(0),
  // Bila true, capaian terakhir indikator ini tampil sebagai stat besar di Home
  tampilkanDiBeranda: boolean("tampilkan_di_beranda").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// periode — rentang waktu input capaian & evaluasi (dibuat otomatis
// dari rentang tanggal, bukan di-create manual oleh admin)
// ============================================================
export const periode = pgTable("periode", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  tanggalMulai: timestamp("tanggal_mulai", { withTimezone: true }).notNull(),
  tanggalAkhir: timestamp("tanggal_akhir", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// capaian — nilai per indikator per periode (boleh diisi berulang
// dalam satu periode; nilai terakhir atau semua riwayat ditampilkan)
// ============================================================
export const capaian = pgTable("capaian", {
  id: uuid("id").defaultRandom().primaryKey(),
  indikatorId: uuid("indikator_id")
    .notNull()
    .references(() => indikator.id, { onDelete: "cascade" }),
  periodeId: uuid("periode_id")
    .notNull()
    .references(() => periode.id, { onDelete: "cascade" }),
  nilai: numeric("nilai", { precision: 12, scale: 2, mode: "number" })
    .notNull()
    .default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// kendala — logbook kendala; status konsisten Baru/Proses/Selesai
// ============================================================
export const kendala = pgTable("kendala", {
  id: uuid("id").defaultRandom().primaryKey(),
  deskripsi: text("deskripsi").notNull(),
  tanggal: timestamp("tanggal", { withTimezone: true }).defaultNow().notNull(),
  status: statusEnum("status").notNull().default("Baru"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// evaluasi_kriteria — definisi kriteria penilaian
// ============================================================
export const evaluasiKriteria = pgTable("evaluasi_kriteria", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  // Bobot kriteria bisa pecahan (mis. 0.25, 0.5) — numeric mode 'number'.
  bobot: numeric("bobot", { precision: 4, scale: 2, mode: "number" })
    .notNull()
    .default(1),
  urutan: integer("urutan").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// evaluasi — skor PER KRITERIA per periode, plus catatan & foto.
// Catatan & foto bersifat per-periode (satu sesi evaluasi) — disimpan
// pada tiap baris kriteria periode yang sama, dibaca dari baris pertama.
// Rata-rata skor dihitung otomatis, tidak disimpan sebagai satu angka.
// ============================================================
export const evaluasi = pgTable("evaluasi", {
  id: uuid("id").defaultRandom().primaryKey(),
  kriteriaId: uuid("kriteria_id")
    .notNull()
    .references(() => evaluasiKriteria.id, { onDelete: "cascade" }),
  periodeId: uuid("periode_id")
    .notNull()
    .references(() => periode.id, { onDelete: "cascade" }),
  // Skor kriteria — bilangan bulat (skala 1-5).
  skor: integer("skor").notNull().default(0),
  catatan: text("catatan"),
  fotoUrl: text("foto_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// rekomendasi — kanban pasca-KKN; status konsisten Baru/Proses/Selesai
// ============================================================
export const rekomendasi = pgTable("rekomendasi", {
  id: uuid("id").defaultRandom().primaryKey(),
  judul: text("judul").notNull(),
  deskripsi: text("deskripsi"),
  prioritas: text("prioritas").notNull().default("Sedang"),
  status: statusEnum("status").notNull().default("Baru"),
  urutan: integer("urutan").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// profil_program — info organisasi, struktur, kontak (single-row)
// ============================================================
export const profilProgram = pgTable("profil_program", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  deskripsi: text("deskripsi"),
  struktur: text("struktur"),
  alamat: text("alamat"),
  telepon: text("telepon"),
  email: text("email"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  youtube: text("youtube"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// berita — artikel publik; konten HTML disanitasi (DOMPurify) sebelum
// disimpan. Status draft/published.
// ============================================================
export const berita = pgTable("berita", {
  id: uuid("id").defaultRandom().primaryKey(),
  judul: text("judul").notNull(),
  slug: text("slug").notNull().unique(),
  konten: text("konten").notNull(),
  coverUrl: text("cover_url").notNull(),
  status: beritaStatusEnum("status").notNull().default("draft"),
  tanggalPublish: timestamp("tanggal_publish", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// site_content — key-value config konten statis halaman publik yang
// bisa diedit admin (hero, value props, cara kerja, profil, kontak,
// termasuk key guide_sop_url type "file" untuk PDF SOP di Vercel Blob).
// ============================================================
export const siteContent = pgTable("site_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull().default(""),
  type: text("type").notNull().default("text"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
