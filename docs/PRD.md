# Bank Sampah Piji
Desa Piji | KKNT-47 UNDIP

## Status PRD: Siap untuk Implementasi

Seluruh gap yang teridentifikasi pada analisis sebelumnya sudah tertutup: cakupan data publik `/monev`, konten Laporan PDF & Excel, toggle visibilitas Tahapan KKN, kepemilikan akun infrastruktur & migrasi DB, mekanisme kode pemulihan, peran pemegang akun, cakupan halaman Guide, dan status kolom kanban rekomendasi.

Sisa item yang sengaja belum ditentukan (by design): detail kolom lengkap per tabel database — ditentukan langsung di file migration Drizzle saat implementasi, bukan didokumentasikan ulang di PRD.

**PRD.md dinyatakan final sebagai acuan implementasi.**

## Kategori Sistem

Website ini adalah **platform website utuh** — bukan sekadar dashboard M&E — termasuk kategori **Web Application / Sistem Informasi**, lebih spesifiknya **Sistem Informasi Monitoring dan Evaluasi (SIMONEV) berbasis web**, dilengkapi halaman publik (Home/Landing, Profil, Guide, Berita/News, Kontak) di samping dashboard monev admin.

## Latar Belakang

Website ini adalah platform Monitoring & Evaluasi (Monev) untuk program pembentukan organisasi Bank Sampah, dibangun sebagai bagian dari program KKN (Kuliah Kerja Nyata). Setelah KKN selesai, website ini akan **diserahterimakan sepenuhnya ke pengurus desa** dan tidak akan lagi dipegang/dimaintain oleh mahasiswa (developer).

Konsekuensi dari keputusan ini membentuk seluruh arah desain:

- **Target user utama admin adalah orang awam teknologi** (pengurus desa), bukan developer. Semua keputusan desain UI harus dioptimalkan untuk kemudahan pakai orang awam, bukan untuk kenyamanan developer.
- Website harus tetap hidup **tanpa campur tangan developer** setelah KKN selesai — tidak boleh bergantung pada home server developer.
- **Konten website harus bisa diubah admin tanpa developer.** Konten halaman publik (hero, value props, cara kerja, profil, kontak) disimpan sebagai data yang bisa diedit lewat menu admin, bukan di-hardcode di kode React.

## Prinsip Desain UI Admin

- **Super simpel, form-based.** Gunakan dropdown/pilihan predefined daripada free text kapan pun memungkinkan, supaya data yang masuk gak berantakan (typo, format tidak konsisten, dll).
- **Bahasa sehari-hari, bukan istilah teknis.** Label, pesan error, dan instruksi ditulis dengan bahasa yang dipahami pengurus desa awam, hindari jargon.
- **Mobile-friendly / mobile-first.** Kemungkinan besar pengurus desa mengakses website dari HP, bukan laptop/desktop.
- **Role cukup 1 (admin).** Tidak ada sistem permission berlapis — makin kompleks sistem izin, makin membingungkan bagi pengguna awam. Cukup: ada session = admin, tidak ada = publik (view-only).

## Fitur "Panduan Pemakaian Website" (penting)

Fitur ini **berbeda dari SOP Bank Sampah** (yang merupakan proker terpisah dari anggota tim KKN lain). "Panduan Pemakaian Website" adalah tutorial cara memakai website ini sendiri — cara login, cara input data mingguan, dst. Idealnya berupa halaman step-by-step dengan screenshot.

Fitur ini krusial supaya pengurus desa **tidak terus-menerus bertanya balik ke developer** setelah KKN selesai. Halaman ini bersifat publik (view).

## Tabel Fitur

