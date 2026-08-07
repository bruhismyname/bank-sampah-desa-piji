import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Leaf, LineChart, Trash2, Users, Wallet, MapPin, Phone, Mail } from "lucide-react";
import { ProfilOrganisasiSection } from "@/features/profil-program/components/profil-organisasi-section";
import { GuideSopSection } from "@/features/guide-sop/components/guide-sop-section";
import { BeritaListSection } from "@/features/berita/components/berita-list-section";
import { LokasiBankSampah } from "@/features/kontak/components/lokasi-bank-sampah";
import { getSiteContentMap } from "@/lib/site-content";

// ============================================================
// HomePage — server component. Seluruh konten statis (hero, stats,
// value props, cara kerja, kontak) dibaca dari tabel `site_content`
// (diedit admin via Kelola Konten). Hanya angka statistik nasabah/
// sampah yang bersumber dari indikator & capaian (fitur monev) —
// ditambahkan pada langkah penyempurnaan berikutnya.
// ============================================================

export async function HomePage() {
  const c = await getSiteContentMap();

  const stats = [
    { icon: Users, value: c.stat1_value, label: c.stat1_label },
    { icon: Trash2, value: c.stat2_value, label: c.stat2_label },
    { icon: Award, value: c.stat3_value, label: c.stat3_label },
  ];

  const values = [
    { icon: Leaf, title: c.value_prop1_title, body: c.value_prop1_body },
    { icon: Wallet, title: c.value_prop2_title, body: c.value_prop2_body },
    { icon: LineChart, title: c.value_prop3_title, body: c.value_prop3_body },
  ];

  const steps = [
    { title: c.step1_title, body: c.step1_body },
    { title: c.step2_title, body: c.step2_body },
    { title: c.step3_title, body: c.step3_body },
    { title: c.step4_title, body: c.step4_body },
  ];

  // Bagi headline: bagian sebelum koma pertama ditulis besar + emerald.
  const headline = c.hero_headline;
  const headlineFirst = headline.split(",")[0]?.trim() ?? "";
  const headlineRest = headline.slice(headlineFirst.length).replace(/^,/, "").trim();

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="relative mx-auto max-w-[1280px] px-4 pt-16 pb-32 md:px-10">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <h1 className="font-heading text-[32px] leading-[1.25] font-extrabold text-foreground md:text-[48px] md:leading-[1.2] md:tracking-[-0.02em]">
              {headlineFirst}
              {headlineRest && (
                <>
                  <br />
                  <span className="text-primary">{headlineRest}</span>
                </>
              )}
            </h1>
            <p className="max-w-xl text-lg leading-[1.6] text-muted-foreground">
              {c.hero_subheadline}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={c.hero_cta_href || "/monev"}
                className="rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                {c.hero_cta_label || "Lihat Dashboard"}
              </Link>
              <Link
                href="/panduan"
                className="rounded-xl border-2 border-input px-8 py-4 text-sm font-semibold text-primary transition-colors hover:border-primary"
              >
                Baca Panduan
              </Link>
            </div>
          </div>

          <div className="relative h-[300px] w-full overflow-hidden rounded-3xl shadow-sm md:h-[500px]">
            {c.hero_image ? (
              <Image
                src={c.hero_image}
                alt="Foto utama Bank Sampah Desa Piji"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent to-surface-container-low">
                <Leaf className="h-20 w-20 text-primary/30" strokeWidth={1.25} />
              </div>
            )}
          </div>
        </div>

        {/* Floating stats bar */}
        <div className="absolute inset-x-4 -bottom-16 z-10 mx-auto max-w-[1000px] md:inset-x-10">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-md">
            <div className="grid grid-cols-1 gap-8 divide-y divide-border text-center md:grid-cols-3 md:divide-x md:divide-y-0">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center justify-center p-4">
                  <s.icon className="mb-2 h-9 w-9 text-primary" strokeWidth={1.75} />
                  <h3 className="font-heading text-2xl font-bold text-foreground">{s.value}</h3>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spacer for floating bar */}
      <div className="h-32" />

      {/* ===== Value props ===== */}
      <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">
            {c.value_props_title}
          </h2>
          <p className="text-muted-foreground">{c.value_props_subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <v.icon className="h-8 w-8 text-primary" strokeWidth={1.75} />
              </div>
              <h3 className="mb-3 font-heading text-2xl font-bold text-foreground">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="bg-muted px-4 py-16 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground">
            {c.steps_title}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="absolute -top-4 -left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-card bg-primary text-lg font-bold text-primary-foreground shadow-sm">
                  {i + 1}
                </div>
                <h4 className="mt-2 mb-2 text-sm font-semibold tracking-wide text-foreground">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Profil Organisasi (di bawah Cara Kerja) ===== */}
      <ProfilOrganisasiSection showPengurusButton />

      {/* ===== Guide SOP (di bawah Profil) ===== */}
      <GuideSopSection />

      {/* ===== Berita & Update Terbaru ===== */}
      <section className="bg-slate-50 px-4 py-16 md:px-10 border-t border-border">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
            <div className="text-center sm:text-left">
              <h2 className="font-heading text-3xl font-extrabold text-slate-900 md:text-4xl">
                Berita & Update Terbaru
              </h2>
              <p className="mt-2 text-slate-500">
                Kabar terbaru seputar pengelolaan dan edukasi Bank Sampah Desa Piji.
              </p>
            </div>
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-600 transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              Lihat Semua Berita
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <BeritaListSection limit={3} />
        </div>
      </section>

      {/* ===== Hubungi Kami Section ===== */}
      <section className="bg-slate-50 px-4 pb-20 pt-8 md:px-10 border-t border-slate-100">
        <div className="mx-auto max-w-[1280px]">
          {/* Split Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">

              {/* Left Column (Contact Info) */}
              <div className="flex flex-col justify-between space-y-8">
                <div>
                  <h2 className="font-heading text-3xl font-extrabold text-slate-900 md:text-4xl tracking-tight">
                    Hubungi Kami
                  </h2>
                  <p className="mt-4 text-slate-500 leading-relaxed text-sm">
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

                {/* Social Media Section */}
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
                          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column (Lokasi Bank Sampah) */}
              <LokasiBankSampah />

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
