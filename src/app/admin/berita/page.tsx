"use client";

import { useState, useRef } from "react";
import { Plus, Edit, Trash2, BookOpen, Bold, Italic, List, Link, Check, AlertCircle } from "lucide-react";

interface ArticleItem {
  id: number;
  title: string;
  date: string;
  status: "Published" | "Draft";
  content: string;
  category: string;
}

export default function KelolaBeritaPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([
    {
      id: 1,
      title: "Sosialisasi Perdana Bank Sampah Desa Piji KKN Undip",
      date: "05 Agu 2026",
      status: "Published",
      category: "Edukasi",
      content: "Kegiatan sosialisasi pemilahan sampah organik dan anorganik dihadiri oleh 45 perwakilan ibu-ibu PKK Desa Piji. Kegiatan berjalan dengan antusiasme yang tinggi.",
    },
    {
      id: 2,
      title: "Peluncuran Sistem Monitoring Evaluasi Berbasis Web",
      date: "03 Agu 2026",
      status: "Published",
      category: "Pengumuman",
      content: "Desa Piji meluncurkan platform SIMONEV Bank Sampah digital untuk memantau data penimbangan secara transparan dan real-time bagi pengurus dan warga.",
    },
    {
      id: 3,
      title: "Kisah Sukses Kerajinan Sampah Plastik Menjadi Hiasan Rumah",
      date: "01 Agu 2026",
      status: "Published",
      category: "Kreatif",
      content: "Warga RT 02 berhasil mengubah botol dan plastik kemasan kopi menjadi produk kerajinan bernilai ekonomi tinggi seperti keranjang dan bunga plastik.",
    },
    {
      id: 4,
      title: "Rencana Program Kunjungan Studi Banding Bank Sampah Sebelah",
      date: "02 Agu 2026",
      status: "Draft",
      category: "Rencana",
      content: "Draf program kerja kunjungan kerja pengurus Bank Sampah Desa Piji ke Bank Sampah Asri Jaya untuk mempelajari teknik komposting modern.",
    },
  ]);

  // Editor states
  const [showEditor, setShowEditor] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Edukasi");
  const [isPublished, setIsPublished] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleOpenNewEditor = () => {
    setEditId(null);
    setTitleInput("");
    setContentInput("");
    setCategoryInput("Edukasi");
    setIsPublished(false);
    setShowEditor(true);
    setSuccessMsg(null);
    
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleEditClick = (article: ArticleItem) => {
    setEditId(article.id);
    setTitleInput(article.title);
    setContentInput(article.content);
    setCategoryInput(article.category);
    setIsPublished(article.status === "Published");
    setShowEditor(true);
    setSuccessMsg(null);

    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      setArticles(prev => prev.filter(a => a.id !== id));
      setSuccessMsg("Artikel berhasil dihapus.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !contentInput.trim()) return;

    const formattedDate = () => {
      const today = new Date();
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      return `${today.getDate().toString().padStart(2, "0")} ${months[today.getMonth()]} ${today.getFullYear()}`;
    };

    if (editId !== null) {
      // Edit mode
      setArticles(prev =>
        prev.map(art =>
          art.id === editId
            ? {
                ...art,
                title: titleInput.trim(),
                content: contentInput.trim(),
                category: categoryInput,
                status: isPublished ? "Published" : "Draft",
              }
            : art
        )
      );
      setSuccessMsg("Artikel berhasil diperbarui.");
    } else {
      // Create mode
      const newArticle: ArticleItem = {
        id: Date.now(),
        title: titleInput.trim(),
        date: formattedDate(),
        status: isPublished ? "Published" : "Draft",
        category: categoryInput,
        content: contentInput.trim(),
      };
      setArticles(prev => [newArticle, ...prev]);
      setSuccessMsg("Artikel baru berhasil dibuat.");
    }

    // Reset editor
    setShowEditor(false);
    setEditId(null);
    setTitleInput("");
    setContentInput("");
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  // Helper to inject formatting into simulated WYSIWYG
  const injectFormat = (formatType: string) => {
    switch (formatType) {
      case "bold":
        setContentInput(prev => prev + " <strong>teks tebal</strong>");
        break;
      case "italic":
        setContentInput(prev => prev + " <em>teks miring</em>");
        break;
      case "list":
        setContentInput(prev => prev + "\n- Poin daftar pertama\n- Poin daftar kedua");
        break;
      case "link":
        setContentInput(prev => prev + ' <a href="#" class="text-emerald-600 underline">tautan</a>');
        break;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
            Kelola Berita & Update
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Tulis, edit, dan publikasikan artikel edukasi serta kabar terbaru seputar Bank Sampah Desa Piji.
          </p>
        </div>

        <button
          onClick={handleOpenNewEditor}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tulis Artikel</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 animate-in fade-in duration-300">
          <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold leading-relaxed">
            {successMsg}
          </p>
        </div>
      )}

      {/* Daftar Berita */}
      <div className="space-y-4">
        <h3 className="font-heading text-base font-bold text-slate-900">
          Daftar Artikel Aktif
        </h3>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {articles.map(article => (
              <div key={article.id} className="p-4 md:p-6 flex items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                
                {/* Left: Thumbnail & Content info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Thumbnail Cover Placeholders */}
                  <div className="w-16 h-12 md:w-20 md:h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center shrink-0 border border-emerald-200/50 shadow-inner">
                    <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-emerald-700 opacity-80" />
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0 space-y-1">
                    <span className="inline-flex text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      {article.category}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm md:text-base truncate">
                      {article.title}
                    </h4>
                    <span className="block text-xs text-slate-400 font-medium">
                      Diposting: {article.date}
                    </span>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Status Badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    article.status === "Published"
                      ? "bg-green-100 text-green-700 border border-green-200/50"
                      : "bg-slate-100 text-slate-600 border border-slate-200/50"
                  }`}>
                    {article.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditClick(article)}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Edit Artikel"
                    >
                      <Edit className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(article.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus Artikel"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collapsible Editor Section */}
      {showEditor && (
        <div
          ref={editorRef}
          className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6 max-w-4xl mx-auto animate-in slide-in-from-top-6 duration-300"
        >
          <div className="border-b border-slate-50 pb-3 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-slate-900">
              {editId !== null ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h3>
            <button
              onClick={() => setShowEditor(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Tutup Editor
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Input Kategori */}
            <div className="space-y-1">
              <label htmlFor="category" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Kategori Artikel
              </label>
              <select
                id="category"
                value={categoryInput}
                onChange={e => setCategoryInput(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="Edukasi">Edukasi</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Kreatif">Kreatif</option>
                <option value="Rencana">Rencana Kegiatan</option>
              </select>
            </div>

            {/* Input Judul Artikel Besar */}
            <div className="space-y-1">
              <label htmlFor="articleTitle" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Judul Artikel Besar
              </label>
              <input
                id="articleTitle"
                type="text"
                required
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                placeholder="Tuliskan judul artikel yang menarik..."
                className="w-full rounded-lg border border-slate-300 p-3.5 text-base md:text-lg font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* WYSIWYG Tiptap Editor Area */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Konten Editor Artikel
              </label>

              {/* Formatting Toolbar */}
              <div className="border border-slate-300 bg-slate-50/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => injectFormat("bold")}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-colors"
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => injectFormat("italic")}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-colors"
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => injectFormat("list")}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-colors"
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => injectFormat("link")}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-colors"
                    title="Insert Link"
                  >
                    <Link className="h-4 w-4" />
                  </button>
                </div>

                {/* Editor Content Area */}
                <textarea
                  required
                  rows={8}
                  value={contentInput}
                  onChange={e => setContentInput(e.target.value)}
                  placeholder="WYSIWYG Tiptap Editor Area (Tulis isi konten artikel di sini. Gunakan tombol pemformatan di atas jika perlu)..."
                  className="w-full p-4 bg-transparent text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none resize-y border-none"
                />
              </div>
            </div>

            {/* Toggle Switch "Publikasikan" */}
            <div className="flex items-center justify-between max-w-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="space-y-0.5">
                <span className="block text-sm font-bold text-slate-800">
                  Publikasikan Artikel
                </span>
                <span className="block text-[11px] text-slate-400 font-medium leading-relaxed">
                  Langsung tampil di modul publik utama.
                </span>
              </div>

              {/* Custom Emerald Toggle Switch */}
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPublished ? "bg-emerald-600" : "bg-slate-200"
                }`}
                aria-label="Status Publikasi Toggle"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isPublished ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Actions Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white transition-colors"
              >
                Simpan Artikel
              </button>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
