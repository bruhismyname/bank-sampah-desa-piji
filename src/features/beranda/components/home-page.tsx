import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Leaf, LineChart, Trash2, Users, Wallet, MapPin, Phone, Mail, Play, Globe } from "lucide-react";
import { ProfilOrganisasiSection } from "@/features/profil-program/components/profil-organisasi-section";
import { GuideSopSection } from "@/features/guide-sop/components/guide-sop-section";
import { BeritaListSection } from "@/features/berita/components/berita-list-section";
import { LokasiBankSampah } from "@/features/kontak/components/lokasi-bank-sampah";
import { getSiteContentMap } from "@/lib/site-content";

// ============================================================
// HomePage — server component. Seluruh konten statis (hero, stats,
// value props, cara kerja, kontak) dibaca dari tabel `site_content`
// (diedit admin via Kelola Konten).
// ============================================================

export async function HomePage() {
  const c = await getSiteContentMap();

  const heroImgSrc = c.hero_image && c.hero_image.trim() !== "" ? c.hero_image : "/hero/hero.PNG";

  const stats = [
    { icon: Users, value: c.stat1_value || "500+", label: c.stat1_label || "Nasabah Aktif", color: "text-emerald-600 bg-emerald-50" },
    { icon: Trash2, value: c.stat2_value || "1.200 Kg", label: c.stat2_label || "Sampah Terkelola", color: "text-blue-600 bg-blue-50" },
    { icon: Award, value: c.stat3_value || "15+", label: c.stat3_label || "Penghargaan Desa", color: "text-amber-600 bg-amber-50" },
    { icon: Globe, value: c.stat4_value || "100%", label: c.stat4_label || "Transparan & Akuntabel", color: "text-teal-600 bg-teal-50" },
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
  const headline = c.hero_headline || "Pilah Sampah, Jaga Bumi Desa";
  const headlineFirst = headline.split(",")[0]?.trim() ?? headline;
  const headlineRest = headline.includes(",") ? headline.slice(headlineFirst.length).replace(/^,/, "").trim() : "";

  return (
    <main>
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden bg-slate-50 pt-6 pb-28 md:pt-12 md:pb-36">
        {/* Hero Banner Container */}
        <div className="relative mx-auto max-w-[1280px] px-4 md:px-10">
          <div className="relative min-h-[480px] md:min-h-[540px] w-full overflow-hidden rounded-3xl border border-slate-200/80 shadow-md">
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={heroImgSrc}
                alt="Hero Bank Sampah Desa Piji"
                fill
                className="object-cover object-right md:object-center"
                priority
                unoptimized
              />
              {/* Gradient Overlay to ensure text readability on the left */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 via-55% to-white/10 md:via-60% md:to-transparent" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex min-h-[480px] md:min-h-[540px] items-center p-6 md:p-14">
              <div className="max-w-2xl space-y-6">
                
                {/* Main Headline */}
                <h1 className="font-heading text-3xl font-extrabold leading-[1.15] text-slate-900 sm:text-4xl md:text-[52px] tracking-tight">
                  {headlineFirst}
                  {headlineRest ? (
                    <>
                      <br />
                      <span className="text-emerald-600">{headlineRest}</span>
                    </>
                  ) : (
                    <span className="block text-emerald-600">Jaga Bumi, Sejahterakan Desa</span>
                  )}
                </h1>

                {/* Subheadline Description */}
                <p className="max-w-xl text-base md:text-lg leading-relaxed text-slate-600">
                  {c.hero_subheadline || "We deliver intelligent solutions that drive growth, empower communities, and create lasting environmental impact."}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={c.hero_cta_href || "/monev"}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {c.hero_cta_label || "Lihat Dashboard"}
                  </Link>
                  
                  <Link
                    href="/panduan"
                    className="inline-flex items-center gap-2.5 rounded-xl border border-slate-300 bg-white/90 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-emerald-600 hover:text-emerald-600 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Play className="h-3 w-3 fill-emerald-600 ml-0.5" />
                    </div>
                    <span>Baca Panduan</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Bar anchored at bottom of Hero */}
        <div className="relative z-20 mx-auto max-w-[1150px] px-4 md:px-10 -mt-16 sm:-mt-20">
          <div className="rounded-2xl md:rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 divide-y sm:divide-y-0 lg:grid-cols-4 lg:divide-x divide-slate-100">
              {stats.map((s, idx) => (
                <div
                  key={s.label}
                  className={`flex items-center gap-4 ${idx > 0 ? "pt-4 sm:pt-0" : ""} ${idx > 0 ? "lg:pl-6" : ""}`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.color}`}>
                    <s.icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {s.value}
                    </h3>
                    <p className="text-xs md:text-sm font-medium text-slate-500">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
