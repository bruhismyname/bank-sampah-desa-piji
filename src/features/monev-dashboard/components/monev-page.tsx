import { Check, BarChart3 } from "lucide-react";

// ============================================================
// MonevPage — komponen presentasional (server, tanpa "use client").
// Menerima data riil dari server component page dan merender
// checklist tahapan, kartu KPI, dan grafik tren.
// ============================================================

type StepStatus = "Selesai" | "Proses" | "Menunggu";
type KpiTone = "success" | "info" | "warning";

export interface TahapanMonev {
  label: string;
  status: StepStatus;
}

export interface KpiMonev {
  name: string;
  value: string;
  detail: string;
  progress: number;
  badge: string;
  tone: KpiTone;
}

interface MonevPageProps {
  /** null bila toggle `tampilkanTahapanKKN` nonaktif → section disembunyikan. */
  tahapan: TahapanMonev[] | null;
  kpis: KpiMonev[];
  trenLabels: string[];
  trenValues: number[];
}

const stepBadge: Record<StepStatus, string> = {
  Selesai: "bg-success-bg text-success-text",
  Proses: "bg-info-bg text-info-text",
  Menunggu: "bg-warning-bg text-warning-text",
};

const toneChip: Record<KpiTone, string> = {
  success: "bg-success-bg text-success-text",
  info: "bg-info-bg text-info-text",
  warning: "bg-warning-bg text-warning-text",
};

const W = 600;
const H = 180;
const plotTop = 20;

function StepCircle({ status }: { status: StepStatus }) {
  if (status === "Selesai") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-4 w-4" strokeWidth={3} />
      </div>
    );
  }
  if (status === "Proses") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
    </div>
  );
}

export function MonevPage({ tahapan, kpis, trenLabels, trenValues }: MonevPageProps) {
  // ===== Grafik tren =====
  const hasTren = trenValues.length >= 2;
  const maxValue = hasTren ? Math.max(...trenValues) : 0;
  const safeMax = maxValue > 0 ? maxValue : 1;

  const points = trenValues.map((v, i) => {
    const x = trenValues.length <= 1 ? W / 2 : (i / (trenValues.length - 1)) * W;
    const y = H - (v / safeMax) * (H - plotTop);
    return { x, y };
  });
  const linePoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPoints = `0,${H} ${linePoints} ${W},${H}`;

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        {/* ===== Page Header ===== */}
        <section className="py-10 md:py-14">
          <h1 className="font-heading text-3xl font-extrabold text-foreground md:text-4xl">
            Dashboard Monitoring &amp; Evaluasi
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Ringkasan perkembangan program Bank Sampah Desa Piji. Data
            diperbarui secara berkala oleh pengurus desa.
          </p>
        </section>

        <div className="space-y-8">
          {/* ===== Top Section: Checklist Tahapan KKN ===== */}
          {tahapan !== null && (
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Checklist Tahapan KKN
                </h2>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {tahapan.length} tahapan
                </span>
              </div>

              {/* Stepper: vertikal di mobile, horizontal di desktop */}
              <div className="flex flex-col gap-5 sm:grid sm:grid-cols-4 sm:gap-2">
                {tahapan.map((t, i) => {
                  const isLast = i === tahapan.length - 1;
                  const leftFilled = i > 0 && tahapan[i - 1].status === "Selesai";
                  const rightFilled = !isLast && t.status === "Selesai";
                  return (
                    <div
                      key={t.label}
                      className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-0"
                    >
                      {/* Connector + circle (desktop) */}
                      <div className="hidden w-full items-center sm:flex">
                        <div
                          className={`h-0.5 flex-1 ${
                            i === 0 ? "invisible" : leftFilled ? "bg-primary" : "bg-border"
                          }`}
                        />
                        <StepCircle status={t.status} />
                        <div
                          className={`h-0.5 flex-1 ${
                            isLast ? "invisible" : rightFilled ? "bg-primary" : "bg-border"
                          }`}
                        />
                      </div>
                      {/* Circle (mobile) */}
                      <div className="sm:hidden">
                        <StepCircle status={t.status} />
                      </div>
                      <div className="text-left sm:mt-3 sm:text-center">
                        <p className="text-sm font-semibold text-foreground">{t.label}</p>
                        <span
                          className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${stepBadge[t.status]}`}
                        >
                          {t.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ===== Middle Section: KPI Cards ===== */}
          <section>
            <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
              Capaian Utama
            </h2>

            {kpis.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
                <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Belum ada indikator yang ditampilkan di beranda
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pengurus dapat mengaktifkan indikator dari menu Master Indikator.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {kpis.map((k) => (
                  <div
                    key={k.name}
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {k.name}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${toneChip[k.tone]}`}
                      >
                        {k.badge}
                      </span>
                    </div>
                    <p className="mt-4 font-heading text-3xl font-extrabold text-foreground">
                      {k.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{k.detail}</p>
                    <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${k.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ===== Bottom Section: Area Chart ===== */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Tren Capaian
                </h2>
                <p className="text-sm text-muted-foreground">
                  Perkembangan total capaian dari periode ke periode
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Capaian
              </span>
            </div>

            {!hasTren ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Belum ada cukup data untuk grafik tren. Data capaian akan
                  tampil di sini setelah pengurus menginput beberapa periode.
                </p>
              </div>
            ) : (
              <>
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="h-56 w-full md:h-64"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="Grafik tren capaian"
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Gridlines */}
                  {[0.25, 0.5, 0.75, 1].map((f) => {
                    const y = H - f * (H - plotTop);
                    return (
                      <line
                        key={f}
                        x1="0"
                        x2={W}
                        y1={y}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                    );
                  })}
                  <polygon points={areaPoints} fill="url(#areaGradient)" />
                  <polyline
                    points={linePoints}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {points.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="3.5"
                      fill="#ffffff"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  ))}
                </svg>

                <div className="mt-2 flex justify-between px-1">
                  {trenLabels.map((l) => (
                    <span key={l} className="text-xs text-muted-foreground">
                      {l}
                    </span>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
