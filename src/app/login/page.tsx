import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

interface LoginPageProps {
  searchParams?: Promise<{ callbackUrl?: string; error?: string }>;
}

async function loginAction(formData: FormData) {
  "use server";

  const callbackUrl = formData.get("callbackUrl")?.toString() || "/admin";

  try {
    await signIn("credentials", {
      username: formData.get("username")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
      redirectTo: callbackUrl,
    });
  } catch (error) {
    // Penting: JANGAN tangkap NEXT_REDIRECT.
    // Saat login SUKSES, `signIn` melempar NEXT_REDIRECT untuk mengalihkan
    // ke halaman tujuan (mis. /admin). Jika tertangkap di sini, redirect
    // tidak akan terjadi dan login tampak gagal walau kredensial benar.
    // Lempar ulang semua error di luar AuthError (pola resmi NextAuth v5).
    if (!(error instanceof AuthError)) {
      throw error;
    }

    // Username/password salah — kembali ke /login dengan flag error supaya
    // banner pesan ramah tampil di halaman.
    if (error.type === "CredentialsSignin") {
      redirect("/login?error=CredentialsSignin");
    }

    // Error Auth lain (mis. konfigurasi) — tampilkan pesan umum yang sama.
    redirect("/login?error=Other");
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl;
  const hasError = params?.error !== undefined;

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-slate-50 px-4">
      {/* Centered Card Container */}
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-md">
        
        {/* Top Logo & Title */}
        <div className="text-center">
          <span className="font-heading text-lg font-extrabold text-emerald-600 tracking-tight block">
            Monev Bank Sampah
          </span>
          <h1 className="mt-4 font-heading text-2xl font-bold text-slate-900">
            Login Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Silakan masuk untuk mengelola data.
          </p>
        </div>

        {/* Error Alert Box */}
        {hasError && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            Username atau password salah. Silakan coba lagi.
          </div>
        )}

        {/* Login Form */}
        <form action={loginAction} className="mt-6 space-y-5">
          {callbackUrl ? (
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
          ) : null}
          
          {/* Username Input */}
          <div className="space-y-1.5">
            <label 
              htmlFor="username" 
              className="block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Masukkan username"
              autoComplete="username"
              required
              className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label 
              htmlFor="password" 
              className="block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            Masuk
          </button>
        </form>

        {/* Bottom Link */}
        <Link
          href="/reset-password"
          className="block text-center text-sm text-slate-500 hover:text-emerald-600 transition-colors mt-6 font-medium"
        >
          Lupa Password? Gunakan Kode Pemulihan
        </Link>
      </div>
    </main>
  );
}

