import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-muted py-12">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-10">
        <div className="text-center md:text-left">
          <span className="mb-2 block font-heading text-2xl font-bold text-foreground">
            Bank Sampah Desa Piji
          </span>
          <p className="text-sm text-muted-foreground">
            © 2026 Bank Sampah Desa Piji | KKNT-47 UNDIP
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/monev" className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
            Dashboard Monev
          </Link>
          <Link href="/panduan" className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
            Panduan
          </Link>
          <Link href="/kontak" className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
            Hubungi Kami
          </Link>
        </div>
      </div>
    </footer>
  );
}