| Fitur | Isi Konten | Akses |
|---|---|---|
| Dashboard Ringkasan | Checklist tahapan KKN (jika `tampilkanTahapanKKN`), kartu KPI (capaian terakhir vs target), grafik tren — HANYA data agregat | Publik (view) |
| Beranda (Home/Landing) | Hero (headline/subheadline/CTA), stats capaian, 3 value props, 4 langkah cara kerja | Publik (view), Admin (edit) |
| Profil Program | Info organisasi, struktur, kontak | Publik (view), Admin (edit) |
| Guide (SOP Bank Sampah) | Tampilkan dokumen SOP berupa file PDF yang di-upload (Vercel Blob), view-only | Publik (view) |
| Berita / News | List & detail artikel (judul, konten WYSIWYG, cover, publish, status draft/published) | Publik (view), Admin (kelola) |
| Kontak | Info kontak & social links | Publik (view), Admin (edit) |
| Login Admin | 1 akun admin (mahasiswa → diserahkan ke pengurus desa) | - |
| Reset Password (Kode Pemulihan) | Ganti password via kode pemulihan 12 karakter, sekali pakai, tanpa email; setelah reset, kode baru digenerate otomatis & ditampilkan sekali | Publik |
| Kelola Tahapan KKN | Atur daftar tahapan KKN, urutan, status selesai, toggle visibilitas `tampilkanTahapanKKN` | Admin |
| Master Indikator | Setup nama indikator, kategori, target + flag `tampilkanDiBeranda` | Admin |
| Input Capaian Berkala | Form isi data per periode + riwayat | Admin |
| Logbook Kendala | Catat & lacak kendala + status (Baru/Proses/Selesai) | Admin |
| Evaluasi Periodik | Skor kriteria + catatan + upload foto | Admin |
| Rekomendasi & Tindak Lanjut | Kanban rekomendasi pasca-KKN, status (Baru/Proses/Selesai) | Admin |
| Laporan Export PDF | Rekap per rentang tanggal: ringkasan capaian + grafik, kendala per status, rata-rata skor evaluasi per kriteria, rekomendasi + status kanban | Admin |
| Export Excel (backup) | Full raw export semua tabel, 1 sheet per tabel, tanpa filter tanggal | Admin |
| Panduan Pemakaian Website | Tutorial cara pakai web, langkah demi langkah | Publik |
| Kelola Konten | Edit konten statis halaman publik (hero, value props, cara kerja, profil, kontak) via key-value config | Admin |

## Daftar Halaman

Tabel fitur di atas menjelaskan *apa yang bisa dilakukan*; bagian ini menjelaskan *halaman apa saja yang ada* dan bagaimana pengguna berpindah antar halaman. Ini sekaligus peta route-nya — dan karena struktur folder berbasis fitur, peta ini juga jadi panduan struktur `src/features/`.

### Halaman Publik (tanpa login)

Struktur navigasi publik: **Home, Profil, Guide, Berita, Kontak**, dengan tombol **Login** di kanan atas. Halaman Dashboard Monev diakses lewat tautan terpisah (di navigasi/footer).

| Halaman | Route | Isi | Fitur Terkait |
|---|---|---|---|
| Beranda (Home/Landing) | `/` | Hero (headline, subheadline, CTA), stats capaian terakhir per indikator terpilih, 3 value props, 4 langkah cara kerja | Beranda (Home/Landing) |
| Dashboard Monev | `/monev` | Checklist tahapan KKN (jika `tampilkanTahapanKKN`), kartu KPI, grafik tren — HANYA data agregat | Dashboard Ringkasan |
| Profil Program | `/profil` | Info organisasi, struktur, kontak | Profil Program |
| Guide (SOP Bank Sampah) | `/guide` | Tampilkan dokumen SOP (PDF di-upload): embed/iframe + tombol "Unduh PDF", pesan "belum tersedia" jika kosong | Guide (SOP Bank Sampah) |
| Berita | `/berita` | List artikel (judul, ringkasan, cover, tanggal publish) | Berita / News |
| Detail Berita | `/berita/[slug]` | Konten lengkap artikel | Berita / News |
| Panduan Pemakaian | `/panduan` | Tutorial step-by-step + screenshot | Panduan Pemakaian Website |
| Kontak | `/kontak` | Info kontak & social links | Kontak |
| Login Admin | `/login` | Form login, satu akun admin | Login Admin |
| Reset Password | `/reset-password` | Input kode pemulihan → set password baru → kode baru ditampilkan sekali | Reset Password (Kode Pemulihan) |

