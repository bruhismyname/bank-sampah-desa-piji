import Link from "next/link";
import { auth } from "@/lib/auth";
import { 
  BarChart3, 
  ClipboardPlus, 
  AlertTriangle, 
  CheckSquare, 
  TrendingUp, 
  FileDown 
} from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  const adminName = session?.user?.name ?? "Admin";

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
        
        {/* Stat 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Indikator Kinerja
            </span>
            <span className="block text-2xl font-extrabold text-slate-900">
              15 Aktif
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Capaian Bulan Ini
            </span>
            <span className="block text-2xl font-extrabold text-slate-900">
              12 Input
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ClipboardPlus className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Kendala Operasional
            </span>
            <span className="block text-2xl font-extrabold text-slate-900">
              3 Proses
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
          Akses Cepat (Quick Actions)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Action 1 */}
          <Link 
            href="#capaian"
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
                Catat penimbangan volume sampah mingguan dan simpan ke database.
              </span>
            </div>
          </Link>

          {/* Action 2 */}
          <Link 
            href="#kendala"
            className="bg-white hover:bg-emerald-50/20 group rounded-2xl p-6 shadow-sm border border-slate-100/80 hover:border-emerald-200 transition-all text-left flex items-start gap-4 hover:-translate-y-0.5 duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-heading font-bold text-slate-800 text-base group-hover:text-emerald-700 block transition-colors">
                Catat Kendala
              </span>
              <span className="text-xs text-slate-500 block leading-relaxed">
                Laporkan hambatan operasional tim KKN desa di lapangan secara rinci.
              </span>
            </div>
          </Link>

          {/* Action 3 */}
          <Link 
            href="#evaluasi"
            className="bg-white hover:bg-emerald-50/20 group rounded-2xl p-6 shadow-sm border border-slate-100/80 hover:border-emerald-200 transition-all text-left flex items-start gap-4 hover:-translate-y-0.5 duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-heading font-bold text-slate-800 text-base group-hover:text-emerald-700 block transition-colors">
                Isi Evaluasi
              </span>
              <span className="text-xs text-slate-500 block leading-relaxed">
                Beri penilaian berkala kualitas tata kelola kebersihan lingkungan.
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
          href="#laporan"
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-3 transition-colors shrink-0 flex items-center gap-2"
        >
          <FileDown className="h-3.5 w-3.5" />
          <span>Buka Menu Laporan</span>
        </Link>
      </div>

    </div>
  );
}
