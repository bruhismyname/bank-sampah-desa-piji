import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { LaporanPdfData } from "@/lib/laporan-data";

/**
 * Dokumen PDF Laporan Ringkasan (export dari /admin/laporan).
 *
 * Konten per PRD — 4 blok TERPISAH:
 *  1. Ringkasan capaian indikator (angka) + grafik tren.
 *  2. Ringkasan jumlah kendala per status.
 *  3. Rata-rata skor evaluasi per kriteria.
 *  4. Daftar rekomendasi + status kanban.
 *
 * Capaian kuantitatif dan skor evaluasi kualitatif TIDAK digabung jadi satu
 * angka — tampil sebagai dua blok terpisah (keputusan PRD).
 *
 * Grafik tren digambar manual dengan flexbox bars (bukan library chart) —
 * ringan & deterministik, sesuai pendekatan dashboard /monev.
 */

const emerald = "#006948";
const slate = "#0f172a";
const slateMuted = "#64748b";
const slateLight = "#f1f5f9";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    paddingTop: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: slate,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: emerald,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: emerald,
  },
  subtitle: {
    fontSize: 8,
    color: slateMuted,
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: emerald,
    marginTop: 18,
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: slateLight,
  },
  row: {
    flexDirection: "row",
  },
  // ===== Ringkasan capaian =====
  capaianCard: {
    borderWidth: 1,
    borderColor: slateLight,
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  capaianHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  capaianNama: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  capaianKategori: {
    fontSize: 7,
    color: slateMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  capaianValue: {
    fontFamily: "Helvetica-Bold",
    color: emerald,
    fontSize: 11,
  },
  capaianDetail: {
    fontSize: 8,
    color: slateMuted,
  },
  // ===== Grafik tren (bar chart manual) =====
  chart: {
    marginTop: 6,
    marginBottom: 2,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  chartLabel: {
    width: 90,
    fontSize: 7,
    color: slateMuted,
  },
  chartBarTrack: {
    flex: 1,
    height: 12,
    borderRadius: 3,
    backgroundColor: slateLight,
    marginHorizontal: 6,
    overflow: "hidden",
  },
  chartBar: {
    height: 12,
    borderRadius: 3,
    backgroundColor: emerald,
  },
  chartValue: {
    width: 50,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  chartEmpty: {
    fontSize: 8,
    color: slateMuted,
    fontStyle: "italic",
  },
  // ===== Tabel (kendala & evaluasi) =====
  table: {
    borderWidth: 1,
    borderColor: slateLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: slateLight,
  },
  tableHeaderRow: {
    backgroundColor: emerald,
    borderBottomWidth: 0,
  },
  tableHeaderCell: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#ffffff",
  },
  tableCell: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 9,
    color: slate,
  },
  tableCellRight: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 9,
    textAlign: "right",
    color: slate,
  },
  tableCellCenter: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 9,
    textAlign: "center",
    color: slate,
  },
  // ===== Rekomendasi =====
  rekomendasiCard: {
    borderWidth: 1,
    borderColor: slateLight,
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  rekomendasiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rekomendasiJudul: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  rekomendasiBadge: {
    fontSize: 7,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontFamily: "Helvetica-Bold",
  },
  rekomendasiBadgeBaru: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  rekomendasiBadgeProses: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  rekomendasiBadgeSelesai: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  rekomendasiDetail: {
    flexDirection: "row",
    marginTop: 2,
    fontSize: 8,
    color: slateMuted,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: slateMuted,
    borderTopWidth: 0.5,
    borderTopColor: slateLight,
    paddingTop: 6,
  },
});

/** Warna chip status kendala/rekomendasi — konsisten admin panel. */
function statusBadgeStyle(status: "Baru" | "Proses" | "Selesai") {
  if (status === "Selesai") return styles.rekomendasiBadgeSelesai;
  if (status === "Proses") return styles.rekomendasiBadgeProses;
  return styles.rekomendasiBadgeBaru;
}

/** Format angka id-ID. */
function formatAngka(n: number) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(n);
}