### Halaman Admin (butuh login, di bawah `/admin`)

| Halaman | Route | Isi | Fitur Terkait |
|---|---|---|---|
| Menu Admin | `/admin` | Daftar pintu masuk ke tiap fitur (halaman pertama setelah login) | — |
| Kelola Tahapan KKN | `/admin/tahapan` | Atur daftar tahapan KKN, urutan, status selesai, toggle `tampilkanTahapanKKN` | Kelola Tahapan KKN |
| Master Indikator | `/admin/indikator` | Kelola nama indikator, kategori, target, flag `tampilkanDiBeranda` | Master Indikator |
| Input Capaian | `/admin/capaian` | Form isi capaian per periode + riwayat | Input Capaian Berkala |
| Logbook Kendala | `/admin/kendala` | Catat & kelola kendala + status | Logbook Kendala |
| Evaluasi Periodik | `/admin/evaluasi` | Skor kriteria + catatan + upload foto | Evaluasi Periodik |
| Rekomendasi & Tindak Lanjut | `/admin/rekomendasi` | Kanban rekomendasi pasca-KKN | Rekomendasi & Tindak Lanjut |
| Laporan & Export | `/admin/laporan` | Export PDF (rentang tanggal) & Export Excel (full raw) | Laporan Export PDF, Export Excel |
| Edit Profil Program | `/admin/profil` | Edit info organisasi, struktur, kontak | Profil Program (edit) |
| Kelola Berita | `/admin/berita` | CRUD artikel (judul, konten WYSIWYG, cover, publish, draft/published) | Berita / News |
| Kelola Konten | `/admin/konten` | Edit konten statis halaman publik via key-value config | Kelola Konten |

Urutan menu sidebar admin: dashboard, kelola tahapan, master indikator, input capaian, logbook kendala, evaluasi periodik, rekomendasi, laporan & export, edit profil, **Kelola Berita**, **Kelola Konten**, lalu pengaturan (logout/dsb).

Catatan navigasi:
- Semua halaman admin ada di bawah `/admin` supaya middleware NextAuth cukup memproteksi satu prefix.
- Halaman admin yang berupa form (capaian, evaluasi, kendala) dipakai mayoritas dari HP — layout antar halaman harus konsisten.

## Halaman Guide (SOP Bank Sampah)

Dokumen SOP disajikan sebagai **file PDF yang di-upload**, bukan teks statis/rich text:

- Field di tabel `site_content`: key `guide_sop_url`, type `file`, value berupa URL hasil upload ke **Vercel Blob**.
- Mekanisme upload memakai pola yang sama dengan upload foto Evaluasi Periodik (client upload via `@vercel/blob/client` + `handleUpload`), karena dokumen SOP dengan diagram/hasil scan berpotensi melebihi 4.5 MB.
- Halaman `/guide` menampilkan PDF via embed/iframe langsung dari URL Blob, dengan tombol **"Unduh PDF"** sebagai fallback untuk browser mobile yang tidak mendukung inline PDF viewing.
- Kontrol upload/replace file ditaruh di menu `/admin/konten` (bagian dari fitur Kelola Konten), bukan halaman admin terpisah.
- Jika belum ada file yang di-upload (state awal/kosong), tampilkan pesan ramah **"Dokumen SOP belum tersedia"** alih-alih halaman error/kosong.

## Cakupan Data Publik `/monev`

Dashboard Monev publik **hanya menampilkan data agregat**:
- Checklist tahapan KKN (jika `tampilkanTahapanKKN` = true)
- Kartu KPI: nilai capaian terakhir per indikator, target vs realisasi, status warna
- Grafik tren mingguan/bulanan dari data `capaian`

**TIDAK ditampilkan ke publik** (tetap admin-only, hanya bisa diakses via `/admin/*`):
- Detail logbook kendala (deskripsi, status per item)
- Catatan & foto evaluasi periodik
- Kanban rekomendasi & tindak lanjut

Alasan: data tersebut berpotensi memuat informasi sensitif (nama individu, kritik internal) yang tidak cocok untuk konsumsi warga umum.

## Konten Laporan PDF & Excel

