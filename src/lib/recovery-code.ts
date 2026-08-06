import bcrypt from "bcryptjs";

/**
 * Kode Pemulihan — mekanisme reset password TANPA email untuk admin.
 *
 * Alur (lihat PRD "Reset Password (Kode Pemulihan)"):
 *  1. Saat akun dibuat / setelah reset, sistem generate kode 12 karakter
 *     alfanumerik yang "aman untuk diketik" (tanpa karakter yang mirip:
 *     O/0, I/l/1, dst) lalu HANYA hash-nya yang disimpan di DB.
 *  2. Kode ditampilkan SEKALI ke layar untuk dicatat/dicetak admin.
 *  3. Saat admin lupa password, ia memasukkan kode di /reset-password.
 *  4. Jika kode cocok, admin set password baru, dan sistem OTOMATIS
 *     generate kode baru (kode lama tidak berlaku lagi — sekali pakai).
 *
 * Kode pemulihan di-hash dengan bcrypt (sama seperti password), TIDAK
 * pernah disimpan dalam bentuk plaintext.
 */

// Karakter alfanumerik yang tidak ambigu (tanpa 0/O, 1/I/l, dst)
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

/**
 * Generate kode pemulihan acak sepanjang `length` karakter (default 12).
 */
export function generateRecoveryCode(length = 12): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

/**
 * Hash kode pemulihan dengan bcrypt (sama seperti password).
 */
export async function hashRecoveryCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

/**
 * Verifikasi apakah `code` cocok dengan `hash` yang tersimpan.
 */
export async function verifyRecoveryCode(
  code: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

/**
 * Buat kode pemulihan baru beserta hash-nya (dipakai saat reset berhasil,
 * menggantikan kode lama). Mengembalikan `{ code, newHash }` — `code`
 * ditampilkan sekali ke layar, `newHash` disimpan ke kolom `recoveryCodeHash`.
 */
export async function rotateRecoveryCode(): Promise<{
  code: string;
  newHash: string;
}> {
  const code = generateRecoveryCode();
  const newHash = await hashRecoveryCode(code);
  return { code, newHash };
}
