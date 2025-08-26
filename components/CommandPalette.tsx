"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import projects from "@/data/projects.json";

type Item = { label: string; href: string; keywords?: string[] };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  // กด ⌘K / Ctrl+K เพื่อเปิด
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  // แหล่งข้อมูล: หน้า + โปรเจกต์
  const items: Item[] = useMemo(() => {
    const base: Item[] = [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "About", href: "/#about" },
      { label: "Contact", href: "/#contact" }
    ];
    const ps: Item[] = (projects as any[]).map((p) => ({
      label: `Project: ${p.title}`,
      href: `/projects/${p.slug}`,
      keywords: p.tags ?? []
    }));
    return [...base, ...ps];
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items.slice(0, 12);
    return items
      .filter((it) =>
        it.label.toLowerCase().includes(term) ||
        (it.keywords ?? []).some((k) => String(k).toLowerCase().includes(term))
      )
      .slice(0, 20);
  }, [items, q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="mx-auto mt-24 max-w-xl rounded-2xl border border-white/15 bg-neutral-900 text-white p-3 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true"
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="พิมพ์เพื่อค้นหา…  (Esc เพื่อปิด)"
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
        />
        <div className="mt-2 max-h-80 overflow-auto">
          {filtered.length === 0 && <div className="p-3 opacity-70 text-sm">ไม่พบรายการ</div>}
          {filtered.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="block rounded-lg px-3 py-2 hover:bg-white/10 transition"
              onClick={() => setOpen(false)}
            >
              {it.label}
            </Link>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs opacity-60 px-1">
          <span>Enter: เปิดลิงก์ • ↑/↓: เลื่อน</span>
          <span>⌘K ปิด/เปิด • Esc ปิด</span>
        </div>
      </div>
    </div>
  );
}
