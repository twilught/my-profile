"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
// ถ้ามี ThemeToggle อยู่แล้วในโปรเจกต์ให้ใช้ได้เลย
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-40 transition-all",
        "backdrop-blur-md",
        scrolled ? "bg-white/60 dark:bg-neutral-950/60 ring-1 ring-black/10 dark:ring-white/10" : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight">
          ATHIP
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link className="hover:opacity-80 transition" href="/projects">Projects</Link>
          <Link className="hover:opacity-80 transition" href="/about">About</Link>
          <Link className="hover:opacity-80 transition" href="/#contact">Contact</Link>
          <div className="w-px h-5 bg-black/10 dark:bg-white/15 mx-1" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
