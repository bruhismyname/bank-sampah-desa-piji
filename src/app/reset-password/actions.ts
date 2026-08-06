"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  rotateRecoveryCode,
  verifyRecoveryCode,
} from "@/lib/recovery-code";

export interface ResetPasswordState {
  ok: boolean;
  error?: string;
  newCode?: string;
}

export interface ResetPasswordFormData {
  recoveryCode: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Server action reset password via Kode Pemulihan (tanpa email).
 *
 * Alur (PRD "Reset Password (Kode Pemulihan)"):
 *  1. Verifikasi kode pemulihan yang dimasukkan admin.
 *  2. Jika valid, set password baru.
 *  3. Generate kode pemulihan BARU (kode lama langsung mati — sekali pakai).
 *  4. Kembalikan `newCode` supaya ditampilkan SEKALI di layar oleh form.
 *     Kode baru TIDAK pernah lewat URL/query string (bisa bocor ke log).
 *
 * `prevState` dipakai oleh `useActionState` di komponen form.
 */
export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const code = formData.get("recoveryCode")?.toString().trim() ?? "";
  const newPassword = formData.get("newPassword")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  // Validasi dengan bahasa sehari-hari (target pengurus desa awam).
  if (!code) {
    return { ok: false, error: "Masukkan kode pemulihan." };
  }
  if (newPassword.length < 6) {
    return { ok: false, error: "Password baru minimal 6 karakter." };
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, error: "Password baru dan ulangi password tidak sama." };
  }

  // Satu akun admin — ambil baris pertama.
  const [user] = await db.select().from(users).limit(1);
  if (!user) {
    return {
      ok: false,
      error: "Akun admin belum dibuat. Hubungi pengurus website.",
    };
  }

  // Verifikasi kode pemulihan (sekali pakai).
  const valid = await verifyRecoveryCode(code, user.recoveryCodeHash);
  if (!valid) {
    return {
      ok: false,
      error: "Kode pemulihan salah atau sudah tidak berlaku.",
    };
  }

  // Set password baru + rotasi kode pemulihan.
  const { code: newCode, newHash } = await rotateRecoveryCode();
  await db
    .update(users)
    .set({
      passwordHash: await bcrypt.hash(newPassword, 10),
      recoveryCodeHash: newHash,
    })
    .where(eq(users.id, user.id));

  return { ok: true, newCode };
}
