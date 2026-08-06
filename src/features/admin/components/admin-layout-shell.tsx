"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  BarChart3, 
  ClipboardPlus, 
  AlertTriangle, 
  CheckSquare, 
  Lightbulb, 
  FileDown, 
  User, 
  Newspaper, 
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";

interface AdminLayoutShellProps {
  adminName: string;
  onLogout: () => void;
  children: React.ReactNode;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "tahapan", label: "Tahapan KKN", icon: Layers, href: "/admin/tahapan" },
  { id: "indikator", label: "Master Indikator", icon: BarChart3, href: "/admin/indikator" },
  { id: "capaian", label: "Input Capaian", icon: ClipboardPlus, href: "/admin/capaian" },
  { id: "kendala", label: "Logbook Kendala", icon: AlertTriangle, href: "/admin/kendala" },
  { id: "evaluasi", label: "Evaluasi Periodik", icon: CheckSquare, href: "/admin/evaluasi" },
  { id: "rekomendasi", label: "Rekomendasi", icon: Lightbulb, href: "/admin/rekomendasi" },
  { id: "laporan", label: "Laporan & Export", icon: FileDown, href: "/admin/laporan" },
  { id: "profil", label: "Edit Profil", icon: User, href: "/admin/profil" },
  { id: "berita", label: "Kelola Berita", icon: Newspaper, href: "/admin/berita" },
  { id: "konten", label: "Kelola Konten", icon: Settings, href: "/admin/konten" },
];

export function AdminLayoutShell({ adminName, onLogout, children }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Helper to determine active menu based on pathname
  const getActiveMenuId = () => {
    if (pathname === "/admin") return "dashboard";
    if (pathname === "/admin/tahapan" || pathname.startsWith("/admin/tahapan/")) return "tahapan";
    if (pathname === "/admin/indikator" || pathname.startsWith("/admin/indikator/")) return "indikator";
    if (pathname === "/admin/capaian" || pathname.startsWith("/admin/capaian/")) return "capaian";
    if (pathname === "/admin/kendala" || pathname.startsWith("/admin/kendala/")) return "kendala";
    if (pathname === "/admin/evaluasi" || pathname.startsWith("/admin/evaluasi/")) return "evaluasi";
    if (pathname === "/admin/rekomendasi" || pathname.startsWith("/admin/rekomendasi/")) return "rekomendasi";
    if (pathname === "/admin/laporan" || pathname.startsWith("/admin/laporan/")) return "laporan";
    if (pathname === "/admin/profil" || pathname.startsWith("/admin/profil/")) return "profil";
    if (pathname === "/admin/berita" || pathname.startsWith("/admin/berita/")) return "berita";
    if (pathname === "/admin/konten" || pathname.startsWith("/admin/konten/")) return "konten";
    // Default or check other hash paths or routes
    return "dashboard";
  };

  const activeMenuId = getActiveMenuId();
  const activeMenuLabel = menuItems.find(item => item.id === activeMenuId)?.label || "Admin";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* Sidebar Kiri (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-100 shrink-0 sticky top-0 h-screen justify-between py-6">
        <div>
          {/* Logo */}
          <div className="px-6 mb-8">
            <Link href="/admin" className="hover:opacity-90 block">
              <span className="font-heading text-lg font-extrabold text-emerald-600 tracking-tight block">
                Monev Bank Sampah
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeMenuId;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 text-left ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-600 rounded-l-none"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-emerald-600" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar (Logout) */}
        <div className="px-6 pt-6 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 flex items-center justify-start gap-1 p-2 shadow-lg overflow-x-auto scrollbar-none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeMenuId;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-150 shrink-0 ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-6 md:px-8 shrink-0 sticky top-0 z-40">
          <h2 className="font-heading font-extrabold text-slate-900 text-lg md:text-xl capitalize">
            {activeMenuLabel}
          </h2>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-emerald-500/20 transition-all focus:outline-none"
              aria-label="Menu Pengguna"
            >
              {adminName.charAt(0).toUpperCase()}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-50">
                  <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">Akun Admin</span>
                  <span className="block text-sm font-semibold text-slate-800 truncate">{adminName}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
