"use client";

import { useState } from "react";
import { Info, LogIn, KeyRound, LineChart, AlertCircle, FileSpreadsheet, ChevronRight } from "lucide-react";

interface Step {
  title: string;
  description: string;
  screenshotText: string;
}

interface Topic {
  id: string;
  label: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  steps: Step[];
  tips: string;
}

const topics: Topic[] = [
  {
    id: "login",
    label: "Cara Login",
    title: "Cara Login Admin",
    icon: LogIn,
    description: "Panduan cara masuk ke dalam panel administrasi Bank Sampah Desa Piji untuk mengelola data pencatatan, kendala, dan laporan.",
    steps: [
      {
        title: "Masuk ke Halaman Login",
        description: "Klik tombol Login yang berada di ujung kanan atas Navbar menu utama website publik, atau Anda dapat langsung mengakses alamat URL http://localhost:3000/login pada peramban (browser) Anda.",
        screenshotText: "Screenshot: Tombol Login di Navbar & Form Input Kredensial",
      },
      {
        title: "Masukkan Kredensial Akun",
        description: "Masukkan Username dan Password admin yang telah terdaftar dan diberikan secara resmi oleh Tim KKNT-47 UNDIP. Periksa kembali ejaan huruf kapital sebelum Anda menekan tombol Masuk.",
        screenshotText: "Screenshot: Form Login Terisi & Tombol Masuk Aktif",
      },
    ],
    tips: "Gunakan fitur simpan sandi pada browser Anda jika Anda mengakses admin panel menggunakan perangkat pribadi untuk mempermudah login berikutnya.",
  },
  {
    id: "reset-password",
    label: "Reset Password",
    title: "Cara Reset Password Admin",
    icon: KeyRound,
    description: "Lupa password? Reset lewat Kode Pemulihan — tanpa perlu memanggil developer. Kode pemulihan dipegang Kepala Desa / Sekretaris Desa.",
    steps: [
      {
        title: "Buka Halaman Reset Password",
        description: "Dari halaman login, klik tautan **Lupa Password?** atau akses langsung alamat https://…/reset-password pada peramban.",
        screenshotText: "Screenshot: Form Input Kode Pemulihan",
      },
      {
        title: "Masukkan Kode Pemulihan",
        description: "Ketik kode pemulihan 12 karakter yang disimpan Kepala/Sekretaris Desa, lalu masukkan **password baru** Anda. Klik tombol reset.",
        screenshotText: "Screenshot: Kode Pemulihan Terisi & Password Baru",
      },
      {
        title: "Catat Kode Pemulihan Baru",
        description: "Setelah berhasil, sistem **otomatis membuat kode pemulihan baru** dan menampilkannya sekali di layar. Catat dan simpan di tempat aman — kode lama sudah tidak berlaku.",
        screenshotText: "Screenshot: Kode Pemulihan Baru Ditampilkan Sekali",
      },
    ],
    tips: "Kode pemulihan hanya tampil SEKALI saat dibuat. Jangan simpan di HP yang sama dengan admin — pegang oleh orang berbeda (Kepala/Sekretaris Desa) sebagai cadangan.",
  },
  {
    id: "capaian",
    label: "Input Capaian",
    title: "Cara Input Capaian Mingguan",
    icon: LineChart,
    description: "Panduan bagi pengurus untuk mencatat capaian volume sampah dan transaksi tabungan nasabah secara digital pada sistem SIMONEV.",
    steps: [
      {
        title: "Masuk ke menu Input Capaian",
        description: "Setelah berhasil masuk (login) ke halaman admin, pilih menu Input Capaian pada daftar navigasi sidebar sebelah kiri halaman untuk membuka formulir input data.",
        screenshotText: "Screenshot: Menu Navigasi Admin Panel dengan Sorotan ke 'Input Capaian'",
      },
      {
        title: "Pilih Periode dan Isi Form",
        description: "Pilih periode penimbangan (misalnya minggu berjalan), kemudian isi form volume sampah per kategori indikator yang tertera. Setelah data terisi dengan benar, tekan tombol Simpan Data di bagian bawah form.",
        screenshotText: "Screenshot: Form Input Capaian, Dropdown Kategori, dan Tombol Simpan Data",
      },
    ],
    tips: "Pastikan Anda memilah data berdasarkan kategori indikator dengan benar sebelum menekan tombol Simpan Data untuk menjaga keakuratan grafik tren di halaman Monev.",
  },
  {
    id: "kendala",
    label: "Kelola Kendala",
    title: "Cara Kelola Logbook Kendala",
    icon: AlertCircle,
    description: "Panduan mencatat kendala atau hambatan operasional bank sampah di lapangan untuk dikoordinasikan bersama perangkat desa.",
    steps: [
      {
        title: "Akses Menu Logbook Kendala",
        description: "Pilih dan klik menu Logbook Kendala yang terletak pada sidebar navigasi panel admin untuk melihat daftar kendala aktif dan menambahkan catatan baru.",
        screenshotText: "Screenshot: Tampilan Logbook Kendala & Tabel Masalah Operasional",
      },
      {
        title: "Tambah Kendala Baru",
        description: "Klik tombol Tambah Kendala Baru, tuliskan deskripsi permasalahan secara mendalam beserta prioritas kendala tersebut, lalu klik tombol Simpan Laporan untuk menerbitkannya.",
        screenshotText: "Screenshot: Form Pelaporan Kendala Baru & Pilihan Skala Prioritas",
      },
    ],
    tips: "Selalu update status kendala secara berkala menjadi 'Proses' ketika penanganan telah dimulai, dan ubah menjadi 'Selesai' setelah masalah operasional tersebut teratasi.",
  },
  {
    id: "laporan",
    label: "Export Laporan",
    title: "Cara Export Laporan PDF & Excel",
    icon: FileSpreadsheet,
    description: "Panduan mencetak hasil rekapitulasi data bank sampah dalam format PDF interaktif (disertai grafik) maupun Excel sebagai data mentah cadangan (backup).",
    steps: [
      {
        title: "Masuk ke Menu Laporan & Export",
        description: "Buka navigasi menu Laporan & Export pada sidebar sebelah kiri untuk masuk ke dalam pusat administrasi pengunduhan data rekapitulasi.",
        screenshotText: "Screenshot: Halaman Laporan & Fitur Date Range Picker",
      },
      {
        title: "Pilih Rentang Tanggal dan Format",
        description: "Tentukan rentang tanggal laporan menggunakan kalender filter yang tersedia. Klik tombol Export PDF untuk mengunduh versi visual berkas laporan, atau klik Export Excel untuk mengunduh data mentah tabular.",
        screenshotText: "Screenshot: Pilihan Tombol 'Unduh Laporan PDF' dan 'Backup Database Excel'",
      },
    ],
    tips: "Laporan PDF membatasi data berdasarkan rentang waktu yang Anda pilih di kalender, sedangkan Export Excel akan mengunduh seluruh database secara lengkap (backup menyeluruh).",
  },
];

