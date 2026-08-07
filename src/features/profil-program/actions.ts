"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { profilProgram } from "@/db/schema";
import { profilProgramSchema, type ProfilProgramInput } from "./schema";

/**
 * Server actions Edit Profil Program (tabel `profil_program` — single-row).
 *
 *  - getProfilProgram: ambil satu baris (untuk form admin & render publik).
 *  - saveProfilProgram: simpan baris — dibuat bila belum ada, update bila ada.
 *
 * `struktur` disimpan sebagai teks "Nama - Jabatan" (satu per baris) agar
 * bisa diedit admin awam tanpa form kompleks; di-render publik sebagai grid.
 *
 * Revalidate `/profil` dan `/` (kontak singkat di footer/home ikut berubah).
 */

export type ProfilState =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Interface yang sama dengan kolom tabel (snake_case dikirim sebagai camel). */
export interface ProfilProgramRecord {
  id: string;
  nama: string;
  deskripsi: string;
  struktur: string;
  alamat: string;
  telepon: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

/** Ambil satu baris profil (atau null bila belum pernah disimpan). */
export async function getProfilProgram(): Promise<ProfilProgramRecord | null> {
  const rows = await db
    .select({
      id: profilProgram.id,
      nama: profilProgram.nama,
      deskripsi: profilProgram.deskripsi,
      struktur: profilProgram.struktur,
      alamat: profilProgram.alamat,
      telepon: profilProgram.telepon,
      email: profilProgram.email,
      instagram: profilProgram.instagram,
      facebook: profilProgram.facebook,
      youtube: profilProgram.youtube,
    })
    .from(profilProgram)
    .limit(1);

  const r = rows[0];
  if (!r) return null;

  return {
    id: r.id,
    nama: r.nama ?? "",
    deskripsi: r.deskripsi ?? "",
    struktur: r.struktur ?? "",
    alamat: r.alamat ?? "",
    telepon: r.telepon ?? "",
    email: r.email ?? "",
    instagram: r.instagram ?? "",
    facebook: r.facebook ?? "",
    youtube: r.youtube ?? "",
  };
}

/** Simpan profil (upsert single-row). */
export async function saveProfilProgram(
  _prevState: ProfilState | null,
  formData: FormData,
): Promise<ProfilState> {
  const parsed = profilProgramSchema.safeParse({
    nama: formData.get("nama"),
    deskripsi: formData.get("deskripsi") ?? "",
    struktur: formData.get("struktur") ?? "",
    alamat: formData.get("alamat") ?? "",
    telepon: formData.get("telepon") ?? "",
    email: formData.get("email") ?? "",
    instagram: formData.get("instagram") ?? "",
    facebook: formData.get("facebook") ?? "",
    youtube: formData.get("youtube") ?? "",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { ok: false, error: firstError ?? "Data tidak valid." };
  }

  const data = parsed.data as ProfilProgramInput;

  try {
    const existing = await db
      .select({ id: profilProgram.id })
      .from(profilProgram)
      .limit(1);

    if (existing[0]) {
      await db
        .update(profilProgram)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(profilProgram.id, existing[0].id));
    } else {
      await db.insert(profilProgram).values(data);
    }

    revalidatePath("/profil");
    revalidatePath("/");
    return { ok: true, message: "Profil organisasi berhasil disimpan." };
  } catch (e) {
    console.error("saveProfilProgram error:", e);
    return { ok: false, error: "Gagal menyimpan profil. Coba lagi." };
  }
}
