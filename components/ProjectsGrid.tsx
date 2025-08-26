"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

type Project = {
  slug: string; title: string; summary?: string; tags?: string[];
  cover?: string;
};

export default function ProjectsGrid({ items }: { items: Project[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const tags = useMemo(() => {
    const all = new Set<string>();
    items.forEach(p => (p.tags ?? []).forEach(t => all.add(t)));
    return Array.from(all).sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter(p => {
      const hitQ =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.summary ?? "").toLowerCase().includes(query.toLowerCase());
      const hitT = !active || (p.tags ?? []).includes(active);
      return hitQ && hitT;
    });
  }, [items, query, active]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาโปรเจกต์..."
          className="glass px-3 py-2 w-full sm:w-72"
        />
        <div className="flex flex-wrap gap-2">
          <button
            className={`tag ${!active ? "bg-white text-black" : ""}`}
            onClick={() => setActive(null)}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              className={`tag ${active === t ? "bg-white text-black" : ""}`}
              onClick={() => setActive(t === active ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {filtered.map((p) => (
          <article key={p.slug} className="mb-6 break-inside-avoid">
            <Link href={`/projects/${p.slug}`} className="group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/15">
                <Image
                  src={p.cover ?? "/images/placeholder.jpg"}
                  alt={p.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{p.title}</h3>
              {p.summary && <p className="opacity-70 text-sm mt-1">{p.summary}</p>}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(p.tags ?? []).slice(0, 4).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-[11px] border border-black/10 dark:border-white/15">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
