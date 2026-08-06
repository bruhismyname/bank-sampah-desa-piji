import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Next.js 16 mengenali file `middleware.ts` (juga `proxy.ts`) sebagai
// proxy/middleware. Wrapper `auth()` dari Auth.js memicu callback
// `authorized` di authConfig, yang memblokir `/admin/*` bagi pengunjung
// yang belum login dan mengalihkannya ke `/login`.
const { auth } = NextAuth(authConfig);

// `auth()` dijadikan middleware. Callback `authorized` di `authConfig`
// yang menangani logika proteksi (redirect ke /login bila belum login).
export default auth((req) => {
  void req;
});

export const config = {
  matcher: ["/admin/:path*"],
};
