ALTER TABLE "capaian" ALTER COLUMN "nilai" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "evaluasi" ALTER COLUMN "skor" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "evaluasi_kriteria" ALTER COLUMN "bobot" SET DATA TYPE numeric(4, 2);--> statement-breakpoint
ALTER TABLE "evaluasi_kriteria" ALTER COLUMN "bobot" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "indikator" ALTER COLUMN "target" SET DATA TYPE numeric(12, 2);