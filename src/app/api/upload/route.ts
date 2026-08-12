import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * API Route: Client Upload ke Vercel Blob.
 *
 * Endpoint ini dipakai oleh komponen client (konten SOP, foto evaluasi, cover
 * berita, dsb.) untuk upload file langsung ke Vercel Blob tanpa melewati
 * server (client upload). `handleUpload` dari @vercel/blob/client mengatur
 * flow tokenized upload:
 *   1. Client minta token ke sini.
 *   2. Client upload langsung ke Blob storage pakai token.
 *   3. Callback `onUploadCompleted` dipanggil setelah selesai.
 *
 * Proteksi: hanya admin yang sudah login yang boleh upload.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname) => {
        // Validasi: hanya izinkan tipe file tertentu.
        // pathname contoh: "sop/dokumen-sop.pdf"
        return {
          allowedContentTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
          ],
          // Maksimum 10MB (cukup untuk PDF SOP dan foto evaluasi)
          maximumSizeInBytes: 10 * 1024 * 1024,
          tokenPayload: JSON.stringify({
            userId: session.user.id,
          }),
        };
      },
      onUploadCompleted: async () => {
        // Tidak perlu processing setelah upload — URL disimpan oleh
        // client ke site_content / evaluasi / berita via server action
        // terpisah.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[upload] Error:", error);
    return NextResponse.json(
      { error: "Gagal mengupload file." },
      { status: 500 },
    );
  }
}
