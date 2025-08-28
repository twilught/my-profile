// app/projects/page.tsx
import type { Metadata } from "next";
import projectsData from "@/data/projects.json";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects — Athip Buasamlee",
  description: "รวมผลงาน โปรเจกต์ และสิ่งที่ได้ทำ",
};

type Project = {
  slug: string;
  title: string;
  summary?: string;
  details?: string;
  date?: string;
  tags?: string[];
  demo?: string;
  github?: string;
  cover?: string;
};

export default function ProjectsPage({
  searchParams,
}: {
  searchParams?: { q?: string; tag?: string };
}) {
  const q = (searchParams?.q ?? "").toLowerCase();
  const activeTag = (searchParams?.tag ?? "").toLowerCase();

  const list = (projectsData as Project[])
    .map((p) => ({ ...p, _dateNum: p.date ? new Date(p.date).getTime() : 0 }))
    .sort((a, b) => b._dateNum - a._dateNum);

  const filtered = list.filter((p) => {
    const hay = (p.title + " " + (p.summary ?? "") + " " + (p.tags ?? []).join(" ")).toLowerCase();
    const okQ = q ? hay.includes(q) : true;
    const okTag = activeTag ? (p.tags ?? []).some((t) => t.toLowerCase() === activeTag) : true;
    return okQ && okTag;
  });

  const allTags = Array.from(new Set(list.flatMap((p) => p.tags ?? []))).sort();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header>
        <h1 className="text-3xl font-extrabold">Projects</h1>
        <p className="opacity-70 mt-1">
          {filtered.length} รายการ
          {q ? ` • ค้นหา: “${q}”` : ""}
          {activeTag ? ` • แท็ก: ${activeTag}` : ""}
        </p>
      </header>

      {/* filter by tag */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/projects" className={`px-3 py-1 rounded-full border text-sm ${!activeTag ? "bg-black text-white" : ""}`}>
          ทั้งหมด
        </Link>
        {allTags.map((t) => (
          <Link
            key={t}
            href={`/projects?tag=${t}${q ? `&q=${q}` : ""}`}
            className={`px-3 py-1 rounded-full border text-sm ${t.toLowerCase() === activeTag ? "bg-black text-white" : ""}`}
          >
            {t}
          </Link>
        ))}
      </div>

      {/* grid */}
      <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <article key={p.slug} className="group overflow-hidden rounded-3xl border bg-white/80 dark:bg-white/5 hover:shadow-lg hover:-translate-y-1 transition">
            <Link href={`/projects/${p.slug}`} className="block">
              {p.cover && (
                <div className="relative h-40">
                  <Image src={p.cover} alt={p.title} fill className="object-cover group-hover:scale-[1.02] transition" />
                </div>
              )}
              <div className="p-5">
                <h2 className="font-semibold text-lg">{p.title}</h2>
                {p.summary && <p className="mt-2 text-sm opacity-80">{p.summary}</p>}
              </div>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