**Export PDF** (`/admin/laporan`):
- Discope oleh rentang tanggal yang dipilih admin (date range picker)
- Isi: (1) ringkasan capaian indikator dalam rentang tersebut sebagai angka + grafik tren, (2) ringkasan jumlah kendala dikelompokkan per status, (3) rata-rata skor evaluasi per kriteria dalam rentang tersebut, (4) daftar rekomendasi beserta status kanban-nya
- Capaian kuantitatif dan skor evaluasi kualitatif ditampilkan sebagai **dua blok terpisah**, tidak digabung jadi satu angka

**Export Excel** (backup):
- **TIDAK difilter tanggal** — full raw export semua tabel (`indikator`, `capaian`, `kendala`, `evaluasi`, `evaluasi_kriteria`, `rekomendasi`)
- Tujuannya untuk **backup data mentah**, bukan untuk laporan tampilan — tidak perlu styling rapi seperti PDF, cukup **1 sheet per tabel**

## Skema Data (Entitas Utama)

Detail kolom lengkap menyusul saat implementasi, tapi daftar entitas + relasinya perlu ditulis sekarang karena menentukan bentuk tabel fitur:

- **users** — satu baris admin (kredensial login). Field `recoveryCodeHash`: hash kode pemulihan (bcrypt/argon2, sama seperti password), dipakai untuk reset password tanpa email. Kode pemulihan **sekali pakai**: setelah set password baru berhasil, sistem otomatis generate kode baru (12 karakter) dan menampilkannya sekali di layar, lalu menyimpan hash barunya — selalu ada satu kode aktif tanpa perlu developer.
- **tahapan_kkn** — daftar tahapan KKN yang dikelola admin (nama, urutan, status selesai). Field boolean `tampilkanTahapanKKN` (default true): bila false, section checklist tahapan disembunyikan dari dashboard publik `/monev`. Toggle manual di `/admin/tahapan` (tidak otomatis berdasarkan tanggal).
- **indikator** — nama indikator, kategori, target (angka). Field boolean `tampilkanDiBeranda`: bila true, capaian terakhir indikator ini ditampilkan sebagai stat besar di halaman Home.
- **periode** — rentang waktu input capaian & evaluasi (mis. "Minggu 1", "Bulan Juni"). **Dibuat otomatis** dari rentang tanggal, bukan di-create manual oleh admin. Input capaian boleh diisi berulang kali dalam satu periode; nilai terakhir (atau semua riwayat) ditampilkan di dashboard.
- **capaian** — nilai capaian per indikator per periode (relasi ke `indikator` dan `periode`).
- **kendala** — deskripsi, tanggal, status enum **`Baru` / `Proses` / `Selesai`** (default `Baru`).
- **evaluasi_kriteria** — definisi kriteria penilaian (nama kriteria, bobot/rentang skor).
- **evaluasi** — skor **per-kriteria** per periode (relasi ke `evaluasi_kriteria` dan `periode`), plus catatan & upload foto. Rata-rata skor dihitung otomatis sebagai ringkasan — tidak disimpan sebagai satu angka terpisah.
- **rekomendasi** — item kanban: judul, deskripsi, prioritas, status enum **`Baru` / `Proses` / `Selesai`** (default `Baru`) — **disamakan dengan status Logbook Kendala** untuk konsistensi terminologi di seluruh admin panel.
- **profil_program** — info organisasi, struktur, kontak (single-row settings).
- **berita** — artikel: judul, slug, konten (HTML hasil rich text, **di-sanitize dengan DOMPurify sebelum disimpan** agar aman dari XSS), gambar cover, tanggal publish, status (draft/published). Upload cover memakai pola yang sama dengan upload foto Evaluasi Periodik (client upload via `@vercel/blob/client` + `handleUpload`).
- **site_content** — key-value config untuk konten statis halaman publik yang editable (hero headline/subheadline/CTA, 3 value props, 4 langkah cara kerja, deskripsi & struktur pengurus profil, info kontak & social links). Kolom: `key`, `value`, `type` (untuk memudahkan render tipe data, mis. text/textarea/image/list). Termasuk key `guide_sop_url` (type `file`) untuk URL PDF SOP di Vercel Blob. Disimpan di DB — **tidak di-hardcode** di kode React — supaya admin bisa ubah tanpa developer.

