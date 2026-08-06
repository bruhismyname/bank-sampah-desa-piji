"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/guide", label: "Guide" },
  { href: "/berita", label: "Berita" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-background/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between border-b border-border px-4 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          {/* Logo — file public/logo/logo.png */}
          <Image
            src="/logo/logo.png"
            alt="Logo Bank Sampah Desa Piji"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-contain"
          />
          <span className="font-heading text-lg font-extrabold text-primary md:text-xl">
            Bank Sampah Desa Piji
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "border-b-2 border-primary pb-1 text-sm font-semibold text-primary"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/login"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Login
        </Link>
      </div>
    </header>
  );
}