export function PanduanPage() {
  const [activeTopicId, setActiveTopicId] = useState("capaian");

  const activeTopic = topics.find((t) => t.id === activeTopicId) || topics[1];

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header (Eco-Corporate Synthesis style) */}
      <section className="bg-gradient-to-b from-accent to-transparent px-4 pb-12 pt-14 text-center md:px-10 md:pt-20 border-b border-slate-100">
        <h1 className="font-heading text-4xl font-extrabold text-slate-900 md:text-5xl">
          Panduan Pemakaian Website
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-500">
          Tutorial langkah demi langkah untuk mempermudah pengurus dalam menggunakan sistem monitoring 
          dan tata kelola Bank Sampah Desa Piji.
        </p>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          
          {/* Sidebar Navigasi Kiri (Sticky) */}
          <aside className="md:col-span-1">
            <nav className="sticky top-28 space-y-2 pr-0 md:pr-6 md:border-r md:border-slate-100">
              <span className="mb-4 block text-xs font-bold uppercase tracking-wider text-slate-400 px-4">
                Daftar Topik Panduan
              </span>
              {topics.map((topic) => {
                const Icon = topic.icon;
                const isActive = topic.id === activeTopicId;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopicId(topic.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                      <span className="text-sm">{topic.label}</span>
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4 text-emerald-600" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Konten Kanan (Utama) */}
          <article className="md:col-span-3 max-w-3xl">
            {/* Title & Description */}
            <h1 className="font-heading text-3xl font-extrabold text-slate-900 md:text-4xl tracking-tight">
              {activeTopic.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {activeTopic.description}
            </p>

            {/* Divider */}
            <div className="my-8 border-t border-slate-100" />

            {/* Steps Rendering */}
            <div className="space-y-12">
              {activeTopic.steps.map((step, index) => (
                <div key={step.title} className="space-y-4">
                  {/* Step Title (H3) */}
                  <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-extrabold text-emerald-800">
                      {index + 1}
                    </span>
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-slate-600 leading-relaxed pl-11">
                    {/* Render bold buttons/texts within standard descriptions */}
                    {step.description.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={i} className="font-bold text-slate-800">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </p>

                  {/* Screenshot Placeholder */}
                  <div className="pl-11">
                    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner text-slate-400 hover:bg-slate-100 transition-colors">
                      <div className="h-12 w-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                        <IconSVG topicId={activeTopic.id} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Screenshot Simulasi
                      </span>
                      <p className="text-center text-sm font-medium text-slate-500 px-6 max-w-md">
                        {step.screenshotText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alert / Info Box (Blue) */}
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-5 rounded-r-2xl my-10 flex gap-4 items-start shadow-sm">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block font-bold text-blue-900 text-sm uppercase tracking-wider">
                  Tips & Informasi Penting
                </span>
                <p className="text-sm leading-relaxed text-blue-800">
                  {activeTopic.tips}
                </p>
              </div>
            </div>

          </article>
        </div>
      </div>
    </main>
  );
}

// Icon helper for screenshot placeholders
function IconSVG({ topicId }: { topicId: string }) {
  switch (topicId) {
    case "login":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      );
    case "reset-password":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      );
    case "capaian":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      );
    case "kendala":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "laporan":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    default:
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}
