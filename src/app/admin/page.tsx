import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { indikator, capaian, kendala, rekomendasi } from "@/db/schema";
import { count, eq, and, gte, lte, sql } from "drizzle-orm";
import {
  BarChart3,
  ClipboardPlus,
  AlertTriangle,
  CheckSquare,
  TrendingUp,
  FileDown,
  Lightbulb,
  Newspaper,
} from "lucide-react";

export const dynamic = "force-dynamic";

/** Query ringkasan dashboard admin — semua data realtime dari DB. */
async function getDashboardStats() {
  // Jumlah indikator aktif
  const [indikatorCount] = await db
    .select({ total: count(indikator.id) })
    .from(indikator);

  // Jumlah capaian yang diinput bulan ini
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [capaianBulanIni] = await db
    .select({ total: count(capaian.id) })
    .from(capaian)
    .where(
      and(
        gte(capaian.createdAt, startOfMonth),
        lte(capaian.createdAt, endOfMonth),
      ),
    );

  // Jumlah kendala yang masih "Baru" atau "Proses" (belum selesai)
  const [kendalaBelumSelesai] = await db
    .select({ total: count(kendala.id) })
    .from(kendala)
    .where(
      sql`${kendala.status} IN ('Baru', 'Proses')`,
    );

  // Jumlah rekomendasi yang masih "Baru" (belum ditindaklanjuti)
  const [rekomendasiBaru] = await db
    .select({ total: count(rekomendasi.id) })
    .from(rekomendasi)
    .where(eq(rekomendasi.status, "Baru"));

  return {
    totalIndikator: indikatorCount?.total ?? 0,
    capaianBulanIni: capaianBulanIni?.total ?? 0,
    kendalaBelumSelesai: kendalaBelumSelesai?.total ?? 0,
    rekomendasiBaru: rekomendasiBaru?.total ?? 0,
  };
}

