"use client";

import { useState } from "react";
import { Plus, Trash2, Save, CheckCircle2, User, Globe, Users } from "lucide-react";

interface PengurusItem {
  id: number;
  name: string;
  role: string;
}

export default function EditProfilPage() {
  // Section 1: Informasi Umum
  const [orgName, setOrgName] = useState("Bank Sampah Desa Piji");
  const [description, setDescription] = useState(
    "Sistem pengelolaan sampah mandiri dan terintegrasi untuk mewujudkan Desa Piji yang bersih, sehat, dan bernilai ekonomi."
  );
  const [visionMission, setVisionMission] = useState(
    "Visi:\nMewujudkan kelestarian lingkungan Desa Piji melalui pengelolaan sampah berbasis masyarakat.\n\nMisi:\n1. Mengedukasi warga tentang pentingnya pemilahan sampah.\n2. Mengolah sampah organik menjadi pupuk.\n3. Memberdayakan ekonomi warga lewat tabungan sampah."
  );

  // Section 2: Kontak
  const [address, setAddress] = useState(
    "Kantor Kepala Desa Piji, RT 02 / RW 03, Kecamatan Dawe, Kabupaten Kudus, Jawa Tengah, 59353"
  );
  const [whatsapp, setWhatsapp] = useState("+62 812-3456-7890");
  const [email, setEmail] = useState("banksampah@desapiji.id");
  const [instagram, setInstagram] = useState("https://instagram.com/banksampah.piji");

  // Section 3: Struktur Pengurus (Dynamic List)
  const [pengurusList, setPengurusList] = useState<PengurusItem[]>([
    { id: 1, name: "Budi Santoso", role: "Ketua Pengurus" },
    { id: 2, name: "Siti Rahma", role: "Sekretaris" },
    { id: 3, name: "Dewi Lestari", role: "Bendahara" },
  ]);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAddPengurus = () => {
    setPengurusList(prev => [
      ...prev,
      { id: Date.now(), name: "", role: "" },
    ]);
    setSuccessMsg(null);
  };

  const handlePengurusChange = (id: number, field: "name" | "role", value: string) => {
    setPengurusList(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
    setSuccessMsg(null);
  };

  const handleDeletePengurus = (id: number) => {
    setPengurusList(prev => prev.filter(item => item.id !== id));
    setSuccessMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate successful API submission
    setSuccessMsg("Profil organisasi berhasil diperbarui dan dipublikasikan ke halaman utama.");
    
    // Smooth scroll to top to see the success message
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Clear alert after 5 seconds
    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen pb-28 relative">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Pengaturan Profil Publik
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Kelola informasi organisasi, detail kontak, dan struktur kepengurusan yang tampil di halaman beranda.
        </p>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="max-w-4xl mx-auto flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 animate-in fade-in duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold leading-relaxed">
            {successMsg}
          </p>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        
        {/* Seksi 1: Informasi Umum */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
            <User className="h-5 w-5 text-emerald-600" />
            Seksi 1: Informasi Umum
          </h3>

          <div className="space-y-4">
            {/* Nama Organisasi */}
            <div className="space-y-1">
              <label htmlFor="orgName" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Nama Organisasi
              </label>
              <input
                id="orgName"
                type="text"
                required
                value={orgName}
                onChange={e => {
                  setOrgName(e.target.value);
                  setSuccessMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Deskripsi Singkat */}
            <div className="space-y-1">
              <label htmlFor="description" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Deskripsi Singkat
              </label>
              <textarea
                id="description"
                required
                rows={3}
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  setSuccessMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Visi/Misi */}
            <div className="space-y-1">
              <label htmlFor="visionMission" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Visi / Misi
              </label>
              <textarea
                id="visionMission"
                required
                rows={6}
                value={visionMission}
                onChange={e => {
                  setVisionMission(e.target.value);
                  setSuccessMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Seksi 2: Kontak */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
            <Globe className="h-5 w-5 text-emerald-600" />
            Seksi 2: Kontak Publik
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alamat Lengkap */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="address" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Alamat Lengkap Kantor
              </label>
              <textarea
                id="address"
                required
                rows={2}
                value={address}
                onChange={e => {
                  setAddress(e.target.value);
                  setSuccessMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Nomor WhatsApp */}
            <div className="space-y-1">
              <label htmlFor="whatsapp" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Nomor WhatsApp
              </label>
              <input
                id="whatsapp"
                type="text"
                required
                value={whatsapp}
                onChange={e => {
                  setWhatsapp(e.target.value);
                  setSuccessMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Email Resmi
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setSuccessMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Link Instagram */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="instagram" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Link Profil Instagram
              </label>
              <input
                id="instagram"
                type="url"
                required
                value={instagram}
                onChange={e => {
                  setInstagram(e.target.value);
                  setSuccessMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Seksi 3: Struktur Pengurus */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 gap-4">
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Seksi 3: Struktur Pengurus
            </h3>
            
            {/* Tambah Pengurus */}
            <button
              type="button"
              onClick={handleAddPengurus}
              className="inline-flex items-center gap-1 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold rounded-lg px-3 py-1.5 text-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Pengurus</span>
            </button>
          </div>

          <div className="space-y-4">
            {pengurusList.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-slate-200 text-slate-400 rounded-xl text-xs font-semibold">
                Belum ada struktur kepengurusan. Tambahkan pengurus menggunakan tombol di atas.
              </div>
            ) : (
              pengurusList.map((item, idx) => (
                <div key={item.id} className="flex items-end gap-3 group animate-in slide-in-from-top-2 duration-150">
                  {/* Fields Container */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    {/* Nama Pengurus */}
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Nama Pengurus #{idx + 1}
                      </span>
                      <input
                        type="text"
                        required
                        value={item.name}
                        onChange={e => handlePengurusChange(item.id, "name", e.target.value)}
                        placeholder="Nama Lengkap"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Jabatan */}
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Jabatan / Peran
                      </span>
                      <input
                        type="text"
                        required
                        value={item.role}
                        onChange={e => handlePengurusChange(item.id, "role", e.target.value)}
                        placeholder="Misal: Ketua Pengurus, Divisi Logistik"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeletePengurus(item.id)}
                    className="p-3 mb-[1px] rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Baris"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sticky Floating Save Button (Bottom Right) */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/25 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <Save className="h-4.5 w-4.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>

      </form>

    </div>
  );
}
