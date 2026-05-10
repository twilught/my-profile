"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // ปิดเมนูเมื่อเปลี่ยนหน้า
  useEffect(() => { setOpen(false); }, [pathname]);

  // ล็อค scroll เมื่อเมนูเปิด
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-xl border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight">ATHIP</Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {links.map((l) => (
            <Link key={l.href} className="opacity-80 hover:opacity-100 transition" href={l.href}>{l.label}</Link>
          ))}
          <Link className="opacity-40 hover:opacity-70 transition text-xs" href="/admin/login">Login</Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
        >
          <span className={`block w-5 h-0.5 bg-current rounded-full transition-all origin-center ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current rounded-full transition-all ${open ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current rounded-full transition-all origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl">
          <div className="px-6 py-3 flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium border-b border-black/5 dark:border-white/5 last:border-0 opacity-80 hover:opacity-100 transition"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="py-3 text-xs opacity-40 hover:opacity-70 transition"
            >
              Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
