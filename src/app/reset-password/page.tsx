"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-alphanumeric and uppercase everything
    let val = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (val.length > 12) val = val.substring(0, 12);
    
    // Auto format: XXXX-XXXX-XXXX
    let formatted = "";
    for (let i = 0; i < val.length; i++) {
      if (i === 4 || i === 8) {
        formatted += "-";
      }
      formatted += val[i];
    }
    setCode(formatted);
    setError(null); // Clear errors on type
  };

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCode = code.replace(/-/g, "");
    if (rawCode.length !== 12) {
      setError("Kode Pemulihan harus berisi 12 karakter.");
      setSuccess(null);
    } else {
      setError(null);
      setSuccess("Kode Pemulihan valid! Silakan hubungi pengembang sistem untuk mengatur ulang kata sandi baru Anda.");
    }
  };

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-slate-50 px-4">
      {/* Centered Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-md relative">
        
        {/* Back Link */}
        <Link
          href="/login"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Login
        </Link>

        {/* Title */}
        <h1 className="font-heading text-2xl font-extrabold text-slate-900">
          Reset Password
        </h1>

        {/* Alert / Info Box */}
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 leading-relaxed">
          Masukkan 12 karakter Kode Pemulihan yang diberikan saat serah-terima sistem.
        </div>

        {/* Verification Statuses */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {success}
          </div>
        )}

        {/* Form Step 1 */}
        <form onSubmit={handleValidate} className="mt-6 space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="recoveryCode" 
              className="block text-xs font-bold uppercase tracking-wider text-slate-400"
            >
              Kode Pemulihan
            </label>
            <input
              id="recoveryCode"
              name="recoveryCode"
              type="text"
              placeholder="XXXX-XXXX-XXXX"
              value={code}
              onChange={handleChange}
              maxLength={14} // 12 chars + 2 dashes
              required
              className="w-full text-center font-mono text-2xl font-bold tracking-widest uppercase rounded-lg border-2 border-slate-300 px-4 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            Validasi Kode
          </button>
        </form>
      </div>
    </main>
  );
}

