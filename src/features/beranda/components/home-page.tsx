import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Leaf, LineChart, Trash2, Users, Wallet, MapPin, Phone, Mail } from "lucide-react";
import { ProfilOrganisasiSection } from "@/features/profil-program/components/profil-organisasi-section";
import { GuideSopSection } from "@/features/guide-sop/components/guide-sop-section";
import { BeritaListSection } from "@/features/berita/components/berita-list-section";
import { LokasiBankSampah } from "@/features/kontak/components/lokasi-bank-sampah";

// ponytail: copy & stats di-hardcode dulu sesuai mockup; nanti datang dari
// tabel site_content + indikator berflag tampilkanDiBeranda (fitur Kelola Konten).
const stats = [
  { icon: Users, value: "500+", label: "Nasabah Aktif" },
  { icon: Trash2, value: "1.200 Kg", label: "Sampah Terkelola" },
  { icon: Award, value: "15+", label: "Penghargaan Desa" },
];

const values = [
  {
    icon: Leaf,
    title: "Lingkungan Bersih",
    body: "Mengurangi penumpukan sampah liar dan menjaga estetika serta kesehatan lingkungan desa kita tercinta.",
  },
  {
    icon: Wallet,
    title: "Nilai Ekonomi",
    body: "Mengubah sampah bernilai guna menjadi sumber pendapatan tambahan bagi warga dan kas pembangunan desa.",
  },
  {
    icon: LineChart,
    title: "Data Transparan",
    body: "Pencatatan real-time yang dapat diakses oleh semua warga, memastikan pengelolaan berjalan jujur dan akuntabel.",
  },
];

const steps = [
  {
    title: "Pilah Sampah",
    body: "Warga memilah sampah organik dan anorganik dari rumah masing-masing.",
  },
  {
    title: "Setor ke Bank",
    body: "Bawa sampah terpilah ke fasilitas Bank Sampah Desa Piji pada jadwal yang ditentukan.",
  },
  {
    title: "Penimbangan",
    body: "Petugas menimbang, mencatat jenis, dan memasukkan data ke dalam sistem.",
  },
  {
    title: "Saldo Bertambah",
    body: "Nilai rupiah dari sampah otomatis ditambahkan ke saldo akun warga.",
  },
];

export function HomePage() {
  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="relative mx-auto max-w-[1280px] px-4 pt-16 pb-32 md:px-10">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <h1 className="font-heading text-[32px] leading-[1.25] font-extrabold text-foreground md:text-[48px] md:leading-[1.2] md:tracking-[-0.02em]">
              Pilah Sampah, Jaga Bumi,
              <br />
              <span className="text-primary">Sejahterakan Desa</span>
            </h1>
            <p className="max-w-xl text-lg leading-[1.6] text-muted-foreground">
              Platform monitoring transparan untuk pengelolaan bank sampah
              desa. Membangun kesadaran warga dan mengukur dampak nyata bagi
              lingkungan kita.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/monev"
                className="rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Lihat Dashboard
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
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMUS8HsWsq5vOcvARIZEV4e3Ue4PNvUqleK5osuW0Sj1ArgdR_aMAglluP3BQdf07Z2ruai1NrHjp0AtvywOGzaNL0rjs4KO5UXJYDEdSMZXtlhwmdEB5_VUaXx4vQsyNm6eZ_-GRMIoMNiZLrnuayNsdYjy3k3DdMkgUIl6HeRsAbE128h7b6y3QjqlN3mCDA4fSGqV0-BT6xvOujyJDMjmn1hjc89m-fgDr6vipCnKDmQKk4oTxsbQ"
              alt="Pemandangan desa yang hijau dan asri"
              fill
              className="object-cover"
              priority
              unoptimized
            />
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
            Membangun Kesadaran, Menciptakan Dampak.
          </h2>
          <p className="text-muted-foreground">
            Bersama mewujudkan desa yang bersih, sehat, dan berdaya saing
            melalui pengelolaan sampah yang terstruktur dan terpadu.
          </p>
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
            4 Langkah Cara Kerja
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
                        Kantor Kepala Desa Piji, RT 02 / RW 03, Kecamatan Dawe, 
                        Kabupaten Kudus, Jawa Tengah, 59353
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
                        href="https://wa.me/6281234567890" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-1 block text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                      >
                        +62 812-3456-7890
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
                        href="mailto:banksampah@desapiji.id" 
                        className="mt-1 block text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                      >
                        banksampah@desapiji.id
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
                    <a
                      href="https://instagram.com"
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
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                      aria-label="Facebook Bank Sampah"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8H7v3h2v9h4v-9h3.625L17 8h-4V7a1 1 0 0 1 1-1h3V2h-3c-3.313 0-6 2.687-6 6z"/>
                      </svg>
                    </a>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                      aria-label="YouTube Bank Sampah"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
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