Relasi yang penting:
- `capaian` → `indikator` (satu indikator punya banyak capaian) dan `capaian` → `periode`.
- `evaluasi` → `evaluasi_kriteria` (skor disimpan per kriteria, bukan satu angka agregat) dan `evaluasi` → `periode`.
- Di laporan PDF, capaian kuantitatif dan skor evaluasi per kriteria ditampilkan **berdampingan sebagai dua blok terpisah** — tidak digabung jadi satu angka, karena keduanya mengukur hal yang berbeda (kuantitas vs kualitas).
- Statistik di Home diambil dari `indikator` berflag `tampilkanDiBeranda = true`, nilainya dari `capaian` pada periode terakhir yang punya data (relasi `capaian → indikator` + `capaian → periode`).

## Keputusan yang Sudah Diambil

1. **Kelola Tahapan KKN** — Ada halaman admin untuk mengelola tahapan (`/admin/tahapan`), yang menggerakkan checklist di dashboard publik. Visibilitas section dikontrol field boolean `tampilkanTahapanKKN` (default true) lewat toggle di `/admin/tahapan` — admin menyembunyikan/menampilkan secara manual, bukan otomatis berdasarkan tanggal. Langkah ini didokumentasikan di Panduan Pemakaian sebagai tugas "pasca serah-terima".
2. **Definisi Periode** — Periode **dibuat otomatis** dari rentang tanggal (bukan di-create manual). Input capaian **boleh diisi berulang** dalam satu periode.
3. **Akun Admin & Reset Password** — Akun admin **dipegang satu orang** (pengurus yang ditunjuk), bukan sharing multi-orang. Reset password memakai **Kode Pemulihan** (tanpa email/SMTP):
   - Kolom `recoveryCodeHash` di tabel `users`, hash dengan **bcrypt/argon2** (sama seperti password).
   - Script/seed sekali-jalan: generate kode pemulihan acak **12 karakter alfanumerik** saat setup akun admin pertama. Kode **ditampilkan sekali** di terminal/halaman khusus untuk dicetak manual — **tidak disimpan sebagai plaintext** di database atau `.env`.
   - Kode pemulihan **sekali pakai**: setelah set password baru berhasil, sistem **langsung generate kode pemulihan baru** (12 karakter alfanumerik acak) dan **menampilkannya satu kali di layar** dengan instruksi jelas ("Catat/screenshot kode ini dan simpan di tempat aman — kode lama sudah tidak berlaku"), lalu menyimpan hash kode baru ke `recoveryCodeHash` menggantikan yang lama. Dengan ini selalu ada satu kode aktif tanpa perlu developer generate ulang, dan kode lama tidak bisa dipakai lagi.
   - Halaman `/reset-password`: input kode pemulihan → validasi hash → jika cocok, tampilkan form set password baru.
   - Tidak perlu email/SMTP sama sekali.
4. **Evaluasi vs Capaian** — Skor evaluasi disimpan **per-kriteria** (bukan satu angka agregat), rata-rata dihitung otomatis sebagai ringkasan. Di laporan PDF, capaian kuantitatif (angka/grafik) dan tabel skor evaluasi per kriteria ditampilkan **berdampingan sebagai dua blok terpisah** — tidak digabung jadi satu angka karena keduanya mengukur hal yang berbeda.
5. **Konten Halaman Publik & Berita** — Konten statis halaman publik disimpan sebagai **key-value config** di tabel `site_content` (bukan di-hardcode di React) supaya bisa diubah admin tanpa developer. Modul Berita memakai **rich text editor WYSIWYG (Tiptap)**; konten disimpan sebagai HTML **yang di-sanitize dengan DOMPurify** sebelum disimpan ke DB agar aman dari XSS — karena admin non-teknis tidak familiar dengan sintaks Markdown. Statistik Home diambil dari indikator berflag `tampilkanDiBeranda = true`, menggunakan capaian dari periode terakhir yang punya data.
6. **Status Kanban Rekomendasi** — Kolom status kanban pada Rekomendasi & Tindak Lanjut **disamakan** dengan status pada Logbook Kendala — `Baru` / `Proses` / `Selesai` (default `Baru`) — untuk konsistensi terminologi di seluruh admin panel, bukan istilah terpisah. Field `status` di tabel `rekomendasi` bertipe enum 3 nilai tersebut.