export default async function AdminPage() {
  const session = await auth();
  const adminName = session?.user?.name ?? "Admin";
  const stats = await getDashboardStats();

  return (
    <div className="p-6 md:p-8 space-y-8">

      {/* Welcome Message */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Selamat Datang, {adminName}!
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Pantau capaian program kerja dan input data terbaru untuk Bank Sampah Desa Piji.
        </p>
      </div>

      {/* Quick Stats (Grid 3 kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Stat 1: Indikator Kinerja */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Indikator Kinerja
            </span>
            <span className="block text-2xl font-extrabold text-slate-900">
              {stats.totalIndikator} <span className="text-base font-bold text-slate-400">Aktif</span>
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 2: Capaian Bulan Ini */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Capaian Bulan Ini
            </span>
            <span className="block text-2xl font-extrabold text-slate-900">
              {stats.capaianBulanIni} <span className="text-base font-bold text-slate-400">Input</span>
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ClipboardPlus className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 3: Kendala Belum Selesai */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Kendala Belum Selesai
            </span>
            <span className="block text-2xl font-extrabold text-slate-900">
              {stats.kendalaBelumSelesai} <span className="text-base font-bold text-slate-400">Aktif</span>
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Quick Actions (Grid 3 kolom) */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-slate-900">
          Akses Cepat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Action 1: Input Capaian */}
          <Link
            href="/admin/capaian"
            className="bg-white hover:bg-emerald-50/20 group rounded-2xl p-6 shadow-sm border border-slate-100/80 hover:border-emerald-200 transition-all text-left flex items-start gap-4 hover:-translate-y-0.5 duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ClipboardPlus className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-heading font-bold text-slate-800 text-base group-hover:text-emerald-700 block transition-colors">
                Input Capaian
              </span>
              <span className="text-xs text-slate-500 block leading-relaxed">
                Catat data capaian indikator per periode dan simpan ke database.
              </span>
            </div>
          </Link>

          {/* Action 2: Catat Kendala */}
          <Link
            href="/admin/kendala"
            className="bg-white hover:bg-emerald-50/20 group rounded-2xl p-6 shadow-sm border border-slate-100/80 hover:border-emerald-200 transition-all text-left flex items-start gap-4 hover:-translate-y-0.5 duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-heading font-bold text-slate-800 text-base group-hover:text-emerald-700 block transition-colors">
                Catat Kendala
              </span>
              <span className="text-xs text-slate-500 block leading-relaxed">
                Laporkan hambatan operasional yang terjadi di lapangan.
              </span>
            </div>
          </Link>

          {/* Action 3: Isi Evaluasi */}
          <Link
            href="/admin/evaluasi"
            className="bg-white hover:bg-emerald-50/20 group rounded-2xl p-6 shadow-sm border border-slate-100/80 hover:border-emerald-200 transition-all text-left flex items-start gap-4 hover:-translate-y-0.5 duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-heading font-bold text-slate-800 text-base group-hover:text-emerald-700 block transition-colors">
                Isi Evaluasi
              </span>
              <span className="text-xs text-slate-500 block leading-relaxed">
                Beri penilaian berkala kualitas tata kelola Bank Sampah.
              </span>
            </div>
          </Link>

          {/* Action 4: Rekomendasi */}
          <Link
            href="/admin/rekomendasi"
            className="bg-white hover:bg-emerald-50/20 group rounded-2xl p-6 shadow-sm border border-slate-100/80 hover:border-emerald-200 transition-all text-left flex items-start gap-4 hover:-translate-y-0.5 duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-heading font-bold text-slate-800 text-base group-hover:text-emerald-700 block transition-colors">
                Rekomendasi
              </span>
              <span className="text-xs text-slate-500 block leading-relaxed">
                Kelola tindak lanjut pasca-KKN di papan kanban.
                {stats.rekomendasiBaru > 0 && (
                  <span className="ml-1 text-amber-600 font-semibold">
                    ({stats.rekomendasiBaru} baru)
                  </span>
                )}
              </span>
            </div>
          </Link>

          {/* Action 5: Kelola Berita */}
          <Link
            href="/admin/berita"
            className="bg-white hover:bg-emerald-50/20 group rounded-2xl p-6 shadow-sm border border-slate-100/80 hover:border-emerald-200 transition-all text-left flex items-start gap-4 hover:-translate-y-0.5 duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Newspaper className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-heading font-bold text-slate-800 text-base group-hover:text-emerald-700 block transition-colors">
                Kelola Berita
              </span>
              <span className="text-xs text-slate-500 block leading-relaxed">
                Tulis dan publikasikan artikel berita Bank Sampah.
              </span>
            </div>
          </Link>

          {/* Action 6: Export Laporan */}
          <Link
            href="/admin/laporan"
            className="bg-white hover:bg-emerald-50/20 group rounded-2xl p-6 shadow-sm border border-slate-100/80 hover:border-emerald-200 transition-all text-left flex items-start gap-4 hover:-translate-y-0.5 duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <FileDown className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-heading font-bold text-slate-800 text-base group-hover:text-emerald-700 block transition-colors">
                Export Laporan
              </span>
              <span className="text-xs text-slate-500 block leading-relaxed">
                Unduh laporan PDF atau backup data Excel.
              </span>
            </div>
          </Link>

        </div>
      </div>

      {/* Information Notice / Tutorial Card */}
      <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-1">
          <h4 className="font-heading font-bold text-emerald-900 text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Saran Penggunaan Hari Ini
          </h4>
          <p className="text-xs text-emerald-800 leading-relaxed max-w-2xl">
            Pastikan Anda melakukan ekspor laporan penimbangan mingguan setiap akhir bulan untuk diserahkan
            kepada kepala desa sebagai bahan rapat evaluasi kebersihan lingkungan Desa Piji.
          </p>
        </div>
        <Link
          href="/admin/laporan"
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-3 transition-colors shrink-0 flex items-center gap-2"
        >
          <FileDown className="h-3.5 w-3.5" />
          <span>Buka Menu Laporan</span>
        </Link>
      </div>

    </div>
  );
}
