"use client";

import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";

/**
 * Lokasi Bank Sampah — pilih salah satu lokasi untuk melihat peta Google Maps.
 *
 * Menampilkan satu peta aktif + daftar lokasi sebagai tombol pilihan (pill),
 * supaya halaman tetap ringan di perangkat mobile dan hemat bandwidth
 * (hanya 1 iframe yang dimuat sekaligus, bukan 4).
 *
 * Koordinat `lat`/`lng` dipakai untuk tautan "Buka di Google Maps".
 */

interface Lokasi {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  embedUrl: string;
}

const locations: Lokasi[] = [
  {
    id: "camat-dawe",
    name: "Kantor Camat Dawe",
    address: "Kecamatan Dawe, Kabupaten Kudus",
    lat: -6.7334553,
    lng: 110.8664818,
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.7878839779905!2d110.86648177456112!3d-6.733455293262675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70da47947d8ecd%3A0x60f60e45f335cfef!2sDawe%20Subdistrict%20Office!5e1!3m2!1sen!2sid!4v1786038129440!5m2!1sen!2sid",
  },
  {
    id: "balai-desa-piji",
    name: "Kantor Balai Desa Piji",
    address: "Desa Piji, Kecamatan Dawe, Kabupaten Kudus",
    lat: -6.7321658,
    lng: 110.8706214,
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.64428124605956!2d110.87062137148565!3d-6.732165786070361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70db4ff9e20667%3A0x1fa720890cfe4398!2sES%20TEH%20TEMAN%20BUCIN%26BOBA!5e0!3m2!1sen!2sid!4v1786038313607!5m2!1sen!2sid",
  },
  {
    id: "mi-nurul-ulum",
    name: "MI NU Nurul Ulum",
    address: "Mitra RW 3, Desa Piji, Kecamatan Dawe",
    lat: -6.7346898,
    lng: 110.8715209,
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122.32637254509609!2d110.871520880394!3d-6.734689792440889!2m3!1f0!2f0.8178462024585152!3f0!3m2!1i1024!2i768!4f49.16598300500809!3m3!1m2!1s0x2e70db33b4b39e25%3A0x639b09e1f60c9a30!2sMI%20NU%20Nurul%20Ulum!5e1!3m2!1sen!2sid!4v1786038525405!5m2!1sen!2sid",
  },
  {
    id: "mts-mambaul-falah",
    name: "MTs Mambaul Falah",
    address: "Desa Piji, Kecamatan Dawe, Kabupaten Kudus",
    lat: -6.7268862,
    lng: 110.8696133,
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2623.4007388375608!2d110.8696133100571!3d-6.726886218389147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70da3bc292c019%3A0x90dce46ea1fa1d67!2sMTs%20Mambaul%20Falah!5e1!3m2!1sen!2sid!4v1786038592016!5m2!1sen!2sid",
  },
];

export function LokasiBankSampah() {
  const [activeId, setActiveId] = useState(locations[0].id);
  const active = locations.find((l) => l.id === activeId) ?? locations[0];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${active.lat},${active.lng}`;

  return (
    <div className="flex flex-col space-y-4">
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
        Lokasi Bank Sampah
      </span>

      {/* Peta aktif */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <iframe
          title={`Peta ${active.name}`}
          src={active.embedUrl}
          className="h-60 w-full border-0 sm:h-72"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      {/* Pilihan lokasi */}
      <div className="flex flex-wrap gap-2">
        {locations.map((loc) => {
          const isActive = loc.id === activeId;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => setActiveId(loc.id)}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              {loc.name}
            </button>
          );
        })}
      </div>

      {/* Info lokasi aktif */}
      <div className="flex items-start justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-emerald-800">{active.name}</p>
          <p className="mt-0.5 text-xs text-emerald-700/80">{active.address}</p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Buka Peta
        </a>
      </div>
    </div>
  );
}