## Hosting Jangka Panjang

Karena website harus tetap hidup tanpa dimaintain developer (home server developer akan mati setelah KKN selesai), hosting dipilih dari layanan **managed/serverless yang gratis dan tetap hidup tanpa perlu dipantau**.

## Operasional Pasca Serah-Terima

### Peran Pemegang Akun

**Pemegang Akun Admin Harian** — Akun admin harian (login rutin untuk input capaian, kendala, evaluasi) dipegang oleh **Sekretaris Bank Sampah**, dipilih karena tugasnya paling sejalan dengan tanggung jawab dokumentasi/pencatatan, dibanding Bendahara (fokus keuangan) atau Ketua (fokus koordinasi eksternal).

> Catatan: penetapan role ini bergantung pada struktur organisasi final Bank Sampah (proker penyusunan struktur organisasi tim KKN lain). Jika struktur final tidak memiliki role "Sekretaris" terpisah, sesuaikan kembali ke role yang paling relevan.

**Pemegang Kredensial (Kode Pemulihan & Akun Infrastruktur)** — Dipegang oleh **Kepala Desa atau Sekretaris Desa**, sengaja berbeda level dari pemegang akun admin harian (bukan sesama pengurus internal Bank Sampah) untuk menjaga separation of duties: jika terjadi pergantian pengurus Bank Sampah, kredensial cadangan tetap aman di pihak yang berbeda.

### Kepemilikan Akun Infrastruktur

Seluruh akun layanan infrastruktur (Vercel, Neon, GitHub jika dipakai) didaftarkan menggunakan **satu email khusus proyek** (bukan email pribadi mahasiswa), dibuat sebelum deployment awal. Kredensial (email + password tiap platform) dicatat secara fisik dan diserahkan kepada Kepala Desa/Sekretaris Desa saat serah-terima — menggunakan mekanisme keamanan yang sama seperti kode pemulihan admin (dicetak, disegel, dipegang pihak yang berbeda dari pemegang akun admin harian).

### Migrasi Skema Database

Migrasi Drizzle (`drizzle-kit push`) dijalankan **otomatis sebagai bagian dari Vercel Build Command** pada setiap deployment, sehingga perubahan skema tidak memerlukan intervensi manual developer setelah serah-terima. Jika di masa depan diperlukan perubahan skema, developer baru (jika ada) cukup push ke repository dan migrasi berjalan otomatis saat deploy.

### Pemantauan Free Tier

Tidak ada kartu kredit yang terpasang pada akun infrastruktur proyek. Jika limit free tier Vercel atau Neon terlampaui, layanan akan **dijeda/dibatasi** (bukan menagih otomatis). Keputusan untuk upgrade ke paket berbayar (jika suatu saat diperlukan) diserahkan sepenuhnya kepada pengurus/desa di masa depan, bukan kewajiban tim KKN.

## Tech Stack

### Fondasi
- **Next.js (App Router) + TypeScript** — server actions untuk form admin, hindari bikin API route terpisah untuk tiap fitur
- **Vercel** — hosting, serverless, tidak bergantung pada home server developer
- **Neon (Postgres)** — database serverless, managed, tetap hidup tanpa maintenance manual
- **Drizzle ORM** — lebih ringan dan native untuk driver serverless Neon dibanding Prisma, edge-friendly
- **NextAuth.js** — auth, cukup Credentials provider + middleware yang memproteksi `/admin/*`. Tidak perlu RBAC karena hanya 1 role

### UI Admin (simpel & mobile-friendly)
- **Tailwind CSS + shadcn/ui** — komponen `Select`/`Combobox`/dropdown sudah tersedia, accessible, responsive by default
- **react-hook-form + Zod** — validasi berbasis enum/pilihan predefined (bukan free text), error message bisa ditulis dengan bahasa sehari-hari

