import { MapPin, Phone, Mail } from "lucide-react";
import { getSiteContentMap } from "@/lib/site-content";
import { LokasiBankSampah } from "@/features/kontak/components/lokasi-bank-sampah";

/**
 * Halaman Kontak — server component.
 *
 * Info kontak (alamat, WhatsApp, email, sosmed) dibaca dari tabel
 * `site_content` (diedit admin via Kelola Konten), BUKAN di-hardcode —
 * sesuai aturan PRD "konten publik tidak diketik langsung di kode".
 */

export async function KontakPage() {
  const c = await getSiteContentMap();

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 md:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Main Split Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Left Column (Contact Info) */}
            <div className="flex flex-col justify-between space-y-8">
              <div>
                <h1 className="font-heading text-3xl font-extrabold text-slate-900 md:text-4xl tracking-tight">
                  Hubungi Kami
                </h1>
                <p className="mt-4 text-slate-500 leading-relaxed">
                  Punya pertanyaan seputar keanggotaan nasabah, tata cara pemilahan sampah,
                  atau ingin berkolaborasi dengan Bank Sampah Desa Piji? Tim kami siap melayani Anda.
                </p>
              </div>

              {/* Info Rows */}
              <div className="space-y-6">
                {/* Alamat */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Alamat Kantor
                    </span>
                    <p className="mt-1 text-sm font-medium text-slate-700 leading-relaxed">
                      {c.kontak_alamat}
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Nomor WhatsApp
                    </span>
                    <a
                      href={`https://wa.me/${c.kontak_whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                    >
                      {c.kontak_whatsapp}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email Resmi
                    </span>
                    <a
                      href={`mailto:${c.kontak_email}`}
                      className="mt-1 block text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                    >
                      {c.kontak_email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media Section — hanya tampil bila ada link terisi */}
              {(c.kontak_instagram || c.kontak_facebook || c.kontak_youtube) && (
                <div className="pt-6 border-t border-slate-100">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Media Sosial
                  </span>
                  <div className="flex items-center gap-3">
                    {c.kontak_instagram && (
                      <a
                        href={c.kontak_instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                        aria-label="Instagram Bank Sampah"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                    )}
                    {c.kontak_facebook && (
                      <a
                        href={c.kontak_facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                        aria-label="Facebook Bank Sampah"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8H7v3h2v9h4v-9h3.625L17 8h-4V7a1 1 0 0 1 1-1h3V2h-3c-3.313 0-6 2.687-6 6z"/>
                        </svg>
                      </a>
                    )}
                    {c.kontak_youtube && (
                      <a
                        href={c.kontak_youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                        aria-label="YouTube Bank Sampah"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Lokasi Bank Sampah) */}
            <LokasiBankSampah />
          </div>
        </div>
      </div>
    </main>
  );
}