/** Format tanggal ISO → "6 Agustus 2026". */
function formatTanggal(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_LABEL: Record<"Baru" | "Proses" | "Selesai", string> = {
  Baru: "Baru",
  Proses: "Proses",
  Selesai: "Selesai",
};

export function LaporanPdfDocument({ data }: { data: LaporanPdfData }) {
  const maxTren = Math.max(1, ...data.tren.map((t) => t.total));

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* ===== Header ===== */}
        <View style={styles.header} fixed>
          <View>
            <Text style={styles.title}>Laporan Monitoring & Evaluasi</Text>
            <Text style={styles.subtitle}>Bank Sampah Desa Piji · KKN-T IDBU 47 UNDIP</Text>
          </View>
          <Text style={styles.subtitle}>
            {formatTanggal(data.tanggalMulai)} — {formatTanggal(data.tanggalAkhir)}
          </Text>
        </View>

        {/* ===== 1. Ringkasan capaian indikator ===== */}
        <Text style={styles.sectionTitle}>A. Ringkasan Capaian Indikator</Text>
        {data.capaianPerIndikator.length === 0 ? (
          <Text style={styles.chartEmpty}>
            Tidak ada capaian pada rentang periode ini.
          </Text>
        ) : (
          data.capaianPerIndikator.map((c) => (
            <View key={c.nama} style={styles.capaianCard}>
              <View style={styles.capaianHeader}>
                <View>
                  <Text style={styles.capaianNama}>{c.nama}</Text>
                  <Text style={styles.capaianKategori}>{c.kategori}</Text>
                </View>
                <Text style={styles.capaianValue}>{formatAngka(c.capaianTerakhir)}</Text>
              </View>
              <Text style={styles.capaianDetail}>
                Total dalam periode: {formatAngka(c.capaianTotal)} · Target: {formatAngka(c.target)}
              </Text>
            </View>
          ))
        )}

        {/* Grafik tren */}
        <Text style={{ ...styles.sectionTitle, marginTop: 14 }}>Grafik Tren Capaian</Text>
        {data.tren.length < 2 ? (
          <Text style={styles.chartEmpty}>
            {data.tren.length === 0
              ? "Belum ada data tren pada periode ini."
              : "Butuh minimal 2 periode untuk menampilkan grafik tren."}
          </Text>
        ) : (
          <View style={styles.chart}>
            {data.tren.map((t) => (
              <View key={t.label} style={styles.chartRow}>
                <Text style={styles.chartLabel}>{t.label}</Text>
                <View style={styles.chartBarTrack}>
                  <View style={{ ...styles.chartBar, width: `${Math.max(4, (t.total / maxTren) * 100)}%` }} />
                </View>
                <Text style={styles.chartValue}>{formatAngka(t.total)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== 2. Ringkasan kendala per status ===== */}
        <Text style={styles.sectionTitle}>B. Ringkasan Kendala</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeaderCell, { width: 60 }]}>Jumlah</Text>
          </View>
          {(["Baru", "Proses", "Selesai"] as const).map((s) => {
            const row = data.kendala.find((k) => k.status === s);
            return (
              <View key={s} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1 }]}>{STATUS_LABEL[s]}</Text>
                <Text style={[styles.tableCellRight, { width: 60 }]}>{row?.jumlah ?? 0}</Text>
              </View>
            );
          })}
        </View>
        <Text style={{ ...styles.chartEmpty, marginTop: 4 }}>
          Total: {data.kendala.reduce((sum, k) => sum + k.jumlah, 0)} kendala
        </Text>

        {/* ===== 3. Rata-rata skor evaluasi per kriteria ===== */}
        <Text style={styles.sectionTitle}>C. Rata-rata Skor Evaluasi per Kriteria</Text>
        {data.evaluasiPerKriteria.length === 0 ? (
          <Text style={styles.chartEmpty}>
            Belum ada evaluasi pada rentang periode ini.
          </Text>
        ) : (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Kriteria</Text>
              <Text style={[styles.tableHeaderCell, { width: 80 }]}>Rata-rata / 5</Text>
            </View>
            {data.evaluasiPerKriteria.map((e) => (
              <View key={e.nama} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1 }]}>{e.nama}</Text>
                <Text style={[styles.tableCellCenter, { width: 80 }]}>
                  {formatAngka(e.rataRata)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== 4. Daftar rekomendasi + status kanban ===== */}
        <Text style={styles.sectionTitle}>D. Rekomendasi & Tindak Lanjut</Text>
        {data.rekomendasi.length === 0 ? (
          <Text style={styles.chartEmpty}>Belum ada rekomendasi.</Text>
        ) : (
          data.rekomendasi.map((r, i) => (
            <View key={`${r.judul}-${i}`} style={styles.rekomendasiCard}>
              <View style={styles.rekomendasiHeader}>
                <Text style={styles.rekomendasiJudul}>
                  {i + 1}. {r.judul}
                </Text>
                <Text style={[styles.rekomendasiBadge, statusBadgeStyle(r.status)]}>
                  {STATUS_LABEL[r.status]}
                </Text>
              </View>
              <View style={styles.rekomendasiDetail}>
                <Text>Prioritas: {r.prioritas}</Text>
              </View>
            </View>
          ))
        )}

        {/* ===== Footer ===== */}
        <View style={styles.footer} fixed>
          <Text>Bank Sampah Desa Piji — Sistem Informasi Monitoring & Evaluasi</Text>
          <Text>Dibuat {formatTanggal(new Date().toISOString())}</Text>
        </View>
      </Page>
    </Document>
  );
}