### Dashboard Ringkasan (publik)
- **Tremor** — dibangun di atas Tailwind, didesain khusus untuk dashboard (KPI card, area chart, progress bar), cepat dibangun dengan visual yang sudah rapi

### Evaluasi Periodik (upload foto)
- **Vercel Blob** — upload client-side via `@vercel/blob/client` + `handleUpload` (bisa menangani file besar, termasuk SOP PDF dan cover berita; upload langsung ke Blob tanpa lewat server), satu ekosistem dengan hosting. Alternatif: Cloudinary jika butuh auto-compress/resize foto dari HP

### Export Excel
- **exceljs** — generate .xlsx di server action, fleksibel untuk styling kolom (header bold, lebar kolom, dst)

### Export PDF (laporan akademik)
- **@react-pdf/renderer** — generate PDF dari komponen React, jalan lancar di serverless Vercel. Hindari Puppeteer/Playwright (headless browser berat, rawan timeout di serverless function)

### Kanban Rekomendasi & Tindak Lanjut
- **@dnd-kit/core** — drag-and-drop yang masih aktif di-maintain (react-beautiful-dnd sudah deprecated)

### Panduan Pemakaian Website
- **MDX (@next/mdx)** — halaman tutorial statis, mudah menyelipkan screenshot, bisa diedit tanpa menyentuh database

### Modul Berita / News
- **Tiptap** — rich text editor WYSIWYG untuk konten berita, cocok untuk admin non-teknis (bukan Markdown). Konten disimpan sebagai HTML.
- **DOMPurify (isomorphic-dompurify)** — sanitasi HTML dari editor sebelum disimpan ke DB, agar aman dari XSS (penting karena HTML dirender kembali di halaman publik).

### Struktur Folder
- **Feature-based**, bukan layer-based (bukan dipisah per `components/`, `hooks/`, `utils/` secara global). Setiap fitur (misal `master-indikator`, `input-capaian`, `evaluasi-periodik`, `panduan-pemakaian`, `berita`, `kelola-konten`) punya foldernya sendiri berisi komponen, server action, schema, dan logic yang spesifik untuk fitur itu. Alasannya untuk kemudahan maintenance jangka panjang — terutama karena project ini akan diserahterimakan dan mungkin disentuh developer lain (atau developer yang sama tapi lama tidak buka project ini) di masa depan, jadi tiap fitur harus mudah ditemukan dan dipahami secara terisolasi.

  Contoh struktur:
  ```
  src/
    features/
      master-indikator/
        components/
        actions.ts
        schema.ts
      input-capaian/
        components/
        actions.ts
        schema.ts
      berita/
        components/       # incl. Tiptap editor
        actions.ts
        schema.ts
      kelola-konten/
        components/
        actions.ts
        schema.ts
      evaluasi-periodik/
        ...
      panduan-pemakaian/
        ...
    components/        # shared UI components (shadcn/ui, dsb)
    lib/                # shared utilities, db client, auth config
    app/                 # Next.js App Router routes, tipis, cuma import dari features/
  ```

## Catatan untuk Claude Code

- Developer proyek ini adalah fullstack developer dengan kedalaman di Next.js, TypeScript, dan full-stack development — kode boleh ditulis dengan asumsi familiaritas teknis developer, **tapi semua yang dilihat/dipakai admin (UI, copy, pesan error) harus disederhanakan untuk orang awam.**
- Selalu prioritaskan dropdown/select/predefined options di atas free text input pada form-form admin, kecuali untuk field yang secara inheren butuh teks bebas (misal: catatan/deskripsi).
- Perhatikan limit free tier Vercel (bandwidth, function execution) dan Neon (compute hours, storage) — website ini akan berjalan tanpa dipantau developer dalam jangka panjang.
- Ikuti struktur folder feature-based di atas secara konsisten saat generate file baru — jangan taruh logic fitur langsung di `app/` atau di folder shared `components/`/`lib/` kecuali memang benar-benar reusable lintas fitur.