import "dotenv/config";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import {
  generateRecoveryCode,
  hashRecoveryCode,
} from "../lib/recovery-code";

/**
 * Seed akun admin pertama (satu-satunya akun yang login ke /admin).
 *
 * Cara pakai: `pnpm db:seed`
 *
 * Alur:
 *  1. Upsert user `admin` — password baru di-hash bcrypt dan ditimpa.
 *     (Menjalankan ulang = reset password admin ke nilai di bawah.)
 *  2. Generate Kode Pemulihan 12 karakter baru dan cetak SEKALI ke
 *     terminal. HANYA hash-nya yang disimpan ke kolom `recoveryCodeHash`
 *     — kode plaintext TIDAK pernah masuk DB.
 *
 * Setelah seed, kode pemulihan dicetak di layar. Catat/kirim ke pemegang
 * kredensial (Kepala/Sekretaris Desa) — kode hanya dipakai untuk reset
 * password bila admin lupa password.
 */

const DEFAULT_USERNAME = "admin";
// Password default pertama kali — WAJIB diganti admin lewat menu pengaturan
// atau lewat reset via kode pemulihan segera setelah serah terima.
const DEFAULT_PASSWORD = "admin123";

async function main() {
  console.log("=== Seed Akun Admin Bank Sampah Piji ===");

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const recoveryCode = generateRecoveryCode();
  const recoveryCodeHash = await hashRecoveryCode(recoveryCode);

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.username, DEFAULT_USERNAME))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({ passwordHash, recoveryCodeHash })
      .where(eq(users.username, DEFAULT_USERNAME));
    console.log(`✓ User "${DEFAULT_USERNAME}" sudah ada — password & kode pemulihan diperbarui.`);
  } else {
    await db.insert(users).values({
      username: DEFAULT_USERNAME,
      passwordHash,
      recoveryCodeHash,
    });
    console.log(`✓ User "${DEFAULT_USERNAME}" berhasil dibuat.`);
  }

  console.log("");
  console.log("============================================================");
  console.log("  KODE PEMULIHAN (sekali pakai, catat dan simpan baik-baik):");
  console.log("");
  console.log(`    ${recoveryCode}`);
  console.log("");
  console.log("  Kode ini dipakai bila admin lupa password (halaman");
  console.log("  /reset-password). Setelah reset berhasil, kode BARU akan");
  console.log("  dibuat otomatis dan kode ini tidak berlaku lagi.");
  console.log("  Hanya hash kode yang tersimpan di database — kode ini");
  console.log("  hanya muncul SEKALI di layar ini.");
  console.log("============================================================");
  console.log("");
  console.log(`Password login: "${DEFAULT_PASSWORD}" (segera ganti setelah masuk)`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Gagal menjalankan seed:", err);
    process.exit(1);
  });
