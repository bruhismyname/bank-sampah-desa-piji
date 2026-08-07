"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  History,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { saveCapaian, deleteCapaian, type CapaianState } from "../actions";

/** Indikator dari DB (id + nama + target). */
export interface IndikatorOption {
  id: string;
  nama: string;
  target: number;
}

/** Periode yang sudah ada di DB (untuk pilihan cepat). */
export interface PeriodeOption {
  id: string;
  nama: string;
  tanggalMulai: string; // format YYYY-MM-DD
  tanggalAkhir: string; // format YYYY-MM-DD
}

/** Satu baris riwayat capaian (join indikator + periode). */
export interface CapaianRiwayatRow {
  id: string;
  indikatorNama: string;
  periodeNama: string;
  nilai: number;
  createdAt: string;
}

interface CapaianClientProps {
  indikatorList: IndikatorOption[];
  periodeList: PeriodeOption[];
  riwayat: CapaianRiwayatRow[];
}

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

/** Format angka id-ID (1.234,56) untuk tampilan. */
function formatAngka(n: number) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(n);
}

/** Format tanggal untuk tampilan (contoh: "6 Agu 2026, 14:30"). */
function formatTanggal(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CapaianClient({ indikatorList, periodeList, riwayat }: CapaianClientProps) {
  const router = useRouter();

  const [indikatorId, setIndikatorId] = useState(indikatorList[0]?.id ?? "");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [nilai, setNilai] = useState("");
  const [feedback, setFeedback] = useState<CapaianState | null>(null);

  const activeIndikator = indikatorList.find((i) => i.id === indikatorId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("indikatorId", indikatorId);
    fd.set("tanggalMulai", tanggalMulai);
    fd.set("tanggalAkhir", tanggalAkhir);
    fd.set("nilai", nilai);
    const res = await saveCapaian(null, fd);
    setFeedback(res);
    if (res.ok) {
      setNilai("");
      setTanggalMulai("");
      setTanggalAkhir("");
      router.refresh();
    }
  }

  async function handleDelete(id: string, label: string) {
    if (!confirm(`Hapus capaian ini (${label})?`)) return;
    await deleteCapaian(id);
    router.refresh();
  }

  function renderFeedback() {
    if (!feedback) return null;
    if (feedback.ok) {
      return (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
          <CheckCircle className="h-3.5 w-3.5" />
          {feedback.message}
        </p>
      );
    }
    return (
      <p className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
        <AlertCircle className="h-3.5 w-3.5" />
        {feedback.error}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
          Input Capaian
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Catat angka pencapaian program Bank Sampah per periode. Boleh diinput
          berulang dalam satu periode — riwayat tetap tersimpan.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm space-y-5 max-w-2xl"
      >
        {/* Indikator */}
        <div className="space-y-1.5">
          <label htmlFor="indikator" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
            Pilih Indikator Capaian
          </label>
          <select
            id="indikator"
            value={indikatorId}
            onChange={(e) => {
              setIndikatorId(e.target.value);
              setFeedback(null);
            }}
            className={inputCls}
          >
            {indikatorList.length === 0 ? (
              <option value="">Belum ada indikator. Tambahkan di Master Indikator dulu.</option>
            ) : (
              indikatorList.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nama} (target: {formatAngka(i.target)})
                </option>
              ))
            )}
          </select>
          {indikatorList.length === 0 && (
            <p className="text-xs text-amber-600">
              Tidak ada indikator. Buka menu <b>Master Indikator</b> untuk menambah dulu.
            </p>
          )}
        </div>

        {/* Periode: rentang tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="tgl-mulai" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Periode — Tanggal Mulai
            </label>
            <input
              id="tgl-mulai"
              type="date"
              required
              value={tanggalMulai}
              onChange={(e) => {
                setTanggalMulai(e.target.value);
                setFeedback(null);
              }}
              className={inputCls}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="tgl-akhir" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Periode — Tanggal Akhir
            </label>
            <input
              id="tgl-akhir"
              type="date"
              required
              value={tanggalAkhir}
              onChange={(e) => {
                setTanggalAkhir(e.target.value);
                setFeedback(null);
              }}
              className={inputCls}
            />
          </div>
        </div>

        {/* Periode yang sudah ada (shortcut) */}
        {periodeList.length > 0 && (
          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Atau pilih periode yang sudah ada
            </span>
            <div className="flex flex-wrap gap-2">
              {periodeList.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setTanggalMulai(p.tanggalMulai);
                    setTanggalAkhir(p.tanggalAkhir);
                    setFeedback(null);
                  }}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  title={p.nama}
                >
                  {p.nama}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Periode dibuat otomatis dari rentang tanggal — tanggal yang sama akan
              memakai periode yang sudah ada.
            </p>
          </div>
        )}

        {/* Nilai */}
        <div className="space-y-1.5">
          <label htmlFor="nilai" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
            Nilai Capaian
          </label>
          <input
            id="nilai"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="0"
            value={nilai}
            onChange={(e) => {
              setNilai(e.target.value);
              setFeedback(null);
            }}
            disabled={!activeIndikator}
            className={`${inputCls} text-center font-mono text-3xl font-extrabold p-4`}
          />
          {activeIndikator && (
            <p className="text-[11px] text-slate-400">
              Target indikator ini: {formatAngka(activeIndikator.target)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={!activeIndikator}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Simpan Capaian
          </button>
          {renderFeedback()}
        </div>
      </form>

      {/* Riwayat */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
          <History className="h-5 w-5 text-slate-400" />
          Riwayat Capaian
        </h3>

        {riwayat.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
            Belum ada capaian yang diinput.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {riwayat.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="block text-sm font-semibold text-slate-800 truncate">
                      {item.indikatorNama}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                      <Calendar className="h-3 w-3" />
                      {item.periodeNama} · Diinput: {formatTanggal(item.createdAt)}
                    </span>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/50 rounded-lg px-3 py-1.5 text-sm">
                      {formatAngka(item.nilai)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, `${item.indikatorNama} · ${formatAngka(item.nilai)}`)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus capaian"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
