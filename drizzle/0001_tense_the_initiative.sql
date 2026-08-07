CREATE TYPE "public"."berita_status_enum" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('Baru', 'Proses', 'Selesai');--> statement-breakpoint
CREATE TABLE "berita" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" text NOT NULL,
	"slug" text NOT NULL,
	"konten" text NOT NULL,
	"cover_url" text NOT NULL,
	"status" "berita_status_enum" DEFAULT 'draft' NOT NULL,
	"tanggal_publish" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "berita_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "capaian" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"indikator_id" uuid NOT NULL,
	"periode_id" uuid NOT NULL,
	"nilai" numeric DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluasi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kriteria_id" uuid NOT NULL,
	"periode_id" uuid NOT NULL,
	"skor" numeric DEFAULT '0' NOT NULL,
	"catatan" text,
	"foto_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluasi_kriteria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"bobot" numeric DEFAULT '1' NOT NULL,
	"urutan" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indikator" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"kategori" text NOT NULL,
	"target" numeric DEFAULT '0' NOT NULL,
	"tampilkan_di_beranda" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kendala" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deskripsi" text NOT NULL,
	"tanggal" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "status_enum" DEFAULT 'Baru' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "periode" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"tanggal_mulai" timestamp with time zone NOT NULL,
	"tanggal_akhir" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profil_program" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"deskripsi" text,
	"struktur" text,
	"alamat" text,
	"telepon" text,
	"email" text,
	"instagram" text,
	"facebook" text,
	"youtube" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rekomendasi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" text NOT NULL,
	"deskripsi" text,
	"prioritas" text DEFAULT 'Sedang' NOT NULL,
	"status" "status_enum" DEFAULT 'Baru' NOT NULL,
	"urutan" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"type" text DEFAULT 'text' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_content_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "tahapan_kkn" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"urutan" integer DEFAULT 0 NOT NULL,
	"selesai" boolean DEFAULT false NOT NULL,
	"tampilkan_tahapan_kkn" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "capaian" ADD CONSTRAINT "capaian_indikator_id_indikator_id_fk" FOREIGN KEY ("indikator_id") REFERENCES "public"."indikator"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capaian" ADD CONSTRAINT "capaian_periode_id_periode_id_fk" FOREIGN KEY ("periode_id") REFERENCES "public"."periode"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluasi" ADD CONSTRAINT "evaluasi_kriteria_id_evaluasi_kriteria_id_fk" FOREIGN KEY ("kriteria_id") REFERENCES "public"."evaluasi_kriteria"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluasi" ADD CONSTRAINT "evaluasi_periode_id_periode_id_fk" FOREIGN KEY ("periode_id") REFERENCES "public"."periode"("id") ON DELETE cascade ON UPDATE no action;